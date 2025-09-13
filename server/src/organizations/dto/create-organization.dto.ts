import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsBoolean, IsNumber, IsUUID, IsEthereumAddress } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsString()
  @IsNotEmpty()
  name_ar: string;

  @IsString()
  @IsOptional()
  description_en?: string;

  @IsString()
  @IsOptional()
  description_ar?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  blockchain_address: string;

   @IsString()
  @IsOptional()
  rejection_reason?:string;

  /*@IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  created_by: string;*/
}

