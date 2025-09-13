import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsInt()
  @Type(() => Number)
  productId: number;

  // User ID is typically taken from the authenticated user's token,
  // so it's not included in the DTO
}
