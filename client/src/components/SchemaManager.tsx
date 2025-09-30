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
}

interface CronStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  updateInterval: number;
  nextUpdate: string | null;
}

const SchemaManager: React.FC = () => {
  const [tables, setTables] = useState<SchemaTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [cronStatus, setCronStatus] = useState<CronStatus | null>(null);
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

  // Load cron status
  const loadCronStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cron/status');
      if (response.data.success) {
        setCronStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error loading cron status:', error);
    }
  };

  // Initialize schema
  const initializeSchema = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/schema/initialize');
      if (response.data.success) {
        setMessage('Schema initialized successfully');
        await loadTables();
      }
    } catch (error) {
      console.error('Error initializing schema:', error);
      setMessage('Error initializing schema');
    } finally {
      setLoading(false);
    }
  };

  // Generate schema file
  const generateSchema = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/schema/generate');
      if (response.data.success) {
        setMessage('Schema file generated successfully');
      }
    } catch (error) {
      console.error('Error generating schema:', error);
      setMessage('Error generating schema');
    } finally {
      setLoading(false);
    }
  };

  // Start cron job
  const startCron = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/cron/start');
      if (response.data.success) {
        setMessage('Cron job started');
        await loadCronStatus();
      }
    } catch (error) {
      console.error('Error starting cron:', error);
      setMessage('Error starting cron job');
    }
  };

  // Stop cron job
  const stopCron = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/cron/stop');
      if (response.data.success) {
        setMessage('Cron job stopped');
        await loadCronStatus();
      }
    } catch (error) {
      console.error('Error stopping cron:', error);
      setMessage('Error stopping cron job');
    }
  };

  // Force update
  const forceUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/cron/force-update');
      if (response.data.success) {
        setMessage('Schema force update completed');
        await loadCronStatus();
      }
    } catch (error) {
      console.error('Error force updating:', error);
      setMessage('Error force updating schema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
    loadCronStatus();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadFields(selectedTable);
    }
  }, [selectedTable]);

  return (
    <div className="schema-manager">
      <div className="schema-header">
        <h2>🔧 Schema Manager</h2>
        <p>Dynamic schema management and cron job control</p>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <div className="schema-controls">
        <div className="control-group">
          <h3>Schema Operations</h3>
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={initializeSchema}
              disabled={loading}
            >
              Initialize Schema
            </button>
            <button 
              className="btn btn-success" 
              onClick={generateSchema}
              disabled={loading}
            >
              Generate Schema File
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Cron Job Management</h3>
          <div className="button-group">
            <button 
              className="btn btn-info" 
              onClick={startCron}
              disabled={cronStatus?.isRunning}
            >
              Start Cron
            </button>
            <button 
              className="btn btn-warning" 
              onClick={stopCron}
              disabled={!cronStatus?.isRunning}
            >
              Stop Cron
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={forceUpdate}
              disabled={loading}
            >
              Force Update
            </button>
          </div>
        </div>
      </div>

      {cronStatus && (
        <div className="cron-status">
          <h3>Cron Job Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">Status:</span>
              <span className={`value ${cronStatus.isRunning ? 'running' : 'stopped'}`}>
                {cronStatus.isRunning ? '🟢 Running' : '🔴 Stopped'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Last Update:</span>
              <span className="value">
                {cronStatus.lastUpdate ? 
                  new Date(cronStatus.lastUpdate).toLocaleString() : 
                  'Never'
                }
              </span>
            </div>
            <div className="status-item">
              <span className="label">Next Update:</span>
              <span className="value">
                {cronStatus.nextUpdate ? 
                  new Date(cronStatus.nextUpdate).toLocaleString() : 
                  'N/A'
                }
              </span>
            </div>
            <div className="status-item">
              <span className="label">Interval:</span>
              <span className="value">
                {Math.round(cronStatus.updateInterval / 1000)}s
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="schema-tables">
        <h3>Schema Tables</h3>
        <div className="table-selector">
          <select 
            value={selectedTable} 
            onChange={(e) => setSelectedTable(e.target.value)}
            className="form-select"
          >
            <option value="">Select a table</option>
            {tables.map(table => (
              <option key={table._id} value={table.table_name}>
                {table.table_icon} {table.table_label}
              </option>
            ))}
          </select>
        </div>

        {selectedTable && (
          <div className="table-details">
            <h4>Table: {selectedTable}</h4>
            <div className="fields-list">
              {fields.map(field => (
                <div key={field._id} className="field-item">
                  <div className="field-info">
                    <span className="field-name">{field.field_name}</span>
                    <span className="field-type">{field.field_type}</span>
                    <span className="field-label">{field.field_label}</span>
                  </div>
                  <div className="field-meta">
                    <span className={`required ${field.is_required ? 'yes' : 'no'}`}>
                      {field.is_required ? 'Required' : 'Optional'}
                    </span>
                    <span className="order">Order: {field.field_order}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaManager;