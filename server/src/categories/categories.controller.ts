import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { UserRole } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Public: list all categories
  /**
   * Get = /api/categories
   * @returns  List of all categories
   */
  @Get()
  async findAll() {
    return this.categoriesService.findAllCategories();
  }

  // Public: get one category by ID
  /**
   * Get = /api/categories/:id
   * @param id Category ID
   * @returns 
   */
  @Get(':id')
 public  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneCategorie(id);
  }

  // Admin-only: create a new category
 /**
  * Post = /api/categories
  * @param dto CreateCategoryDto
  * @returns  Newly created category
  */
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async create(
    @Body(new ValidationPipe({ whitelist: true }))
    dto: CreateCategoryDto,
  ) {
    return this.categoriesService.createNewCategorie(dto);
  }

  // Admin-only: update an existing category
 /**
  * Put = /api/categories/:id
  * @param id Category ID
  * @param dto 
  * @returns  Updated category
  */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true }))
    dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategorie(id, dto);
  }

  // Admin-only: delete a category
  /**
   * Delete = /api/categories/:id
   * 
   * @param id Category ID
   * @returns  Success message
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}