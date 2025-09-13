export interface Rating {
  id: string;
  value: number;
  productId: number;
  userId: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingDto {
  value: number;
  productId: number;
}

export interface UpdateRatingDto {
  value: number;
}
