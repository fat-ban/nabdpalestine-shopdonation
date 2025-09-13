import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Donation } from '../../donations/entities/donation.entity';
import { OrderStatus, PaymentStatus } from '../../utils/enums';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  user_id: string;

  order_number: string;

  @Column('decimal')
  total_amount: number;

  @Column({type: 'enum', enum: OrderStatus , default: OrderStatus.PENDING})
  status: OrderStatus; // e.g., 'pending', 'shipped', 'completed'

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  payment_status: PaymentStatus;

  @Column()
  blockchain_tx_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => Donation, donation => donation.order)
  donations: Donation[];
}
