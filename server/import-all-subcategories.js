import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Tigris Configuration
const accessKeyId = process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.TIGRIS_ACCESS_KEY_ID;
const secretAccessKey = process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.TIGRIS_SECRET_ACCESS_KEY;
const endpoint = process.env.TIGRIS_STORAGE_ENDPOINT || process.env.TIGRIS_ENDPOINT || 'https://fly.storage.tigris.dev';
const bucketName = process.env.TIGRIS_STORAGE_BUCKET || process.env.TIGRIS_BUCKET || 'ecom1';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: false,
});

console.log('🔍 Tigris Configuration:');
console.log('Endpoint:', endpoint);
console.log('Bucket:', bucketName);

async function downloadAndUploadImage(imageUrl, slug) {
  try {
    if (!imageUrl) return null;
    
    const response = await fetch(imageUrl, { timeout: 10000 });
    if (!response.ok) return null;
    
    const buffer = await response.buffer();
    const urlParts = imageUrl.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `subcategories/${slug}-${timestamp}-${randomString}.${extension}`;
    
    let contentType = 'image/jpeg';
    if (extension.toLowerCase() === 'png') contentType = 'image/png';
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    }));
    
    return `https://${bucketName}.fly.storage.tigris.dev/${filename}`;
  } catch (error) {
    return null;
  }
}

async function importAllSubcategories() {
  try {
    console.log('🚀 Importing ALL Subcategories from neeyog_relational_database.json...\n');
    
    await mongoose.connect(process.env.MONGODB_URI + '/ecommerce_admin');
    console.log('✅ Connected to MongoDB\n');
    
    // Load relational database
    const jsonPath = path.join(__dirname, 'data/neeyog_relational_database.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`📄 Total subcategories in JSON: ${data.subcategories.length}\n`);
    
    const categoriesCollection = mongoose.connection.db.collection('categories');
    const subcategoriesCollection = mongoose.connection.db.collection('subcategories');
    
    // Get existing categories
    const categories = await categoriesCollection.find({}).toArray();
    const categoryMap = new Map();
    categories.forEach(cat => {
      // Map by both slug variations
      categoryMap.set(cat.slug, cat._id.toString());
      categoryMap.set(cat.slug.replace(/-/g, '_'), cat._id.toString());
    });
    
    console.log(`✅ ${categories.length} categories loaded\n`);
    
    // Get existing subcategories to avoid duplicates
    const existingSubcats = await subcategoriesCollection.find({}).toArray();
    const existingSlugs = new Set(existingSubcats.map(s => s.slug));
    
    console.log(`📋 ${existingSubcats.length} subcategories already exist\n`);
    console.log('📥 Importing new subcategories...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < data.subcategories.length; i++) {
      const subcat = data.subcategories[i];
      
      try {
        // Skip if already exists
        if (existingSlugs.has(subcat.slug)) {
          console.log(`  ⏭️  [${i+1}] Already exists: ${subcat.name}`);
          skipCount++;
          continue;
        }
        
        // Find parent category
        const category = data.categories.find(c => c.category_id === subcat.category_id);
        if (!category) {
          console.log(`  ⏭️  [${i+1}] No parent category: ${subcat.name}`);
          skipCount++;
          continue;
        }
        
        const dbCategoryId = categoryMap.get(category.slug) || categoryMap.get(category.slug.replace(/-/g, '_'));
        if (!dbCategoryId) {
          console.log(`  ⏭️  [${i+1}] Category not in DB: ${subcat.name}`);
          skipCount++;
          continue;
        }
        
        // Download image
        let imageUrl = null;
        if (subcat.image_url) {
          imageUrl = await downloadAndUploadImage(subcat.image_url, subcat.slug);
        }
        
        // Insert subcategory
        await subcategoriesCollection.insertOne({
          name: subcat.name,
          slug: subcat.slug,
          description: `${subcat.name} products`,
          image_url: imageUrl || subcat.image_url,
          category_id: dbCategoryId,
          product_count: 0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
        
        console.log(`  ✅ [${i+1}] ${subcat.name}`);
        successCount++;
        
      } catch (error) {
        console.error(`  ❌ [${i+1}] Error: ${subcat.name} - ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📦 Total: ${data.subcategories.length}`);
    
    console.log('\n✅ Import completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

importAllSubcategories();

