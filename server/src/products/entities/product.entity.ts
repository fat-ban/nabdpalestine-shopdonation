import { Category } from '../../categories/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { User } from '../../users/entities/user.entity';
import { ProductStatus } from '../../utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_ar: string;

  @Column()
  name_en: string;

  @Column('text')
  description_ar: string;

  @Column('text')
  description_en: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @Column({
    name: 'image_public_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image_public_id: string | null;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_approved: boolean;

  // New approval workflow columns
  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  approval_status: ProductStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ type: 'varchar', nullable: true })
  approved_by?: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  approved_at?: Date | null;

  // -----------------------
  // Seller (owner) columns
  // -----------------------
  @Column({ name: 'seller_id', type: 'uuid' })
  seller_id: string;

  @ManyToOne(() => User, (u) => u.products, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'seller_id', referencedColumnName: 'user_id' })
  seller: User;

  // -----------------------
  // Creator (admin) columns
  // -----------------------
  @Column({ name: 'creator_id', type: 'uuid', nullable: true })
  creator_id?: string;

  @ManyToOne(() => User, (u) => u.createdProducts, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'user_id' })
  creator?: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => Organization, (organization) => organization.products, {
    eager: true,
  })
  organization: Organization;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Rating, (rating) => rating.product, { onDelete: 'CASCADE' })
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.product, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

}
