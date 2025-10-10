// ============================================
// DYNAMIC DATABASE SCHEMA - AUTO GENERATED
// Generated on: 2025-10-07T02:36:24.461Z
// Collections: 1
// ============================================

export const DATABASE_SCHEMA = {
  "name1": {
    "label": "name",
    "description": "",
    "fields": {
      "name": {
        "type": "text",
        "label": "",
        "required": false,
        "placeholder": "",
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
