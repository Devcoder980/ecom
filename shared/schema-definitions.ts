// ============================================
// DYNAMIC SCHEMA DEFINITIONS
// Database-driven schema management
// ============================================

export interface SchemaFieldDefinition {
  _id?: string;
  table_name: string;
  field_name: string;
  field_type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'text' | 'select' | 'multiselect' | 'file' | 'files' | 'json';
  field_label: string;
  is_required: boolean;
  default_value?: any;
  placeholder?: string;
  field_options?: { value: any; label: string }[];
  validation_rules?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  ui_config?: {
    input_type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'files' | 'image' | 'document';
    rows?: number;
    cols?: number;
    step?: number;
    multiple?: boolean;
    accept?: string;
    max_files?: number;
  };
  is_seo_field?: boolean;
  is_searchable?: boolean;
  is_sortable?: boolean;
  is_display_field?: boolean;
  field_order: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SchemaTableDefinition {
  _id?: string;
  table_name: string;
  table_label: string;
  table_description: string;
  table_icon?: string;
  table_group?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SchemaRelationshipDefinition {
  _id?: string;
  source_table: string;
  target_table: string;
  source_field: string;
  target_field: string;
  relationship_type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  is_active: boolean;
  created_at?: Date;
}

export interface SchemaPermissionDefinition {
  _id?: string;
  table_name: string;
  role: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  created_at?: Date;
}

// Default schema definitions
export const DEFAULT_SCHEMA_DEFINITIONS = {
  tables: [
    {
      table_name: 'users',
      table_label: 'Users',
      table_description: 'User accounts and authentication',
      table_icon: '👤',
      table_group: 'core',
      is_active: true
    },
    {
      table_name: 'categories',
      table_label: 'Categories',
      table_description: 'Product categories with SEO optimization',
      table_icon: '📁',
      table_group: 'products',
      is_active: true
    },
    {
      table_name: 'products',
      table_label: 'Products',
      table_description: 'Product catalog with variants and SEO',
      table_icon: '📦',
      table_group: 'products',
      is_active: true
    },
    {
      table_name: 'orders',
      table_label: 'Orders',
      table_description: 'Order management and tracking',
      table_icon: '🛒',
      table_group: 'sales',
      is_active: true
    },
    {
      table_name: 'customers',
      table_label: 'Customers',
      table_description: 'Customer information and profiles',
      table_icon: '👥',
      table_group: 'customers',
      is_active: true
    },
    {
      table_name: 'blog_posts',
      table_label: 'Blog Posts',
      table_description: 'Content management and SEO',
      table_icon: '📝',
      table_group: 'content',
      is_active: true
    },
    {
      table_name: 'company_info',
      table_label: 'Company Info',
      table_description: 'Complete business information with legal documents and social media',
      table_icon: '🏢',
      table_group: 'settings',
      is_active: true
    }
  ],

  fields: [
    // Users table fields
    { table_name: 'users', field_name: 'name', field_type: 'string', field_label: 'Full Name', is_required: true, placeholder: 'Enter full name', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 1 },
    { table_name: 'users', field_name: 'email', field_type: 'email', field_label: 'Email', is_required: true, placeholder: 'user@example.com', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 2 },
    { table_name: 'users', field_name: 'phone', field_type: 'string', field_label: 'Phone', is_required: false, placeholder: '+91 9876543210', is_searchable: true, field_order: 3 },
    { table_name: 'users', field_name: 'password_hash', field_type: 'string', field_label: 'Password Hash', is_required: true, ui_config: { input_type: 'password' }, field_order: 4 },
    { table_name: 'users', field_name: 'role', field_type: 'select', field_label: 'Role', is_required: true, default_value: 'customer', field_options: [{ value: 'admin', label: 'Admin' }, { value: 'customer', label: 'Customer' }, { value: 'vendor', label: 'Vendor' }], is_sortable: true, is_display_field: true, field_order: 5 },
    { table_name: 'users', field_name: 'is_active', field_type: 'boolean', field_label: 'Active', is_required: true, default_value: true, ui_config: { input_type: 'checkbox' }, is_sortable: true, is_display_field: true, field_order: 6 },
    { table_name: 'users', field_name: 'last_login', field_type: 'date', field_label: 'Last Login', is_required: false, ui_config: { input_type: 'datetime-local' }, is_sortable: true, field_order: 7 },
    { table_name: 'users', field_name: 'created_at', field_type: 'date', field_label: 'Created At', is_required: false, ui_config: { input_type: 'datetime-local' }, is_sortable: true, field_order: 8 },
    { table_name: 'users', field_name: 'updated_at', field_type: 'date', field_label: 'Updated At', is_required: false, ui_config: { input_type: 'datetime-local' }, is_sortable: true, field_order: 9 },

    // Categories table fields
    { table_name: 'categories', field_name: 'parent_id', field_type: 'string', field_label: 'Parent Category', is_required: false, placeholder: 'Select parent category', field_order: 1 },
    { table_name: 'categories', field_name: 'name', field_type: 'string', field_label: 'Category Name', is_required: true, placeholder: 'Enter category name', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 2 },
    { table_name: 'categories', field_name: 'slug', field_type: 'string', field_label: 'URL Slug', is_required: true, placeholder: 'category-slug', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 3 },
    { table_name: 'categories', field_name: 'description', field_type: 'text', field_label: 'Description', is_required: false, placeholder: 'Category description', ui_config: { input_type: 'textarea', rows: 3 }, field_order: 4 },
    { table_name: 'categories', field_name: 'image_url', field_type: 'file', field_label: 'Category Image', is_required: false, ui_config: { input_type: 'image', accept: 'image/*' }, field_order: 5 },
    { table_name: 'categories', field_name: 'gallery_images', field_type: 'files', field_label: 'Gallery Images', is_required: false, ui_config: { input_type: 'files', accept: 'image/*', multiple: true }, field_order: 6 },
    { table_name: 'categories', field_name: 'meta_title', field_type: 'string', field_label: 'Meta Title', is_required: false, placeholder: 'SEO title', is_seo_field: true, field_order: 7 },
    { table_name: 'categories', field_name: 'meta_description', field_type: 'text', field_label: 'Meta Description', is_required: false, placeholder: 'SEO description', ui_config: { input_type: 'textarea', rows: 2 }, is_seo_field: true, field_order: 8 },
    { table_name: 'categories', field_name: 'position', field_type: 'number', field_label: 'Position', is_required: true, default_value: 0, ui_config: { input_type: 'number' }, is_sortable: true, field_order: 9 },
    { table_name: 'categories', field_name: 'is_active', field_type: 'boolean', field_label: 'Active', is_required: true, default_value: true, ui_config: { input_type: 'checkbox' }, is_sortable: true, is_display_field: true, field_order: 10 },

    // Products table fields
    { table_name: 'products', field_name: 'sku', field_type: 'string', field_label: 'SKU', is_required: false, placeholder: 'PROD-001', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 1 },
    { table_name: 'products', field_name: 'name', field_type: 'string', field_label: 'Product Name', is_required: true, placeholder: 'Enter product name', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 2 },
    { table_name: 'products', field_name: 'slug', field_type: 'string', field_label: 'URL Slug', is_required: true, placeholder: 'product-slug', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 3 },
    { table_name: 'products', field_name: 'short_desc', field_type: 'text', field_label: 'Short Description', is_required: false, placeholder: 'Brief product description', ui_config: { input_type: 'textarea', rows: 3 }, field_order: 4 },
    { table_name: 'products', field_name: 'long_desc', field_type: 'text', field_label: 'Long Description', is_required: false, placeholder: 'Detailed product description', ui_config: { input_type: 'textarea', rows: 5 }, field_order: 5 },
    { table_name: 'products', field_name: 'category_id', field_type: 'string', field_label: 'Category', is_required: false, placeholder: 'Select category', field_order: 6 },
    { table_name: 'products', field_name: 'price', field_type: 'number', field_label: 'Price', is_required: true, placeholder: '0.00', ui_config: { input_type: 'number', step: 0.01 }, is_sortable: true, is_display_field: true, field_order: 7 },
    { table_name: 'products', field_name: 'stock_qty', field_type: 'number', field_label: 'Stock Quantity', is_required: true, default_value: 0, ui_config: { input_type: 'number' }, is_sortable: true, is_display_field: true, field_order: 8 },
    { table_name: 'products', field_name: 'product_images', field_type: 'files', field_label: 'Product Images', is_required: false, ui_config: { input_type: 'files', accept: 'image/*', multiple: true }, field_order: 9 },
    { table_name: 'products', field_name: 'product_documents', field_type: 'files', field_label: 'Product Documents', is_required: false, ui_config: { input_type: 'files', accept: '.pdf,.doc,.docx', multiple: true }, field_order: 10 },
    { table_name: 'products', field_name: 'is_featured', field_type: 'boolean', field_label: 'Featured', is_required: true, default_value: false, ui_config: { input_type: 'checkbox' }, is_sortable: true, is_display_field: true, field_order: 11 },
    { table_name: 'products', field_name: 'is_active', field_type: 'boolean', field_label: 'Active', is_required: true, default_value: true, ui_config: { input_type: 'checkbox' }, is_sortable: true, is_display_field: true, field_order: 12 },

    // Company Info table fields
    { table_name: 'company_info', field_name: 'name', field_type: 'string', field_label: 'Company Name', is_required: true, placeholder: 'Your Company Name', is_searchable: true, is_sortable: true, is_display_field: true, field_order: 1 },
    { table_name: 'company_info', field_name: 'legal_name', field_type: 'string', field_label: 'Legal Name', is_required: false, placeholder: 'Legal Company Name Pvt Ltd', is_searchable: true, field_order: 2 },
    { table_name: 'company_info', field_name: 'logo_url', field_type: 'file', field_label: 'Logo', is_required: false, ui_config: { input_type: 'image', accept: 'image/*' }, field_order: 3 },
    { table_name: 'company_info', field_name: 'favicon_url', field_type: 'file', field_label: 'Favicon', is_required: false, ui_config: { input_type: 'image', accept: 'image/*' }, field_order: 4 },
    { table_name: 'company_info', field_name: 'tagline', field_type: 'string', field_label: 'Tagline', is_required: false, placeholder: 'Your Company Tagline', is_searchable: true, field_order: 5 },
    { table_name: 'company_info', field_name: 'description', field_type: 'text', field_label: 'Company Description', is_required: false, placeholder: 'Brief company description', ui_config: { input_type: 'textarea', rows: 4 }, field_order: 6 },
    { table_name: 'company_info', field_name: 'email', field_type: 'email', field_label: 'Primary Email', is_required: false, placeholder: 'contact@company.com', is_searchable: true, field_order: 7 },
    { table_name: 'company_info', field_name: 'phone', field_type: 'string', field_label: 'Primary Phone', is_required: false, placeholder: '+91 9876543210', is_searchable: true, field_order: 8 },
    { table_name: 'company_info', field_name: 'website_url', field_type: 'url', field_label: 'Website URL', is_required: false, placeholder: 'https://company.com', field_order: 9 },
    { table_name: 'company_info', field_name: 'address_line1', field_type: 'string', field_label: 'Address Line 1', is_required: false, placeholder: 'Street address, Building name', field_order: 10 },
    { table_name: 'company_info', field_name: 'city', field_type: 'string', field_label: 'City', is_required: false, placeholder: 'Mumbai', is_searchable: true, field_order: 11 },
    { table_name: 'company_info', field_name: 'state', field_type: 'string', field_label: 'State', is_required: false, placeholder: 'Maharashtra', is_searchable: true, field_order: 12 },
    { table_name: 'company_info', field_name: 'country', field_type: 'string', field_label: 'Country', is_required: true, default_value: 'India', placeholder: 'India', is_sortable: true, is_display_field: true, field_order: 13 },
    { table_name: 'company_info', field_name: 'gst_no', field_type: 'string', field_label: 'GST Number', is_required: false, placeholder: '27ABCDE1234F1Z5', field_order: 14 },
    { table_name: 'company_info', field_name: 'is_active', field_type: 'boolean', field_label: 'Active', is_required: true, default_value: true, ui_config: { input_type: 'checkbox' }, is_sortable: true, is_display_field: true, field_order: 15 }
  ],

  relationships: [
    { source_table: 'products', target_table: 'categories', source_field: 'category_id', target_field: '_id', relationship_type: 'many-to-one', is_active: true },
    { source_table: 'orders', target_table: 'customers', source_field: 'customer_id', target_field: '_id', relationship_type: 'many-to-one', is_active: true }
  ],

  permissions: [
    { table_name: 'users', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'categories', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'products', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'orders', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'customers', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'blog_posts', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true },
    { table_name: 'company_info', role: 'admin', can_create: true, can_read: true, can_update: true, can_delete: true }
  ]
};