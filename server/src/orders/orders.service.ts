import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';
import { OrderStatus, PaymentStatus } from '../utils/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Generate unique order number.
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create a new order.
   */
  public async createOrder(
    dto: CreateOrderDto,
    userId: string,
  ): Promise<Order> {
    // 1. Load user
    const user = await this.usersService.getCurrentUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Generate unique order number
    let orderNumber: string;
    let exists: Order | null;
    do {
      orderNumber = this.generateOrderNumber();
      exists = await this.orderRepository.findOne({
        where: { order_number: orderNumber },
      });
    } while (exists);

    // 3. Create order entity
    const order = this.orderRepository.create({
  user_id: user.user_id,  // Use the foreign key instead of the relation object
  order_number: orderNumber,
  total_amount: dto.total_amount,
  status: OrderStatus.PENDING,
  payment_status: PaymentStatus.UNPAID,
  blockchain_tx_id: dto.blockchain_tx_id || undefined,  // Use undefined instead of null
});
    return this.orderRepository.save(order);
  }

  /**
   * Retrieve all orders with optional filtering.
   */
  public async findAllOrders(
    userId?: string,
    status?: OrderStatus,
    paymentStatus?: PaymentStatus,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Order[]; total: number }> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.donations', 'donations');

    if (userId) {
      queryBuilder.andWhere('order.user.user_id = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      queryBuilder.andWhere('order.payment_status = :paymentStatus', { paymentStatus });
    }

    const [data, total] = await queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * Retrieve a single order by ID.
   */
  public async findOneOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'donations'],
    });
    if (!order) {
      throw new NotFoundException(`Order not found`);
    }
    return order;
  }

  /**
   * Find order by order number.
   */
  public async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_number: orderNumber },
      relations: ['user', 'orderItems', 'donations'],
    });
    if (!order) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }
    return order;
  }

  /**
   * Update order details (admin or owner).
   */
  public async updateOrder(
    id: number,
    dto: UpdateOrderDto,
    userId?: string,
  ): Promise<Order> {
    const order = await this.findOneOrder(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId) {
    const currentUser = await this.usersService.getCurrentUser(userId);
      if (currentUser.role !== 'admin') {
        if (order.user.user_id !== userId) {
          throw new ForbiddenException('You can only update your own orders');  
      }
  }}
    Object.assign(order, {
      total_amount: dto.total_amount ?? order.total_amount,
      status: dto.status ?? order.status,
      payment_status: dto.payment_status ?? order.payment_status,
      blockchain_tx_id: dto.blockchain_tx_id ?? order.blockchain_tx_id,
    });

    return this.orderRepository.save(order);
  }

  /**
   * Update order status.
   */
  public async updateStatus(
    id: number,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.findOneOrder(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  /**
   * Update payment status.
   */
  public async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
    blockchainTxId?: string,
  ): Promise<Order> {
    const order = await this.findOneOrder(id);
    order.payment_status = paymentStatus;
    
    if (blockchainTxId) {
      order.blockchain_tx_id = blockchainTxId;
    }

    return this.orderRepository.save(order);
  }

  /**
   * Get user's order history.
   */
  public async getUserOrders(
    userId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ data: Order[]; total: number }> {
    return this.findAllOrders(userId, undefined, undefined, options);
  }

  /**
   * Get order statistics.
   */
  public async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }> {
    const totalOrders = await this.orderRepository.count();
    
    const pendingOrders = await this.orderRepository.count({
      where: { status: OrderStatus.PENDING },
    });
    
    const completedOrders = await this.orderRepository.count({
      where: { status: OrderStatus.COMPLETED },
    });

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where('order.payment_status = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.total || '0');

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    };
  }

  /**
   * Cancel an order (only if pending and unpaid).
   */
  public async cancelOrder(id: number, userId?: string): Promise<Order> {
    const order = await this.findOneOrder(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // Check ownership if userId provided
    if (userId && order.user.user_id !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    // Only allow cancellation of pending/unpaid orders
    if (order.status !== OrderStatus.PENDING || order.payment_status === PaymentStatus.PAID) {
      throw new BadRequestException('Cannot cancel this order');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  /**
   * Remove an order (admin only, if no related data exists).
   */
  public async removeOrder(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'donations'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    // Prevent deletion if order items or donations exist
    if (order.orderItems && order.orderItems.length > 0) {
      throw new BadRequestException(
        `Cannot delete order because it has ${order.orderItems.length} associated item(s)`,
      );
    }
    
    if (order.donations && order.donations.length > 0) {
      throw new BadRequestException(
        `Cannot delete order because it has ${order.donations.length} associated donation(s)`,
      );
    }

    await this.orderRepository.remove(order);
  }
}