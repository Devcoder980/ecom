import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SchemaField {
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
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

interface TableSchema {
  label: string;
  description: string;
  fields: { [key: string]: SchemaField };
}

const TableManager: React.FC = () => {
  const [tables, setTables] = useState<Array<{ name: string; label: string; description: string }>>([]);
  const [currentTable, setCurrentTable] = useState<string>('');
  const [schema, setSchema] = useState<TableSchema | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [relationData, setRelationData] = useState<{ [key: string]: any[] }>({});
  const [relationshipSearchTerms, setRelationshipSearchTerms] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (currentTable) {
      fetchSchema();
      fetchData();
    }
  }, [currentTable]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (schema) {
      // Preload relation data for all relationship fields in the current table
      Object.entries(schema.fields).forEach(([fieldName, field]) => {
        if (field.type === 'relationship' && field.relationshipTable) {
          fetchRelationData(field.relationshipTable, field.relationshipDisplayField);
        } else if (fieldName.endsWith('_id') && field.type === 'select') {
          const relationTable = fieldName.replace('_id', 's');
          fetchRelationData(relationTable);
        }
      });
    }
  }, [schema]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schemas');
      setTables(response.data);
      if (response.data.length > 0) {
        setCurrentTable(response.data[0].name);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tables');
    }
  };

  const fetchSchema = async () => {
    try {
      console.log(`📋 Fetching schema for table: ${currentTable}`);
      const response = await axios.get(`http://localhost:5000/api/schema/${currentTable}`);
      console.log(`✅ Schema fetched:`, response.data);

      // Convert fields array to object format if needed
      let schemaData = response.data;
      if (schemaData.fields && Array.isArray(schemaData.fields)) {
        const fieldsObject: { [key: string]: any } = {};
        schemaData.fields.forEach((field: any) => {
          fieldsObject[field.name] = field;
        });
        schemaData.fields = fieldsObject;
      }

      console.log(`📋 Processed schema:`, schemaData);
      setSchema(schemaData);
    } catch (err: any) {
      console.error(`❌ Failed to fetch schema for ${currentTable}:`, err);
      setError(err.response?.data?.error || 'Failed to fetch schema');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/${currentTable}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      setData(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelationData = async (relationTable: string, displayField?: string, searchTerm?: string) => {
    try {
      console.log(`🔗 Fetching relation data for ${relationTable}`, { displayField, searchTerm });
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const response = await axios.get(`http://localhost:5000/api/relationship/${relationTable}?limit=1000&displayField=${displayField || 'name'}${searchParam}`);
      console.log(`✅ Relation data fetched for ${relationTable}:`, response.data);
      setRelationData(prev => ({
        ...prev,
        [relationTable]: response.data.data || []
      }));
    } catch (err: any) {
      console.error(`❌ Failed to fetch relation data for ${relationTable}:`, err);
    }
  };

  const handleCreate = () => {
    setFormData({});
    setSelectedItem(null);
    setModalMode('create');
    setShowModal(true);

    // Preload relation data for all relationship fields
    if (schema) {
      Object.entries(schema.fields).forEach(([fieldName, field]) => {
        if (field.type === 'relationship' && field.relationshipTable) {
          fetchRelationData(field.relationshipTable, field.relationshipDisplayField);
        } else if (fieldName.endsWith('_id') && field.type === 'select') {
          const relationTable = fieldName.replace('_id', 's');
          fetchRelationData(relationTable);
        }
      });
    }
  };

  const handleEdit = (item: any) => {
    console.log('📝 Editing item:', item);
    setFormData(item);
    setSelectedItem(item);
    setModalMode('edit');
    setShowModal(true);

    // Preload relation data for all relationship fields
    if (schema) {
      Object.entries(schema.fields).forEach(([fieldName, field]) => {
        if (field.type === 'relationship' && field.relationshipTable) {
          fetchRelationData(field.relationshipTable, field.relationshipDisplayField);
        } else if (fieldName.endsWith('_id') && field.type === 'select') {
          const relationTable = fieldName.replace('_id', 's');
          fetchRelationData(relationTable);
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/${currentTable}/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete item');
    }
  };

  const handleFileUpload = async (fieldName: string, file: File) => {
    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      formData.append('fieldName', fieldName);

      // Add record ID if we're editing an existing record
      if (selectedItem && selectedItem._id) {
        formData.append('recordId', selectedItem._id);
      }

      const response = await axios.post(`http://localhost:5000/api/${currentTable}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fileUrl = response.data.uploadedFiles[fieldName];
        setFormData((prev: any) => ({
          ...prev,
          [fieldName]: fileUrl
        }));
        console.log(`📁 File uploaded for ${fieldName}:`, fileUrl);
        console.log(`📁 Updated formData:`, { ...formData, [fieldName]: fileUrl });

        // Refresh data to show updated record
        if (selectedItem && selectedItem._id) {
          console.log('🔄 Refreshing data after file upload...');
          fetchData();
        }
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError('Failed to upload file');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleMultipleFileUpload = async (fieldName: string, files: File[]) => {
    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append(fieldName, file);
      });
      formData.append('fieldName', fieldName);

      // Add record ID if we're editing an existing record
      if (selectedItem && selectedItem._id) {
        formData.append('recordId', selectedItem._id);
      }

      const response = await axios.post(`http://localhost:5000/api/${currentTable}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fileUrls = response.data.uploadedFiles[fieldName];
        setFormData((prev: any) => ({
          ...prev,
          [fieldName]: fileUrls
        }));
        console.log(`📁 Multiple files uploaded for ${fieldName}:`, fileUrls);
        console.log(`📁 Updated formData:`, { ...formData, [fieldName]: fileUrls });

        // Refresh data to show updated record
        if (selectedItem && selectedItem._id) {
          console.log('🔄 Refreshing data after multiple file upload...');
          fetchData();
        }
      }
    } catch (err) {
      console.error('Multiple file upload error:', err);
      setError('Failed to upload files');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        await axios.post(`http://localhost:5000/api/${currentTable}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.put(`http://localhost:5000/api/${currentTable}/${selectedItem?._id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      setShowModal(false);
      setFormData({});
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save item');
    }
  };

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    table.label.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(tableSearchTerm.toLowerCase())
  );

  const getDisplayName = (item: any, relationTable: string, customField?: string) => {
    // Use custom display field if specified
    if (customField && item[customField]) {
      return item[customField];
    }

    // Try different common name fields
    const nameFields = ['name', 'title', 'label', 'sku', 'email'];
    for (const field of nameFields) {
      if (item[field]) {
        return item[field];
      }
    }
    // Fallback to table name + ID
    return `${relationTable} #${item._id}`;
  };

  const renderFormField = (fieldName: string, field: SchemaField) => {
    const value = formData[fieldName] || '';
    const isUploading = uploadingFiles[fieldName];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'password':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            placeholder={field.placeholder}
            required={field.required}
            className="form-input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
            className="form-input"
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            required={field.required}
            className="form-input"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows || 3}
            className="form-textarea"
          />
        );

      case 'relationship':
        const relationTable = field.relationshipTable;

        console.log(`🔗 Rendering relationship field: ${fieldName}`, {
          field,
          relationTable,
          relationshipTable: field.relationshipTable,
          relationshipDisplayField: field.relationshipDisplayField
        });

        if (relationTable) {
          // Fetch relation data if not already loaded
          if (!relationData[relationTable]) {
            fetchRelationData(relationTable, field.relationshipDisplayField);
          }

          const searchKey = `${relationTable}_${fieldName}`;
          const currentSearchTerm = relationshipSearchTerms[searchKey] || '';

          return (
            <div className="space-y-2">
              {field.relationshipSearchable ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${field.label}...`}
                    className="form-input pr-10"
                    value={currentSearchTerm}
                    onChange={async (e) => {
                      const searchValue = e.target.value;
                      setRelationshipSearchTerms(prev => ({
                        ...prev,
                        [searchKey]: searchValue
                      }));

                      // Debounce search
                      if (searchValue.length > 2 || searchValue.length === 0) {
                        await fetchRelationData(relationTable, field.relationshipDisplayField, searchValue);
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              ) : null}

              <select
                value={value}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
                required={field.required}
                className="form-select"
                multiple={field.relationshipMultiple}
              >
                <option value="">Select {field.label}</option>
                {relationData[relationTable]?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {getDisplayName(item, relationTable, field.relationshipDisplayField)}
                  </option>
                ))}
              </select>

              {!relationData[relationTable] && (
                <div className="text-sm text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                  Loading {relationTable}...
                </div>
              )}

              {relationData[relationTable] && relationData[relationTable].length === 0 && (
                <div className="text-sm text-gray-500">
                  No {relationTable} found. {field.relationshipSearchable && currentSearchTerm && 'Try a different search term.'}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="text-sm text-gray-500">
            Please configure relationship table in schema
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            required={field.required}
            className="form-select"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{field.label}</span>
          </label>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple || false}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  if (field.multiple) {
                    handleMultipleFileUpload(fieldName, files);
                  } else {
                    handleFileUpload(fieldName, files[0]);
                  }
                }
              }}
              className="form-input"
            />
            {isUploading && (
              <div className="text-sm text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Uploading...
              </div>
            )}
            {value && (
              <div className="mt-2">
                {Array.isArray(value) ? (
                  <div className="grid grid-cols-2 gap-2">
                    {value.map((fileUrl, index) => (
                      <div key={index} className="border rounded p-2">
                        {field.fileType === 'image' ? (
                          <img src={`http://localhost:5000${fileUrl}`} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        ) : (
                          <div className="text-sm text-gray-600">File {index + 1}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded p-2">
                    {field.fileType === 'image' ? (
                      <img src={`http://localhost:5000${value}`} alt="Preview" className="w-full h-20 object-cover rounded" />
                    ) : (
                      <div className="text-sm text-gray-600">File uploaded</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, [fieldName]: e.target.value }))}
            placeholder={field.placeholder}
            className="form-input"
          />
        );
    }
  };

  if (loading && !data.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold leading-6 text-gray-900 sm:text-2xl sm:truncate">
            Table Manager
          </h2>
          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-600">
            <span>📊 {tables.length} tables</span>
            {currentTable && (
              <span>📋 {tables.find(t => t.name === currentTable)?.label || currentTable}</span>
            )}
          </div>
        </div>
        <div className="mt-2 flex md:mt-0 md:ml-4 space-x-2">
          <button onClick={handleCreate} className="btn btn-primary btn-sm">
            <span className="mr-1">➕</span>
            Add Record
          </button>
          {currentTable && (
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setCurrentTable(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="form-select form-select-sm"
                defaultValue=""
              >
                <option value="">Related</option>
                {tables.filter(table =>
                  table.name !== currentTable &&
                  (table.name.includes('product') || table.name.includes('order'))
                ).map(table => (
                  <option key={table.name} value={table.name}>
                    📋 {table.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Table Selector - Searchable Dropdown */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="max-w-md">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select Table
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search and select table..."
              value={tableSearchTerm}
              onChange={(e) => setTableSearchTerm(e.target.value)}
              className="form-input form-input-sm pl-8 pr-8 w-full"
            />
            {tableSearchTerm && (
              <button
                type="button"
                onClick={() => setTableSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {tableSearchTerm && (
            <div className="absolute max-w-2xl z-10 mt-1  bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredTables.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No tables found matching "{tableSearchTerm}"
                </div>
              ) : (
                filteredTables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => {
                      setCurrentTable(table.name);
                      setTableSearchTerm('');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <span className="mr-2">📋</span>
                    <div>
                      <div className="font-medium">{table.label}</div>
                      <div className="text-xs text-gray-500">{table.name}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Current Selection Display */}
          {currentTable && !tableSearchTerm && (
            <div className="mt-2 p-2 max-w-48 bg-gray-50 rounded border flex items-center justify-between">
              <div className="flex items-center ">
                <span className="mr-2">📋</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {tables.find(t => t.name === currentTable)?.label || currentTable}
                  </div>
                  <div className="text-xs text-gray-500">{currentTable}</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentTable('')}
                className="text-gray-400 hover:text-gray-600 text-sm"
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input form-input-sm pl-8"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="btn btn-secondary"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                {schema && Object.entries(schema.fields).slice(0, 5).map(([fieldName, field]) => (
                  <th key={fieldName}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id || index}>
                  {schema && Object.entries(schema.fields).slice(0, 5).map(([fieldName, field]) => (
                    <td key={fieldName} className="max-w-xs truncate">
                      {field.type === 'file' ? (
                        <span className="text-blue-600">📎 File</span>
                      ) : field.type === 'relationship' ? (
                        <span className="text-green-600">
                          🔗 {getDisplayName(
                            relationData[field.relationshipTable || '']?.find(rel => rel._id === item[fieldName]) || {},
                            field.relationshipTable || '',
                            field.relationshipDisplayField
                          )}
                        </span>
                      ) : fieldName.endsWith('_id') && field.type === 'select' ? (
                        <span className="text-green-600">
                          🔗 {getDisplayName(
                            relationData[fieldName.replace('_id', 's')]?.find(rel => rel._id === item[fieldName]) || {},
                            fieldName.replace('_id', 's')
                          )}
                        </span>
                      ) : (
                        String(item[fieldName] || '')
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-xs btn-secondary"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-xs btn-danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && schema && (
        <div className="modal-overlay">
          <div className="modal max-w-4xl overflow-y-auto max-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'create' ? 'Create New' : 'Edit'} {schema.label}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(schema.fields).map(([fieldName, field]) => (
                  <div key={fieldName} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFormField(fieldName, field)}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
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
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;