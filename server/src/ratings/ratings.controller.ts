import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { JWT_PAYLOAD } from 'src/utils/type';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingsService } from './ratings.service';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { UserRole } from 'src/utils/enums';

@Controller('api/ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,

  
  ) {}

  /**
   * Create a new rating
   * POST /api/ratings
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ValidationPipe({ whitelist: true }))
    createRatingDto: CreateRatingDto,
    @CurrentUser()
    payload: JWT_PAYLOAD,
  ) {
    return this.ratingsService.createNewRating(createRatingDto, payload.id);
  }

  /**
   * Get all ratings with optional filters
   * GET /api/ratings?productId=123&userId=456&page=1&limit=10
   */
  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  findAll(
    @Query('productId') productIdRaw?: string,
    @Query('userId') userId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    const productId =
      productIdRaw !== undefined && productIdRaw !== null && productIdRaw !== ''
        ? Number(productIdRaw)
        : undefined;
    return this.ratingsService.findAllRating(productId, userId, page, limit);
  }

  /**
   * Get average rating for a product
   * GET /api/ratings/product/:productId/average
   */
  @Get('product/:productId/average')
  getProductAverageRating(@Param('productId', ParseIntPipe) productId: number) {
    return this.ratingsService.getProductAverageRating(productId);
  }

  /**
   * Get user's rating for a specific product
   * GET /api/ratings/product/:productId/user
   */
  @Get('product/:productId/user')
  @UseGuards(AuthGuard)
  getUserProductRating(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.ratingsService.getUserProductRating(payload.id, productId);
  }

  /**
   * Get a single rating by ID
   * GET /api/ratings/:id
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOneRating(id);
  }

  /**
   * Update a rating
   * PATCH /api/ratings/:id
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateRatingDto: UpdateRatingDto,
    @CurrentUser()
    payload: JWT_PAYLOAD,
  ) {
    return this.ratingsService.updateRating(id, updateRatingDto, payload.id);
  }

  /**
   * Delete a rating
   * DELETE /api/ratings/:id
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() payload: JWT_PAYLOAD) {
    return this.ratingsService.removeRating(id, payload.id);
  }
}
