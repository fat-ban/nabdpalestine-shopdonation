export enum UserRole {
   CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Language {
  AR = 'ar',
  EN = 'en',
}

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum DonationType {
  PURCHASE = 'purchase',
  DIRECT = 'direct',
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum InteractionType {
  CHAT = 'chat',
  MODERATION = 'moderation',
  RECOMMENDATION = 'recommendation',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}