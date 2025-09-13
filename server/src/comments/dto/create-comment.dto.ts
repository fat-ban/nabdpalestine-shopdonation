import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsInt()
  @Type(() => Number)
  productId: number;

  // User ID is typically taken from the authenticated user's token
}
