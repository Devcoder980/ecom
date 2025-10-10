// ============================================
// TEST SUBDOMAIN FUNCTIONALITY
// Quick test to verify subdomain-based database switching
// ============================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Test subdomain configurations
const testSubdomains = ['default', 'ecom1', 'ecom2'];

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const testSubdomainFunctionality = async () => {
  try {
    console.log('🧪 Testing subdomain functionality...\n');
    
    // Test database name generation
    const getDatabaseName = (subdomain) => {
      if (!subdomain || subdomain === 'www' || subdomain === 'localhost' || subdomain === '127.0.0.1') {
        return 'ecommerce';
      }
      return `ecommerce_${subdomain}`;
    };
    
    console.log('📋 Database name generation:');
    testSubdomains.forEach(subdomain => {
      const dbName = getDatabaseName(subdomain);
      console.log(`  ${subdomain} → ${dbName}`);
    });
    
    console.log('\n🔗 Testing database connections:');
    
    for (const subdomain of testSubdomains) {
      const dbName = getDatabaseName(subdomain);
      const connectionUri = `${MONGODB_URI}/${dbName}`;
      
      try {
        // Connect to subdomain-specific database
        await mongoose.connect(connectionUri);
        console.log(`  ✅ Connected to: ${dbName}`);
        
        // Test creating a simple collection
        const testCollection = mongoose.connection.db.collection('test');
        await testCollection.insertOne({ 
          subdomain: subdomain, 
          timestamp: new Date(),
          message: `Test from ${subdomain}`
        });
        console.log(`  📝 Created test document in: ${dbName}`);
        
        // Disconnect
        await mongoose.disconnect();
        console.log(`  🔌 Disconnected from: ${dbName}\n`);
        
      } catch (error) {
        console.log(`  ❌ Failed to connect to: ${dbName}`);
        console.log(`     Error: ${error.message}\n`);
      }
    }
    
    console.log('🎉 Subdomain testing completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node initialize-subdomains.js');
    console.log('2. Configure hosts file');
    console.log('3. Test with different subdomains');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testSubdomainFunctionality();
