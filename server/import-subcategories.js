import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { SchemaDefinition, generateSchemaFile } from './schema-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Tigris S3 Configuration
const accessKeyId = process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.TIGRIS_ACCESS_KEY_ID;
const secretAccessKey = process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.TIGRIS_SECRET_ACCESS_KEY;
const endpoint = process.env.TIGRIS_STORAGE_ENDPOINT || process.env.TIGRIS_ENDPOINT || 'https://fly.storage.tigris.dev';
const bucketName = process.env.TIGRIS_STORAGE_BUCKET || process.env.TIGRIS_BUCKET_NAME || process.env.TIGRIS_BUCKET || 'ecom1';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: false,
});

console.log('🔍 Tigris Configuration:');
console.log('Access Key:', accessKeyId ? '✅ Set' : '❌ Not set');
console.log('Secret Key:', secretAccessKey ? '✅ Set' : '❌ Not set');
console.log('Endpoint:', endpoint);
console.log('Bucket:', bucketName);

// Download image and upload to Tigris
async function downloadAndUploadImage(imageUrl, subcategorySlug) {
  try {
    console.log(`  📥 Downloading: ${imageUrl}`);
    
    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    
    // Get file extension from URL
    const urlParts = imageUrl.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `subcategories/${subcategorySlug}-${timestamp}-${randomString}.${extension}`;
    
    // Detect MIME type
    let contentType = 'image/jpeg';
    if (extension.toLowerCase() === 'png') contentType = 'image/png';
    else if (extension.toLowerCase() === 'jpg' || extension.toLowerCase() === 'jpeg') contentType = 'image/jpeg';
    else if (extension.toLowerCase() === 'gif') contentType = 'image/gif';
    else if (extension.toLowerCase() === 'webp') contentType = 'image/webp';
    
    // Upload to Tigris
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    });
    
    await s3Client.send(command);
    
    // Return Tigris public URL
    const tigrisUrl = `https://${bucketName}.fly.storage.tigris.dev/${filename}`;
    console.log(`  ✅ Uploaded to Tigris: ${tigrisUrl}`);
    
    return tigrisUrl;
  } catch (error) {
    console.error(`  ❌ Error processing image: ${error.message}`);
    return null;
  }
}

// Main import function
async function importSubcategories() {
  try {
    console.log('🚀 Starting Subcategories Import...\n');
    
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    const databaseName = 'ecommerce_admin';
    const mongoUri = process.env.MONGODB_URI.includes('?') 
      ? `${process.env.MONGODB_URI.split('?')[0]}/${databaseName}?${process.env.MONGODB_URI.split('?')[1]}`
      : `${process.env.MONGODB_URI}/${databaseName}`;
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    console.log(`📂 Database: ${databaseName}\n`);
    
    // Load JSON data
    const jsonPath = path.join(__dirname, 'data/neeyog_complete_database_ready.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`📄 Loaded data: ${jsonData.categories.length} categories\n`);
    
    // Get categories and subcategories collections
    const categoriesCollection = mongoose.connection.db.collection('categories');
    const subcategoriesCollection = mongoose.connection.db.collection('subcategories');
    
    // Step 1: Clear existing subcategories
    console.log('🗑️  Clearing existing subcategories...');
    await subcategoriesCollection.deleteMany({});
    console.log('✅ Cleared\n');
    
    // Step 2: Import subcategories
    console.log('📥 Importing subcategories...\n');
    
    let totalSubcategories = 0;
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (const category of jsonData.categories) {
      if (!category.subcategories || category.subcategories.length === 0) {
        console.log(`⏭️  Skipping category: ${category.category_name} (no subcategories)`);
        continue;
      }
      
      console.log(`\n📂 Category: ${category.category_name}`);
      console.log(`   Subcategories: ${category.subcategories.length}`);
      
      // Find category in database by slug
      const dbCategory = await categoriesCollection.findOne({ 
        slug: category.category_slug 
      });
      
      if (!dbCategory) {
        console.log(`   ⚠️  Category not found in database: ${category.category_slug}`);
        skipCount += category.subcategories.length;
        continue;
      }
      
      console.log(`   ✅ Found category in DB: ${dbCategory._id}`);
      
      // Import subcategories for this category
      for (let i = 0; i < category.subcategories.length; i++) {
        const subcategory = category.subcategories[i];
        totalSubcategories++;
        
        console.log(`\n   [${i + 1}/${category.subcategories.length}] ${subcategory.subcategory_name}`);
        
        try {
          // Download and upload image to Tigris
          let imageUrl = null;
          if (subcategory.image_url) {
            imageUrl = await downloadAndUploadImage(
              subcategory.image_url, 
              subcategory.subcategory_slug || subcategory.subcategory_name.toLowerCase().replace(/\s+/g, '-')
            );
          }
          
          // Prepare subcategory document
          const subcategoryDoc = {
            name: subcategory.subcategory_name,
            slug: subcategory.subcategory_slug || subcategory.subcategory_name.toLowerCase().replace(/\s+/g, '-'),
            description: `${subcategory.subcategory_name} products`,
            image_url: imageUrl || subcategory.image_url,
            category_id: dbCategory._id.toString(), // Link to parent category
            product_count: subcategory.product_count || 0,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          };
          
          // Insert into MongoDB
          const result = await subcategoriesCollection.insertOne(subcategoryDoc);
          console.log(`   ✅ Saved: ${result.insertedId}`);
          successCount++;
          
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          failCount++;
        }
      }
    }
    
    console.log('\n\n📊 Import Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📦 Total: ${totalSubcategories}`);
    
    // Step 3: Create subcategories schema in SchemaDefinition
    console.log('\n\n📋 Creating subcategories schema...');
    
    const subcategoriesSchema = {
      tableName: 'subcategories',
      label: 'Subcategories',
      description: 'Product subcategories linked to categories',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          placeholder: 'Enter subcategory name'
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          placeholder: 'Enter slug'
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          placeholder: 'Enter description',
          rows: 3
        },
        {
          name: 'image_url',
          type: 'url',
          label: 'Image URL',
          required: false,
          placeholder: 'Enter image URL'
        },
        {
          name: 'category_id',
          type: 'text',
          label: 'Category',
          required: true,
          placeholder: 'Select category'
        },
        {
          name: 'product_count',
          type: 'number',
          label: 'Product Count',
          required: false,
          placeholder: '0'
        },
        {
          name: 'is_active',
          type: 'checkbox',
          label: 'Active',
          required: false
        }
      ],
      isActive: true
    };
    
    // Save or update schema
    await SchemaDefinition.findOneAndUpdate(
      { tableName: 'subcategories' },
      subcategoriesSchema,
      { upsert: true, new: true }
    );
    
    console.log('✅ Subcategories schema created');
    
    // Step 4: Regenerate database-schema.js
    console.log('\n📝 Regenerating database-schema.js...');
    await generateSchemaFile();
    console.log('✅ database-schema.js updated');
    
    console.log('\n✅ Subcategories import completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run import
importSubcategories();

