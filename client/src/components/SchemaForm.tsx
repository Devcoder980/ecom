import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FieldDefinition, TableDefinition } from '../../types/schema';
import FileUpload from './FileUpload';
import MultipleFileUpload from './MultipleFileUpload';

interface SchemaFormProps {
  tableName: string;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  tableName,
  initialData = {},
  onSubmit,
  onCancel,
  mode
}) => {
  const [schema, setSchema] = useState<TableDefinition | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchema();
  }, [tableName]);

  useEffect(() => {
    if (schema && initialData) {
      // Set default values for create mode
      const defaultData: Record<string, any> = {};
      schema.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultData[field.name] = field.defaultValue;
        }
      });
      setFormData({ ...defaultData, ...initialData });
    }
  }, [schema, initialData]);

  const fetchSchema = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schema/${tableName}`);
      setSchema(response.data.data);
    } catch (error) {
      console.error('Error fetching schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateField = (field: FieldDefinition, value: any): string => {
    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`;
    }

    // Skip validation if field is not provided and not required
    if (value === undefined || value === null || value === '') {
      return '';
    }

    // Type validation
    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return `${field.label} must be a valid email`;
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return `${field.label} must be a valid URL`;
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          return `${field.label} must be a number`;
        } else {
          const numValue = Number(value);
          if (field.validation?.min !== undefined && numValue < field.validation.min) {
            return `${field.label} must be at least ${field.validation.min}`;
          }
          if (field.validation?.max !== undefined && numValue > field.validation.max) {
            return `${field.label} must be at most ${field.validation.max}`;
          }
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          return `${field.label} must be true or false`;
        }
        break;
    }

    // Pattern validation
    if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
      return `${field.label} format is invalid`;
    }

    return '';
  };

  const validateForm = (): boolean => {
    if (!schema) return false;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    schema.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FieldDefinition) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    const getInputType = () => {
      if (field.ui?.inputType) return field.ui.inputType;
      
      switch (field.type) {
        case 'email': return 'email';
        case 'url': return 'url';
        case 'number': return 'number';
        case 'date': return 'datetime-local';
        case 'boolean': return 'checkbox';
        case 'text': return 'textarea';
        default: return 'text';
      }
    };

    const inputType = getInputType();

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          <select
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <div className="field-error">{error}</div>}
        </div>
      );
    }

    if (field.type === 'boolean') {
      return (
        <div key={field.name} className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              required={field.required}
            />
            {field.label}
          </label>
          {error && <div className="field-error">{error}</div>}
        </div>
      );
    }

    if (field.type === 'file') {
      return (
        <div key={field.name} className="form-group">
          <FileUpload
            fieldName={field.name}
            value={value}
            onChange={(fileUrl) => handleInputChange(field.name, fileUrl)}
            accept={field.ui?.accept}
            multiple={field.ui?.multiple}
            label={field.label}
            required={field.required}
          />
          {error && <div className="field-error">{error}</div>}
        </div>
      );
    }

    if (field.type === 'files') {
      return (
        <div key={field.name} className="form-group">
          <MultipleFileUpload
            fieldName={field.name}
            value={Array.isArray(value) ? value : []}
            onChange={(files) => handleInputChange(field.name, files)}
            accept={field.ui?.accept}
            maxFiles={field.ui?.maxFiles || 10}
            label={field.label}
            required={field.required}
          />
          {error && <div className="field-error">{error}</div>}
        </div>
      );
    }

    if (inputType === 'textarea') {
      return (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.ui?.rows || 3}
            cols={field.ui?.cols}
          />
          {error && <div className="field-error">{error}</div>}
        </div>
      );
    }

    return (
      <div key={field.name} className="form-group">
        <label htmlFor={field.name}>{field.label}</label>
        <input
          id={field.name}
          type={inputType}
          value={value}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          step={field.ui?.step}
          min={field.validation?.min}
          max={field.validation?.max}
          multiple={field.ui?.multiple}
          accept={field.ui?.accept}
        />
        {error && <div className="field-error">{error}</div>}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (!schema) {
    return <div className="error">Schema not found for {tableName}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="schema-form">
      <div className="form-header">
        <h3>{mode === 'create' ? 'Create New' : 'Edit'} {schema.label}</h3>
        <p>{schema.description}</p>
      </div>

      <div className="form-fields">
        {schema.fields.map(field => renderField(field))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </div>
    </form>
  );
};

export default SchemaForm;