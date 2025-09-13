import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}