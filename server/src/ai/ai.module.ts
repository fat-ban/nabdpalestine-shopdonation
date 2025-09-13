import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIInteraction } from './entities/ai.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';


@Module({
  imports: [TypeOrmModule.forFeature([AIInteraction])],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AIModule {}