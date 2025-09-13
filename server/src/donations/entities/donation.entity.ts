import { Order } from '../../orders/entities/order.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { DonationStatus, DonationType } from '../../utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'donations' })
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;
  // Make sure you have the foreign key columns
  @Column()
  user_id: string;

  @Column()
  organization_id: number;

  @Column({ nullable: true })
  order_id: number;

  // Relations
  @ManyToOne(() => User, (user) => user.donations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.donations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Order, (order) => order.donations, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column('decimal')
  amount: number;

  @Column({ type: 'enum', enum: DonationType })
  type: DonationType;

  @Column({
    type: 'enum',
    enum: DonationStatus,
    default: DonationStatus.PENDING,
  })
  status: DonationStatus;

  @Column()
  blockchain_tx_id: string;

  @CreateDateColumn()
  created_at: Date;
}
