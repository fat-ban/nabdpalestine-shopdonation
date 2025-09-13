import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category with multilingual fields.
   */
  public async createNewCategorie(dto: CreateCategoryDto): Promise<Category> {
    const exists = await this.categoryRepository.findOne({
      where: { name_en: dto.name_en.trim(), name_ar: dto.name_ar.trim() },
    });
    if (exists) {
      throw new BadRequestException(
        'Category with same English and Arabic names already exists',
      );
    }

    const category = this.categoryRepository.create({
      name_en: dto.name_en.trim(),
      name_ar: dto.name_ar.trim(),
      icon: dto.icon?.trim(),
      color: dto.color?.trim(),
    });

    return this.categoryRepository.save(category);
  }

  /**
   * Retrieve all categories, optionally paginated.
   */
  public async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Retrieve a single category by ID.
   */
  public async findOneCategorie(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }
    return category;
  }

  /**
   * Update multilingual fields on an existing category.
   */
  public async updateCategorie(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneCategorie(id);

    // Prevent duplicate names across other categories
    if (dto.name_en || dto.name_ar) {
      const duplicate = await this.categoryRepository.findOne({
        where: [
          { name_en: dto.name_en?.trim(),id: Not(id)},
          { name_ar: dto.name_ar?.trim(),id: Not(id) },
        ],
      });
      if (duplicate) {
        throw new BadRequestException(
          'Another category with the same name exists',
        );
      }
    }

    Object.assign(category, {
      name_en: dto.name_en?.trim() ?? category.name_en,
      name_ar: dto.name_ar?.trim() ?? category.name_ar,
      icon: dto.icon?.trim() ?? category.icon,
      color: dto.color?.trim() ?? category.color,
    });

    return this.categoryRepository.save(category);
  }

  /**
   * Remove a category by ID.
   */
  public async remove(id: number): Promise<void> {
    const category = await this.findOneCategorie(id);

    if (category.products && category.products.length > 0) {
    throw new BadRequestException(
        `Cannot delete category ${category.name_en}/ ${category.name_ar} because it has ${category.products.length} associated product(s)`
    );
  }
console.log(category.products.length)
    await this.categoryRepository.remove(category);
  }
}