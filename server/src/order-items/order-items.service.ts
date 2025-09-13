import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, MoreThan, LessThan, Between } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UserRole, OrderStatus } from '../utils/enums';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrderItem(createDto: CreateOrderItemDto, userId: string): Promise<OrderItem> {
    const order = await this.orderRepository.findOne({ where: { id: createDto.order_id }, relations: ['user'] });

    if (!order) {
      throw new NotFoundException(`Order with ID ${createDto.order_id} not found`);
    }

    if (order.user.user_id !== userId) {
      throw new UnauthorizedException('You are not authorized to add items to this order.');
    }

    const orderItem = this.orderItemRepository.create(createDto);
    return this.orderItemRepository.save(orderItem);
  }

  async findAllOrderItems(userId: string, role: UserRole): Promise<OrderItem[]> {
    if (role === UserRole.ADMIN) {
      return this.orderItemRepository.find({ relations: ['order', 'order.user'] });
    }
    return this.orderItemRepository.find({
      where: { order: { user: { user_id: userId } } },
      relations: ['order', 'order.user'],
    });
  }

  async findOrderItemsByOrderId(orderId: number, userId: string, role: UserRole): Promise<OrderItem[]> {
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['user'] });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (role !== UserRole.ADMIN && order.user.user_id !== userId) {
      throw new UnauthorizedException('You are not authorized to view these order items.');
    }

    return this.orderItemRepository.find({ where: { order: { id: orderId } } });
  }

  async findOneOrderItem(id: number, userId: string, role: UserRole): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['order', 'order.user'] });

    if (!orderItem) {
      throw new NotFoundException(`Order item with ID ${id} not found`);
    }

    if (role !== UserRole.ADMIN && orderItem.order.user.user_id !== userId) {
      throw new UnauthorizedException('You are not authorized to view this order item.');
    }

    return orderItem;
  }

  async updateOrderItem(id: number, updateDto: UpdateOrderItemDto, userId: string, role: UserRole): Promise<OrderItem> {
    const orderItem = await this.findOneOrderItem(id, userId, role);
    Object.assign(orderItem, updateDto);
    return this.orderItemRepository.save(orderItem);
  }

  async removeOrderItem(id: number, userId: string, role: UserRole): Promise<void> {
    const orderItem = await this.findOneOrderItem(id, userId, role);
    await this.orderItemRepository.remove(orderItem);
  }

  async findAllOrderItemsAdmin(options: { page: number; limit: number; status?: string; productId?: number }): Promise<any> {
    // Admin-specific logic with pagination and filtering
    // This is a placeholder for more complex logic
    return this.orderItemRepository.findAndCount({      
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });
  }

  async updateOrderItemStatus(id: number, status: string, userId: string, role: UserRole): Promise<OrderItem> {
    const orderItem = await this.findOneOrderItem(id, userId, role);
    
    const isValidStatus = Object.values(OrderStatus).includes(status as OrderStatus);
    if (!isValidStatus) {
      throw new HttpException(`Invalid status: ${status}`, HttpStatus.BAD_REQUEST);
    }

    orderItem.status = status as OrderStatus;
    return this.orderItemRepository.save(orderItem);
  }

  async getOrderItemsAnalytics(period: string): Promise<any> {
    // Analytics logic - placeholder for now
    return { message: `Analytics for the last ${period} would be calculated here.` };
  }
}
