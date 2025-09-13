
export interface Organization {
  id: number;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  logo_url?: string;
  blockchain_address: string;
  is_verified: boolean;
  verified_by?: string;
  rejection_reason?: string;
}

export interface CreateOrganizationDto {
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  logo_url?: string;
  blockchain_address: string;
}

export interface UpdateOrganizationDto {
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  logo_url?: string;
  blockchain_address?: string;
  rejection_reason?: string;
}
