import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  content: string;

  // Usually you don't allow changing the article or user for a comment
}
