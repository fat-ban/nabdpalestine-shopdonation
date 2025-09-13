import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  total_amount: number;

  @IsString()
  @IsOptional()
  @IsUUID()
  blockchain_tx_id?: string;
}