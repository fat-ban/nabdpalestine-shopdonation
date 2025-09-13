import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentStatus } from 'src/utils/enums';

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  total_amount?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @IsString()
  @IsOptional()
  @IsUUID()
  blockchain_tx_id?: string;
}
