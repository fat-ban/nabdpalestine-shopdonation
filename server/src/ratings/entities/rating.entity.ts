import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'ratings' })
@Unique(['user', 'product']) // one rating per user per product
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  rating_id: string;

  @Column({ type: 'int', nullable: false })
  value: number; // expected range: 1–5

  @ManyToOne(() => Product, product => product.ratings, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
