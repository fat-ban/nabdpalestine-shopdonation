import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UploadProductImageDto {
  /**

Mark this image as the main image for the product.
*/
  @IsOptional()
  @IsBoolean()
  is_main?: boolean;

  /**

Alt text (Arabic) for accessibility and SEO.
*/
  @IsOptional()
  @IsString()
  alt_text_ar?: string;

  /**

Alt text (English) for accessibility and SEO.
*/
  @IsOptional()
  @IsString()
  alt_text_en?: string;

  /**

Position/order of this image in the product gallery.
*/
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateMainImageDto {
  /**

Index of the image in the gallery to set as main.
*/
  @IsNumber()
  imageIndex: number;
}
