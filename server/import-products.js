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
async function downloadAndUploadImage(imageUrl, productSlug) {
  try {
    if (!imageUrl) return null;
    
    // Download image
    const response = await fetch(imageUrl, { timeout: 10000 });
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    
    // Get file extension from URL
    const urlParts = imageUrl.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0].split('/')[0] || 'jpg';
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `products/${productSlug}-${timestamp}-${randomString}.${extension}`;
    
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
    return tigrisUrl;
  } catch (error) {
    console.error(`    ⚠️  Image error: ${error.message}`);
    return null;
  }
}

// Main import function
async function importProducts() {
  try {
    console.log('🚀 Starting Products Import...\n');
    
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
    const jsonPath = path.join(__dirname, 'data/neeyog_relational_database.json');
    console.log('📄 Loading products data...');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`✅ Loaded: ${jsonData.products.length} products\n`);
    
    // Get collections
    const categoriesCollection = mongoose.connection.db.collection('categories');
    const subcategoriesCollection = mongoose.connection.db.collection('subcategories');
    const productsCollection = mongoose.connection.db.collection('products');
    
    // Step 1: Clear existing products
    console.log('🗑️  Clearing existing products...');
    await productsCollection.deleteMany({});
    console.log('✅ Cleared\n');
    
    // Step 2: Create lookup maps for categories and subcategories
    console.log('📋 Creating lookup maps...');
    const categories = await categoriesCollection.find({}).toArray();
    const subcategories = await subcategoriesCollection.find({}).toArray();
    
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat._id.toString());
    });
    
    const subcategoryMap = new Map();
    subcategories.forEach(subcat => {
      subcategoryMap.set(subcat.slug, subcat._id.toString());
    });
    
    console.log(`  ✅ ${categories.length} categories mapped`);
    console.log(`  ✅ ${subcategories.length} subcategories mapped\n`);
    
    // Step 3: Import products in batches
    console.log('📥 Importing products...\n');
    
    const BATCH_SIZE = 50;
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    let processedCount = 0;
    
    for (let i = 0; i < jsonData.products.length; i += BATCH_SIZE) {
      const batch = jsonData.products.slice(i, i + BATCH_SIZE);
      console.log(`\n📦 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(jsonData.products.length / BATCH_SIZE)} (${i + 1}-${Math.min(i + BATCH_SIZE, jsonData.products.length)}/${jsonData.products.length})`);
      
      for (const product of batch) {
        processedCount++;
        
        try {
          // Find category and subcategory IDs
          const categorySlug = jsonData.categories.find(c => c.category_id === product.category_id)?.slug;
          const subcategorySlug = jsonData.subcategories.find(s => s.subcategory_id === product.subcategory_id)?.slug;
          
          if (!categorySlug || !subcategorySlug) {
            console.log(`  ⏭️  [${processedCount}] Skipped: ${product.name} (missing category/subcategory)`);
            skipCount++;
            continue;
          }
          
          const dbCategoryId = categoryMap.get(categorySlug);
          const dbSubcategoryId = subcategoryMap.get(subcategorySlug);
          
          if (!dbCategoryId || !dbSubcategoryId) {
            console.log(`  ⏭️  [${processedCount}] Skipped: ${product.name} (not found in DB)`);
            skipCount++;
            continue;
          }
          
          // Download main image to Tigris (only main image for speed)
          let mainImageUrl = product.images?.main || product.images?.large;
          if (mainImageUrl) {
            const tigrisUrl = await downloadAndUploadImage(mainImageUrl, product.slug);
            if (tigrisUrl) mainImageUrl = tigrisUrl;
          }
          
          // Prepare product document with SEO fields
          const productDoc = {
            sku: product.product_id,
            name: product.name,
            slug: product.slug,
            short_desc: product.description?.text || '',
            long_desc: product.description?.html || product.description?.text || '',
            
            // Relationships
            category_id: dbCategoryId,
            subcategory_id: dbSubcategoryId,
            
            // Pricing & Stock
            price: parseFloat(product.price) || 0,
            mrp: parseFloat(product.price) || 0,
            stock_qty: product.stock_status === 'instock' ? 100 : 0,
            stock_status: product.stock_status || 'instock',
            
            // Images
            image_url: mainImageUrl,
            images: {
              main: mainImageUrl,
              large: product.images?.large,
              thumbnail: product.images?.thumbnail,
              gallery: []
            },
            
            // SEO Fields
            meta_title: product.name,
            meta_description: product.description?.text?.substring(0, 160) || `Buy ${product.name} online`,
            meta_keywords: product.tags?.join(', ') || product.name,
            og_title: product.name,
            og_description: product.description?.text?.substring(0, 200) || `Buy ${product.name} online`,
            og_image: mainImageUrl,
            canonical_url: product.url,
            h1_tag: product.name,
            
            // Schema.org
            schema_type: 'Product',
            schema_data: {
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product.name,
              image: mainImageUrl,
              description: product.description?.text || product.name,
              sku: product.product_id,
              offers: {
                '@type': 'Offer',
                availability: product.stock_status === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                price: parseFloat(product.price) || 0,
                priceCurrency: 'INR'
              }
            },
            
            // Additional Fields
            focus_keyword: product.name.split(' ')[0],
            alt_text_default: product.name,
            breadcrumb_title: product.name,
            
            // Status
            is_featured: false,
            is_new: false,
            status: 'active',
            view_count: 0,
            
            // Metadata
            tags: product.tags || [],
            product_type: product.metadata?.product_type || 'simple',
            
            // Timestamps
            created_at: new Date(),
            updated_at: new Date(),
          };
          
          // Insert into MongoDB
          await productsCollection.insertOne(productDoc);
          successCount++;
          
          if (processedCount % 10 === 0 || processedCount === jsonData.products.length) {
            console.log(`  ✅ [${processedCount}/${jsonData.products.length}] ${product.name}`);
          }
          
        } catch (error) {
          console.error(`  ❌ [${processedCount}] Error: ${product.name} - ${error.message}`);
          failCount++;
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n\n📊 Import Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📦 Total: ${jsonData.products.length}`);
    
    // Step 4: Create products schema
    console.log('\n\n📋 Creating products schema...');
    
    const productsSchema = {
      tableName: 'products',
      label: 'Products',
      description: 'Product catalog with SEO optimization',
      fields: [
        { name: 'sku', type: 'text', label: 'SKU', required: false, placeholder: 'Product SKU' },
        { name: 'name', type: 'text', label: 'Product Name', required: true, placeholder: 'Enter product name' },
        { name: 'slug', type: 'text', label: 'URL Slug', required: true, placeholder: 'product-slug' },
        { name: 'short_desc', type: 'textarea', label: 'Short Description', required: false, placeholder: 'Brief description', rows: 3 },
        { name: 'long_desc', type: 'textarea', label: 'Long Description', required: false, placeholder: 'Detailed description', rows: 5 },
        { name: 'category_id', type: 'text', label: 'Category', required: true, placeholder: 'Select category' },
        { name: 'subcategory_id', type: 'text', label: 'Subcategory', required: true, placeholder: 'Select subcategory' },
        { name: 'price', type: 'number', label: 'Price', required: true, placeholder: '0.00' },
        { name: 'mrp', type: 'number', label: 'MRP', required: false, placeholder: '0.00' },
        { name: 'stock_qty', type: 'number', label: 'Stock Quantity', required: true, placeholder: '0' },
        { name: 'image_url', type: 'url', label: 'Image URL', required: false, placeholder: 'Enter image URL' },
        { name: 'meta_title', type: 'text', label: 'Meta Title', required: false, placeholder: 'SEO title' },
        { name: 'meta_description', type: 'textarea', label: 'Meta Description', required: false, placeholder: 'SEO description', rows: 2 },
        { name: 'meta_keywords', type: 'text', label: 'Meta Keywords', required: false, placeholder: 'keyword1, keyword2' },
        { name: 'og_title', type: 'text', label: 'OG Title', required: false, placeholder: 'Social media title' },
        { name: 'og_description', type: 'textarea', label: 'OG Description', required: false, placeholder: 'Social media description', rows: 2 },
        { name: 'og_image', type: 'url', label: 'OG Image', required: false, placeholder: 'https://example.com/og-image.jpg' },
        { name: 'canonical_url', type: 'url', label: 'Canonical URL', required: false, placeholder: 'https://example.com/canonical' },
        { name: 'h1_tag', type: 'text', label: 'H1 Tag', required: false, placeholder: 'Main heading' },
        { name: 'is_featured', type: 'checkbox', label: 'Featured', required: false },
        { name: 'is_new', type: 'checkbox', label: 'New Product', required: false },
        { name: 'status', type: 'select', label: 'Status', required: true, options: [
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ] },
      ],
      isActive: true
    };
    
    await SchemaDefinition.findOneAndUpdate(
      { tableName: 'products' },
      productsSchema,
      { upsert: true, new: true }
    );
    
    console.log('✅ Products schema created');
    
    // Step 5: Regenerate database-schema.js
    console.log('\n📝 Regenerating database-schema.js...');
    await generateSchemaFile();
    console.log('✅ database-schema.js updated');
    
    console.log('\n✅ Products import completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run import
importProducts();

