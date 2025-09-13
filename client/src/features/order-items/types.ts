import { OrderStatus } from "../orders/types";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  donation_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderItemDto {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  donation_amount: number;
}

export type UpdateOrderItemDto = Partial<CreateOrderItemDto>;
