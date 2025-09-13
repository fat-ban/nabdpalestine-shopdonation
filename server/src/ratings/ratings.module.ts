import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductModule } from 'src/products/products.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Rating } from './entities/rating.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService],
  imports: [
    TypeOrmModule.forFeature([Rating, User, Product]),
    UsersModule,
    ProductModule,
    JwtModule,
  ],
  exports: [RatingsService],
})
export class RatingsModule {}
