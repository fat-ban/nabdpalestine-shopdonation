import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ProductStatus } from 'src/utils/enums';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name_ar: string;

  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsString()
  @IsOptional()
  description_ar?: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  image_url?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;

  @IsEnum(ProductStatus)
  @IsOptional()
  approval_status?: ProductStatus;

  @IsString()
  @IsOptional()
   rejection_reason?: string;

   @IsString()
   @IsOptional()
   approved_by?: string;

   @IsString()
   @IsOptional()
   approved_at?: Date;

   @IsUUID()
   @IsNotEmpty()
  seller_id: string;

  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @IsNumber()
  @IsNotEmpty()
  organization_id: number;


}
