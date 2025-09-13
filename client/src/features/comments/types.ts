export interface Comment {
  id: string;
  content: string;
  productId: number;
  userId: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentDto {
  content: string;
  productId: number;
}

export interface UpdateCommentDto {
  content: string;
}
