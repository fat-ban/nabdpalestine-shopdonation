import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { AuthRolesGuard } from '../users/guards/auth-role.guard';
import { Roles } from '../users/decorator/user-role.decorator';
import { UserRole } from '../utils/enums';
import { CurrentUser } from '../users/decorator/current-user.decorator';

// Define JWT_PAYLOAD here as it is not available in the context
export interface JWT_PAYLOAD {
  id: string;
  role: UserRole;
}

@Controller('api/order-items')
@UseGuards(AuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  async createOrderItem(
    @Body() createDto: CreateOrderItemDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      return await this.orderItemsService.createOrderItem(createDto, payload.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create order item',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('my-order-items')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(AuthRolesGuard)
  async findMyOrderItems(@CurrentUser() payload: JWT_PAYLOAD) {
    try {
      return await this.orderItemsService.findAllOrderItems(payload.id, payload.role);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve order items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('by-order/:orderId')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  async findOrderItemsByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      return await this.orderItemsService.findOrderItemsByOrderId(
        orderId,
        payload.id,
        payload.role,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve order items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  async findOneOrderItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      return await this.orderItemsService.findOneOrderItem(id, payload.id, payload.role);
    } catch (error) {
      throw new HttpException(
        error.message || 'Order item not found',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  async updateOrderItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOrderItemDto,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      return await this.orderItemsService.updateOrderItem(
        id,
        updateDto,
        payload.id,
        payload.role,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update order item',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(AuthRolesGuard)
  async removeOrderItem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      await this.orderItemsService.removeOrderItem(id, payload.id, payload.role);
      return {
        message: 'Order item deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete order item',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async findAllOrderItems(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('productId') productId?: number,
  ) {
    try {
      return await this.orderItemsService.findAllOrderItemsAdmin({
        page,
        limit,
        status,
        productId,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve order items',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  async updateOrderItemStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    try {
      return await this.orderItemsService.updateOrderItemStatus(
        id,
        status,
        payload.id,
        payload.role,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update order item status',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('analytics/stats')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getOrderItemsAnalytics(@Query('period') period: string = '30d') {
    try {
      return await this.orderItemsService.getOrderItemsAnalytics(period);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve analytics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
