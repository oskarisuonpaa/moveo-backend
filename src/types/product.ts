export interface Product {
  product_id: number;
  product_name: string;
  product_name_english: string;
  product_code: string;
  product_season: string;
}

export interface Purchase {
  purchase_id: number;
  user_id: number;
  product_code: string;
  purchase_date: string;
  firstname: string;
  lastname: string;
  study_location: string;
  product_start_date: Date;
  product_end_date: Date;
}
