import { IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  donation_amount: number;
}
