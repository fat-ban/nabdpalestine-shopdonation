import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
//import { Article } from 'src/article/entities/article.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { UserRole } from '../../utils/enums';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { Donation } from '../../donations/entities/donation.entity';
import { AIInteraction } from '../../ai/entities/ai.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  phone?: string;

  @Column({default: 'ar'})
  language: string; // 'ar' or 'en'

  @Column({default: 'light'})
  theme: string; // 'light' or 'dark'
  
  @Column({ nullable: true })
  avatar_url?: string;

  // ADD THIS NEW FIELD for Cloudinary management
  @Column({ nullable: true })
  avatar_public_id?: string;

  @Column({ nullable: true })
  image__url?: string;

  @Column({ nullable: true })
  image_public_id?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'varchar', length: 150, nullable: true })
  username?: string;

  @Column({ type: 'decimal', default: 0 })
  total_donated: number;

  @Column({ default: true })
  is_active: boolean;
  
  /*@OneToMany(() => Article, (article) => article.author)
  articles: Article[];*/
 // @OneToMany(() => Product, product => product.user)
  //products: Product[];
  @OneToMany(() => Product, p => p.seller)
  products: Product[];

  @OneToMany(() => Product, p => p.creator,{onDelete:'CASCADE'})
  createdProducts: Product[];
///
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Donation, donation => donation.user)
  donations: Donation[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

 /* @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];*/
  @OneToMany(() => Organization, org => org.creator)
  createdOrganizations: Organization[];

  @OneToMany(() => Organization, org => org.verifier)
  verifiedOrganizations: Organization[];

  @OneToMany(() => AIInteraction, aiInteraction => aiInteraction.user)
  aiInteractions: AIInteraction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
