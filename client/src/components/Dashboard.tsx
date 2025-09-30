import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface TableStats {
  total: number;
  active: number;
  inactive: number;
}

interface DashboardStats {
  [key: string]: TableStats;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  const tables = [
    { name: 'users', label: 'Users', description: 'Manage user accounts and permissions' },
    { name: 'categories', label: 'Categories', description: 'Product categories and SEO settings' },
    { name: 'products', label: 'Products', description: 'Product catalog with variants and SEO' },
    { name: 'customers', label: 'Customers', description: 'Customer information and profiles' },
    { name: 'orders', label: 'Orders', description: 'Order management and tracking' },
    { name: 'blog_posts', label: 'Blog Posts', description: 'Content management and SEO' },
    { name: 'cms_pages', label: 'CMS Pages', description: 'Static pages and content' },
    { name: 'reviews', label: 'Reviews', description: 'Customer reviews and testimonials' },
    { name: 'inquiries', label: 'Inquiries', description: 'Customer inquiries and support' },
    { name: 'newsletter_subscribers', label: 'Newsletter', description: 'Email subscribers' },
    { name: 'coupons', label: 'Coupons', description: 'Discount codes and promotions' },
    { name: 'banners', label: 'Banners', description: 'Homepage banners and sliders' },
    { name: 'menus', label: 'Menus', description: 'Navigation menu management' },
    { name: 'media', label: 'Media', description: 'File and image management' },
    { name: 'settings', label: 'Settings', description: 'System configuration' },
    { name: 'company_info', label: 'Company Info', description: 'Business information' }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData: DashboardStats = {};
        
        for (const table of tables) {
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
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getTotalStats = () => {
    const totals = Object.values(stats).reduce(
      (acc, stat) => ({
        total: acc.total + stat.total,
        active: acc.active + stat.active,
        inactive: acc.inactive + stat.inactive
      }),
      { total: 0, active: 0, inactive: 0 }
    );
    return totals;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Records</h3>
          <div className="number">{totalStats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Active Records</h3>
          <div className="number">{totalStats.active}</div>
        </div>
        <div className="stat-card">
          <h3>Inactive Records</h3>
          <div className="number">{totalStats.inactive}</div>
        </div>
        <div className="stat-card">
          <h3>Total Tables</h3>
          <div className="number">{tables.length}</div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Manage Tables</h2>
      <div className="tables-grid">
        {tables.map((table) => {
          const tableStats = stats[table.name] || { total: 0, active: 0, inactive: 0 };
          
          return (
            <div key={table.name} className="table-card">
              <h3>{table.label}</h3>
              <p>{table.description}</p>
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                <div>Total: {tableStats.total}</div>
                <div>Active: {tableStats.active}</div>
                <div>Inactive: {tableStats.inactive}</div>
              </div>
              <div className="table-actions">
                <Link 
                  to={`/tables?table=${table.name}`} 
                  className="btn btn-primary"
                >
                  Manage
                </Link>
                <Link 
                  to={`/tables?table=${table.name}&action=create`} 
                  className="btn btn-success"
                >
                  Add New
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;