import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { DonationStatus, UserRole } from 'src/utils/enums';
import { JWT_PAYLOAD } from 'src/utils/type';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Controller('api/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // Create a new donation (authenticated user)
  /**
   * @Post = /api/donations
   * @param dto
   * @param payload
   * @returns
   */
  @Post()
  @UseGuards(AuthGuard)
  public async create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateDonationDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.donationsService.createNewDonation(dto, payload.id);
  }

  // List donations with optional filters
  @Get()
  @UseGuards(AuthGuard)
  public async findAll(
    @Query('userId') userId?: string,
    @Query('organizationId', ParseIntPipe) organizationId?: number,
    @Query('status') status?: DonationStatus,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.donationsService.findAllDonations(
      userId,
      organizationId,
      status as DonationStatus,
      { page, limit },
    );
  }

  // Get a single donation by ID
  @Get(':id')
  @UseGuards(AuthGuard)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.findOneDonation(id);
  }

  // Admin: update donation status
  /**
   *
   * @param id  donation id
   * @param dto  data transfer object for updating donation status
   * @returns  Updated donation entity
   */
  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) dto: UpdateDonationDto,
  ) {
    if (!dto.status) {
      throw new BadRequestException('Status is required');
    }
    return this.donationsService.updateStatus(
      id,
      dto.status,
      dto.blockchain_tx_id,
    );
  }

  // Get current user's donations
  /**
   *
   * @param payload current user payload
   * @param page  page number for pagination
   * @param limit  number of items per page
   * @returns  List of donations made by the current user with pagination
   */
  @Get('user/history')
  @UseGuards(AuthGuard)
  public async getUserDonations(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.donationsService.getUserDonations(payload.id, { page, limit });
  }

  // List organization donations
  /**
   *
   * @param orgId  organization id
   * @param page  page number for pagination
   * @param limit  number of items per page
   * @returns  List of donations made to the specified organization with pagination
   */
  @Get('organization/:orgId')
  @UseGuards(AuthGuard)
  public async getOrganizationDonations(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.donationsService.getOrganizationDonations(orgId, {
      page,
      limit,
    });
  }

  // Organization donation stats (public)
  /**
   *
   * @param orgId  organization id
   * @returns  Donation statistics for the specified organization
   */
  @Get('organization/:orgId/stats')
  public async getOrganizationStats(
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.donationsService.getOrganizationStats(orgId);
  }

  // Admin: delete a pending donation
  /**
   * @Delete = /api/donations/:id
   * @param id  donation id
   * @returns  No content status on successful deletion
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    await this.donationsService.removeDonation(id);
  }

  // Confirm blockchain transaction for a donation
  /**
   *
   * @param id donation id
   * @param dto  data transfer object containing blockchain transaction id
   * @returns  Updated donation entity
   */
  @Put(':id/confirm')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async confirmBlockchainTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    dto: { blockchainTxId: string },
  ) {
    return this.donationsService.confirmBlockchainTransaction(
      id,
      dto.blockchainTxId,
    );
  }
}

//Endpoints Overview
/*
POST /donations (auth) – Create a donation

GET /donations (auth) – List donations with filters

GET /donations/:id (auth) – Retrieve one donation

PUT /donations/:id/status (admin) – Update status

GET /donations/user/history (auth) – Current user’s donations

GET /donations/organization/:orgId (auth) – Organization’s donations

GET /donations/organization/:orgId/stats (public) – Donation statistics

DELETE /donations/:id (admin) – Delete pending donation

PUT /donations/:id/confirm (admin) – Confirm blockchain transaction
*/
