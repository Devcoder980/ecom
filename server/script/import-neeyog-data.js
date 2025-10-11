import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Tigris S3 Configuration
const accessKeyId = process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.TIGRIS_ACCESS_KEY_ID;
const secretAccessKey = process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.TIGRIS_SECRET_ACCESS_KEY;
const endpoint = process.env.TIGRIS_STORAGE_ENDPOINT || process.env.TIGRIS_ENDPOINT || 'https://fly.storage.tigris.dev';
const bucketName = process.env.TIGRIS_STORAGE_BUCKET || process.env.TIGRIS_BUCKET_NAME || process.env.TIGRIS_BUCKET || 'ecom';

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

// Neeyog Categories Data
const neeyogData = {
  "website": "https://neeyog.com/",
  "scraped_at": "2025-10-11",
  "total_categories": 17,
  "categories": [
    {
      "id": "interactive-banner-1-wrap-1934",
      "title": "PS Cups",
      "description": "Mouse Cups",
      "link": "https://neeyog.com/product-category/bakery-sweet-products/mousse-products-with-lids/",
      "slug": "bakery-sweet-products/mousse-products-with-lids",
      "image": "https://neeyog.com/wp-content/uploads/2025/02/ICE-CREAM-BOWL-12-1-scaled.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-7958",
      "title": "Pizza Box",
      "description": "Pizza Box",
      "link": "https://neeyog.com/product-category/grab-go/pizza-boxes/",
      "slug": "grab-go/pizza-boxes",
      "image": "https://neeyog.com/wp-content/uploads/2025/02/PIZZA-BOX-10.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-1244",
      "title": "Plates & Bowls",
      "description": "Plates & Bowls",
      "link": "https://neeyog.com/product-category/plates-bowls/",
      "slug": "plates-bowls",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/746021.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-3002",
      "title": "Reusable Cups",
      "description": "Poultry Products",
      "link": "https://neeyog.com/product-category/glasses/reusable-glasses/",
      "slug": "glasses/reusable-glasses",
      "image": "https://neeyog.com/wp-content/uploads/2024/09/2.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-2958",
      "title": "Cutlery",
      "description": "Cutlery",
      "link": "https://neeyog.com/product-category/cutlery/",
      "slug": "cutlery",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/WoodenCutlery_2048x.png"
    },
    {
      "id": "interactive-banner-1-wrap-5971",
      "title": "Grab & Go",
      "description": "Grab & Go",
      "link": "https://neeyog.com/product-category/grab-go/",
      "slug": "grab-go",
      "image": "https://neeyog.com/wp-content/uploads/2019/02/XSmall-1.png"
    },
    {
      "id": "interactive-banner-1-wrap-4230",
      "title": "Takeaway",
      "description": "Takeaway",
      "link": "https://neeyog.com/product-category/takeaway/",
      "slug": "takeaway",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/8CP-Meal-Tray-Natraj-Black-3-new-2.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-8716",
      "title": "Bags",
      "description": "Bags",
      "link": "https://neeyog.com/product-category/bags/",
      "slug": "bags",
      "image": "https://neeyog.com/wp-content/uploads/2018/10/elephant-fashion.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-5654",
      "title": "Biodegradable Cornstarch Products",
      "description": "biodegradable cornstarch Bowls and containers",
      "link": "https://neeyog.com/product-category/biodegradable-cornstarch-food-packaging/",
      "slug": "biodegradable-cornstarch-food-packaging",
      "image": "https://neeyog.com/wp-content/uploads/2025/01/CORNSTRACH-PRODUCT-Photoroom.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-1998",
      "title": "Aluminium",
      "description": "Aluminium Products",
      "link": "https://neeyog.com/product-category/aluminium-foil-containers/",
      "slug": "aluminium-foil-containers",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/06.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-6314",
      "title": "Bakery & Sweet",
      "description": "Bakery & Sweet Products",
      "link": "https://neeyog.com/product-category/bakery-sweet-products/",
      "slug": "bakery-sweet-products",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/IMG-20160723-WA0092.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-8697",
      "title": "FNV & Butchery",
      "description": "FNV & Butchery Products",
      "link": null,
      "slug": "fnv-butchery",
      "image": "https://neeyog.com/wp-content/uploads/2018/10/822552.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-3651",
      "title": "Safety & Hygiene",
      "description": "Safety & Hygiene",
      "link": "https://neeyog.com/product-category/safety-hygiene-products/",
      "slug": "safety-hygiene-products",
      "image": "https://neeyog.com/wp-content/uploads/2020/05/handkleen-rub-brochure-1.png"
    },
    {
      "id": "interactive-banner-1-wrap-9928",
      "title": "Table Roll",
      "description": "Table Roll",
      "link": "https://neeyog.com/product-category/table-roll/",
      "slug": "table-roll",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/Table-Roll.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-4697",
      "title": "Tissues",
      "description": "Tissues",
      "link": "https://neeyog.com/product-category/tissues/",
      "slug": "tissues",
      "image": "https://neeyog.com/wp-content/uploads/2018/10/NAP012.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-2372",
      "title": "Sealing Machine",
      "description": "Sealing Machine",
      "link": "https://neeyog.com/product-category/sealer-machine/",
      "slug": "sealer-machine",
      "image": "https://neeyog.com/wp-content/uploads/2019/01/sealer-machine-500x500.jpg"
    },
    {
      "id": "interactive-banner-1-wrap-3735",
      "title": "Chocolate Packaging",
      "description": "Chocolate Packaging",
      "link": "https://neeyog.com/product-category/chocolate-packaging/",
      "slug": "chocolate-packaging",
      "image": "https://neeyog.com/wp-content/uploads/2018/10/pl13370131-paperboard_chocolate_packaging_box.jpg"
    }
  ]
};

// Download image and upload to Tigris
async function downloadAndUploadImage(imageUrl, categorySlug) {
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
    const filename = `categories/${categorySlug}-${timestamp}-${randomString}.${extension}`;
    
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
async function importNeeyogData() {
  try {
    console.log('🚀 Starting Neeyog Data Import...\n');
    
    // Connect to MongoDB - use ecommerce_admin database
    console.log('📦 Connecting to MongoDB...');
    const databaseName = 'ecommerce_admin'; // Admin database for categories
    const mongoUri = process.env.MONGODB_URI.includes('?') 
      ? `${process.env.MONGODB_URI.split('?')[0]}/${databaseName}?${process.env.MONGODB_URI.split('?')[1]}`
      : `${process.env.MONGODB_URI}/${databaseName}`;
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Get database name from connection
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📂 Database: ${dbName}\n`);
    
    // Step 1: Delete all existing data
    console.log('🗑️  Deleting all existing data...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      if (collectionName !== 'schemas') { // Keep schemas collection
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`  ✅ Cleared: ${collectionName}`);
      }
    }
    console.log('✅ All data deleted\n');
    
    // Step 2: Ensure categories schema exists
    const schemasCollection = mongoose.connection.db.collection('schemas');
    let categoriesSchema = await schemasCollection.findOne({ collectionName: 'categories' });
    
    if (!categoriesSchema) {
      console.log('⚠️  Categories schema not found');
      console.log('💡 Run the server first to initialize schemas, or continue without schema validation...\n');
      // Continue anyway - MongoDB will create the collection
    } else {
      console.log('✅ Categories schema found\n');
    }
    
    // Step 3: Import categories with images
    console.log('📥 Importing categories from Neeyog...\n');
    const categoriesCollection = mongoose.connection.db.collection('categories');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < neeyogData.categories.length; i++) {
      const category = neeyogData.categories[i];
      console.log(`\n[${i + 1}/${neeyogData.categories.length}] Processing: ${category.title}`);
      
      try {
        // Download and upload image to Tigris
        let imageUrl = null;
        if (category.image) {
          imageUrl = await downloadAndUploadImage(category.image, category.slug || category.title.toLowerCase().replace(/\s+/g, '-'));
        }
        
        // Prepare category document
        const categoryDoc = {
          name: category.title,
          slug: category.slug || category.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
          description: category.description || '',
          image_url: imageUrl || category.image, // Use Tigris URL or fallback to original
          parent_id: null, // Top-level categories
          position: i,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          
          // SEO fields (optional)
          meta_title: category.title,
          meta_description: category.description || '',
          meta_keywords: category.title,
          canonical_url: category.link || '',
          h1_tag: category.title,
        };
        
        // Insert into MongoDB
        const result = await categoriesCollection.insertOne(categoryDoc);
        console.log(`  ✅ Saved to MongoDB: ${result.insertedId}`);
        successCount++;
        
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📦 Total: ${neeyogData.categories.length}`);
    
    console.log('\n✅ Data import completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run import
importNeeyogData();

