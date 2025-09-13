import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { UsersService } from 'src/users/users.service';
import { DonationStatus, DonationType } from 'src/utils/enums';
import { Repository } from 'typeorm';
import { CreateDonationDto } from './dto/create-donation.dto';
import { Donation } from './entities/donation.entity';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Create a new donation and update organization's total_received.
   */
  public async createNewDonation(
    dto: CreateDonationDto,
    userId: string,
  ): Promise<Donation> {
    // 1. Load user, organization, and optional order
    const user = await this.usersService.getCurrentUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const organization = await this.organizationsService.findOneOrganization(
      dto.organizationId,
    );
    if (!organization) {
      throw new NotFoundException(`Organization not found`);
    }

    let order: Order | null = null;
    if (dto.orderId) {
      order = await this.ordersService.findOneOrder(dto.orderId);
      if (!order) {
        throw new NotFoundException(`Order not found`);
      }
    }

    // 2. Create donation entity
    const partial: Partial<Donation> = {
      user,
      organization,
      order: dto.orderId ? order : undefined,
      amount: dto.amount,
      type: dto.type,
      status: DonationStatus.PENDING,
    };

    // Only set blockchain_tx_id if DTO provided it
    if (dto.blockchain_tx_id) {
      partial.blockchain_tx_id = dto.blockchain_tx_id;
    }

    const donation = this.donationRepository.create(partial);
    return this.donationRepository.save(donation);
  }

  /**
   * Retrieve all donations with optional filtering.
   */
  public async findAllDonations(
    userId?: string,
    organizationId?: number,
    status?: DonationStatus,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Donation[]; total: number }> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.user', 'user')
      .leftJoinAndSelect('donation.organization', 'organization')
      .leftJoinAndSelect('donation.order', 'order');

    if (userId) {
      queryBuilder.andWhere('user.user_id = :userId', { userId });
    }

    if (organizationId) {
      queryBuilder.andWhere('organization.id = :organizationId', {
        organizationId,
      });
    }

    if (status) {
      queryBuilder.andWhere('donation.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .orderBy('donation.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * Retrieve a single donation by ID.
   */
  public async findOneDonation(id: number): Promise<Donation> {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ['user', 'organization', 'order'],
    });
    if (!donation) {
      throw new NotFoundException(`Donation ${id} not found`);
    }
    return donation;
  }

  /**
   * Update donation status (typically used for payment processing).
   */
  public async updateStatus(
    id: number,
    status: DonationStatus,
    blockchainTxId?: string,
  ): Promise<Donation> {
    const donation = await this.findOneDonation(id);

    donation.status = status;
    if (blockchainTxId) {
      donation.blockchain_tx_id = blockchainTxId;
    }

    const updatedDonation = await this.donationRepository.save(donation);

    // Update organization total if donation is now completed
    if (
      status === DonationStatus.COMPLETED &&
      donation.type === DonationType.DIRECT
    ) {
      await this.organizationsService.updateTotalReceivedOrg(
        donation.organization.id,
        donation.amount,
      );
    }

    return updatedDonation;
  }

  /**
   * Get user's donation history.
   */
  public async getUserDonations(
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Donation[]; total: number }> {
    return this.findAllDonations(userId, undefined, undefined, options);
  }

  /**
   * Get organization's received donations.
   */
  public async getOrganizationDonations(
    organizationId: number,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Donation[]; total: number }> {
    return this.findAllDonations(undefined, organizationId, undefined, options);
  }

  /**
   * Get donation statistics for an organization.
   */
  public async getOrganizationStats(organizationId: number): Promise<any> {
    const totalDonations = await this.donationRepository.count({
      where: { organization_id: organizationId },
    });

    const completedDonations = await this.donationRepository.count({
      where: {
        organization_id: organizationId,
        status: DonationStatus.COMPLETED,
      },
    });

    const pendingDonations = await this.donationRepository.count({
      where: {
        organization_id: organizationId,
        status: DonationStatus.PENDING,
      },
    });

    const totalAmountResult = await this.donationRepository
      .createQueryBuilder('donation')
      .select('COALESCE(SUM(donation.amount), 0)', 'total')
      .where('donation.organization_id = :organizationId', { organizationId })
      .andWhere('donation.status = :status', {
        status: DonationStatus.COMPLETED,
      })
      .getRawOne<{ total: string }>();

    const totalAmount = parseFloat(totalAmountResult?.total ?? '0');

    return {
      totalAmount,
      totalDonations,
      completedDonations,
      pendingDonations,
    };
  }

  /**
   * Admin: Remove a donation (only if pending).
   */
  public async removeDonation(id: number): Promise<any> {
    const donation = await this.findOneDonation(id);

    if (donation.status !== DonationStatus.PENDING) {
      throw new BadRequestException('Only pending donations can be removed');
    }

    await this.donationRepository.remove(donation);
    return { message: 'Donation removed successfully' };
  }

  /**
   * Process blockchain confirmation for a donation.
   */
  public async confirmBlockchainTransaction(
    id: number,
    blockchainTxId: string,
  ): Promise<Donation> {
    const donation = await this.findOneDonation(id);

    if (donation.status !== DonationStatus.PENDING) {
      throw new BadRequestException('Only pending donations can be confirmed');
    }

    return this.updateStatus(id, DonationStatus.COMPLETED, blockchainTxId);
  }
}
