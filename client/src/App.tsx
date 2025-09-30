import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TableManager from './components/TableManager';
import SchemaManager from './components/SchemaManager';
import SchemaEditor from './components/SchemaEditor';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>E-commerce Admin</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/tables" className="nav-link">Manage Tables</Link>
            <Link to="/schema" className="nav-link">Schema Manager</Link>
            <Link to="/schema-editor" className="nav-link">Schema Editor</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TableManager />} />
            <Route path="/schema" element={<SchemaManager />} />
            <Route path="/schema-editor" element={<SchemaEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;