import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Patch,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { ProductStatus, UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { JWT_PAYLOAD } from 'src/utils/type';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { Product } from './entities/product.entity';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  //ReorderImagesDto,
  UpdateMainImageDto,
  UploadProductImageDto,
} from './dto/upload-image.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  /**1***
   * Post = api/products
   * @param createProductDto
   * @param payload
   * @returns
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async createNewProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.productsService.createNewProduct(createProductDto, payload.id);
  }

  /**2***
   * PUT = /api/products/:id/submit
   * @param id  Product ID
   * @param user  Current User
   * @returns  Product submitted for approval
   */
  @Patch(':id/submit')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  public async submitForApproval(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.productsService.submitForApprovalProduct(id, payload.id);
  }

  /**3***
   * PUT = /api/products/:id/approve
   * @param id Product ID
   * @param reason  Reason for approval
   * @param user Current User
   * @returns Approved Product
   */
  @Put(':id/approve')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async approveProduct(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.approveProduct(
      id,
      payload.id,
      body.rejection_reason,
    );
  }

  /**4***
   * PUT = /api/products/:id/reject
   * @param id Product ID
   * @param reason  Reason for rejection
   * @param user  Current User
   * @returns  Rejected Product
   */
  @Put(':id/reject')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async rejectProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ): Promise<Product> {
    if (!body.rejection_reason) {
      throw new BadRequestException('Rejection reason is required');
    }
    return this.productsService.rejectProduct(
      id,
      body.rejection_reason,
      payload.id,
    );
  }

  /**5****
   * PUT = /api/products/:id/toggle-activation
   *
   * @param id Product ID
   * @param user Current User
   * @returns  Product with toggled activation status
   */
  @Put(':id/toggle-activation')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async toggleActivation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.productsService.toggleActivation(id, payload.id);
  }

  /**6****
   * GET = /api/products
   * @param page  page number for pagination
   * @param limit  limit number for pagination
   * @param category category ID to filter
   * @param organization organization ID to filter
   * @param user  role seller user ID to filter
   * @param isActive isActive filter
   * @param isApproved isApproved filter
   * @param approvalStatus  approvalStatus filter
   * @param minPrice minPrice filter
   * @param maxPrice maxPrice filter
   * @returns  List of products based on filters and pagination
   */

  @Get()
  public async findAllProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: number,
    @Query('organization') organization?: number,
    //@Query('seller') seller?: string,
    @Query('isActive') isActive?: boolean,
    @Query('isApproved') isApproved?: boolean,
    @Query('approvalStatus') approvalStatus?: ProductStatus,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const options = {
      page,
      limit,
      category,
      organization,
      //seller,
      isActive,
      isApproved,
      approvalStatus,
      minPrice,
      maxPrice,
    };
    return this.productsService.findAllProducts(options);
  }

  /**7**** not FIXED
   * GET = /api/products/seller/:sellerId
   *
   * @param sellerId
   * @param status
   * @param page
   * @param limit
   * @returns
   */
  @Get('seller/:sellerId')
  public async findSellerProducts(
    @Param('sellerId') sellerId: string,
    @Query('status') status?: ProductStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productsService.findSellerProducts(sellerId, status, {
      page,
      limit,
    });
  }

  /**8****
   * GET = /api/products/public
   *
   * @param page  PAGE number
   * @param limit limit number
   * @param category category ID
   * @param organization  organization ID
   * @param minPrice  minPrice filter
   * @param maxPrice  maxPrice filter
   * @returns
   */
  @Get('public')
  public async findPublicProducts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: number,
    @Query('organization') organization?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.productsService.findPublicProducts({
      page,
      limit,
      category,
      organization,
      minPrice,
      maxPrice,
    });
  }

  /**9****
   * GET = /api/products/search
   *
   * @param query search query
   * @param page page number
   * @param limit limit number
   * @returns  List of products matching the search query
   */
  @Get('search')
  public async searchProduct(
    @Query('name') query: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productsService.searchProduct(query);
  }

  /**10****
   * GET = /api/products/:id
   *
   * @param id Product ID
   * @returns  Single product by ID
   */
  @Get(':id')
  public async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneProduct(id);
  }

  /**11***
   *
   * @param id  Product ID
   * @param updateProductDto  Product update data
   * @param user  Current User
   * @returns  Updated Product
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return this.productsService.updateProduct(id, updateProductDto, payload.id);
  }

  /**12****
   * DELETE = /api/products/:id
   *
   * @param id Product ID
   * @param user Current User
   * @returns  Soft-deleted Product
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    //@CurrentUser() payload: JWT_PAYLOAD,
  ) {
    return await this.productsService.deleteProduct(id);
  }

  /**13****
   *
   * @param id Product ID
   * @returns  Permanently deleted Product
   */
  @Delete('hard-delete/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async hardDelete(@Param('id', ParseIntPipe) id: number) {
    // Consider securing this route for admin only
    return await this.productsService.hardDelete(id);
  }

  /**14****
   * GET = /api/products/status/:status
   *
   * @param status approval status
   * @param page page number
   * @param limit limit number
   * @returns  List of products by approval status
   */
  @Get('status/:status')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async findByApprovalStatus(
    @Param('status') status: ProductStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productsService.findByApprovalStatus(status, { page, limit });
  }

  /**15***
   * GET = /api/products/statistics/admin
   *
   * @returns  Admin statistics
   */
  @Get('statistics/admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async getAdminStatistics() {
    return this.productsService.getAdminStatistics();
  }

  //product image
  /**
   * Upload or replace the main image for a product
   */
  @Post(':id/image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  public async uploadProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const result = await this.cloudinaryService.uploadFile(file, {
      folder: 'nabdPalestine/products',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
    const updated = await this.productsService.updateMainImage(
      productId,
      result.secure_url,
      result.public_id,
      payload.id,
    );
    return {
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        image_url: result.secure_url,
        product: updated,
      },
    };
  }

  /**
   * Get the current main image URL for a product
   */
  @Get(':id/image')
  public async getProductImage(@Param('id', ParseIntPipe) productId: number) {
    const product = await this.productsService.findOneProduct(productId);
    return {
      success: true,
      data: {
        image_url: product.image_url,
        image_public_id: product.image_public_id,
      },
    };
  }

  /**
   * Remove the main image from a product
   */
  @Delete(':id/image')
  @UseGuards(AuthGuard)
  public async deleteProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    const updated = await this.productsService.updateMainImage(
      productId,
      null,
      null,
      payload.id,
    );
    return {
      success: true,
      message: 'Product image removed successfully',
      data: {
        product: updated,
      },
    };
  }
}
