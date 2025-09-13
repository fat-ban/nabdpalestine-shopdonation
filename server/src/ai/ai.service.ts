import { Injectable } from '@nestjs/common';
import { CreateAIInteractionDto } from './dto/create-ai.dto';

@Injectable()
export class AiService {
  generate(createAiDto: CreateAIInteractionDto) {
    // Placeholder for AI logic
    return {
      prompt: createAiDto.input_text,
      response: `AI response for: ${createAiDto.input_text}`,
    };
  }
}
