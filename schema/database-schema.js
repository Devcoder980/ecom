// ============================================
// DYNAMIC DATABASE SCHEMA - AUTO GENERATED
// Generated on: 2025-10-11T09:39:16.386Z
// Collections: 2
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
        "type": "url",
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
