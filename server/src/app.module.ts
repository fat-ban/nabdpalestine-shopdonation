import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Importing necessary modules
import { RatingsModule } from './ratings/ratings.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/products.module';
import { CategoryModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { DonationModule } from './donations/donations.module';
import { AIModule } from './ai/ai.module';
import { OrganizationModule } from './organizations/organizations.module';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Order } from './orders/entities/order.entity';
import { Donation } from './donations/entities/donation.entity';
import { Rating } from './ratings/entities/rating.entity';
import { Category } from './categories/entities/category.entity';
import { AIInteraction } from './ai/entities/ai.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
//import { ChatbotModule } from './chatbot/chatbot.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    CategoryModule,
    OrdersModule,
    OrderItemsModule,
    DonationModule,
    AIModule,
    OrganizationModule,
    RatingsModule,
    CommentsModule,
    UsersModule,
    CloudinaryModule,
    //ChatbotModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '3306', 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        //entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, //FALSE in production, use migrations instead
        entities: [
          Product,
          User,
          Organization,
          Order,
          OrderItem,
          Category,
          Donation,
          Rating,
          Comment,
          AIInteraction,
        ],
      }),
    }),
  ],
})
export class AppModule {}
// This module imports the necessary modules and sets up TypeORM with configuration from environment variables.
