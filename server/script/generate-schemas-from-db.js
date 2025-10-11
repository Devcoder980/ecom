import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SchemaDefinition } from '../schema-manager.js';

dotenv.config();

// Connect to ecommerce_admin database
const databaseName = 'ecommerce_admin';
const mongoUri = process.env.MONGODB_URI.includes('?') 
  ? `${process.env.MONGODB_URI.split('?')[0]}/${databaseName}?${process.env.MONGODB_URI.split('?')[1]}`
  : `${process.env.MONGODB_URI}/${databaseName}`;

// Infer field type from value
function inferFieldType(value) {
  if (value === null || value === undefined) return 'text';
  
  const type = typeof value;
  
  if (type === 'string') {
    if (value.includes('@') && value.includes('.')) return 'email';
    if (value.startsWith('http://') || value.startsWith('https://')) return 'url';
    if (value.startsWith('+') || /^\d{10,}$/.test(value)) return 'tel';
    if (value.length > 100) return 'textarea';
    return 'text';
  }
  
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'checkbox';
  if (value instanceof Date) return 'datetime-local';
  
  return 'text';
}

// Generate label from field name
function generateLabel(fieldName) {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate schema from collection
async function generateSchemaFromCollection(collectionName) {
  try {
    console.log(`\n📋 Analyzing collection: ${collectionName}`);
    
    const collection = mongoose.connection.db.collection(collectionName);
    const sampleDocs = await collection.find({}).limit(10).toArray();
    
    if (sampleDocs.length === 0) {
      console.log(`  ⚠️  Empty collection, skipping...`);
      return null;
    }
    
    // Aggregate all fields from sample documents
    const fieldsMap = new Map();
    
    sampleDocs.forEach(doc => {
      Object.keys(doc).forEach(key => {
        if (key === '_id' || key === '__v') return; // Skip MongoDB internal fields
        
        if (!fieldsMap.has(key)) {
          const fieldType = inferFieldType(doc[key]);
          fieldsMap.set(key, {
            name: key,
            type: fieldType,
            label: generateLabel(key),
            required: false,
            placeholder: `Enter ${generateLabel(key).toLowerCase()}`,
          });
        }
      });
    });
    
    const fields = Array.from(fieldsMap.values());
    
    console.log(`  ✅ Found ${fields.length} fields`);
    
    return {
      tableName: collectionName,
      label: generateLabel(collectionName),
      description: `Manage ${generateLabel(collectionName)}`,
      fields: fields,
      isActive: true
    };
    
  } catch (error) {
    console.error(`  ❌ Error analyzing ${collectionName}:`, error.message);
    return null;
  }
}

// Main function
async function generateAllSchemas() {
  try {
    console.log('🚀 Generating Schemas from Database Collections...\n');
    
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to: ${databaseName}\n`);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📂 Found ${collections.length} collections\n`);
    
    // Filter out system collections
    const userCollections = collections
      .map(c => c.name)
      .filter(name => !name.startsWith('system.') && name !== 'schemadefinitions' && name !== 'schemas');
    
    console.log(`🎯 Processing ${userCollections.length} user collections:`);
    userCollections.forEach(name => console.log(`   - ${name}`));
    
    // Clear existing schemas
    console.log('\n🗑️  Clearing existing schemas...');
    await SchemaDefinition.deleteMany({});
    console.log('✅ Cleared\n');
    
    // Generate schemas
    let successCount = 0;
    let skipCount = 0;
    
    for (const collectionName of userCollections) {
      const schemaData = await generateSchemaFromCollection(collectionName);
      
      if (schemaData) {
        try {
          const schema = new SchemaDefinition(schemaData);
          await schema.save();
          console.log(`  ✅ Schema saved for: ${collectionName}`);
          successCount++;
        } catch (error) {
          console.error(`  ❌ Error saving schema for ${collectionName}:`, error.message);
        }
      } else {
        skipCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  📦 Total: ${userCollections.length}`);
    
    console.log('\n✅ Schema generation completed!');
    console.log('💡 Now restart the server to generate database-schema.js file');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run
generateAllSchemas();

