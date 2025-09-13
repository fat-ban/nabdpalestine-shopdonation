import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   *create New comment
   *
   * @async
   * @param {CreateCommentDto} createCommentDto
   * @param {string} userId
   * @returns {Promise<Comment>}
   */
  public async createNewComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const { content, productId } = createCommentDto;

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const comment = this.commentRepository.create({ content, user, product });
    return this.commentRepository.save(comment);
  }

  /**
   * Find all comments
   * @param productId
   * @param userId
   * @param page
   * @param limit
   * @returns
   */
  public async findAllomments(
    productId?: number,
    userId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Comment[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.product', 'product');

    if (productId) {
      queryBuilder.andWhere('product.id = :productId', { productId });
    }

    if (userId) {
      queryBuilder.andWhere('user.user_id = :userId', { userId });
    }

    const [data, total] = await queryBuilder
      .orderBy('comment.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * find One comment
   * @param id
   * @returns oneComment
   */
  public async findOneComment(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { comment_id: id },
      relations: ['user', 'product'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  /**
   * update comment by ID
   * @param id
   * @param updateCommentDto
   * @param userId
   * @returns updated comment
   */
  public async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOneComment(id);
    if (comment.user.user_id !== userId) {
      throw new BadRequestException('You can only update your own comments');
    }
    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  /**
   * remove comment by id
   * @param id
   * @param userId
   */
  public async removeComment(id: string, userId: string): Promise<void> {
    const comment = await this.findOneComment(id);
    if (comment.user.user_id !== userId) {
      throw new BadRequestException('You can only delete your own comments');
    }
    await this.commentRepository.remove(comment);
  }
}
