import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SchemaField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: any;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  fileType?: string;
  multiple?: boolean;
  // Relationship configuration
  relationshipTable?: string;
  relationshipDisplayField?: string;
  relationshipSearchable?: boolean;
  relationshipMultiple?: boolean;
}

interface SchemaDefinition {
  _id?: string;
  tableName?: string;
  name?: string;
  label: string;
  description: string;
  fields: SchemaField[];
  fieldCount?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const fieldTypes = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'password', label: 'Password', icon: '🔒' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'tel', label: 'Phone', icon: '📞' },
  { value: 'url', label: 'URL', icon: '🔗' },
  { value: 'textarea', label: 'Textarea', icon: '📄' },
  { value: 'select', label: 'Select', icon: '📋' },
  { value: 'relationship', label: 'Relationship', icon: '🔗' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'radio', label: 'Radio', icon: '🔘' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'datetime-local', label: 'DateTime', icon: '⏰' },
  { value: 'time', label: 'Time', icon: '🕐' },
  { value: 'file', label: 'File Upload', icon: '📁' },
  { value: 'color', label: 'Color', icon: '🎨' },
  { value: 'range', label: 'Range', icon: '🎚️' }
];

const SchemaManager: React.FC = () => {
  const [schemas, setSchemas] = useState<SchemaDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingSchema, setEditingSchema] = useState<string | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<SchemaDefinition | null>(null);
  const [formData, setFormData] = useState<SchemaDefinition>({
    label: '',
    description: '',
    fields: [],
    isActive: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [availableTables, setAvailableTables] = useState<Array<{name: string; label: string}>>([]);
  const [allTables, setAllTables] = useState<Array<{name: string; label: string}>>([]);

  useEffect(() => {
    fetchSchemas();
    fetchAvailableTables();
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const response = await axios.get('/api/schemas');
      const tables = response.data.map((schema: any) => ({
        name: schema.name || schema.tableName,
        label: schema.label
      }));
      setAvailableTables(tables);
      setAllTables(tables);
    } catch (err: any) {
      console.error('Failed to fetch available tables:', err);
    }
  };

  const fetchSchemas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schemas');
      setSchemas(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch schemas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      label: '',
      description: '',
      fields: [],
      isActive: true
    });
    setSelectedSchema(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = async (schema: SchemaDefinition) => {
    try {
      setEditingSchema(schema._id!);
      const tableName = schema.name || schema.tableName;
      if (!tableName) {
        throw new Error('Table name is undefined');
      }
      const response = await axios.get(`/api/schema/${tableName}`);
      const fullSchema = response.data;
      setFormData(fullSchema);
      setSelectedSchema(fullSchema);
      setModalMode('edit');
      setShowModal(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch schema details');
    } finally {
      setEditingSchema(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schema?')) {
      try {
        await axios.delete(`/api/schema/${id}`);
        await fetchSchemas();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete schema');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post('/api/schema', formData);
      } else {
        await axios.put(`/api/schema/${selectedSchema?._id}`, formData);
      }
      setShowModal(false);
      await fetchSchemas();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save schema');
    }
  };

  const addField = () => {
    setFormData((prev: any) => ({
      ...prev,
      fields: [...(prev.fields || []), {
        name: '', 
        type: 'text', 
        label: '', 
        required: false, 
        placeholder: '', 
        multiple: false,
        relationshipTable: '',
        relationshipDisplayField: '',
        relationshipSearchable: false,
        relationshipMultiple: false
      }]
    }));
  };

  const removeField = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      fields: (prev.fields || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const updateField = (index: number, field: Partial<SchemaField>) => {
    setFormData((prev: any) => ({
      ...prev,
      fields: (prev.fields || []).map((f: any, i: number) => i === index ? { ...f, ...field } : f)
    }));
  };

  const filteredSchemas = schemas.filter(schema => {
    const matchesSearch = (schema.name || schema.tableName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schema.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && schema.isActive) ||
      (statusFilter === 'inactive' && !schema.isActive);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schemas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Schema Management</h1>
          <p className="text-gray-600">Manage database schemas and field definitions</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
            <span>📊 {schemas.length} schemas available</span>
            {(searchTerm || statusFilter !== 'all') && (
              <span>🔍 Showing {filteredSchemas.length} filtered results</span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              ✕
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Schemas</h2>
              <button
                onClick={handleCreate}
                className="btn btn-primary"
              >
                <span className="mr-2">➕</span>
                Create New Schema
              </button>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                {/* Search Input */}
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search schemas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10 pr-10"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="form-select max-w-xs"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  🔄 Clear Filters
                </button>
              </div>
            </div>
            
            {(searchTerm || statusFilter !== 'all') && (
              <div className="mt-2 text-sm text-gray-500">
                {filteredSchemas.length === 0 ? (
                  <span>
                    No schemas found
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                  </span>
                ) : (
                  <span>
                    Showing {filteredSchemas.length} of {schemas.length} schemas
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchemas && filteredSchemas.length > 0 ? filteredSchemas.map((schema) => (
                  <tr key={schema._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{schema.name || schema.tableName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{schema.label}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{schema.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{schema.fieldCount || 0}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        schema.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {schema.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(schema)}
                          disabled={editingSchema === schema._id}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          title="Edit schema"
                        >
                          {editingSchema === schema._id ? '⏳' : '✏️'}
                        </button>
                        <button
                          onClick={() => handleDelete(schema._id!)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete schema"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      No schemas found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'create' ? 'Create New Schema' : 'Edit Schema'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Table Name
                      </label>
                      <input
                        type="text"
                        value={formData.tableName || formData.name || ''}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, tableName: e.target.value, name: e.target.value }))}
                        placeholder="e.g., products"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={formData.label}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Products"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this schema..."
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Fields
                      </label>
                      <button
                        type="button"
                        onClick={addField}
                        className="btn btn-secondary btn-sm"
                      >
                        <span className="mr-2">➕</span>
                        Add Field
                      </button>
                    </div>
                 
                    {formData.fields && formData.fields.length > 0 ? (
                      <div className="overflow-x-auto text-nowrap">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Field Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placeholder</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accept</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rel. Table</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Field</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Searchable</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiple</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 Fields">
                            {formData.fields.map((field, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    placeholder="field_name"
                                    value={field.name}
                                    onChange={(e) => updateField(index, { name: e.target.value })}
                                    className="form-input  text-sm min-w-48"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <select
                                    value={field.type}
                                    onChange={(e) => updateField(index, { type: e.target.value })}
                                    className="form-select min-w-32 text-sm"
                                  >
                                    {fieldTypes.map(type => (
                                      <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    placeholder="Display Label"
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                    className="form-input text-sm w-full"
                                  />
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateField(index, { required: e.target.checked })}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={field.placeholder || ''}
                                    onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                    className="form-input text-sm w-full"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    placeholder="Default"
                                    value={field.defaultValue || ''}
                                    onChange={(e) => updateField(index, { defaultValue: e.target.value })}
                                    className="form-input text-sm w-full"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    placeholder="image/*, .pdf"
                                    value={field.accept || ''}
                                    onChange={(e) => updateField(index, { accept: e.target.value })}
                                    className="form-input text-sm w-full"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  {field.type === 'relationship' ? (
                                    <select
                                      value={field.relationshipTable || ''}
                                      onChange={(e) => updateField(index, { relationshipTable: e.target.value })}
                                      className="form-select text-sm w-full"
                                    >
                                      <option value="">Select Table</option>
                                      {allTables.map(table => (
                                        <option key={table.name} value={table.name}>
                                          {table.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  {field.type === 'relationship' ? (
                                    <input
                                      type="text"
                                      placeholder="name, title, etc."
                                      value={field.relationshipDisplayField || ''}
                                      onChange={(e) => updateField(index, { relationshipDisplayField: e.target.value })}
                                      className="form-input text-sm w-full"
                                    />
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {field.type === 'relationship' ? (
                                    <input
                                      type="checkbox"
                                      checked={field.relationshipSearchable || false}
                                      onChange={(e) => updateField(index, { relationshipSearchable: e.target.checked })}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {field.type === 'file' ? (
                                    <input
                                      type="checkbox"
                                      checked={field.multiple || false}
                                      onChange={(e) => updateField(index, { multiple: e.target.checked })}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                  ) : field.type === 'relationship' ? (
                                    <input
                                      type="checkbox"
                                      checked={field.relationshipMultiple || false}
                                      onChange={(e) => updateField(index, { relationshipMultiple: e.target.checked })}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeField(index)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                    title="Remove field"
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📝</div>
                        <p>No fields added yet. Click "Add Field" to get started.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {modalMode === 'create' ? 'Create Schema' : 'Update Schema'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaManager;