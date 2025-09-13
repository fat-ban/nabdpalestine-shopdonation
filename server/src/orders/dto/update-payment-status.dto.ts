import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentStatus } from 'src/utils/enums';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  payment_status: PaymentStatus;

  @IsString()
  @IsOptional()
  @IsUUID()
  blockchain_tx_id?: string;
}