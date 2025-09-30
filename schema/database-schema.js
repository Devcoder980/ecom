// ============================================
// DYNAMIC DATABASE SCHEMA - AUTO GENERATED
// Generated on: 2025-09-30T08:26:45.941Z
// Collections: 30
// ============================================

export const DATABASE_SCHEMA = {
  "users": {
    "label": "Users",
    "description": "User accounts and authentication",
    "fields": {
      "name": {
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter full name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "user@example.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "phone": {
        "type": "tel",
        "label": "Phone Number",
        "required": false,
        "placeholder": "+91 9876543210",
        "validation": {
          "pattern": "^[+]?[0-9\\s\\-()]+$"
        },
        "options": [],
        "multiple": false
      },
      "password_hash": {
        "type": "password",
        "label": "Password",
        "required": true,
        "placeholder": "Enter password",
        "validation": {
          "minLength": 6
        },
        "options": [],
        "multiple": false
      },
      "role": {
        "type": "select",
        "label": "User Role",
        "required": true,
        "defaultValue": "customer",
        "validation": {},
        "options": [
          {
            "value": "admin",
            "label": "Administrator",
            "_id": "68db7c28499a8d122cc2418b"
          },
          {
            "value": "customer",
            "label": "Customer",
            "_id": "68db7c28499a8d122cc2418c"
          },
          {
            "value": "vendor",
            "label": "Vendor",
            "_id": "68db7c28499a8d122cc2418d"
          }
        ],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "last_login": {
        "type": "datetime-local",
        "label": "Last Login",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "categories": {
    "label": "Categories",
    "description": "Product categories with SEO optimization",
    "fields": {
      "parent_id": {
        "type": "relationship",
        "label": "Parent Category",
        "required": false,
        "placeholder": "Select parent category",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "categories",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "name": {
        "type": "text",
        "label": "Category Name",
        "required": true,
        "placeholder": "Enter category name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "category-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter category description",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Category Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "Title for social media sharing",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "Description for social media sharing",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/category",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading for the page",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "position": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "subcategories": {
    "label": "Subcategories",
    "description": "Product subcategories linked to main categories",
    "fields": {
      "category_id": {
        "type": "relationship",
        "label": "Parent Category",
        "required": true,
        "placeholder": "Select parent category",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "categories",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "name": {
        "type": "text",
        "label": "Subcategory Name",
        "required": true,
        "placeholder": "Enter subcategory name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "subcategory-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter subcategory description",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Subcategory Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "Title for social media sharing",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "Description for social media sharing",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/subcategory",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading for the page",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "position": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "products": {
    "label": "Products",
    "description": "Product catalog with variants and SEO",
    "fields": {
      "sku": {
        "type": "text",
        "label": "SKU",
        "required": false,
        "placeholder": "PROD-001",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Product Name",
        "required": true,
        "placeholder": "Enter product name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "product-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "short_desc": {
        "type": "textarea",
        "label": "Short Description",
        "required": false,
        "placeholder": "Brief product description",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "long_desc": {
        "type": "textarea",
        "label": "Long Description",
        "required": false,
        "placeholder": "Detailed product description",
        "validation": {},
        "options": [],
        "rows": 6,
        "multiple": false
      },
      "subcategory_id": {
        "type": "relationship",
        "label": "Subcategory",
        "required": false,
        "placeholder": "Select subcategory",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "subcategories",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "price": {
        "type": "number",
        "label": "Price",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "mrp": {
        "type": "number",
        "label": "MRP",
        "required": false,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "stock_qty": {
        "type": "number",
        "label": "Stock Quantity",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "Title for social media sharing",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "Description for social media sharing",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/product",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading for the page",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "focus_keyword": {
        "type": "text",
        "label": "Focus Keyword",
        "required": false,
        "placeholder": "Primary SEO keyword",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "alt_text_default": {
        "type": "text",
        "label": "Default Alt Text",
        "required": false,
        "placeholder": "Default alt text for images",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "breadcrumb_title": {
        "type": "text",
        "label": "Breadcrumb Title",
        "required": false,
        "placeholder": "Title for breadcrumb navigation",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "schema_type": {
        "type": "select",
        "label": "Schema Type",
        "required": false,
        "defaultValue": "Product",
        "validation": {},
        "options": [
          {
            "value": "Product",
            "label": "Product",
            "_id": "68db7c28499a8d122cc241b6"
          },
          {
            "value": "Book",
            "label": "Book",
            "_id": "68db7c28499a8d122cc241b7"
          },
          {
            "value": "SoftwareApplication",
            "label": "Software Application",
            "_id": "68db7c28499a8d122cc241b8"
          }
        ],
        "multiple": false
      },
      "schema_data": {
        "type": "textarea",
        "label": "Schema Data (JSON)",
        "required": false,
        "placeholder": "{\"@type\": \"Product\", \"name\": \"Product Name\"}",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "is_featured": {
        "type": "checkbox",
        "label": "Featured Product",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_new": {
        "type": "checkbox",
        "label": "New Product",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "defaultValue": "draft",
        "validation": {},
        "options": [
          {
            "value": "draft",
            "label": "Draft",
            "_id": "68db7c29499a8d122cc241bd"
          },
          {
            "value": "active",
            "label": "Active",
            "_id": "68db7c29499a8d122cc241be"
          },
          {
            "value": "inactive",
            "label": "Inactive",
            "_id": "68db7c29499a8d122cc241bf"
          }
        ],
        "multiple": false
      },
      "view_count": {
        "type": "number",
        "label": "View Count",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "customers": {
    "label": "Customers",
    "description": "Customer information and profiles",
    "fields": {
      "user_id": {
        "type": "select",
        "label": "User Account",
        "required": false,
        "placeholder": "Select user account",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Customer Name",
        "required": true,
        "placeholder": "Enter customer name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email Address",
        "required": false,
        "placeholder": "customer@example.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "phone": {
        "type": "tel",
        "label": "Phone Number",
        "required": false,
        "placeholder": "+91 9876543210",
        "validation": {
          "pattern": "^[+]?[0-9\\s\\-()]+$"
        },
        "options": [],
        "multiple": false
      },
      "company_name": {
        "type": "text",
        "label": "Company Name",
        "required": false,
        "placeholder": "Enter company name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "gst_number": {
        "type": "text",
        "label": "GST Number",
        "required": false,
        "placeholder": "22AAAAA0000A1Z5",
        "validation": {
          "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
        },
        "options": [],
        "multiple": false
      }
    }
  },
  "orders": {
    "label": "Orders",
    "description": "Order management and tracking",
    "fields": {
      "order_number": {
        "type": "text",
        "label": "Order Number",
        "required": true,
        "placeholder": "ORD-001",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "customer_id": {
        "type": "select",
        "label": "Customer",
        "required": true,
        "placeholder": "Select customer",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "subtotal": {
        "type": "number",
        "label": "Subtotal",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "tax_amount": {
        "type": "number",
        "label": "Tax Amount",
        "required": false,
        "placeholder": "0.00",
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "shipping_charge": {
        "type": "number",
        "label": "Shipping Charge",
        "required": false,
        "placeholder": "0.00",
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "discount_amount": {
        "type": "number",
        "label": "Discount Amount",
        "required": false,
        "placeholder": "0.00",
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "total_amount": {
        "type": "number",
        "label": "Total Amount",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "billing_address_id": {
        "type": "select",
        "label": "Billing Address",
        "required": false,
        "placeholder": "Select billing address",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "shipping_address_id": {
        "type": "select",
        "label": "Shipping Address",
        "required": false,
        "placeholder": "Select shipping address",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Order Status",
        "required": true,
        "defaultValue": "pending",
        "validation": {},
        "options": [
          {
            "value": "pending",
            "label": "Pending",
            "_id": "68db7c29499a8d122cc241d3"
          },
          {
            "value": "processing",
            "label": "Processing",
            "_id": "68db7c29499a8d122cc241d4"
          },
          {
            "value": "shipped",
            "label": "Shipped",
            "_id": "68db7c29499a8d122cc241d5"
          },
          {
            "value": "delivered",
            "label": "Delivered",
            "_id": "68db7c29499a8d122cc241d6"
          },
          {
            "value": "cancelled",
            "label": "Cancelled",
            "_id": "68db7c29499a8d122cc241d7"
          },
          {
            "value": "refunded",
            "label": "Refunded",
            "_id": "68db7c29499a8d122cc241d8"
          }
        ],
        "multiple": false
      },
      "payment_status": {
        "type": "select",
        "label": "Payment Status",
        "required": true,
        "defaultValue": "pending",
        "validation": {},
        "options": [
          {
            "value": "pending",
            "label": "Pending",
            "_id": "68db7c29499a8d122cc241da"
          },
          {
            "value": "paid",
            "label": "Paid",
            "_id": "68db7c29499a8d122cc241db"
          },
          {
            "value": "failed",
            "label": "Failed",
            "_id": "68db7c29499a8d122cc241dc"
          },
          {
            "value": "refunded",
            "label": "Refunded",
            "_id": "68db7c29499a8d122cc241dd"
          }
        ],
        "multiple": false
      },
      "payment_method": {
        "type": "text",
        "label": "Payment Method",
        "required": false,
        "placeholder": "Credit Card, UPI, etc.",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "notes": {
        "type": "textarea",
        "label": "Order Notes",
        "required": false,
        "placeholder": "Additional notes for this order",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      }
    }
  },
  "blog_posts": {
    "label": "Blog Posts",
    "description": "Blog content management with SEO",
    "fields": {
      "title": {
        "type": "text",
        "label": "Post Title",
        "required": true,
        "placeholder": "Enter blog post title",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "blog-post-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "excerpt": {
        "type": "textarea",
        "label": "Excerpt",
        "required": false,
        "placeholder": "Brief summary of the post",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "content": {
        "type": "textarea",
        "label": "Content",
        "required": true,
        "placeholder": "Write your blog post content here...",
        "validation": {},
        "options": [],
        "rows": 10,
        "multiple": false
      },
      "featured_image": {
        "type": "file",
        "label": "Featured Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "author_id": {
        "type": "select",
        "label": "Author",
        "required": false,
        "placeholder": "Select author",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "Title for social media sharing",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "Description for social media sharing",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/blog/post",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading for the page",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "focus_keyword": {
        "type": "text",
        "label": "Focus Keyword",
        "required": false,
        "placeholder": "Primary SEO keyword",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "schema_type": {
        "type": "select",
        "label": "Schema Type",
        "required": false,
        "defaultValue": "BlogPosting",
        "validation": {},
        "options": [
          {
            "value": "BlogPosting",
            "label": "Blog Posting",
            "_id": "68db7c29499a8d122cc241f1"
          },
          {
            "value": "Article",
            "label": "Article",
            "_id": "68db7c29499a8d122cc241f2"
          },
          {
            "value": "NewsArticle",
            "label": "News Article",
            "_id": "68db7c29499a8d122cc241f3"
          }
        ],
        "multiple": false
      },
      "schema_data": {
        "type": "textarea",
        "label": "Schema Data (JSON)",
        "required": false,
        "placeholder": "{\"@type\": \"BlogPosting\", \"headline\": \"Post Title\"}",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "defaultValue": "draft",
        "validation": {},
        "options": [
          {
            "value": "draft",
            "label": "Draft",
            "_id": "68db7c29499a8d122cc241f6"
          },
          {
            "value": "published",
            "label": "Published",
            "_id": "68db7c29499a8d122cc241f7"
          },
          {
            "value": "archived",
            "label": "Archived",
            "_id": "68db7c29499a8d122cc241f8"
          }
        ],
        "multiple": false
      },
      "published_at": {
        "type": "datetime-local",
        "label": "Published Date",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "view_count": {
        "type": "number",
        "label": "View Count",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "reviews": {
    "label": "Reviews",
    "description": "Customer reviews and testimonials",
    "fields": {
      "product_id": {
        "type": "select",
        "label": "Product",
        "required": false,
        "placeholder": "Select product",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "customer_id": {
        "type": "select",
        "label": "Customer",
        "required": false,
        "placeholder": "Select customer",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Reviewer Name",
        "required": true,
        "placeholder": "Enter reviewer name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email Address",
        "required": false,
        "placeholder": "reviewer@example.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "rating": {
        "type": "number",
        "label": "Rating",
        "required": true,
        "placeholder": "4.5",
        "validation": {},
        "options": [],
        "step": 0.1,
        "multiple": false
      },
      "title": {
        "type": "text",
        "label": "Review Title",
        "required": false,
        "placeholder": "Enter review title",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "review_text": {
        "type": "textarea",
        "label": "Review Text",
        "required": true,
        "placeholder": "Write your review here...",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "is_verified": {
        "type": "checkbox",
        "label": "Verified Purchase",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_approved": {
        "type": "checkbox",
        "label": "Approved",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "helpful_count": {
        "type": "number",
        "label": "Helpful Count",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "inquiries": {
    "label": "Inquiries",
    "description": "Customer inquiries and support",
    "fields": {
      "name": {
        "type": "text",
        "label": "Name",
        "required": true,
        "placeholder": "Enter your name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "your@email.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "phone": {
        "type": "tel",
        "label": "Phone Number",
        "required": false,
        "placeholder": "+91 9876543210",
        "validation": {
          "pattern": "^[+]?[0-9\\s\\-()]+$"
        },
        "options": [],
        "multiple": false
      },
      "company_name": {
        "type": "text",
        "label": "Company Name",
        "required": false,
        "placeholder": "Enter company name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "subject": {
        "type": "text",
        "label": "Subject",
        "required": false,
        "placeholder": "Enter inquiry subject",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "message": {
        "type": "textarea",
        "label": "Message",
        "required": true,
        "placeholder": "Write your inquiry message here...",
        "validation": {},
        "options": [],
        "rows": 5,
        "multiple": false
      },
      "inquiry_type": {
        "type": "select",
        "label": "Inquiry Type",
        "required": true,
        "defaultValue": "general",
        "validation": {},
        "options": [
          {
            "value": "general",
            "label": "General",
            "_id": "68db7c29499a8d122cc2420e"
          },
          {
            "value": "quote",
            "label": "Quote Request",
            "_id": "68db7c29499a8d122cc2420f"
          },
          {
            "value": "support",
            "label": "Support",
            "_id": "68db7c29499a8d122cc24210"
          },
          {
            "value": "partnership",
            "label": "Partnership",
            "_id": "68db7c29499a8d122cc24211"
          }
        ],
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "defaultValue": "new",
        "validation": {},
        "options": [
          {
            "value": "new",
            "label": "New",
            "_id": "68db7c29499a8d122cc24213"
          },
          {
            "value": "responded",
            "label": "Responded",
            "_id": "68db7c29499a8d122cc24214"
          },
          {
            "value": "closed",
            "label": "Closed",
            "_id": "68db7c29499a8d122cc24215"
          }
        ],
        "multiple": false
      }
    }
  },
  "coupons": {
    "label": "Coupons",
    "description": "Discount codes and promotions",
    "fields": {
      "code": {
        "type": "text",
        "label": "Coupon Code",
        "required": true,
        "placeholder": "SAVE20",
        "validation": {
          "maxLength": 50
        },
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "text",
        "label": "Description",
        "required": false,
        "placeholder": "Enter coupon description",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "discount_type": {
        "type": "select",
        "label": "Discount Type",
        "required": true,
        "defaultValue": "percentage",
        "validation": {},
        "options": [
          {
            "value": "percentage",
            "label": "Percentage",
            "_id": "68db7c29499a8d122cc2421a"
          },
          {
            "value": "fixed",
            "label": "Fixed Amount",
            "_id": "68db7c29499a8d122cc2421b"
          },
          {
            "value": "free_shipping",
            "label": "Free Shipping",
            "_id": "68db7c29499a8d122cc2421c"
          }
        ],
        "multiple": false
      },
      "discount_value": {
        "type": "number",
        "label": "Discount Value",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "min_order_value": {
        "type": "number",
        "label": "Minimum Order Value",
        "required": false,
        "placeholder": "0.00",
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "max_discount": {
        "type": "number",
        "label": "Maximum Discount",
        "required": false,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "usage_limit": {
        "type": "number",
        "label": "Usage Limit",
        "required": false,
        "placeholder": "100",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "used_count": {
        "type": "number",
        "label": "Used Count",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "valid_from": {
        "type": "datetime-local",
        "label": "Valid From",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "valid_to": {
        "type": "datetime-local",
        "label": "Valid To",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "banners": {
    "label": "Banners",
    "description": "Homepage banners and sliders",
    "fields": {
      "title": {
        "type": "text",
        "label": "Banner Title",
        "required": true,
        "placeholder": "Enter banner title",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Banner Image",
        "required": true,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "image_alt": {
        "type": "text",
        "label": "Image Alt Text",
        "required": false,
        "placeholder": "Describe the image",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "link_url": {
        "type": "url",
        "label": "Link URL",
        "required": false,
        "placeholder": "https://example.com/page",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "position": {
        "type": "select",
        "label": "Position",
        "required": false,
        "defaultValue": "homepage",
        "validation": {},
        "options": [
          {
            "value": "homepage",
            "label": "Homepage",
            "_id": "68db7c29499a8d122cc2422b"
          },
          {
            "value": "category",
            "label": "Category Page",
            "_id": "68db7c29499a8d122cc2422c"
          },
          {
            "value": "product",
            "label": "Product Page",
            "_id": "68db7c29499a8d122cc2422d"
          }
        ],
        "multiple": false
      },
      "ordering": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "media": {
    "label": "Media",
    "description": "File and image management",
    "fields": {
      "filename": {
        "type": "text",
        "label": "Filename",
        "required": true,
        "placeholder": "Enter filename",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "filepath": {
        "type": "text",
        "label": "File Path",
        "required": true,
        "placeholder": "/uploads/images/file.jpg",
        "validation": {
          "maxLength": 1024
        },
        "options": [],
        "multiple": false
      },
      "mime_type": {
        "type": "select",
        "label": "File Type",
        "required": true,
        "validation": {},
        "options": [
          {
            "value": "image/jpeg",
            "label": "JPEG Image",
            "_id": "68db7c29499a8d122cc24234"
          },
          {
            "value": "image/png",
            "label": "PNG Image",
            "_id": "68db7c29499a8d122cc24235"
          },
          {
            "value": "image/gif",
            "label": "GIF Image",
            "_id": "68db7c29499a8d122cc24236"
          },
          {
            "value": "application/pdf",
            "label": "PDF Document",
            "_id": "68db7c29499a8d122cc24237"
          },
          {
            "value": "application/msword",
            "label": "Word Document",
            "_id": "68db7c29499a8d122cc24238"
          },
          {
            "value": "application/vnd.ms-excel",
            "label": "Excel Document",
            "_id": "68db7c29499a8d122cc24239"
          }
        ],
        "multiple": false
      },
      "file_size": {
        "type": "number",
        "label": "File Size (bytes)",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "alt_text": {
        "type": "text",
        "label": "Alt Text",
        "required": false,
        "placeholder": "Describe the file",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "title": {
        "type": "text",
        "label": "Title",
        "required": false,
        "placeholder": "Enter file title",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "uploaded_by": {
        "type": "select",
        "label": "Uploaded By",
        "required": false,
        "placeholder": "Select user",
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "settings": {
    "label": "Settings",
    "description": "System configuration",
    "fields": {
      "setting_key": {
        "type": "text",
        "label": "Setting Key",
        "required": true,
        "placeholder": "site_name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "setting_value": {
        "type": "textarea",
        "label": "Setting Value",
        "required": false,
        "placeholder": "Enter setting value",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "setting_group": {
        "type": "select",
        "label": "Setting Group",
        "required": false,
        "defaultValue": "general",
        "validation": {},
        "options": [
          {
            "value": "general",
            "label": "General",
            "_id": "68db7c29499a8d122cc24242"
          },
          {
            "value": "seo",
            "label": "SEO",
            "_id": "68db7c29499a8d122cc24243"
          },
          {
            "value": "email",
            "label": "Email",
            "_id": "68db7c29499a8d122cc24244"
          },
          {
            "value": "payment",
            "label": "Payment",
            "_id": "68db7c29499a8d122cc24245"
          },
          {
            "value": "social",
            "label": "Social Media",
            "_id": "68db7c29499a8d122cc24246"
          }
        ],
        "multiple": false
      }
    }
  },
  "company_info": {
    "label": "Company Info",
    "description": "Business information and details",
    "fields": {
      "name": {
        "type": "text",
        "label": "Company Name",
        "required": true,
        "placeholder": "Enter company name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "legal_name": {
        "type": "text",
        "label": "Legal Name",
        "required": false,
        "placeholder": "Enter legal company name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "logo_url": {
        "type": "file",
        "label": "Company Logo",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "favicon_url": {
        "type": "file",
        "label": "Favicon",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "tagline": {
        "type": "text",
        "label": "Tagline",
        "required": false,
        "placeholder": "Enter company tagline",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter company description",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email",
        "required": false,
        "placeholder": "info@company.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "phone": {
        "type": "tel",
        "label": "Phone",
        "required": false,
        "placeholder": "+91 9876543210",
        "validation": {
          "pattern": "^[+]?[0-9\\s\\-()]+$"
        },
        "options": [],
        "multiple": false
      },
      "website_url": {
        "type": "url",
        "label": "Website URL",
        "required": false,
        "placeholder": "https://company.com",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "address_line1": {
        "type": "text",
        "label": "Address Line 1",
        "required": false,
        "placeholder": "Enter address",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "city": {
        "type": "text",
        "label": "City",
        "required": false,
        "placeholder": "Enter city",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "state": {
        "type": "text",
        "label": "State",
        "required": false,
        "placeholder": "Enter state",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "postal_code": {
        "type": "text",
        "label": "Postal Code",
        "required": false,
        "placeholder": "123456",
        "validation": {
          "maxLength": 20
        },
        "options": [],
        "multiple": false
      },
      "country": {
        "type": "text",
        "label": "Country",
        "required": false,
        "placeholder": "Enter country",
        "defaultValue": "India",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "gst_no": {
        "type": "text",
        "label": "GST Number",
        "required": false,
        "placeholder": "22AAAAA0000A1Z5",
        "validation": {
          "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
        },
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active Status",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "product_images": {
    "label": "Product Images",
    "description": "Product image gallery with SEO",
    "fields": {
      "product_id": {
        "type": "relationship",
        "label": "Product",
        "required": true,
        "placeholder": "Select product",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "products",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "url": {
        "type": "file",
        "label": "Image",
        "required": true,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "alt_text": {
        "type": "text",
        "label": "Alt Text",
        "required": false,
        "placeholder": "Describe the image",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "title_text": {
        "type": "text",
        "label": "Title Text",
        "required": false,
        "placeholder": "Image title",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "caption": {
        "type": "textarea",
        "label": "Caption",
        "required": false,
        "placeholder": "Image caption",
        "validation": {},
        "options": [],
        "rows": 2,
        "multiple": false
      },
      "ordering": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_primary": {
        "type": "checkbox",
        "label": "Primary Image",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "product_attributes": {
    "label": "Product Attributes",
    "description": "Product attribute definitions",
    "fields": {
      "name": {
        "type": "text",
        "label": "Attribute Name",
        "required": true,
        "placeholder": "Enter attribute name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "type": {
        "type": "select",
        "label": "Attribute Type",
        "required": true,
        "defaultValue": "select",
        "validation": {},
        "options": [
          {
            "value": "select",
            "label": "Select Dropdown",
            "_id": "68db7c29499a8d122cc24263"
          },
          {
            "value": "text",
            "label": "Text Input",
            "_id": "68db7c29499a8d122cc24264"
          },
          {
            "value": "number",
            "label": "Number Input",
            "_id": "68db7c29499a8d122cc24265"
          }
        ],
        "multiple": false
      }
    }
  },
  "product_attribute_values": {
    "label": "Attribute Values",
    "description": "Values for product attributes",
    "fields": {
      "attribute_id": {
        "type": "select",
        "label": "Attribute",
        "required": true,
        "placeholder": "Select attribute",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "value": {
        "type": "text",
        "label": "Value",
        "required": true,
        "placeholder": "Enter attribute value",
        "validation": {
          "minLength": 1,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "extra_price": {
        "type": "number",
        "label": "Extra Price",
        "required": false,
        "placeholder": "0.00",
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      }
    }
  },
  "product_variants": {
    "label": "Product Variants",
    "description": "Product variations and options",
    "fields": {
      "product_id": {
        "type": "select",
        "label": "Product",
        "required": true,
        "placeholder": "Select product",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "sku": {
        "type": "text",
        "label": "Variant SKU",
        "required": false,
        "placeholder": "VAR-001",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "attribute_value_ids": {
        "type": "textarea",
        "label": "Attribute Values (JSON)",
        "required": false,
        "placeholder": "[\"attr1\", \"attr2\"]",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "price": {
        "type": "number",
        "label": "Price",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "stock_qty": {
        "type": "number",
        "label": "Stock Quantity",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "addresses": {
    "label": "Addresses",
    "description": "Customer addresses for billing and shipping",
    "fields": {
      "customer_id": {
        "type": "select",
        "label": "Customer",
        "required": true,
        "placeholder": "Select customer",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "address_line1": {
        "type": "text",
        "label": "Address Line 1",
        "required": true,
        "placeholder": "Enter address",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "address_line2": {
        "type": "text",
        "label": "Address Line 2",
        "required": false,
        "placeholder": "Apartment, suite, etc.",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "city": {
        "type": "text",
        "label": "City",
        "required": true,
        "placeholder": "Enter city",
        "validation": {
          "minLength": 2,
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "state": {
        "type": "text",
        "label": "State",
        "required": true,
        "placeholder": "Enter state",
        "validation": {
          "minLength": 2,
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "postal_code": {
        "type": "text",
        "label": "Postal Code",
        "required": true,
        "placeholder": "123456",
        "validation": {
          "maxLength": 20
        },
        "options": [],
        "multiple": false
      },
      "country": {
        "type": "text",
        "label": "Country",
        "required": true,
        "placeholder": "Enter country",
        "defaultValue": "India",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      },
      "type": {
        "type": "select",
        "label": "Address Type",
        "required": true,
        "defaultValue": "billing",
        "validation": {},
        "options": [
          {
            "value": "billing",
            "label": "Billing",
            "_id": "68db7c29499a8d122cc24279"
          },
          {
            "value": "shipping",
            "label": "Shipping",
            "_id": "68db7c29499a8d122cc2427a"
          },
          {
            "value": "both",
            "label": "Both",
            "_id": "68db7c29499a8d122cc2427b"
          }
        ],
        "multiple": false
      },
      "is_default": {
        "type": "checkbox",
        "label": "Default Address",
        "required": false,
        "defaultValue": false,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "order_items": {
    "label": "Order Items",
    "description": "Individual items in orders",
    "fields": {
      "order_id": {
        "type": "relationship",
        "label": "Order",
        "required": true,
        "placeholder": "Select order",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "orders",
        "relationshipDisplayField": "order_number",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "variant_id": {
        "type": "relationship",
        "label": "Product Variant",
        "required": false,
        "placeholder": "Select variant",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "product_variants",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "product_id": {
        "type": "relationship",
        "label": "Product",
        "required": false,
        "placeholder": "Select product",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "products",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "product_name": {
        "type": "text",
        "label": "Product Name",
        "required": true,
        "placeholder": "Enter product name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "qty": {
        "type": "number",
        "label": "Quantity",
        "required": true,
        "placeholder": "1",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "unit_price": {
        "type": "number",
        "label": "Unit Price",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      },
      "total_price": {
        "type": "number",
        "label": "Total Price",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "step": 0.01,
        "multiple": false
      }
    }
  },
  "cms_pages": {
    "label": "CMS Pages",
    "description": "Static pages with SEO optimization",
    "fields": {
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "page-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "title": {
        "type": "text",
        "label": "Page Title",
        "required": true,
        "placeholder": "Enter page title",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "content": {
        "type": "textarea",
        "label": "Content",
        "required": false,
        "placeholder": "Enter page content...",
        "validation": {},
        "options": [],
        "rows": 10,
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "Title for social media sharing",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "Description for social media sharing",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/page",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading for the page",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "schema_type": {
        "type": "select",
        "label": "Schema Type",
        "required": false,
        "defaultValue": "WebPage",
        "validation": {},
        "options": [
          {
            "value": "WebPage",
            "label": "Web Page",
            "_id": "68db7c29499a8d122cc24292"
          },
          {
            "value": "AboutPage",
            "label": "About Page",
            "_id": "68db7c29499a8d122cc24293"
          },
          {
            "value": "ContactPage",
            "label": "Contact Page",
            "_id": "68db7c29499a8d122cc24294"
          }
        ],
        "multiple": false
      },
      "schema_data": {
        "type": "textarea",
        "label": "Schema Data (JSON)",
        "required": false,
        "placeholder": "{\"@type\": \"WebPage\", \"name\": \"Page Name\"}",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "defaultValue": "draft",
        "validation": {},
        "options": [
          {
            "value": "draft",
            "label": "Draft",
            "_id": "68db7c29499a8d122cc24297"
          },
          {
            "value": "published",
            "label": "Published",
            "_id": "68db7c29499a8d122cc24298"
          },
          {
            "value": "archived",
            "label": "Archived",
            "_id": "68db7c29499a8d122cc24299"
          }
        ],
        "multiple": false
      }
    }
  },
  "blog_categories": {
    "label": "Blog Categories",
    "description": "Blog post categories",
    "fields": {
      "name": {
        "type": "text",
        "label": "Category Name",
        "required": true,
        "placeholder": "Enter category name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "category-slug",
        "validation": {
          "pattern": "^[a-z0-9-]+$"
        },
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter category description",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title for search engines",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description for search engines",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      }
    }
  },
  "blog_post_categories": {
    "label": "Blog Post Categories",
    "description": "Many-to-many relationship between posts and categories",
    "fields": {
      "post_id": {
        "type": "relationship",
        "label": "Blog Post",
        "required": true,
        "placeholder": "Select blog post",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "blog_posts",
        "relationshipDisplayField": "title",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "category_id": {
        "type": "relationship",
        "label": "Category",
        "required": true,
        "placeholder": "Select category",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "blog_categories",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      }
    }
  },
  "url_redirects": {
    "label": "URL Redirects",
    "description": "301/302 redirects for SEO",
    "fields": {
      "old_url": {
        "type": "text",
        "label": "Old URL",
        "required": true,
        "placeholder": "/old-page",
        "validation": {
          "maxLength": 1024
        },
        "options": [],
        "multiple": false
      },
      "new_url": {
        "type": "text",
        "label": "New URL",
        "required": true,
        "placeholder": "/new-page",
        "validation": {
          "maxLength": 1024
        },
        "options": [],
        "multiple": false
      },
      "redirect_type": {
        "type": "select",
        "label": "Redirect Type",
        "required": true,
        "defaultValue": "301",
        "validation": {},
        "options": [
          {
            "value": "301",
            "label": "301 Permanent",
            "_id": "68db7c29499a8d122cc242a7"
          },
          {
            "value": "302",
            "label": "302 Temporary",
            "_id": "68db7c29499a8d122cc242a8"
          }
        ],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "hit_count": {
        "type": "number",
        "label": "Hit Count",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "sitemap_urls": {
    "label": "Sitemap URLs",
    "description": "URLs for XML sitemap generation",
    "fields": {
      "url": {
        "type": "text",
        "label": "URL",
        "required": true,
        "placeholder": "/page-url",
        "validation": {
          "maxLength": 1024
        },
        "options": [],
        "multiple": false
      },
      "page_type": {
        "type": "select",
        "label": "Page Type",
        "required": true,
        "defaultValue": "product",
        "validation": {},
        "options": [
          {
            "value": "product",
            "label": "Product",
            "_id": "68db7c29499a8d122cc242ae"
          },
          {
            "value": "category",
            "label": "Category",
            "_id": "68db7c29499a8d122cc242af"
          },
          {
            "value": "blog",
            "label": "Blog Post",
            "_id": "68db7c29499a8d122cc242b0"
          },
          {
            "value": "cms",
            "label": "CMS Page",
            "_id": "68db7c29499a8d122cc242b1"
          }
        ],
        "multiple": false
      },
      "page_id": {
        "type": "number",
        "label": "Page ID",
        "required": true,
        "placeholder": "1",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "priority": {
        "type": "number",
        "label": "Priority",
        "required": false,
        "defaultValue": 0.5,
        "validation": {},
        "options": [],
        "step": 0.1,
        "multiple": false
      },
      "changefreq": {
        "type": "select",
        "label": "Change Frequency",
        "required": false,
        "defaultValue": "weekly",
        "validation": {},
        "options": [
          {
            "value": "always",
            "label": "Always",
            "_id": "68db7c29499a8d122cc242b5"
          },
          {
            "value": "hourly",
            "label": "Hourly",
            "_id": "68db7c29499a8d122cc242b6"
          },
          {
            "value": "daily",
            "label": "Daily",
            "_id": "68db7c29499a8d122cc242b7"
          },
          {
            "value": "weekly",
            "label": "Weekly",
            "_id": "68db7c29499a8d122cc242b8"
          },
          {
            "value": "monthly",
            "label": "Monthly",
            "_id": "68db7c29499a8d122cc242b9"
          },
          {
            "value": "yearly",
            "label": "Yearly",
            "_id": "68db7c29499a8d122cc242ba"
          },
          {
            "value": "never",
            "label": "Never",
            "_id": "68db7c29499a8d122cc242bb"
          }
        ],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "faqs": {
    "label": "FAQs",
    "description": "Frequently asked questions with rich snippets",
    "fields": {
      "product_id": {
        "type": "select",
        "label": "Product",
        "required": false,
        "placeholder": "Select product",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "category_id": {
        "type": "relationship",
        "label": "Category",
        "required": false,
        "placeholder": "Select category",
        "validation": {},
        "options": [],
        "multiple": false,
        "relationshipTable": "categories",
        "relationshipDisplayField": "name",
        "relationshipSearchable": true,
        "relationshipMultiple": false
      },
      "question": {
        "type": "textarea",
        "label": "Question",
        "required": true,
        "placeholder": "Enter the question",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "answer": {
        "type": "textarea",
        "label": "Answer",
        "required": true,
        "placeholder": "Enter the answer",
        "validation": {},
        "options": [],
        "rows": 5,
        "multiple": false
      },
      "ordering": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "quote_requests": {
    "label": "Quote Requests",
    "description": "Customer quote requests",
    "fields": {
      "customer_id": {
        "type": "select",
        "label": "Customer",
        "required": false,
        "placeholder": "Select customer",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Name",
        "required": true,
        "placeholder": "Enter name",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "email": {
        "type": "email",
        "label": "Email",
        "required": true,
        "placeholder": "email@example.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "phone": {
        "type": "tel",
        "label": "Phone",
        "required": false,
        "placeholder": "+91 9876543210",
        "validation": {
          "pattern": "^[+]?[0-9\\s\\-()]+$"
        },
        "options": [],
        "multiple": false
      },
      "company_name": {
        "type": "text",
        "label": "Company Name",
        "required": false,
        "placeholder": "Enter company name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "products_requested": {
        "type": "textarea",
        "label": "Products Requested (JSON)",
        "required": false,
        "placeholder": "[\"product1\", \"product2\"]",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "message": {
        "type": "textarea",
        "label": "Message",
        "required": false,
        "placeholder": "Additional message",
        "validation": {},
        "options": [],
        "rows": 4,
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "defaultValue": "pending",
        "validation": {},
        "options": [
          {
            "value": "pending",
            "label": "Pending",
            "_id": "68db7c29499a8d122cc242cd"
          },
          {
            "value": "quoted",
            "label": "Quoted",
            "_id": "68db7c29499a8d122cc242ce"
          },
          {
            "value": "accepted",
            "label": "Accepted",
            "_id": "68db7c29499a8d122cc242cf"
          },
          {
            "value": "rejected",
            "label": "Rejected",
            "_id": "68db7c29499a8d122cc242d0"
          }
        ],
        "multiple": false
      }
    }
  },
  "newsletter_subscribers": {
    "label": "Newsletter Subscribers",
    "description": "Email newsletter subscribers",
    "fields": {
      "email": {
        "type": "email",
        "label": "Email",
        "required": true,
        "placeholder": "subscriber@example.com",
        "validation": {
          "pattern": "^[^@]+@[^@]+\\.[^@]+$"
        },
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Name",
        "required": false,
        "placeholder": "Enter name",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "subscribed_at": {
        "type": "datetime-local",
        "label": "Subscribed At",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "unsubscribed_at": {
        "type": "datetime-local",
        "label": "Unsubscribed At",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "menus": {
    "label": "Menus",
    "description": "Navigation menu management",
    "fields": {
      "parent_id": {
        "type": "select",
        "label": "Parent Menu",
        "required": false,
        "placeholder": "Select parent menu",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "title": {
        "type": "text",
        "label": "Menu Title",
        "required": true,
        "placeholder": "Enter menu title",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "url": {
        "type": "text",
        "label": "URL",
        "required": true,
        "placeholder": "/page-url",
        "validation": {
          "maxLength": 1024
        },
        "options": [],
        "multiple": false
      },
      "target": {
        "type": "select",
        "label": "Target",
        "required": false,
        "defaultValue": "_self",
        "validation": {},
        "options": [
          {
            "value": "_self",
            "label": "Same Window",
            "_id": "68db7c29499a8d122cc242dc"
          },
          {
            "value": "_blank",
            "label": "New Window",
            "_id": "68db7c29499a8d122cc242dd"
          }
        ],
        "multiple": false
      },
      "menu_type": {
        "type": "select",
        "label": "Menu Type",
        "required": true,
        "defaultValue": "header",
        "validation": {},
        "options": [
          {
            "value": "header",
            "label": "Header",
            "_id": "68db7c29499a8d122cc242df"
          },
          {
            "value": "footer",
            "label": "Footer",
            "_id": "68db7c29499a8d122cc242e0"
          },
          {
            "value": "sidebar",
            "label": "Sidebar",
            "_id": "68db7c29499a8d122cc242e1"
          }
        ],
        "multiple": false
      },
      "ordering": {
        "type": "number",
        "label": "Display Order",
        "required": false,
        "defaultValue": 0,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "defaultValue": true,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "seo_meta_overrides": {
    "label": "SEO Meta Overrides",
    "description": "Global SEO meta tag overrides",
    "fields": {
      "page_type": {
        "type": "select",
        "label": "Page Type",
        "required": true,
        "defaultValue": "product",
        "validation": {},
        "options": [
          {
            "value": "product",
            "label": "Product",
            "_id": "68db7c29499a8d122cc242e6"
          },
          {
            "value": "category",
            "label": "Category",
            "_id": "68db7c29499a8d122cc242e7"
          },
          {
            "value": "blog",
            "label": "Blog Post",
            "_id": "68db7c29499a8d122cc242e8"
          },
          {
            "value": "cms",
            "label": "CMS Page",
            "_id": "68db7c29499a8d122cc242e9"
          }
        ],
        "multiple": false
      },
      "page_id": {
        "type": "number",
        "label": "Page ID",
        "required": true,
        "placeholder": "1",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title override",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description override",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2, keyword3",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "Open Graph Title",
        "required": false,
        "placeholder": "OG title override",
        "validation": {
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "Open Graph Description",
        "required": false,
        "placeholder": "OG description override",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "og_image": {
        "type": "file",
        "label": "Open Graph Image",
        "required": false,
        "validation": {},
        "options": [],
        "accept": "image/*",
        "fileType": "image",
        "multiple": true
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical URL",
        "required": false,
        "placeholder": "https://example.com/canonical",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "robots_tag": {
        "type": "text",
        "label": "Robots Tag",
        "required": false,
        "placeholder": "index, follow",
        "defaultValue": "index, follow",
        "validation": {
          "maxLength": 100
        },
        "options": [],
        "multiple": false
      }
    }
  },
  "activity_logs": {
    "label": "Activity Logs",
    "description": "System activity and audit logs",
    "fields": {
      "user_id": {
        "type": "select",
        "label": "User",
        "required": false,
        "placeholder": "Select user",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "action": {
        "type": "text",
        "label": "Action",
        "required": true,
        "placeholder": "Enter action description",
        "validation": {
          "minLength": 2,
          "maxLength": 255
        },
        "options": [],
        "multiple": false
      },
      "entity_type": {
        "type": "select",
        "label": "Entity Type",
        "required": false,
        "placeholder": "Select entity type",
        "validation": {},
        "options": [
          {
            "value": "product",
            "label": "Product",
            "_id": "68db7c29499a8d122cc242f7"
          },
          {
            "value": "order",
            "label": "Order",
            "_id": "68db7c29499a8d122cc242f8"
          },
          {
            "value": "user",
            "label": "User",
            "_id": "68db7c29499a8d122cc242f9"
          },
          {
            "value": "category",
            "label": "Category",
            "_id": "68db7c29499a8d122cc242fa"
          }
        ],
        "multiple": false
      },
      "entity_id": {
        "type": "number",
        "label": "Entity ID",
        "required": false,
        "placeholder": "1",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "ip_address": {
        "type": "text",
        "label": "IP Address",
        "required": false,
        "placeholder": "192.168.1.1",
        "validation": {
          "maxLength": 45
        },
        "options": [],
        "multiple": false
      },
      "user_agent": {
        "type": "textarea",
        "label": "User Agent",
        "required": false,
        "placeholder": "Browser user agent string",
        "validation": {
          "maxLength": 512
        },
        "options": [],
        "rows": 2,
        "multiple": false
      }
    }
  }
};

// Field type definitions for form generation
export const FIELD_TYPES = {
  text: {
    component: 'input',
    inputType: 'text'
  },
  email: {
    component: 'input',
    inputType: 'email'
  },
  tel: {
    component: 'input',
    inputType: 'tel'
  },
  url: {
    component: 'input',
    inputType: 'url'
  },
  password: {
    component: 'input',
    inputType: 'password'
  },
  number: {
    component: 'input',
    inputType: 'number'
  },
  datetime_local: {
    component: 'input',
    inputType: 'datetime-local'
  },
  textarea: {
    component: 'textarea'
  },
  select: {
    component: 'select'
  },
  checkbox: {
    component: 'input',
    inputType: 'checkbox'
  },
  file: {
    component: 'input',
    inputType: 'file'
  }
};

// File type configurations
export const FILE_TYPES = {
  image: {
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  document: {
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  video: {
    accept: 'video/*',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg']
  }
};

// Validation rules
export const VALIDATION_RULES = {
  required: (value) => value !== '' && value !== null && value !== undefined,
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
  pattern: (value, pattern) => value && new RegExp(pattern).test(value),
  min: (value, min) => value && parseFloat(value) >= min,
  max: (value, max) => value && parseFloat(value) <= max,
  email: (value) => value && /^[^@]+@[^@]+\.[^@]+$/.test(value),
  url: (value) => value && /^https?:\/\/.+/.test(value)
};

export default DATABASE_SCHEMA;
