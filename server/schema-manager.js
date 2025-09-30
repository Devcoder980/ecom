// ============================================
// SCHEMA MANAGER - META-DRIVEN CRUD SYSTEM
// Manages DATABASE_SCHEMA table and dynamic CRUD
// ============================================

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schema Definition Model
const SchemaDefinitionSchema = new mongoose.Schema({
  tableName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fields: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'email', 'tel', 'url', 'password', 'number', 'datetime-local', 'textarea', 'select', 'checkbox', 'file', 'relationship']
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    defaultValue: mongoose.Schema.Types.Mixed,
    validation: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
      pattern: String
    },
    options: [{
      value: String,
      label: String
    }],
    rows: Number,
    step: Number,
    accept: String,
    fileType: String,
    multiple: {
      type: Boolean,
      default: false
    },
    // Relationship configuration
    relationshipTable: String,
    relationshipDisplayField: String,
    relationshipSearchable: {
      type: Boolean,
      default: false
    },
    relationshipMultiple: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const SchemaDefinition = mongoose.model('SchemaDefinition', SchemaDefinitionSchema);

// Dynamic Model Creator
const createDynamicModel = (tableName, fields) => {
  const schemaFields = {};
  
  fields.forEach(field => {
    let fieldType = mongoose.Schema.Types.Mixed;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'password':
      case 'textarea':
        fieldType = String;
        break;
      case 'number':
        fieldType = Number;
        break;
      case 'checkbox':
        fieldType = Boolean;
        break;
      case 'datetime-local':
        fieldType = Date;
        break;
      case 'file':
        fieldType = field.multiple ? [String] : String;
        break;
      case 'select':
        fieldType = String;
        break;
    }
    
    schemaFields[field.name] = {
      type: fieldType,
      required: field.required || false,
      default: field.defaultValue
    };
  });
  
  // Add common fields
  schemaFields.createdAt = { type: Date, default: Date.now };
  schemaFields.updatedAt = { type: Date, default: Date.now };
  
  const dynamicSchema = new mongoose.Schema(schemaFields);
  return mongoose.model(tableName, dynamicSchema);
};

// Get all schema definitions
const getAllSchemas = async () => {
  try {
    const schemas = await SchemaDefinition.find({ isActive: true });
    return schemas;
  } catch (error) {
    throw new Error(`Failed to fetch schemas: ${error.message}`);
  }
};

// Get schema by table name
const getSchemaByTable = async (tableName) => {
  try {
    const schema = await SchemaDefinition.findOne({ tableName, isActive: true });
    if (!schema) {
      throw new Error(`Schema not found for table: ${tableName}`);
    }
    return schema;
  } catch (error) {
    throw new Error(`Failed to fetch schema: ${error.message}`);
  }
};

// Create new schema definition
const createSchema = async (schemaData) => {
  try {
    const schema = new SchemaDefinition(schemaData);
    await schema.save();
    
    // Create the actual MongoDB collection
    const Model = createDynamicModel(schema.tableName, schema.fields);
    
    return schema;
  } catch (error) {
    throw new Error(`Failed to create schema: ${error.message}`);
  }
};

// Update schema definition
const updateSchema = async (id, updateData) => {
  try {
    const schema = await SchemaDefinition.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!schema) {
      throw new Error('Schema not found');
    }
    
    // Recreate the model with updated fields
    const Model = createDynamicModel(schema.tableName, schema.fields);
    
    return schema;
  } catch (error) {
    throw new Error(`Failed to update schema: ${error.message}`);
  }
};

// Delete schema definition
const deleteSchema = async (id) => {
  try {
    const schema = await SchemaDefinition.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!schema) {
      throw new Error('Schema not found');
    }
    
    return schema;
  } catch (error) {
    throw new Error(`Failed to delete schema: ${error.message}`);
  }
};

// Generate database-schema.js file from database
const generateSchemaFile = async () => {
  try {
    const schemas = await getAllSchemas();
    
    const schemaObject = {};
    schemas.forEach(schema => {
      const fields = {};
      schema.fields.forEach(field => {
        fields[field.name] = {
          type: field.type,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
          defaultValue: field.defaultValue,
          validation: field.validation,
          options: field.options,
          rows: field.rows,
          min: field.validation?.min,
          max: field.validation?.max,
          step: field.step,
          accept: field.accept,
          fileType: field.fileType,
          multiple: field.multiple
        };
      });
      
      schemaObject[schema.tableName] = {
        label: schema.label,
        description: schema.description,
        fields
      };
    });
    
    const schemaContent = `// ============================================
// DYNAMIC DATABASE SCHEMA - AUTO GENERATED
// Generated on: ${new Date().toISOString()}
// Collections: ${Object.keys(schemaObject).length}
// ============================================

export const DATABASE_SCHEMA = ${JSON.stringify(schemaObject, null, 2)};

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
  email: (value) => value && /^[^@]+@[^@]+\\.[^@]+$/.test(value),
  url: (value) => value && /^https?:\\/\\/.+/.test(value)
};

export default DATABASE_SCHEMA;
`;

    // Write to file
    const schemaPath = path.join(__dirname, '../schema/database-schema.js');
    fs.writeFileSync(schemaPath, schemaContent);
    
    console.log(`✅ Schema file generated: ${schemaPath}`);
    return schemaObject;
  } catch (error) {
    throw new Error(`Failed to generate schema file: ${error.message}`);
  }
};

// Get dynamic model for CRUD operations
const getDynamicModel = async (tableName) => {
  try {
    const schema = await getSchemaByTable(tableName);
    return createDynamicModel(tableName, schema.fields);
  } catch (error) {
    throw new Error(`Failed to get dynamic model: ${error.message}`);
  }
};

export {
  SchemaDefinition,
  createDynamicModel,
  getAllSchemas,
  getSchemaByTable,
  createSchema,
  updateSchema,
  deleteSchema,
  generateSchemaFile,
  getDynamicModel
};
