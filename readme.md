-- ============================================
-- SEO-FRIENDLY E-COMMERCE DATABASE SCHEMA
-- MySQL Compatible | Full SEO Features
-- ============================================

-- Users Table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','customer','vendor') NOT NULL DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories with Full SEO
CREATE TABLE categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(1024) NULL,
  
  -- SEO Fields
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  meta_keywords VARCHAR(512) NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(512) NULL,
  og_image VARCHAR(1024) NULL,
  canonical_url VARCHAR(1024) NULL,
  h1_tag VARCHAR(255) NULL,
  
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent (parent_id),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products with Advanced SEO
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_desc TEXT NULL,
  long_desc LONGTEXT NULL,
  category_id BIGINT NULL,
  price DECIMAL(12,2) NOT NULL,
  mrp DECIMAL(12,2) NULL,
  stock_qty INT DEFAULT 0,
  
  -- SEO Fields
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  meta_keywords VARCHAR(512) NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(512) NULL,
  og_image VARCHAR(1024) NULL,
  canonical_url VARCHAR(1024) NULL,
  h1_tag VARCHAR(255) NULL,
  
  -- Schema.org / Structured Data
  schema_type VARCHAR(100) DEFAULT 'Product',
  schema_data JSON NULL,
  
  -- Additional SEO
  focus_keyword VARCHAR(255) NULL,
  alt_text_default VARCHAR(255) NULL,
  breadcrumb_title VARCHAR(255) NULL,
  
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  status ENUM('draft','active','inactive') DEFAULT 'draft',
  
  -- Tracking
  view_count INT DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_category (category_id),
  INDEX idx_status (status),
  INDEX idx_featured (is_featured),
  FULLTEXT INDEX ft_name_desc (name, short_desc, long_desc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images with SEO
CREATE TABLE product_images (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  url VARCHAR(1024) NOT NULL,
  alt_text VARCHAR(255) NULL,
  title_text VARCHAR(255) NULL,
  caption TEXT NULL,
  ordering INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Attributes
CREATE TABLE product_attributes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('select','text','number') NOT NULL DEFAULT 'select',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Attribute Values
CREATE TABLE product_attribute_values (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  attribute_id BIGINT NOT NULL,
  value VARCHAR(255) NOT NULL,
  extra_price DECIMAL(12,2) DEFAULT 0.00,
  
  FOREIGN KEY (attribute_id) REFERENCES product_attributes(id) ON DELETE CASCADE,
  INDEX idx_attribute (attribute_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Variants
CREATE TABLE product_variants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  sku VARCHAR(100) UNIQUE NULL,
  attribute_value_ids JSON NULL,
  price DECIMAL(12,2) NOT NULL,
  stock_qty INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers
CREATE TABLE customers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company_name VARCHAR(255) NULL,
  gst_number VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Addresses
CREATE TABLE addresses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  type ENUM('billing','shipping','both') NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  INDEX idx_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders
CREATE TABLE orders (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id BIGINT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  shipping_charge DECIMAL(12,2) DEFAULT 0.00,
  discount_amount DECIMAL(12,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL,
  
  billing_address_id BIGINT NULL,
  shipping_address_id BIGINT NULL,
  
  status ENUM('pending','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  payment_method VARCHAR(100) NULL,
  
  notes TEXT NULL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (billing_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  INDEX idx_customer (customer_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items
CREATE TABLE order_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  variant_id BIGINT NULL,
  product_id BIGINT NULL,
  product_name VARCHAR(255) NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CMS Pages with Full SEO
CREATE TABLE cms_pages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  
  -- SEO Fields
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  meta_keywords VARCHAR(512) NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(512) NULL,
  og_image VARCHAR(1024) NULL,
  canonical_url VARCHAR(1024) NULL,
  h1_tag VARCHAR(255) NULL,
  
  -- Schema.org
  schema_type VARCHAR(100) NULL,
  schema_data JSON NULL,
  
  status ENUM('draft','published','archived') DEFAULT 'draft',
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Posts with SEO
CREATE TABLE blog_posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(1024) NULL,
  author_id BIGINT NULL,
  
  -- SEO Fields
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  meta_keywords VARCHAR(512) NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(512) NULL,
  og_image VARCHAR(1024) NULL,
  canonical_url VARCHAR(1024) NULL,
  h1_tag VARCHAR(255) NULL,
  focus_keyword VARCHAR(255) NULL,
  
  -- Schema.org
  schema_type VARCHAR(100) DEFAULT 'BlogPosting',
  schema_data JSON NULL,
  
  status ENUM('draft','published','archived') DEFAULT 'draft',
  published_at DATETIME NULL,
  view_count INT DEFAULT 0,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published (published_at),
  FULLTEXT INDEX ft_content (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Categories
CREATE TABLE blog_categories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NULL,
  
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Post Categories (Many-to-Many)
CREATE TABLE blog_post_categories (
  post_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- URL Redirects (301/302 for SEO)
CREATE TABLE url_redirects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  old_url VARCHAR(1024) NOT NULL,
  new_url VARCHAR(1024) NOT NULL,
  redirect_type ENUM('301','302') DEFAULT '301',
  is_active BOOLEAN DEFAULT TRUE,
  hit_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_old_url (old_url(255)),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sitemap URLs (for XML sitemap generation)
CREATE TABLE sitemap_urls (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(1024) NOT NULL,
  page_type VARCHAR(50) NOT NULL,
  page_id BIGINT NOT NULL,
  priority DECIMAL(2,1) DEFAULT 0.5,
  changefreq ENUM('always','hourly','daily','weekly','monthly','yearly','never') DEFAULT 'weekly',
  last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE KEY uniq_page (page_type, page_id),
  INDEX idx_active (is_active),
  INDEX idx_modified (last_modified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews/Testimonials (Rich Snippets)
CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NULL,
  customer_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  rating DECIMAL(2,1) NOT NULL,
  title VARCHAR(255) NULL,
  review_text TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQs (Rich Snippets)
CREATE TABLE faqs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT NULL,
  category_id BIGINT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ordering INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Inquiries
CREATE TABLE inquiries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  company_name VARCHAR(255) NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  inquiry_type ENUM('general','quote','support','partnership') DEFAULT 'general',
  status ENUM('new','responded','closed') DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_type (inquiry_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quote Requests
CREATE TABLE quote_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  company_name VARCHAR(255) NULL,
  products_requested JSON NULL,
  message TEXT NULL,
  status ENUM('pending','quoted','accepted','rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME NULL,
  
  INDEX idx_email (email),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons/Discounts
CREATE TABLE coupons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255) NULL,
  discount_type ENUM('percentage','fixed','free_shipping') NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL,
  min_order_value DECIMAL(12,2) DEFAULT 0.00,
  max_discount DECIMAL(12,2) NULL,
  usage_limit INT NULL,
  used_count INT DEFAULT 0,
  valid_from DATETIME NULL,
  valid_to DATETIME NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_code (code),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners/Sliders
CREATE TABLE banners (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(1024) NOT NULL,
  image_alt VARCHAR(255) NULL,
  link_url VARCHAR(1024) NULL,
  position VARCHAR(50) DEFAULT 'homepage',
  ordering INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_position (position),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Navigation Menus
CREATE TABLE menus (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(1024) NOT NULL,
  target VARCHAR(20) DEFAULT '_self',
  menu_type ENUM('header','footer','sidebar') DEFAULT 'header',
  ordering INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL,
  INDEX idx_parent (parent_id),
  INDEX idx_type (menu_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media Library
CREATE TABLE media (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(1024) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT NULL,
  alt_text VARCHAR(255) NULL,
  title VARCHAR(255) NULL,
  uploaded_by BIGINT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_mime (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings (Key-Value Store)
CREATE TABLE settings (
  setting_key VARCHAR(255) PRIMARY KEY,
  setting_value TEXT NULL,
  setting_group VARCHAR(100) DEFAULT 'general',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Company Information (Global Business Details)
CREATE TABLE company_info (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NULL,
  logo_url VARCHAR(1024) NULL,
  favicon_url VARCHAR(1024) NULL,
  tagline VARCHAR(255) NULL,
  description TEXT NULL,
  
  -- Contact Details
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  alternate_phone VARCHAR(50) NULL,
  whatsapp VARCHAR(50) NULL,
  toll_free VARCHAR(50) NULL,
  
  -- Address
  address_line1 VARCHAR(255) NULL,
  address_line2 VARCHAR(255) NULL,
  landmark VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  postal_code VARCHAR(20) NULL,
  country VARCHAR(100) DEFAULT 'India',
  
  -- Legal & Business
  gst_no VARCHAR(50) NULL,
  pan_no VARCHAR(50) NULL,
  cin_no VARCHAR(50) NULL,
  tan_no VARCHAR(50) NULL,
  import_export_code VARCHAR(50) NULL,
  
  -- Website & Social Media
  website_url VARCHAR(255) NULL,
  facebook_url VARCHAR(255) NULL,
  instagram_url VARCHAR(255) NULL,
  linkedin_url VARCHAR(255) NULL,
  twitter_url VARCHAR(255) NULL,
  youtube_url VARCHAR(255) NULL,
  pinterest_url VARCHAR(255) NULL,
  
  -- Business Hours
  business_hours JSON NULL,
  
  -- SEO & Schema.org
  schema_type VARCHAR(100) DEFAULT 'Organization',
  schema_data JSON NULL,
  
  -- Additional Info
  established_year INT NULL,
  certifications TEXT NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEO Meta Override (Global)
CREATE TABLE seo_meta_overrides (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  page_type VARCHAR(50) NOT NULL,
  page_id BIGINT NOT NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(512) NULL,
  meta_keywords VARCHAR(512) NULL,
  og_title VARCHAR(255) NULL,
  og_description VARCHAR(512) NULL,
  og_image VARCHAR(1024) NULL,
  canonical_url VARCHAR(1024) NULL,
  robots_tag VARCHAR(100) DEFAULT 'index, follow',
  
  UNIQUE KEY uniq_page_meta (page_type, page_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity/Audit Log
CREATE TABLE activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NULL,
  entity_id BIGINT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT SEO SETTINGS
-- ============================================

INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Neeyog Packaging', 'general'),
('site_tagline', 'One Stop Solution for Disposable Food Packaging & Serviceware', 'general'),
('site_url', 'https://neeyog.com', 'general'),
('default_meta_description', 'Leading supplier of disposable and biodegradable food packaging products in India', 'seo'),
('default_og_image', '/images/og-default.jpg', 'seo'),
('google_analytics_id', '', 'seo'),
('google_tag_manager_id', '', 'seo'),
('facebook_pixel_id', '', 'seo'),
('robots_txt', 'User-agent: *\nAllow: /', 'seo'),
('sitemap_frequency', 'daily', 'seo');