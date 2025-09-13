import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus, UserRole } from 'src/utils/enums';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { JWT_PAYLOAD } from 'src/utils/type';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order (authenticated user)
  /**
   *@Post() 
   * @param dto DTO containing order details
   * @param payload  JWT payload containing user information
   * @returns  Created order entity
   */
  @Post()
  @UseGuards(AuthGuard)
  public async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() payload: { id: string },
  ) {
    return this.ordersService.createOrder(dto, payload.id);
  }

  // List orders with optional filters
  /**
   *@Get  / (authenticated user)
   * @param payload  JWT payload containing user information
   * @param status  Optional order status filter
   * @param paymentStatus  Optional payment status filter
   * @param pageStr  Optional page number for pagination
   * @param limitStr  Optional limit for pagination
   * @returns
   */
  @Get()
  @UseGuards(AuthGuard)
  public async findAll(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const page = pageStr ? parseInt(pageStr) : undefined;
    const limit = limitStr ? parseInt(limitStr) : undefined;
    return this.ordersService.findAllOrders(payload.id, status, paymentStatus, {
      page,
      limit,
    });
  }

  // Get a single order by ID (authenticated user)
  /**
   * @Get ':id'
   * @param id  Order ID
   * @returns  Order entity
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneOrder(id);
  }

  // Update order details (owner or admin)
  /**
   *@Put(':id')
   * @param payload  JWT payload containing user information
   * @param id  Order ID
   * @param dto  DTO containing updated order details
   * @returns  Updated order entity
   */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async update(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, dto, payload.id);
  }

  // Update payment status (admin)
  /**
   * @Put(':id/payment-status')
   * @param id  Order ID
   * @param dto  DTO containing updated payment status and blockchain transaction ID
   * @returns  Updated order entity
   */

  @Put(':id/payment-status')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    if (!dto.payment_status) {
    throw new BadRequestException('Payment status is required');
  }
    if (!dto.blockchain_tx_id) {
      throw new BadRequestException('Blockchain transaction ID is required');
    }
    return this.ordersService.updatePaymentStatus(
      id,
      dto.payment_status,
      dto.blockchain_tx_id,
    );
  }

  // Get current user's orders (authenticated user)  
  /**
   * @Get 'user/history'
   * @param payload  JWT payload containing user information
   * @param pageStr  Optional page number for pagination
   * @param limitStr  Optional limit for pagination
   * @returns  Current user's orders
   */
  @Get('user/history')
   @UseGuards(AuthGuard)
  public async getUserOrders(
    @CurrentUser() payload: JWT_PAYLOAD,   
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const page = pageStr ? parseInt(pageStr) : undefined;
    const limit = limitStr ? parseInt(limitStr) : undefined;
    return this.ordersService.getUserOrders(payload.id, {
      page,
      limit,
    });
  }

  // Order statistics (admin)
/**
 * @Get 'stats'
 * @returns Order statistics
 */
  @Get('stats')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async getStats() {
    return this.ordersService.getOrderStats();
  }

  // Cancel an order (authenticated user)
  /**
   * @Put ':id/cancel'
   * @param payload  JWT payload containing user information
   * @param id  Order ID
   * @param req  Request object containing user information
   * @returns  Updated order entity
   */
  @Put(':id/cancel')
  @UseGuards(AuthGuard)
  public async cancel(
    @CurrentUser() payload: JWT_PAYLOAD,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.cancelOrder(id, payload.id);
  }

  // Delete an order (admin only)
  /**
   * @Delete ':id'
   * @param id  Order ID
   * 
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
 public  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.removeOrder(id);
  }
}
