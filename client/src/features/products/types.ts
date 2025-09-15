export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
}

export interface Organization {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  website?: string;
  contact_email?: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image_url?: string;
  image_public_id?: string;
  is_active: boolean;
  is_approved: boolean;
  approval_status: string;
  seller_id: string;
  creator_id: string;
  category: Category;
  organization: Organization;
  average_rating?: number;
  ratings_count?: number;
  created_at: string;
  updated_at: string;
}

export enum ProductStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export interface CreateProductDto {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  stock_quantity: number;
  category_id: string;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'category_id'>> {
  status?: ProductStatus;
  category_id?: string;
}
