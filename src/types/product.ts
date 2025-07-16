export interface Product {
  product_id: number;
  product_name: string;
  product_name_english: string;
  product_code: string;
  product_start: string;
  product_end: string;
}

export interface Purchase {
  purchase_id: number;
  user_id: number;
  product_code: string;
  purchase_date: string;
  firstname: string;
  lastname: string;
  study_location: string;
}
