import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductStatus, UserRole } from 'src/utils/enums';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

interface ProductImage {
  url: string;
  public_id: string;
  is_main: boolean;
  alt_text_ar?: string;
  alt_text_en?: string;
  order: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService, // Assuming you have a UsersService to fetch user details
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new product
   */
  public async createNewProduct(
    createProductDto: CreateProductDto,
    creatorId: string, // ID of the admin creating the product
  ): Promise<Product> {
    // 1. Load the seller (owner) by ID
    const seller = await this.usersService.findSellerById(
      createProductDto.seller_id,
    );
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // 2. Ensure no duplicate product name for this seller
    const existingProduct = await this.productRepository.findOne({
      where: {
        name_en: createProductDto.name_en?.toLowerCase().trim(),
        seller_id: seller.user_id,
      },
      relations: ['seller'],
    });
    if (existingProduct) {
      throw new BadRequestException(
        'Product with the same name already exists for this seller',
      );
    }

    // 3. Load the admin creator by ID
    const creator = await this.usersService.getCurrentUser(creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // 4. Create new product entity
    const product = this.productRepository.create({
      name_ar: createProductDto.name_ar?.toLowerCase().trim(),
      name_en: createProductDto.name_en?.toLowerCase().trim(),
      description_ar: createProductDto.description_ar?.toLowerCase().trim(),
      description_en: createProductDto.description_en?.toLowerCase().trim(),
      price: createProductDto.price,
      image_url: createProductDto.image_url,
      is_active: createProductDto.is_active ?? false,
      approval_status: ProductStatus.DRAFT,
      seller, // Assign seller relation (populates seller_id)
      creator, // Assign creator relation (populates creator_id)
      category: { id: createProductDto.category_id },
      organization: { id: createProductDto.organization_id },
    });

    // 5. Save and return
    return await this.productRepository.save(product);
  }
  /**
   * Submit product for approval
   */
  public async submitForApprovalProduct(
    id: number,
    sellerId: string,
  ): Promise<Product> {
    const product = await this.findOneProduct(id);
    // Ensure the user is the seller of the product

    const seller = await this.usersService.getCurrentUser(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    //const sellerIdFromUser = seller.user_id;

    if (
      seller.role === UserRole.SELLER &&
      product.seller_id !== seller.user_id
    ) {
      throw new ForbiddenException('You can only submit your own products');
    }
    // Only draft or rejected products can be submitted for approval

    if (
      product.approval_status !== ProductStatus.DRAFT &&
      product.approval_status !== ProductStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Only draft or rejected products can be submitted for approval',
      );
    }

    product.approval_status = ProductStatus.PENDING_APPROVAL;
    product.rejection_reason = null; // Clear any previous rejection reason

    return await this.productRepository.save(product);
  }

  /**
   * Approve product (admin action)
   */
  public async approveProduct(
    id: number,
    user_id: string,
    reason?: string,
  ): Promise<Product> {
    const product = await this.findOneProduct(id);

    const adminUser = await this.usersService.getCurrentUser(user_id);

    if (product.approval_status !== ProductStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending products can be approved');
    }

    product.approval_status = ProductStatus.APPROVED;
    product.is_approved = true;
    product.is_active = true;
    product.approved_by = adminUser.user_id;
    product.approved_at = new Date();
    product.creator = adminUser;
    product.rejection_reason = reason || null;

    return await this.productRepository.save(product);
  }

  /**
   * Reject product (admin action)
   */
  public async rejectProduct(
    id: number,
    reason: string,
    user_id: string,
  ): Promise<Product> {
    const product = await this.findOneProduct(id);

    const adminUser = await this.usersService.getCurrentUser(user_id);

    if (product.approval_status !== ProductStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending products can be rejected');
    }

    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }

    product.approval_status = ProductStatus.REJECTED;
    product.is_approved = false;
    product.is_active = false;
    product.approved_by = adminUser.user_id;
    product.approved_at = new Date();
    product.creator = adminUser;
    product.rejection_reason = reason;

    return await this.productRepository.save(product);
  }

  /**
   * Toggle activation (admin action)
   */
  public async toggleActivation(id: number, user_id: string): Promise<Product> {
    const product = await this.findOneProduct(id);

    const adminUser = await this.usersService.getCurrentUser(user_id);

    // Only approved products can be activated/deactivated
    if (product.approval_status === ProductStatus.APPROVED) {
      product.is_active = !product.is_active;

      if (adminUser) {
        product.approved_by = adminUser.user_id;
        product.approved_at = new Date();
        //product.user?.user_id = adminUser.user_id;// Assuming approver is a relation to User
      }

      return await this.productRepository.save(product);
    }

    throw new BadRequestException(
      'Only approved products can be activated/deactivated',
    );
  }

  /**
   * Enhanced findAll with all filters including approval status
   */
  public async findAllProducts(options?: {
    page?: number;
    limit?: number;
    category?: number;
    organization?: number;
    seller?: string;
    isActive?: boolean;
    isApproved?: boolean;
    approvalStatus?: ProductStatus;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      approvalStatus,
      ...filters
    } = options || {};
    const skip = (page - 1) * limit;

    // Build a typed where clause
    const where: FindOptionsWhere<Product> = {};

    if (filters.category) {
      where.category = { id: filters.category };
    }
    if (filters.organization) {
      where.organization = { id: filters.organization };
    }
    if (filters.seller) {
      where.seller = {user_id: filters.seller};
    }
    if (filters.isActive !== undefined) {
      where.is_active = filters.isActive;
    }
    if (filters.isApproved !== undefined) {
      where.is_approved = filters.isApproved;
    }
    if (approvalStatus) {
      where.approval_status = approvalStatus;
    }

    // Price filtering
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    const findOptions: FindManyOptions<Product> = {
      relations: [
        'category',
        'organization',
        'creator',
        'seller',
        'ratings',
        'comments',
      ],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      where,
    };

    const [data, total] =
      await this.productRepository.findAndCount(findOptions);

    return { data, total, page, limit };
  }

  /**
   * Get seller's products
   */
  public async findSellerProducts(
    sellerId: string,
    status?: ProductStatus,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Product[]; total: number }> {
    // 1. Verify seller exists
    const seller = await this.usersService.findSellerById(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // 2. Pagination defaults
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    // 3. Build QueryBuilder
    const qb = this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.seller', 'seller')
      .leftJoinAndSelect('p.creator', 'creator')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.organization', 'organization')
      .where('p.seller_id = :sellerId', { sellerId });
    if (status) {
      qb.andWhere('p.approval_status = :status', { status });
    }

    const [data, total] = await qb
      .orderBy('p.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * Find one product
   */
  public async findOneProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'organization',
        'creator',
        'seller',
        'ratings',
        'comments',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  /**
   * Update product
   */
  public async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    userId?: string, // Added user authorization
  ): Promise<Product> {
    try {
      const product = await this.findOneProduct(id);

      // If userId is provided, check if user owns the product
      if (userId && product.approved_by !== userId) {
        throw new ForbiddenException('You can only update your own products');
      }

      // Don't allow updates to approved products without going through approval process
      if (product.approval_status === ProductStatus.APPROVED && userId) {
        throw new BadRequestException(
          'Approved products cannot be updated directly',
        );
      }

      Object.assign(product, updateProductDto);

      // Reset approval status if product was modified after being rejected/approved
      if (
        product.approval_status === ProductStatus.APPROVED ||
        product.approval_status === ProductStatus.REJECTED
      ) {
        product.approval_status = ProductStatus.DRAFT;
        product.is_approved = false;
        product.is_active = false;
        product.rejection_reason = null;
      }

      return await this.productRepository.save(product);
    } catch (error) {
      const err = error as unknown;
      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new BadRequestException('Failed to update product');
    }
  }

  /**
   * soft delete a product (deactivate)
   * @param id
   * @param userId
   */

  public async deleteProduct(id: number): Promise<any> {
    const product = await this.findOneProduct(id);

    //const user = await this.usersService.getCurrentUser(userId);
    // If userId is provided, check if user owns the product
    /*if (userId && product.approved_by !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }*/

    // Only allow deletion of draft or rejected products
    if (
      product.approval_status === ProductStatus.APPROVED ||
      product.approval_status === ProductStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(
        'Cannot delete approved or pending products',
      );
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  /**
   * hard delete a product (admin action)
   * @param id
   */
  public async hardDelete(id: number): Promise<any> {
    const product = await this.findOneProduct(id);
    await this.productRepository.remove(product);
    return { message: 'Product permanently deleted successfully' };
  }
  /**
   * Get products by approval status
   */
  public async findByApprovalStatus(
    status: ProductStatus,
    options?: {
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      where: { approval_status: status },
      relations: ['category', 'organization', 'seller', 'creator'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { data, total };
  }

  /**
   * Get admin statistics
   */
  public async getAdminStatistics(): Promise<{
    total: number;
    active: number;
    approved: number;
    pending: number;
    draft: number;
    rejected: number;
    suspended: number;
  }> {
    const [total, active, approved, pending, draft, rejected, suspended] =
      await Promise.all([
        this.productRepository.count(),
        this.productRepository.count({ where: { is_active: true } }),
        this.productRepository.count({ where: { is_approved: true } }),
        this.productRepository.count({
          where: { approval_status: ProductStatus.PENDING_APPROVAL },
        }),
        this.productRepository.count({
          where: { approval_status: ProductStatus.DRAFT },
        }),
        this.productRepository.count({
          where: { approval_status: ProductStatus.REJECTED },
        }),
        this.productRepository.count({
          where: { approval_status: ProductStatus.SUSPENDED },
        }),
      ]);

    return { total, active, approved, pending, draft, rejected, suspended };
  }
  /**
   * Get public products (approved and active only)
   */
  public async findPublicProducts(options?: {
    page?: number;
    limit?: number;
    category?: number;
    organization?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{
    data: Product[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    return this.findAllProducts({
      ...options,
      isActive: true,
      isApproved: true,
      approvalStatus: ProductStatus.APPROVED,
    });
  }

  /**
   * Search products
   */
  public async searchProduct(
    query: string,
    options?: {
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Product[]; total: number }> {
    if (!query?.trim()) {
      throw new BadRequestException('Search query is required');
    }

    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;
    const searchTerm = `%${query.trim()}%`;

    try {
      const [data, total] = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.organization', 'organization')
        .leftJoinAndSelect('product.seller', 'seller')
        .leftJoinAndSelect('product.creator', 'creator')
        .where('LOWER(product.name_en) LIKE LOWER(:query)', {
          query: searchTerm,
        })
        .orWhere('LOWER(product.name_ar) LIKE LOWER(:query)', {
          query: searchTerm,
        })
        .andWhere('product.is_active = :isActive', { isActive: true })
        .andWhere('product.approval_status = :status', {
          status: ProductStatus.APPROVED,
        })
        .orderBy('product.created_at', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { data, total };
    } catch {
      throw new BadRequestException('Failed to search products');
    }
  }

  //for product image
  /**
   * Replace the product's main image
   */
  public async updateMainImage(
    productId: number,
    imageUrl: string | null,
    publicId: string | null,
    userId?: string,
  ): Promise<Product> {
    const product = await this.findOneProduct(productId);

    // Authorization: sellers can only update their own products, while admins have unrestricted access.
    if (userId) {
      const user = await this.usersService.getCurrentUser(userId);
      if (user.role === UserRole.SELLER && product.seller_id !== user.user_id) {
        throw new ForbiddenException('You can only update your own product');
      }
    }

    // Delete old image from Cloudinary if it exists
    if (product.image_public_id) {
      try {
        await this.cloudinaryService.deleteFile(product.image_public_id);
      } catch (err) {
        console.warn('Could not delete old image:', err);
      }
    }

    // Update DB fields
    await this.productRepository.update(productId, {
      image_url: imageUrl,
      image_public_id: publicId,
    });

    return this.findOneProduct(productId);
  }

  /**
   * Fetch a single product with its image fields
   */
  /*public async findOneProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }*/
}
