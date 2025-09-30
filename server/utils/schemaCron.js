// ============================================
// SCHEMA CRON JOB UTILITY
// Automatically update schema files
// ============================================

import fs from 'fs';
import path from 'path';
import axios from 'axios';

const SCHEMA_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SCHEMA_SERVER_URL = process.env.SCHEMA_SERVER_URL || 'http://localhost:5000';

class SchemaCronJob {
  constructor() {
    this.isRunning = false;
    this.lastUpdate = null;
    this.updateInterval = null;
  }

  // Start the cron job
  start() {
    if (this.isRunning) {
      console.log('Schema cron job is already running');
      return;
    }

    console.log('🔄 Starting schema cron job...');
    this.isRunning = true;
    
    // Run immediately
    this.updateSchema();
    
    // Set up interval
    this.updateInterval = setInterval(() => {
      this.updateSchema();
    }, SCHEMA_UPDATE_INTERVAL);
    
    console.log(`✅ Schema cron job started (interval: ${SCHEMA_UPDATE_INTERVAL / 1000}s)`);
  }

  // Stop the cron job
  stop() {
    if (!this.isRunning) {
      console.log('Schema cron job is not running');
      return;
    }

    console.log('🛑 Stopping schema cron job...');
    this.isRunning = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('✅ Schema cron job stopped');
  }

  // Update schema files
  async updateSchema() {
    try {
      console.log('🔄 Updating schema files...');
      
      // Generate new schema
      const response = await axios.post(`${SCHEMA_SERVER_URL}/api/schema/generate`);
      
      if (response.data.success) {
        this.lastUpdate = new Date();
        console.log(`✅ Schema updated successfully at ${this.lastUpdate.toISOString()}`);
        console.log(`📁 Schema file: ${response.data.filePath}`);
        console.log(`📊 Tables count: ${response.data.tablesCount}`);
        
        // Copy to client
        await this.copySchemaToClient(response.data.filePath);
        
        // Log update
        this.logUpdate(response.data);
      } else {
        console.error('❌ Schema update failed:', response.data.error);
      }
    } catch (error) {
      console.error('❌ Schema cron job error:', error.message);
    }
  }

  // Copy schema to client
  async copySchemaToClient(schemaPath) {
    try {
      const clientSchemaPath = path.join(process.cwd(), 'client', 'src', 'types', 'database-schema.js');
      
      // Ensure directory exists
      const clientDir = path.dirname(clientSchemaPath);
      if (!fs.existsSync(clientDir)) {
        fs.mkdirSync(clientDir, { recursive: true });
      }
      
      // Copy file
      fs.copyFileSync(schemaPath, clientSchemaPath);
      console.log(`📋 Schema copied to client: ${clientSchemaPath}`);
    } catch (error) {
      console.error('❌ Error copying schema to client:', error.message);
    }
  }

  // Log update information
  logUpdate(data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'schema_update',
      filePath: data.filePath,
      tablesCount: data.tablesCount,
      success: true
    };
    
    // Write to log file
    const logPath = path.join(process.cwd(), 'logs', 'schema-updates.log');
    const logDir = path.dirname(logPath);
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  }

  // Get cron job status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      updateInterval: SCHEMA_UPDATE_INTERVAL,
      nextUpdate: this.lastUpdate ? 
        new Date(this.lastUpdate.getTime() + SCHEMA_UPDATE_INTERVAL) : 
        null
    };
  }

  // Force update
  async forceUpdate() {
    console.log('🔄 Force updating schema...');
    await this.updateSchema();
  }
}

// Create singleton instance
const schemaCron = new SchemaCronJob();

export default schemaCron;

// Auto-start if not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Start after a short delay to ensure server is ready
  setTimeout(() => {
    schemaCron.start();
  }, 10000); // 10 seconds delay
}