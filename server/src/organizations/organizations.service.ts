import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/utils/enums';
import { Not, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly usersService: UsersService, // Assuming you have a UsersService to fetch user details
  ) {}

  /**
   * Create a new organization with multilingual fields.
   */
  public async createNewOrganization(
    dto: CreateOrganizationDto,
    userId: string,
  ): Promise<Organization> {
    const user = await this.usersService.getCurrentUser(userId);

    if (!dto) {
      throw new BadRequestException('Organization data is required');
    }

    const duplicate = await this.organizationRepository.findOne({
      where: [
        { name_en: dto.name_en.trim() },
        { name_ar: dto.name_ar.trim() },
        { blockchain_address: dto.blockchain_address.trim() },
      ],
    });
    if (duplicate) {
      throw new BadRequestException(
        'Organization name or blockchain address already in use',
      );
    }

    const org = this.organizationRepository.create({
      name_en: dto.name_en.trim(),
      name_ar: dto.name_ar.trim(),
      description_en: dto.description_en?.trim(),
      description_ar: dto.description_ar?.trim(),
      logo_url: dto.logo_url?.trim(),
      blockchain_address: dto.blockchain_address.trim(),
      created_by: user.user_id,
      total_received: 0,
      is_verified: false,
    });

    return this.organizationRepository.save(org);
  }

  /**
   * Retrieve all organizations with optional filtering by verification status.
   */
  public async findAllOrganization(): Promise<Organization[]> {
    //const where = isVerified !== undefined ? { is_verified: isVerified } : {};

    return this.organizationRepository.find({
      //where,
      order: { created_at: 'DESC' },
      relations: ['products', 'donations', 'creator'],
    });
  }

  /**
   * Retrieve a single organization by ID.
   */
  public async findOneOrganization(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['products', 'donations', 'creator', 'verifier'],
    });
    if (!organization) {
      throw new NotFoundException(`Organization not found`);
    }
    return organization;
  }

  /**
   * Update multilingual fields on an existing organization.
   */
  public async updateOrganization(
    id: number,
    dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOneOrganization(id);

    // Prevent duplicate names/blockchain address across other organizations
    if (dto.name_en || dto.name_ar || dto.blockchain_address) {
      const duplicate = await this.organizationRepository.findOne({
        where: [
          { name_en: dto.name_en?.trim(), id: Not(id) },
          { name_ar: dto.name_ar?.trim(), id: Not(id) },
          { blockchain_address: dto.blockchain_address?.trim(), id: Not(id) },
        ],
      });
      if (duplicate) {
        throw new BadRequestException(
          'Another organization with the same name or blockchain address exists',
        );
      }
    }

    Object.assign(organization, {
      name_en: dto.name_en?.trim() ?? organization.name_en,
      name_ar: dto.name_ar?.trim() ?? organization.name_ar,
      description_en: dto.description_en?.trim() ?? organization.description_en,
      description_ar: dto.description_ar?.trim() ?? organization.description_ar,
      logo_url: dto.logo_url?.trim() ?? organization.logo_url,
      blockchain_address:
        dto.blockchain_address?.trim() ?? organization.blockchain_address,
    });

    return this.organizationRepository.save(organization);
  }

  /**
   * Remove an organization by ID.
   */
  public async removeOrganization(id: number): Promise<any> {
    const org = await this.findOneOrganization(id);
    if (org.products.length || org.donations.length) {
      throw new BadRequestException(
        'Cannot delete organization with existing products or donations',
      );
    }
    await this.organizationRepository.remove(org);
  }

  /**
   * Admin verification workflow: Verify an organization.
   */
  public async verifyOrganization(
    id: number,
    adminId: string,
  ): Promise<Organization> {
    const admin = await this.usersService.getCurrentUser(adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can verify');
    }

    const org = await this.findOneOrganization(id);
    if (org.is_verified) {
      throw new BadRequestException('Already verified');
    }

    org.is_verified = true;
    org.verified_by = admin.user_id;
    org.verified_at = new Date();
    org.rejection_reason = '';

    return this.organizationRepository.save(org);
  }
  /**
   * Admin verification workflow: Reject an organization.
   */
  public async rejectOrganization(
    id: number,
    adminId: string,
    reason: string,
  ): Promise<Organization> {
    const admin = await this.usersService.getCurrentUser(adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can reject');
    }

    const org = await this.findOneOrganization(id);
    if (!org.is_verified) {
      throw new BadRequestException('Already unverified');
    }

    org.is_verified = false;
    org.verified_by = admin.user_id;
    org.verified_at = new Date();
    org.rejection_reason = reason;
    return this.organizationRepository.save(org);
  }

  /**
   * Update total received amount (for donation processing).
   */

  public async updateTotalReceivedOrg(
    id: number,
    amount: number,
  ): Promise<Organization> {
    const organization = await this.findOneOrganization(id);
    organization.total_received =
      Number(organization.total_received) + Number(amount);
    return this.organizationRepository.save(organization);
  }

  /**
   * Find verified organizations only.
   */
  public async findVerifiedOrganization(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { is_verified: true },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Find pending organizations (for admin review).
   */
  public async findPendingOrganization(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { is_verified: false },
      order: { created_at: 'DESC' },
    });
  }
}
