import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Language, InteractionType } from 'src/utils/enums';

export class CreateAIInteractionDto {
  @IsString()
  input_text: string;

  @IsString()
  output_text: string;

  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsEnum(Language)
  language: Language;

  @IsEnum(InteractionType)
  interaction_type: InteractionType;
}
