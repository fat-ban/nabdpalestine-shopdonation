export enum DonationType {
  PURCHASE = 'purchase',
  DIRECT = 'direct',
}

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Organization {
    id: number;
    name: string;
    description: string;
    website: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name?: string;
    email: string;
    createdAt?: string;
}

export interface Donation {
  id: number;
  amount: number;
  type: DonationType;
  status: DonationStatus;
  blockchain_tx_id?: string;
  userId: string;
  organizationId: number;
  orderId?: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  organization?: Organization;
}

export interface CreateDonationDto {
  amount: number;
  type: DonationType;
  blockchain_tx_id?: string;
  organizationId: number;
  orderId?: number;
}

export interface UpdateDonationDto extends Partial<CreateDonationDto> {
  status?: DonationStatus;
}
