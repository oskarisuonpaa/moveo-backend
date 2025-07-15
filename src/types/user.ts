export interface User {
  user_id: number;
  app_email: string;
  shop_email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  product_name?: string;
  product_code?: string;
  study_location?: string;
  membership_start?: string;
  membership_end?: string;
  verification_token?: string;
  is_verified: number;
}
