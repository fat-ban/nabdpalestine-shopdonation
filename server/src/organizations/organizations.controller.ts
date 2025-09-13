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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { UserRole } from 'src/utils/enums';
import { JWT_PAYLOAD } from 'src/utils/type';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('api/organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly jwtService: JwtService,
  ) {}

  // Public: list all organizations or filter by verified status
  /**
   * @Get = /api/organizations?isVerified=true/false
   * @returns  List of organizations
   */
  @Get()
  public async findAll() {
    return this.organizationsService.findAllOrganization();
  }

  // Public: list verified organizations
  /**
   * Get = /api/organizations/verified
   * @returns List of verified organizations
   */
  @Get('verified')
  public async findVerified() {
    return this.organizationsService.findVerifiedOrganization();
  }

  // Admin: list pending organizations for review
  /**
   * Get = /api/organizations/pending
   * @returns List of pending organizations
   */
  @Get('pending')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async findPending() {
    return this.organizationsService.findPendingOrganization();
  }

  // Public: get one organization by ID
  /**
   * @Get = /api/organizations/:id
   * @param id Organization ID
   * @returns  Single organization details
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOneOrganization(id);
  }

  // Admin-only: create a new organization
  /**
   * @Post = /api/organizations
   * @param dto
   * @returns
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async create(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.createNewOrganization(dto, payload.id);
  }

  // Owner or Admin: update an existing organization

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateOrganization(id, dto);
  }

  // Admin-only: delete an organization

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.organizationsService.removeOrganization(id);
  }

  // Admin-only: verify an organization
  /**
   * Put = /api/organizations/:id/verify
   * @param id Organization ID
   * @param payload
   * @returns  Verified organization
   */
  @Put(':id/verify')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async verify(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.organizationsService.verifyOrganization(id, payload.id);
  }

  // Admin-only: reject an organization
  /**
   * Put = /api/organizations/:id/reject
   * @param id Organization ID
   * @returns  Unverified organization
   */
  @Put(':id/reject')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async reject(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Body() dto: UpdateOrganizationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!dto.rejection_reason) {
      throw new BadRequestException('Rejection reason is required');
    }
    return this.organizationsService.rejectOrganization(
      id,
      payload.id,
      dto?.rejection_reason,
    );
  }
}

/*
GET /organizations (all)

GET /organizations/verified

GET /organizations/pending (admin)

GET /organizations/:id

POST /organizations (admin)

PUT /organizations/:id (admin)

DELETE /organizations/:id (admin)

PUT /organizations/:id/verify (admin)

PUT /organizations/:id/reject (admin)


*/
