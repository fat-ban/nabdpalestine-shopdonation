import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order]),
    UsersModule,
    JwtModule, // register if not global
  ],
  providers: [OrderItemsService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
