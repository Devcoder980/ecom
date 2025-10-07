import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TenantInfo from './TenantInfo';

interface DashboardStats {
  [key: string]: {
    total: number;
    active: number;
    inactive: number;
  };
}

interface Table {
  name: string;
  label: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available tables
        const tablesResponse = await axios.get('http://localhost:5000/api/schemas');
        const tablesData = Array.isArray(tablesResponse.data) ? tablesResponse.data : [];
        setTables(tablesData);

        const statsData: DashboardStats = {};

        for (const table of tablesData) {
          try {
            const response = await axios.get(`http://localhost:5000/api/${table.name}/stats`);
            statsData[table.name] = response.data;
          } catch (error) {
            console.error(`Error fetching stats for ${table.name}:`, error);
            statsData[table.name] = { total: 0, active: 0, inactive: 0 };
          }
        }
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setTables([]);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-500 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalRecords = Object.values(stats).reduce((sum, stat) => sum + stat.total, 0);
  const totalTables = tables.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to your E-commerce Admin Dashboard
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn btn-primary">
            <span className="mr-2">📊</span>
            Generate Report
          </button>
        </div>
      </div>

      {/* Tenant Information */}
      <TenantInfo />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Records</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalRecords.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🗂️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tables</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalTables}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Records</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Object.values(stats).reduce((sum, stat) => sum + stat.active, 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Growth Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">+12.5%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Overview */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Tables Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => {
              const tableStats = stats[table.name] || { total: 0, active: 0, inactive: 0 };
              return (
                <div key={table.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {table.label}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{table.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {tableStats.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tableStats.active} active
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Records</span>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {tableStats.active}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tableStats.inactive}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-lg">➕</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Add New Record</div>
                <div className="text-xs text-gray-500">Create a new entry</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-lg">⚙️</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">Manage Schema</div>
                <div className="text-xs text-gray-500">Configure tables</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">View Reports</div>
                <div className="text-xs text-gray-500">Analytics & insights</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;