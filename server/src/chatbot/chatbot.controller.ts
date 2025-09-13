import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { JWT_PAYLOAD } from 'src/utils/type';

class ChatDto { message: string; }

@Controller('api/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @UseGuards(AuthGuard)
  async message(@Body() dto: ChatDto, @CurrentUser() user: JWT_PAYLOAD) {
    const response = await this.chatbotService.getResponse(dto.message, user);
    return { response };
  }
}