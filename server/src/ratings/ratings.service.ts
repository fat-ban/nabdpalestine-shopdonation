import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Create a new rating for a product
   */
  public async createNewRating(
    createRatingDto: CreateRatingDto,
    userId: string,
  ): Promise<Rating> {
    const { value, productId } = createRatingDto;

    // Validate user exists
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already rated this product
    const existingRating = await this.ratingRepository.findOne({
      where: {
        user: { user_id: userId },
        product: { id: productId },
      },
    });

    if (existingRating) {
      throw new ConflictException('User has already rated this product');
    }

    // Create new rating
    const rating = this.ratingRepository.create({
      value,
      user,
      product,
    });

    return this.ratingRepository.save(rating);
  }

  /**
   * Get all ratings with optional filters
   */
  public async findAllRating(
    productId?: number,
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Rating[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .leftJoinAndSelect('rating.product', 'product');

    if (productId) {
      queryBuilder.andWhere('product.id = :productId', { productId });
    }

    if (userId) {
      queryBuilder.andWhere('user.user_id = :userId', { userId });
    }

    const [data, total] = await queryBuilder
      .orderBy('rating.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * Get a single rating by ID
   */
  public async findOneRating(id: string): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { rating_id: id },
      relations: ['user', 'product'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return rating;
  }

  /**
   * Update a rating
   */
  public async updateRating(
    id: string,
    updateRatingDto: UpdateRatingDto,
    userId: string,
  ): Promise<Rating> {
    const rating = await this.findOneRating(id);

    // Check if user owns this rating or is admin
    if (rating.user.user_id !== userId) {
      throw new BadRequestException('You can only update your own ratings');
    }

    rating.value = updateRatingDto.value;
    return this.ratingRepository.save(rating);
  }

  /**
   * Remove a rating
   */
  public async removeRating(id: string, userId: string): Promise<void> {
    const rating = await this.findOneRating(id);

    // Check if user owns this rating or is admin
    if (rating.user.user_id !== userId) {
      throw new BadRequestException('You can only delete your own ratings');
    }

    await this.ratingRepository.remove(rating);
  }

  /**
   * Get average rating for a product
   */
  public async getProductAverageRating(
    productId: number,
  ): Promise<{ average: number; count: number }> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.value)', 'average')
      .addSelect('COUNT(rating.rating_id)', 'count')
      .leftJoin('rating.product', 'product')
      .where('product.id = :productId', { productId })
      .getRawOne<{ average: string | null; count: string | null }>();

    return {
      average: parseFloat(result?.average || '0'),
      count: parseInt(result?.count || '0'),
    };
  }

  /**
   * Get user's rating for a specific product
   */
  public async getUserProductRating(
    userId: string,
    productId: number,
  ): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: {
        user: { user_id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });
  }
}
