import { Donation } from '../../donations/entities/donation.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization {
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

  @Column()
  logo_url: string;

  @Column()
  blockchain_address: string;

  @Column('decimal', { default: 0 })
  total_received: number;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  verified_at?: Date;

  @Column({ nullable: true })
  rejection_reason: string;

  @OneToMany(() => Product, (product) => product.organization)
  products: Product[];

  @OneToMany(() => Donation, (donation) => donation.organization)
  donations: Donation[];

  //
  // Creator (user who added the organization)
  //
  @Column({ name: 'created_by', type: 'uuid' })
  created_by: string;

  @ManyToOne(() => User, (user) => user.createdOrganizations, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'user_id' })
  creator: User;

  //
  // Verifier (admin who approved it)
  //
  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verified_by?: string;

  @ManyToOne(() => User, (user) => user.verifiedOrganizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'verified_by', referencedColumnName: 'user_id' })
  verifier?: User;

  @CreateDateColumn()
  created_at: Date;
}
