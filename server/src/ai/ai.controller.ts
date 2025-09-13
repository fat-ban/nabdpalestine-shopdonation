import { Controller, Post, Body } from '@nestjs/common';
import { CreateAIInteractionDto } from './dto/create-ai.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(@Body() createAiDto: CreateAIInteractionDto) {
    return this.aiService.generate(createAiDto);
  }
}
