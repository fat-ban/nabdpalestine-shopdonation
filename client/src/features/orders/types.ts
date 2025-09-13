
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  blockchain_tx_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderDto {
  total_amount: number;
  blockchain_tx_id?: string;
}

export interface UpdateOrderDto {
  total_amount?: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  blockchain_tx_id?: string;
}

export interface UpdatePaymentStatusDto {
  payment_status: PaymentStatus;
  blockchain_tx_id: string;
}
