import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SchemaTable {
  _id: string;
  table_name: string;
  table_label: string;
  table_description: string;
  table_icon: string;
  table_group: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SchemaField {
  _id: string;
  table_name: string;
  field_name: string;
  field_type: string;
  field_label: string;
  is_required: boolean;
  field_order: number;
  is_active: boolean;
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
    input_type?: string;
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
}

const SchemaEditor: React.FC = () => {
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [editingTable, setEditingTable] = useState<SchemaTable | null>(null);
  const [editingField, setEditingField] = useState<SchemaField | null>(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Load tables
  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/schema/tables');
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load fields for selected table
  const loadFields = async (tableName: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/schema/tables/${tableName}/fields`);
      if (response.data.success) {
        setFields(response.data.data);
      }
    } catch (error) {
      console.error('Error loading fields:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new table
  const createTable = async (tableData: Partial<SchemaTable>) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/schema/tables', tableData);
      if (response.data.success) {
        setMessage('Table created successfully');
        await loadTables();
        setShowTableForm(false);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error creating table');
    } finally {
      setLoading(false);
    }
  };

  // Update table
  const updateTable = async (id: string, tableData: Partial<SchemaTable>) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/schema/tables/${id}`, tableData);
      if (response.data.success) {
        setMessage('Table updated successfully');
        await loadTables();
        setEditingTable(null);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error updating table');
    } finally {
      setLoading(false);
    }
  };

  // Delete table
  const deleteTable = async (id: string, tableName: string) => {
    if (!window.confirm('Are you sure you want to delete this table and all its fields?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/schema/tables/${id}`, {
        data: { table_name: tableName }
      });
      if (response.data.success) {
        setMessage('Table deleted successfully');
        await loadTables();
        if (selectedTable === tableName) {
          setSelectedTable('');
          setFields([]);
        }
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error deleting table');
    } finally {
      setLoading(false);
    }
  };

  // Create new field
  const createField = async (fieldData: Partial<SchemaField>) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/schema/fields', fieldData);
      if (response.data.success) {
        setMessage('Field created successfully');
        await loadFields(selectedTable);
        setShowFieldForm(false);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error creating field');
    } finally {
      setLoading(false);
    }
  };

  // Update field
  const updateField = async (id: string, fieldData: Partial<SchemaField>) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/schema/fields/${id}`, fieldData);
      if (response.data.success) {
        setMessage('Field updated successfully');
        await loadFields(selectedTable);
        setEditingField(null);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error updating field');
    } finally {
      setLoading(false);
    }
  };

  // Delete field
  const deleteField = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this field?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:5000/api/schema/fields/${id}`);
      if (response.data.success) {
        setMessage('Field deleted successfully');
        await loadFields(selectedTable);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error deleting field');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadFields(selectedTable);
    }
  }, [selectedTable]);

  return (
    <div className="schema-editor">
      <div className="schema-editor-header">
        <h2>🔧 Schema Editor</h2>
        <p>Create, edit, and manage database schemas dynamically</p>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="schema-editor-content">
        {/* Tables Section */}
        <div className="tables-section">
          <div className="section-header">
            <h3>📋 Tables</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowTableForm(true)}
            >
              + Add Table
            </button>
          </div>

          <div className="tables-list">
            {tables.map(table => (
              <div key={table._id} className="table-item">
                <div className="table-info">
                  <span className="table-icon">{table.table_icon}</span>
                  <div className="table-details">
                    <h4>{table.table_label}</h4>
                    <p>{table.table_description}</p>
                    <span className="table-name">{table.table_name}</span>
                  </div>
                </div>
                <div className="table-actions">
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => setSelectedTable(table.table_name)}
                  >
                    View Fields
                  </button>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => setEditingTable(table)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTable(table._id, table.table_name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fields Section */}
        {selectedTable && (
          <div className="fields-section">
            <div className="section-header">
              <h3>🔧 Fields for {selectedTable}</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowFieldForm(true)}
              >
                + Add Field
              </button>
            </div>

            <div className="fields-list">
              {fields.map(field => (
                <div key={field._id} className="field-item">
                  <div className="field-info">
                    <span className="field-name">{field.field_name}</span>
                    <span className="field-type">{field.field_type}</span>
                    <span className="field-label">{field.field_label}</span>
                    <span className={`required ${field.is_required ? 'yes' : 'no'}`}>
                      {field.is_required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <div className="field-actions">
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => setEditingField(field)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteField(field._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table Form Modal */}
      {showTableForm && (
        <TableForm
          table={editingTable}
          onSubmit={editingTable ? 
            (data) => updateTable(editingTable._id, data) : 
            createTable
          }
          onClose={() => {
            setShowTableForm(false);
            setEditingTable(null);
          }}
        />
      )}

      {/* Field Form Modal */}
      {showFieldForm && (
        <FieldForm
          field={editingField}
          tableName={selectedTable}
          onSubmit={editingField ? 
            (data) => updateField(editingField._id, data) : 
            createField
          }
          onClose={() => {
            setShowFieldForm(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
};

// Table Form Component
const TableForm: React.FC<{
  table?: SchemaTable | null;
  onSubmit: (data: Partial<SchemaTable>) => void;
  onClose: () => void;
}> = ({ table, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    table_name: table?.table_name || '',
    table_label: table?.table_label || '',
    table_description: table?.table_description || '',
    table_icon: table?.table_icon || '📋',
    table_group: table?.table_group || 'general',
    is_active: table?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{table ? 'Edit Table' : 'Create Table'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Table Name</label>
            <input
              type="text"
              value={formData.table_name}
              onChange={(e) => setFormData({...formData, table_name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Table Label</label>
            <input
              type="text"
              value={formData.table_label}
              onChange={(e) => setFormData({...formData, table_label: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.table_description}
              onChange={(e) => setFormData({...formData, table_description: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Icon</label>
            <input
              type="text"
              value={formData.table_icon}
              onChange={(e) => setFormData({...formData, table_icon: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Group</label>
            <select
              value={formData.table_group}
              onChange={(e) => setFormData({...formData, table_group: e.target.value})}
            >
              <option value="general">General</option>
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="content">Content</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              Active
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {table ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Field Form Component
const FieldForm: React.FC<{
  field?: SchemaField | null;
  tableName: string;
  onSubmit: (data: Partial<SchemaField>) => void;
  onClose: () => void;
}> = ({ field, tableName, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    table_name: tableName,
    field_name: field?.field_name || '',
    field_type: field?.field_type || 'string',
    field_label: field?.field_label || '',
    is_required: field?.is_required ?? false,
    field_order: field?.field_order || 1,
    is_active: field?.is_active ?? true,
    default_value: field?.default_value || '',
    placeholder: field?.placeholder || '',
    is_seo_field: field?.is_seo_field ?? false,
    is_searchable: field?.is_searchable ?? false,
    is_sortable: field?.is_sortable ?? false,
    is_display_field: field?.is_display_field ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{field ? 'Edit Field' : 'Create Field'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Field Name</label>
            <input
              type="text"
              value={formData.field_name}
              onChange={(e) => setFormData({...formData, field_name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Field Type</label>
            <select
              value={formData.field_type}
              onChange={(e) => setFormData({...formData, field_type: e.target.value})}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="multiselect">Multiselect</option>
              <option value="file">File</option>
              <option value="files">Files</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div className="form-group">
            <label>Field Label</label>
            <input
              type="text"
              value={formData.field_label}
              onChange={(e) => setFormData({...formData, field_label: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Field Order</label>
            <input
              type="number"
              value={formData.field_order}
              onChange={(e) => setFormData({...formData, field_order: parseInt(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Placeholder</label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Default Value</label>
            <input
              type="text"
              value={formData.default_value}
              onChange={(e) => setFormData({...formData, default_value: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_required}
                onChange={(e) => setFormData({...formData, is_required: e.target.checked})}
              />
              Required
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_seo_field}
                onChange={(e) => setFormData({...formData, is_seo_field: e.target.checked})}
              />
              SEO Field
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_searchable}
                onChange={(e) => setFormData({...formData, is_searchable: e.target.checked})}
              />
              Searchable
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_sortable}
                onChange={(e) => setFormData({...formData, is_sortable: e.target.checked})}
              />
              Sortable
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_display_field}
                onChange={(e) => setFormData({...formData, is_display_field: e.target.checked})}
              />
              Display Field
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {field ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemaEditor;