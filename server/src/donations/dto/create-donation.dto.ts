import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { DonationStatus, DonationType } from 'src/utils/enums';


export class CreateDonationDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsEnum(DonationType)
  @IsNotEmpty()
  type: DonationType;

  @IsString()
  blockchain_tx_id?: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  organizationId: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  orderId?: number;
}