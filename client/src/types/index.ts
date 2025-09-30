export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'admin' | 'customer' | 'vendor';
  is_active: boolean;
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Category {
  _id?: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  h1_tag?: string;
  position: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  _id?: string;
  sku?: string;
  name: string;
  slug: string;
  short_desc?: string;
  long_desc?: string;
  category_id?: string;
  price: number;
  mrp?: number;
  stock_qty: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  h1_tag?: string;
  schema_type: string;
  schema_data?: any;
  focus_keyword?: string;
  alt_text_default?: string;
  breadcrumb_title?: string;
  is_featured: boolean;
  is_new: boolean;
  status: 'draft' | 'active' | 'inactive';
  view_count: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Customer {
  _id?: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  gst_number?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Order {
  _id?: string;
  order_number: string;
  customer_id: string;
  subtotal: number;
  tax_amount: number;
  shipping_charge: number;
  discount_amount: number;
  total_amount: number;
  billing_address_id?: string;
  shipping_address_id?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  h1_tag?: string;
  focus_keyword?: string;
  schema_type: string;
  schema_data?: any;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  view_count: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Review {
  _id?: string;
  product_id?: string;
  customer_id?: string;
  name: string;
  email?: string;
  rating: number;
  title?: string;
  review_text: string;
  is_verified: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at?: Date;
}

export interface Inquiry {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  subject?: string;
  message: string;
  inquiry_type: 'general' | 'quote' | 'support' | 'partnership';
  status: 'new' | 'responded' | 'closed';
  created_at?: Date;
}

export interface Coupon {
  _id?: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from?: Date;
  valid_to?: Date;
  is_active: boolean;
  created_at?: Date;
}

export interface Banner {
  _id?: string;
  title: string;
  image_url: string;
  image_alt?: string;
  link_url?: string;
  position: string;
  ordering: number;
  is_active: boolean;
  created_at?: Date;
}

export interface Menu {
  _id?: string;
  parent_id?: string;
  title: string;
  url: string;
  target: string;
  menu_type: 'header' | 'footer' | 'sidebar';
  ordering: number;
  is_active: boolean;
  created_at?: Date;
}

export interface Media {
  _id?: string;
  filename: string;
  filepath: string;
  mime_type: string;
  file_size?: number;
  alt_text?: string;
  title?: string;
  uploaded_by?: string;
  created_at?: Date;
}

export interface Setting {
  setting_key: string;
  setting_value?: string;
  setting_group: string;
  updated_at?: Date;
}

export interface CompanyInfo {
  _id?: string;
  name: string;
  legal_name?: string;
  logo_url?: string;
  favicon_url?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  whatsapp?: string;
  toll_free?: string;
  address_line1?: string;
  address_line2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  gst_no?: string;
  pan_no?: string;
  cin_no?: string;
  tan_no?: string;
  import_export_code?: string;
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  pinterest_url?: string;
  business_hours?: any;
  schema_type: string;
  schema_data?: any;
  established_year?: number;
  certifications?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}