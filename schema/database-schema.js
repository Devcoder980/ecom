// ============================================
// DYNAMIC DATABASE SCHEMA - AUTO GENERATED
// Generated on: 2025-10-12T06:32:12.683Z
// Collections: 4
// ============================================

export const DATABASE_SCHEMA = {
  "categories": {
    "label": "Categories",
    "description": "Manage Categories",
    "fields": {
      "name": {
        "type": "text",
        "label": "Name",
        "required": false,
        "placeholder": "Enter name",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "Slug",
        "required": false,
        "placeholder": "Enter slug",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "text",
        "label": "Description",
        "required": false,
        "placeholder": "Enter description",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Image Url",
        "required": false,
        "placeholder": "Enter image url",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "parent_id": {
        "type": "text",
        "label": "Parent Id",
        "required": false,
        "placeholder": "Enter parent id",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "position": {
        "type": "number",
        "label": "Position",
        "required": false,
        "placeholder": "Enter position",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Is Active",
        "required": false,
        "placeholder": "Enter is active",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "created_at": {
        "type": "datetime-local",
        "label": "Created At",
        "required": false,
        "placeholder": "Enter created at",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "updated_at": {
        "type": "datetime-local",
        "label": "Updated At",
        "required": false,
        "placeholder": "Enter updated at",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "Enter meta title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "text",
        "label": "Meta Description",
        "required": false,
        "placeholder": "Enter meta description",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "Enter meta keywords",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "canonical_url": {
        "type": "url",
        "label": "Canonical Url",
        "required": false,
        "placeholder": "Enter canonical url",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Enter h1 tag",
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "subcategories": {
    "label": "Subcategories",
    "description": "Product subcategories linked to categories",
    "fields": {
      "name": {
        "type": "text",
        "label": "Name",
        "required": true,
        "placeholder": "Enter subcategory name",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "Slug",
        "required": true,
        "placeholder": "Enter slug",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter description",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "image_url": {
        "type": "url",
        "label": "Image URL",
        "required": false,
        "placeholder": "Enter image URL",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "category_id": {
        "type": "text",
        "label": "Category",
        "required": true,
        "placeholder": "Select category",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "product_count": {
        "type": "number",
        "label": "Product Count",
        "required": false,
        "placeholder": "0",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      }
    }
  },
  "products": {
    "label": "Products",
    "description": "Product catalog with SEO optimization",
    "fields": {
      "sku": {
        "type": "text",
        "label": "SKU",
        "required": false,
        "placeholder": "Product SKU",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "name": {
        "type": "text",
        "label": "Product Name",
        "required": true,
        "placeholder": "Enter product name",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "slug": {
        "type": "text",
        "label": "URL Slug",
        "required": true,
        "placeholder": "product-slug",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "short_desc": {
        "type": "textarea",
        "label": "Short Description",
        "required": false,
        "placeholder": "Brief description",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "long_desc": {
        "type": "textarea",
        "label": "Long Description",
        "required": false,
        "placeholder": "Detailed description",
        "validation": {},
        "options": [],
        "rows": 5,
        "multiple": false
      },
      "category_id": {
        "type": "text",
        "label": "Category",
        "required": true,
        "placeholder": "Select category",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "subcategory_id": {
        "type": "text",
        "label": "Subcategory",
        "required": true,
        "placeholder": "Select subcategory",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "price": {
        "type": "number",
        "label": "Price",
        "required": true,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "mrp": {
        "type": "number",
        "label": "MRP",
        "required": false,
        "placeholder": "0.00",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "stock_qty": {
        "type": "number",
        "label": "Stock Quantity",
        "required": true,
        "placeholder": "0",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Image URL",
        "required": false,
        "placeholder": "Enter image URL",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description",
        "validation": {},
        "options": [],
        "rows": 2,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "OG Title",
        "required": false,
        "placeholder": "Social media title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "OG Description",
        "required": false,
        "placeholder": "Social media description",
        "validation": {},
        "options": [],
        "rows": 2,
        "multiple": false
      },
      "og_image": {
        "type": "url",
        "label": "OG Image",
        "required": false,
        "placeholder": "https://example.com/og-image.jpg",
        "validation": {},
        "options": [],
        "multiple": false
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
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_featured": {
        "type": "checkbox",
        "label": "Featured",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_new": {
        "type": "checkbox",
        "label": "New Product",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "status": {
        "type": "select",
        "label": "Status",
        "required": true,
        "validation": {},
        "options": [
          {
            "value": "draft",
            "label": "Draft",
            "_id": "68ea39d43cfbfad7cbedb185"
          },
          {
            "value": "active",
            "label": "Active",
            "_id": "68ea39d43cfbfad7cbedb186"
          },
          {
            "value": "inactive",
            "label": "Inactive",
            "_id": "68ea39d43cfbfad7cbedb187"
          }
        ],
        "multiple": false
      }
    }
  },
  "hero_sliders": {
    "label": "Hero Sliders",
    "description": "Homepage hero section sliders with SEO optimization",
    "fields": {
      "title": {
        "type": "text",
        "label": "Title",
        "required": true,
        "placeholder": "Enter slider title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "description": {
        "type": "textarea",
        "label": "Description",
        "required": false,
        "placeholder": "Enter slider description",
        "validation": {},
        "options": [],
        "rows": 3,
        "multiple": false
      },
      "image_url": {
        "type": "file",
        "label": "Image URL",
        "required": true,
        "placeholder": "Enter image URL",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "link": {
        "type": "url",
        "label": "Link URL",
        "required": false,
        "placeholder": "/products or external URL",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "button_text": {
        "type": "text",
        "label": "Button Text",
        "required": false,
        "placeholder": "Shop Now",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "position": {
        "type": "number",
        "label": "Position",
        "required": true,
        "placeholder": "1",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "is_active": {
        "type": "checkbox",
        "label": "Active",
        "required": false,
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_title": {
        "type": "text",
        "label": "Meta Title",
        "required": false,
        "placeholder": "SEO title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "meta_description": {
        "type": "textarea",
        "label": "Meta Description",
        "required": false,
        "placeholder": "SEO description",
        "validation": {},
        "options": [],
        "rows": 2,
        "multiple": false
      },
      "meta_keywords": {
        "type": "text",
        "label": "Meta Keywords",
        "required": false,
        "placeholder": "keyword1, keyword2",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "og_title": {
        "type": "text",
        "label": "OG Title",
        "required": false,
        "placeholder": "Social media title",
        "validation": {},
        "options": [],
        "multiple": false
      },
      "og_description": {
        "type": "textarea",
        "label": "OG Description",
        "required": false,
        "placeholder": "Social media description",
        "validation": {},
        "options": [],
        "rows": 2,
        "multiple": false
      },
      "og_image": {
        "type": "url",
        "label": "OG Image",
        "required": false,
        "placeholder": "https://example.com/og-image.jpg",
        "validation": {},
        "options": [],
        "multiple": false
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
      "h1_tag": {
        "type": "text",
        "label": "H1 Tag",
        "required": false,
        "placeholder": "Main heading",
        "validation": {},
        "options": [],
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
