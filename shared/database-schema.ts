// ============================================
// SCHEMA-DRIVEN UI - SINGLE SOURCE OF TRUTH
// ============================================

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'text' | 'select' | 'multiselect' | 'file' | 'json';
  label: string;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  ui?: {
    inputType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
    rows?: number;
    cols?: number;
    step?: number;
    multiple?: boolean;
    accept?: string;
  };
  seo?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  display?: boolean;
}

export interface TableDefinition {
  name: string;
  label: string;
  description: string;
  icon?: string;
  fields: FieldDefinition[];
  relationships?: {
    [key: string]: {
      table: string;
      field: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    };
  };
  permissions?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

export const DATABASE_SCHEMA: { [key: string]: TableDefinition } = {
  users: {
    name: 'users',
    label: 'Users',
    description: 'User accounts and authentication',
    icon: '👤',
    fields: [
      { name: 'name', type: 'string', label: 'Full Name', required: true, placeholder: 'Enter full name', searchable: true, sortable: true, display: true },
      { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'user@example.com', searchable: true, sortable: true, display: true },
      { name: 'phone', type: 'string', label: 'Phone', required: false, placeholder: '+91 9876543210', searchable: true },
      { name: 'password_hash', type: 'string', label: 'Password Hash', required: true, ui: { inputType: 'password' } },
      { name: 'role', type: 'select', label: 'Role', required: true, defaultValue: 'customer', options: [
        { value: 'admin', label: 'Admin' },
        { value: 'customer', label: 'Customer' },
        { value: 'vendor', label: 'Vendor' }
      ], sortable: true, display: true },
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'last_login', type: 'date', label: 'Last Login', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  categories: {
    name: 'categories',
    label: 'Categories',
    description: 'Product categories with SEO optimization',
    icon: '📁',
    fields: [
      { name: 'parent_id', type: 'string', label: 'Parent Category', required: false, placeholder: 'Select parent category' },
      { name: 'name', type: 'string', label: 'Category Name', required: true, placeholder: 'Enter category name', searchable: true, sortable: true, display: true },
      { name: 'slug', type: 'string', label: 'URL Slug', required: true, placeholder: 'category-slug', searchable: true, sortable: true, display: true },
      { name: 'description', type: 'text', label: 'Description', required: false, placeholder: 'Category description', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'image_url', type: 'url', label: 'Image URL', required: false, placeholder: 'https://example.com/image.jpg' },
      { name: 'meta_title', type: 'string', label: 'Meta Title', required: false, placeholder: 'SEO title', seo: true },
      { name: 'meta_description', type: 'text', label: 'Meta Description', required: false, placeholder: 'SEO description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'meta_keywords', type: 'string', label: 'Meta Keywords', required: false, placeholder: 'keyword1, keyword2', seo: true },
      { name: 'og_title', type: 'string', label: 'OG Title', required: false, placeholder: 'Social media title', seo: true },
      { name: 'og_description', type: 'text', label: 'OG Description', required: false, placeholder: 'Social media description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'og_image', type: 'url', label: 'OG Image', required: false, placeholder: 'https://example.com/og-image.jpg', seo: true },
      { name: 'canonical_url', type: 'url', label: 'Canonical URL', required: false, placeholder: 'https://example.com/canonical', seo: true },
      { name: 'h1_tag', type: 'string', label: 'H1 Tag', required: false, placeholder: 'Main heading', seo: true },
      { name: 'position', type: 'number', label: 'Position', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  products: {
    name: 'products',
    label: 'Products',
    description: 'Product catalog with variants and SEO',
    icon: '📦',
    fields: [
      { name: 'sku', type: 'string', label: 'SKU', required: false, placeholder: 'PROD-001', searchable: true, sortable: true, display: true },
      { name: 'name', type: 'string', label: 'Product Name', required: true, placeholder: 'Enter product name', searchable: true, sortable: true, display: true },
      { name: 'slug', type: 'string', label: 'URL Slug', required: true, placeholder: 'product-slug', searchable: true, sortable: true, display: true },
      { name: 'short_desc', type: 'text', label: 'Short Description', required: false, placeholder: 'Brief product description', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'long_desc', type: 'text', label: 'Long Description', required: false, placeholder: 'Detailed product description', ui: { inputType: 'textarea', rows: 5 } },
      { name: 'category_id', type: 'string', label: 'Category', required: false, placeholder: 'Select category' },
      { name: 'price', type: 'number', label: 'Price', required: true, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true, display: true },
      { name: 'mrp', type: 'number', label: 'MRP', required: false, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'stock_qty', type: 'number', label: 'Stock Quantity', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true, display: true },
      { name: 'meta_title', type: 'string', label: 'Meta Title', required: false, placeholder: 'SEO title', seo: true },
      { name: 'meta_description', type: 'text', label: 'Meta Description', required: false, placeholder: 'SEO description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'meta_keywords', type: 'string', label: 'Meta Keywords', required: false, placeholder: 'keyword1, keyword2', seo: true },
      { name: 'og_title', type: 'string', label: 'OG Title', required: false, placeholder: 'Social media title', seo: true },
      { name: 'og_description', type: 'text', label: 'OG Description', required: false, placeholder: 'Social media description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'og_image', type: 'url', label: 'OG Image', required: false, placeholder: 'https://example.com/og-image.jpg', seo: true },
      { name: 'canonical_url', type: 'url', label: 'Canonical URL', required: false, placeholder: 'https://example.com/canonical', seo: true },
      { name: 'h1_tag', type: 'string', label: 'H1 Tag', required: false, placeholder: 'Main heading', seo: true },
      { name: 'schema_type', type: 'string', label: 'Schema Type', required: true, defaultValue: 'Product', placeholder: 'Product' },
      { name: 'schema_data', type: 'json', label: 'Schema Data', required: false, placeholder: '{}', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'focus_keyword', type: 'string', label: 'Focus Keyword', required: false, placeholder: 'main keyword', seo: true },
      { name: 'alt_text_default', type: 'string', label: 'Default Alt Text', required: false, placeholder: 'Image alt text', seo: true },
      { name: 'breadcrumb_title', type: 'string', label: 'Breadcrumb Title', required: false, placeholder: 'Breadcrumb text', seo: true },
      { name: 'is_featured', type: 'boolean', label: 'Featured', required: true, defaultValue: false, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'is_new', type: 'boolean', label: 'New Product', required: true, defaultValue: false, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'status', type: 'select', label: 'Status', required: true, defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ], sortable: true, display: true },
      { name: 'view_count', type: 'number', label: 'View Count', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  customers: {
    name: 'customers',
    label: 'Customers',
    description: 'Customer information and profiles',
    icon: '👥',
    fields: [
      { name: 'user_id', type: 'string', label: 'User ID', required: false, placeholder: 'Select user' },
      { name: 'name', type: 'string', label: 'Customer Name', required: true, placeholder: 'Enter customer name', searchable: true, sortable: true, display: true },
      { name: 'email', type: 'email', label: 'Email', required: false, placeholder: 'customer@example.com', searchable: true, sortable: true, display: true },
      { name: 'phone', type: 'string', label: 'Phone', required: false, placeholder: '+91 9876543210', searchable: true },
      { name: 'company_name', type: 'string', label: 'Company Name', required: false, placeholder: 'Company name', searchable: true },
      { name: 'gst_number', type: 'string', label: 'GST Number', required: false, placeholder: 'GST number' },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  orders: {
    name: 'orders',
    label: 'Orders',
    description: 'Order management and tracking',
    icon: '🛒',
    fields: [
      { name: 'order_number', type: 'string', label: 'Order Number', required: true, placeholder: 'ORD-001', searchable: true, sortable: true, display: true },
      { name: 'customer_id', type: 'string', label: 'Customer', required: true, placeholder: 'Select customer' },
      { name: 'subtotal', type: 'number', label: 'Subtotal', required: true, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true, display: true },
      { name: 'tax_amount', type: 'number', label: 'Tax Amount', required: true, defaultValue: 0, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'shipping_charge', type: 'number', label: 'Shipping Charge', required: true, defaultValue: 0, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'discount_amount', type: 'number', label: 'Discount Amount', required: true, defaultValue: 0, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'total_amount', type: 'number', label: 'Total Amount', required: true, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true, display: true },
      { name: 'billing_address_id', type: 'string', label: 'Billing Address', required: false, placeholder: 'Select billing address' },
      { name: 'shipping_address_id', type: 'string', label: 'Shipping Address', required: false, placeholder: 'Select shipping address' },
      { name: 'status', type: 'select', label: 'Status', required: true, defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'refunded', label: 'Refunded' }
      ], sortable: true, display: true },
      { name: 'payment_status', type: 'select', label: 'Payment Status', required: true, defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
      ], sortable: true, display: true },
      { name: 'payment_method', type: 'string', label: 'Payment Method', required: false, placeholder: 'Payment method' },
      { name: 'notes', type: 'text', label: 'Notes', required: false, placeholder: 'Order notes', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  blog_posts: {
    name: 'blog_posts',
    label: 'Blog Posts',
    description: 'Content management and SEO',
    icon: '📝',
    fields: [
      { name: 'title', type: 'string', label: 'Title', required: true, placeholder: 'Blog post title', searchable: true, sortable: true, display: true },
      { name: 'slug', type: 'string', label: 'URL Slug', required: true, placeholder: 'blog-post-slug', searchable: true, sortable: true, display: true },
      { name: 'excerpt', type: 'text', label: 'Excerpt', required: false, placeholder: 'Brief description', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'content', type: 'text', label: 'Content', required: true, placeholder: 'Blog post content', ui: { inputType: 'textarea', rows: 10 } },
      { name: 'featured_image', type: 'url', label: 'Featured Image', required: false, placeholder: 'https://example.com/image.jpg' },
      { name: 'author_id', type: 'string', label: 'Author', required: false, placeholder: 'Select author' },
      { name: 'meta_title', type: 'string', label: 'Meta Title', required: false, placeholder: 'SEO title', seo: true },
      { name: 'meta_description', type: 'text', label: 'Meta Description', required: false, placeholder: 'SEO description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'meta_keywords', type: 'string', label: 'Meta Keywords', required: false, placeholder: 'keyword1, keyword2', seo: true },
      { name: 'og_title', type: 'string', label: 'OG Title', required: false, placeholder: 'Social media title', seo: true },
      { name: 'og_description', type: 'text', label: 'OG Description', required: false, placeholder: 'Social media description', ui: { inputType: 'textarea', rows: 2 }, seo: true },
      { name: 'og_image', type: 'url', label: 'OG Image', required: false, placeholder: 'https://example.com/og-image.jpg', seo: true },
      { name: 'canonical_url', type: 'url', label: 'Canonical URL', required: false, placeholder: 'https://example.com/canonical', seo: true },
      { name: 'h1_tag', type: 'string', label: 'H1 Tag', required: false, placeholder: 'Main heading', seo: true },
      { name: 'focus_keyword', type: 'string', label: 'Focus Keyword', required: false, placeholder: 'main keyword', seo: true },
      { name: 'schema_type', type: 'string', label: 'Schema Type', required: true, defaultValue: 'BlogPosting', placeholder: 'BlogPosting' },
      { name: 'schema_data', type: 'json', label: 'Schema Data', required: false, placeholder: '{}', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'status', type: 'select', label: 'Status', required: true, defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ], sortable: true, display: true },
      { name: 'published_at', type: 'date', label: 'Published At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'view_count', type: 'number', label: 'View Count', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  reviews: {
    name: 'reviews',
    label: 'Reviews',
    description: 'Customer reviews and testimonials',
    icon: '⭐',
    fields: [
      { name: 'product_id', type: 'string', label: 'Product', required: false, placeholder: 'Select product' },
      { name: 'customer_id', type: 'string', label: 'Customer', required: false, placeholder: 'Select customer' },
      { name: 'name', type: 'string', label: 'Reviewer Name', required: true, placeholder: 'Reviewer name', searchable: true, sortable: true, display: true },
      { name: 'email', type: 'email', label: 'Email', required: false, placeholder: 'reviewer@example.com', searchable: true },
      { name: 'rating', type: 'number', label: 'Rating', required: true, placeholder: '5', ui: { inputType: 'number', min: 1, max: 5 }, sortable: true, display: true },
      { name: 'title', type: 'string', label: 'Review Title', required: false, placeholder: 'Review title', searchable: true },
      { name: 'review_text', type: 'text', label: 'Review Text', required: true, placeholder: 'Write your review', ui: { inputType: 'textarea', rows: 4 } },
      { name: 'is_verified', type: 'boolean', label: 'Verified', required: true, defaultValue: false, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'is_approved', type: 'boolean', label: 'Approved', required: true, defaultValue: false, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'helpful_count', type: 'number', label: 'Helpful Count', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  inquiries: {
    name: 'inquiries',
    label: 'Inquiries',
    description: 'Customer inquiries and support',
    icon: '📧',
    fields: [
      { name: 'name', type: 'string', label: 'Name', required: true, placeholder: 'Your name', searchable: true, sortable: true, display: true },
      { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com', searchable: true, sortable: true, display: true },
      { name: 'phone', type: 'string', label: 'Phone', required: false, placeholder: '+91 9876543210', searchable: true },
      { name: 'company_name', type: 'string', label: 'Company Name', required: false, placeholder: 'Company name', searchable: true },
      { name: 'subject', type: 'string', label: 'Subject', required: false, placeholder: 'Inquiry subject', searchable: true },
      { name: 'message', type: 'text', label: 'Message', required: true, placeholder: 'Your message', ui: { inputType: 'textarea', rows: 4 } },
      { name: 'inquiry_type', type: 'select', label: 'Inquiry Type', required: true, defaultValue: 'general', options: [
        { value: 'general', label: 'General' },
        { value: 'quote', label: 'Quote Request' },
        { value: 'support', label: 'Support' },
        { value: 'partnership', label: 'Partnership' }
      ], sortable: true, display: true },
      { name: 'status', type: 'select', label: 'Status', required: true, defaultValue: 'new', options: [
        { value: 'new', label: 'New' },
        { value: 'responded', label: 'Responded' },
        { value: 'closed', label: 'Closed' }
      ], sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  coupons: {
    name: 'coupons',
    label: 'Coupons',
    description: 'Discount codes and promotions',
    icon: '🎫',
    fields: [
      { name: 'code', type: 'string', label: 'Coupon Code', required: true, placeholder: 'SAVE20', searchable: true, sortable: true, display: true },
      { name: 'description', type: 'string', label: 'Description', required: false, placeholder: 'Coupon description', searchable: true },
      { name: 'discount_type', type: 'select', label: 'Discount Type', required: true, options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed', label: 'Fixed Amount' },
        { value: 'free_shipping', label: 'Free Shipping' }
      ], sortable: true, display: true },
      { name: 'discount_value', type: 'number', label: 'Discount Value', required: true, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true, display: true },
      { name: 'min_order_value', type: 'number', label: 'Min Order Value', required: true, defaultValue: 0, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'max_discount', type: 'number', label: 'Max Discount', required: false, placeholder: '0.00', ui: { inputType: 'number', step: 0.01 }, sortable: true },
      { name: 'usage_limit', type: 'number', label: 'Usage Limit', required: false, placeholder: '100', ui: { inputType: 'number' }, sortable: true },
      { name: 'used_count', type: 'number', label: 'Used Count', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true, display: true },
      { name: 'valid_from', type: 'date', label: 'Valid From', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'valid_to', type: 'date', label: 'Valid To', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  banners: {
    name: 'banners',
    label: 'Banners',
    description: 'Homepage banners and sliders',
    icon: '🖼️',
    fields: [
      { name: 'title', type: 'string', label: 'Banner Title', required: true, placeholder: 'Banner title', searchable: true, sortable: true, display: true },
      { name: 'image_url', type: 'url', label: 'Image URL', required: true, placeholder: 'https://example.com/banner.jpg' },
      { name: 'image_alt', type: 'string', label: 'Image Alt Text', required: false, placeholder: 'Banner image alt text' },
      { name: 'link_url', type: 'url', label: 'Link URL', required: false, placeholder: 'https://example.com/link' },
      { name: 'position', type: 'string', label: 'Position', required: true, defaultValue: 'homepage', placeholder: 'homepage', sortable: true, display: true },
      { name: 'ordering', type: 'number', label: 'Order', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  menus: {
    name: 'menus',
    label: 'Menus',
    description: 'Navigation menu management',
    icon: '📋',
    fields: [
      { name: 'parent_id', type: 'string', label: 'Parent Menu', required: false, placeholder: 'Select parent menu' },
      { name: 'title', type: 'string', label: 'Menu Title', required: true, placeholder: 'Menu item title', searchable: true, sortable: true, display: true },
      { name: 'url', type: 'url', label: 'URL', required: true, placeholder: '/page-url' },
      { name: 'target', type: 'select', label: 'Target', required: true, defaultValue: '_self', options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' }
      ], sortable: true },
      { name: 'menu_type', type: 'select', label: 'Menu Type', required: true, defaultValue: 'header', options: [
        { value: 'header', label: 'Header' },
        { value: 'footer', label: 'Footer' },
        { value: 'sidebar', label: 'Sidebar' }
      ], sortable: true, display: true },
      { name: 'ordering', type: 'number', label: 'Order', required: true, defaultValue: 0, ui: { inputType: 'number' }, sortable: true },
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  media: {
    name: 'media',
    label: 'Media',
    description: 'File and image management',
    icon: '📁',
    fields: [
      { name: 'filename', type: 'string', label: 'Filename', required: true, placeholder: 'image.jpg', searchable: true, sortable: true, display: true },
      { name: 'filepath', type: 'string', label: 'File Path', required: true, placeholder: '/uploads/image.jpg' },
      { name: 'mime_type', type: 'string', label: 'MIME Type', required: true, placeholder: 'image/jpeg', sortable: true, display: true },
      { name: 'file_size', type: 'number', label: 'File Size (bytes)', required: false, ui: { inputType: 'number' }, sortable: true },
      { name: 'alt_text', type: 'string', label: 'Alt Text', required: false, placeholder: 'Image description' },
      { name: 'title', type: 'string', label: 'Title', required: false, placeholder: 'Image title', searchable: true },
      { name: 'uploaded_by', type: 'string', label: 'Uploaded By', required: false, placeholder: 'User ID' },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  settings: {
    name: 'settings',
    label: 'Settings',
    description: 'System configuration',
    icon: '⚙️',
    fields: [
      { name: 'setting_key', type: 'string', label: 'Setting Key', required: true, placeholder: 'site_name', searchable: true, sortable: true, display: true },
      { name: 'setting_value', type: 'text', label: 'Setting Value', required: false, placeholder: 'Setting value', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'setting_group', type: 'string', label: 'Setting Group', required: true, defaultValue: 'general', placeholder: 'general', sortable: true, display: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  },

  company_info: {
    name: 'company_info',
    label: 'Company Info',
    description: 'Complete business information with legal documents and social media',
    icon: '🏢',
    fields: [
      // Basic Details
      { name: 'name', type: 'string', label: 'Company Name', required: true, placeholder: 'Your Company Name', searchable: true, sortable: true, display: true },
      { name: 'legal_name', type: 'string', label: 'Legal Name', required: false, placeholder: 'Legal Company Name Pvt Ltd', searchable: true },
      { name: 'logo_url', type: 'url', label: 'Logo URL', required: false, placeholder: 'https://example.com/logo.png' },
      { name: 'favicon_url', type: 'url', label: 'Favicon URL', required: false, placeholder: 'https://example.com/favicon.ico' },
      { name: 'tagline', type: 'string', label: 'Tagline', required: false, placeholder: 'Your Company Tagline', searchable: true },
      { name: 'description', type: 'text', label: 'Company Description', required: false, placeholder: 'Brief company description', ui: { inputType: 'textarea', rows: 4 } },
      
      // Contact Information
      { name: 'email', type: 'email', label: 'Primary Email', required: false, placeholder: 'contact@company.com', searchable: true },
      { name: 'phone', type: 'string', label: 'Primary Phone', required: false, placeholder: '+91 9876543210', searchable: true },
      { name: 'alternate_phone', type: 'string', label: 'Alternate Phone', required: false, placeholder: '+91 9876543211' },
      { name: 'whatsapp', type: 'string', label: 'WhatsApp Number', required: false, placeholder: '+91 9876543210' },
      { name: 'toll_free', type: 'string', label: 'Toll Free Number', required: false, placeholder: '1800-123-4567' },
      
      // Complete Address
      { name: 'address_line1', type: 'string', label: 'Address Line 1', required: false, placeholder: 'Street address, Building name' },
      { name: 'address_line2', type: 'string', label: 'Address Line 2', required: false, placeholder: 'Area, Locality' },
      { name: 'landmark', type: 'string', label: 'Landmark', required: false, placeholder: 'Near Metro Station' },
      { name: 'city', type: 'string', label: 'City', required: false, placeholder: 'Mumbai', searchable: true },
      { name: 'state', type: 'string', label: 'State', required: false, placeholder: 'Maharashtra', searchable: true },
      { name: 'postal_code', type: 'string', label: 'Postal Code', required: false, placeholder: '400001' },
      { name: 'country', type: 'string', label: 'Country', required: true, defaultValue: 'India', placeholder: 'India', sortable: true, display: true },
      
      // Legal Documents
      { name: 'gst_no', type: 'string', label: 'GST Number', required: false, placeholder: '27ABCDE1234F1Z5' },
      { name: 'pan_no', type: 'string', label: 'PAN Number', required: false, placeholder: 'ABCDE1234F' },
      { name: 'cin_no', type: 'string', label: 'CIN Number', required: false, placeholder: 'U72900MH2020PTC123456' },
      { name: 'tan_no', type: 'string', label: 'TAN Number', required: false, placeholder: 'MUMB12345F' },
      { name: 'import_export_code', type: 'string', label: 'Import/Export Code', required: false, placeholder: 'IEC123456789' },
      
      // Website & Social Media
      { name: 'website_url', type: 'url', label: 'Website URL', required: false, placeholder: 'https://company.com' },
      { name: 'facebook_url', type: 'url', label: 'Facebook URL', required: false, placeholder: 'https://facebook.com/company' },
      { name: 'instagram_url', type: 'url', label: 'Instagram URL', required: false, placeholder: 'https://instagram.com/company' },
      { name: 'linkedin_url', type: 'url', label: 'LinkedIn URL', required: false, placeholder: 'https://linkedin.com/company/company' },
      { name: 'twitter_url', type: 'url', label: 'Twitter URL', required: false, placeholder: 'https://twitter.com/company' },
      { name: 'youtube_url', type: 'url', label: 'YouTube URL', required: false, placeholder: 'https://youtube.com/c/company' },
      { name: 'pinterest_url', type: 'url', label: 'Pinterest URL', required: false, placeholder: 'https://pinterest.com/company' },
      
      // Business Hours (JSON)
      { name: 'business_hours', type: 'json', label: 'Business Hours', required: false, placeholder: '{"monday": {"open": "09:00", "close": "18:00"}}', ui: { inputType: 'textarea', rows: 6 } },
      
      // SEO & Schema.org
      { name: 'schema_type', type: 'string', label: 'Schema Type', required: true, defaultValue: 'Organization', placeholder: 'Organization' },
      { name: 'schema_data', type: 'json', label: 'Schema Data', required: false, placeholder: '{"@type": "Organization", "name": "Company Name"}', ui: { inputType: 'textarea', rows: 4 } },
      
      // Additional Info
      { name: 'established_year', type: 'number', label: 'Established Year', required: false, placeholder: '2020', ui: { inputType: 'number', min: 1800, max: 2030 } },
      { name: 'certifications', type: 'text', label: 'Certifications', required: false, placeholder: 'ISO 9001:2015, ISO 14001:2015', ui: { inputType: 'textarea', rows: 3 } },
      { name: 'awards', type: 'text', label: 'Awards & Recognition', required: false, placeholder: 'Best Company Award 2023', ui: { inputType: 'textarea', rows: 3 } },
      
      // Status
      { name: 'is_active', type: 'boolean', label: 'Active', required: true, defaultValue: true, ui: { inputType: 'checkbox' }, sortable: true, display: true },
      { name: 'created_at', type: 'date', label: 'Created At', required: false, ui: { inputType: 'datetime-local' }, sortable: true },
      { name: 'updated_at', type: 'date', label: 'Updated At', required: false, ui: { inputType: 'datetime-local' }, sortable: true }
    ],
    permissions: { create: true, read: true, update: true, delete: true }
  }
};

// Helper functions
export const getTableDefinition = (tableName: string): TableDefinition | undefined => {
  return DATABASE_SCHEMA[tableName];
};

export const getAllTables = (): TableDefinition[] => {
  return Object.values(DATABASE_SCHEMA);
};

export const getTableFields = (tableName: string): FieldDefinition[] => {
  const table = getTableDefinition(tableName);
  return table ? table.fields : [];
};

export const getDisplayFields = (tableName: string): FieldDefinition[] => {
  return getTableFields(tableName).filter(field => field.display);
};

export const getSearchableFields = (tableName: string): FieldDefinition[] => {
  return getTableFields(tableName).filter(field => field.searchable);
};

export const getSortableFields = (tableName: string): FieldDefinition[] => {
  return getTableFields(tableName).filter(field => field.sortable);
};

export const getSEOFields = (tableName: string): FieldDefinition[] => {
  return getTableFields(tableName).filter(field => field.seo);
};