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