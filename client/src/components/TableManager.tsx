import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SchemaForm from './SchemaForm';
import { DATABASE_SCHEMA } from '../../types/schema';

interface TableData {
  _id: string;
  [key: string]: any;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

const TableManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTable, setCurrentTable] = useState(searchParams.get('table') || 'users');
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ current: 1, pages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<TableData | null>(null);

  const tables = Object.values(DATABASE_SCHEMA);

  useEffect(() => {
    const table = searchParams.get('table');
    const action = searchParams.get('action');
    
    if (table) {
      setCurrentTable(table);
    }
    
    if (action === 'create') {
      setModalMode('create');
      setShowModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [currentTable, pagination.current, searchTerm, sortBy, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/${currentTable}`, {
        params: {
          page: pagination.current,
          limit: 10,
          search: searchTerm,
          sortBy,
          sortOrder
        }
      });
      
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (tableName: string) => {
    setCurrentTable(tableName);
    setSearchParams({ table: tableName });
    setPagination({ current: 1, pages: 1, total: 0 });
    setSearchTerm('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: TableData) => {
    setModalMode('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/${currentTable}/${id}`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete item');
    }
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      if (modalMode === 'create') {
        await axios.post(`http://localhost:5000/api/${currentTable}`, formData);
      } else {
        await axios.put(`http://localhost:5000/api/${currentTable}/${selectedItem?._id}`, formData);
      }
      
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save item');
    }
  };

  const getTableColumns = () => {
    if (data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).filter(key => 
      key !== '_id' && 
      typeof sample[key] !== 'object' &&
      !Array.isArray(sample[key])
    ).slice(0, 5); // Show first 5 columns
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  };

  return (
    <div className="table-manager">
      <div className="table-selector">
        <select 
          value={currentTable} 
          onChange={(e) => handleTableChange(e.target.value)}
        >
          {tables.map(table => (
            <option key={table.name} value={table.name}>
              {table.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-header">
        <h2>{tables.find(t => t.name === currentTable)?.label} Management</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          Add New
        </button>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
      </div>

      <div className="data-table">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  {getTableColumns().map(column => (
                    <th 
                      key={column}
                      onClick={() => handleSort(column)}
                      style={{ cursor: 'pointer' }}
                    >
                      {column} {sortBy === column && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    {getTableColumns().map(column => (
                      <td key={column}>{formatValue(item[column])}</td>
                    ))}
                    <td className="table-actions-cell">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.current} of {pagination.pages} 
                ({pagination.total} total)
              </span>
              <button 
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current === pagination.pages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <SchemaForm
              tableName={currentTable}
              initialData={selectedItem || {}}
              onSubmit={handleSubmit}
              onCancel={() => setShowModal(false)}
              mode={modalMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;