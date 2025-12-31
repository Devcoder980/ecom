import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SchemaDefinition, generateSchemaFile } from './schema-manager.js';

dotenv.config();

// Dummy hero slider data with images
const heroSliderData = [
  {
    title: "Premium Eco-Friendly Packaging Solutions",
    description: "Discover our wide range of sustainable packaging products for your business. High-quality, biodegradable, and affordable.",
    image_url: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1920&h=600&fit=crop",
    link: "/products",
    button_text: "Shop Now",
    position: 1,
    is_active: true,
    
    // SEO Fields
    meta_title: "Premium Eco-Friendly Packaging Solutions | Neeyog",
    meta_description: "Discover sustainable packaging products for your business. High-quality biodegradable solutions at affordable prices.",
    meta_keywords: "eco-friendly packaging, sustainable packaging, biodegradable products",
    og_title: "Premium Eco-Friendly Packaging Solutions",
    og_description: "Discover our wide range of sustainable packaging products for your business",
    og_image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&h=630&fit=crop",
    canonical_url: "/",
    h1_tag: "Eco-Friendly Packaging Solutions",
  },
  {
    title: "Disposable Plates & Bowls Collection",
    description: "Browse our extensive collection of disposable plates, bowls, and serving ware. Perfect for events, restaurants, and catering services.",
    image_url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1920&h=600&fit=crop",
    link: "/category/plates-bowls",
    button_text: "View Collection",
    position: 2,
    is_active: true,
    
    // SEO Fields
    meta_title: "Disposable Plates & Bowls Collection | Neeyog",
    meta_description: "Browse our extensive collection of disposable plates and bowls. Perfect for events, restaurants, and catering services.",
    meta_keywords: "disposable plates, biodegradable bowls, serving ware, catering supplies",
    og_title: "Disposable Plates & Bowls Collection",
    og_description: "Perfect for events, restaurants, and catering services",
    og_image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=630&fit=crop",
    canonical_url: "/category/plates-bowls",
    h1_tag: "Disposable Plates & Bowls",
  },
  {
    title: "Premium Takeaway Packaging",
    description: "Get the best takeaway containers, food boxes, and meal trays. Keep your food fresh and secure with our premium packaging solutions.",
    image_url: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1920&h=600&fit=crop",
    link: "/category/takeaway",
    button_text: "Explore Products",
    position: 3,
    is_active: true,
    
    // SEO Fields
    meta_title: "Premium Takeaway Packaging Solutions | Neeyog",
    meta_description: "Get the best takeaway containers and food boxes. Keep your food fresh with our premium packaging solutions.",
    meta_keywords: "takeaway containers, food boxes, meal trays, restaurant packaging",
    og_title: "Premium Takeaway Packaging",
    og_description: "Keep your food fresh and secure with our premium packaging solutions",
    og_image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&h=630&fit=crop",
    canonical_url: "/category/takeaway",
    h1_tag: "Takeaway Packaging Solutions",
  },
  {
    title: "Special Offer - 20% Off on Bulk Orders",
    description: "Limited time offer! Get 20% discount on all bulk orders above ₹10,000. Stock up now and save big on your packaging needs.",
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop",
    link: "/contact",
    button_text: "Get Quote",
    position: 4,
    is_active: true,
    
    // SEO Fields
    meta_title: "Special Offer - 20% Off on Bulk Orders | Neeyog",
    meta_description: "Limited time offer! Get 20% discount on all bulk orders above ₹10,000. Contact us for best prices.",
    meta_keywords: "bulk orders, wholesale packaging, discount offers, special deals",
    og_title: "Special Offer - 20% Off on Bulk Orders",
    og_description: "Limited time offer! Get 20% discount on all bulk orders",
    og_image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&fit=crop",
    canonical_url: "/contact",
    h1_tag: "Special Bulk Order Discount",
  }
];

async function createHeroSliderTable() {
  try {
    console.log('🚀 Creating Hero Slider Collection...\n');
    
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    const databaseName = 'ecommerce_admin';
    const mongoUri = process.env.MONGODB_URI.includes('?') 
      ? `${process.env.MONGODB_URI.split('?')[0]}/${databaseName}?${process.env.MONGODB_URI.split('?')[1]}`
      : `${process.env.MONGODB_URI}/${databaseName}`;
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    console.log(`📂 Database: ${databaseName}\n`);
    
    // Get hero_sliders collection
    const heroSlidersCollection = mongoose.connection.db.collection('hero_sliders');
    
    // Step 1: Clear existing data
    console.log('🗑️  Clearing existing hero sliders...');
    await heroSlidersCollection.deleteMany({});
    console.log('✅ Cleared\n');
    
    // Step 2: Insert dummy data
    console.log('📥 Inserting dummy hero slider data...\n');
    
    let successCount = 0;
    
    for (let i = 0; i < heroSliderData.length; i++) {
      const slider = heroSliderData[i];
      
      try {
        const sliderDoc = {
          ...slider,
          created_at: new Date(),
          updated_at: new Date(),
        };
        
        const result = await heroSlidersCollection.insertOne(sliderDoc);
        console.log(`  ✅ [${i + 1}/${heroSliderData.length}] ${slider.title}`);
        console.log(`     ID: ${result.insertedId}`);
        console.log(`     Link: ${slider.link}`);
        successCount++;
        
      } catch (error) {
        console.error(`  ❌ Error: ${slider.title} - ${error.message}`);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Success: ${successCount}/${heroSliderData.length}`);
    
    // Step 3: Create schema for hero_sliders
    console.log('\n📋 Creating hero_sliders schema...');
    
    const heroSlidersSchema = {
      tableName: 'hero_sliders',
      label: 'Hero Sliders',
      description: 'Homepage hero section sliders with SEO optimization',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          placeholder: 'Enter slider title'
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          placeholder: 'Enter slider description',
          rows: 3
        },
        {
          name: 'image_url',
          type: 'url',
          label: 'Image URL',
          required: true,
          placeholder: 'Enter image URL'
        },
        {
          name: 'link',
          type: 'url',
          label: 'Link URL',
          required: false,
          placeholder: '/products or external URL'
        },
        {
          name: 'button_text',
          type: 'text',
          label: 'Button Text',
          required: false,
          placeholder: 'Shop Now'
        },
        {
          name: 'position',
          type: 'number',
          label: 'Position',
          required: true,
          placeholder: '1'
        },
        {
          name: 'is_active',
          type: 'checkbox',
          label: 'Active',
          required: false
        },
        {
          name: 'meta_title',
          type: 'text',
          label: 'Meta Title',
          required: false,
          placeholder: 'SEO title'
        },
        {
          name: 'meta_description',
          type: 'textarea',
          label: 'Meta Description',
          required: false,
          placeholder: 'SEO description',
          rows: 2
        },
        {
          name: 'meta_keywords',
          type: 'text',
          label: 'Meta Keywords',
          required: false,
          placeholder: 'keyword1, keyword2'
        },
        {
          name: 'og_title',
          type: 'text',
          label: 'OG Title',
          required: false,
          placeholder: 'Social media title'
        },
        {
          name: 'og_description',
          type: 'textarea',
          label: 'OG Description',
          required: false,
          placeholder: 'Social media description',
          rows: 2
        },
        {
          name: 'og_image',
          type: 'url',
          label: 'OG Image',
          required: false,
          placeholder: 'https://example.com/og-image.jpg'
        },
        {
          name: 'canonical_url',
          type: 'url',
          label: 'Canonical URL',
          required: false,
          placeholder: 'https://example.com/canonical'
        },
        {
          name: 'h1_tag',
          type: 'text',
          label: 'H1 Tag',
          required: false,
          placeholder: 'Main heading'
        }
      ],
      isActive: true
    };
    
    await SchemaDefinition.findOneAndUpdate(
      { tableName: 'hero_sliders' },
      heroSlidersSchema,
      { upsert: true, new: true }
    );
    
    console.log('✅ Hero sliders schema created');
    
    // Step 4: Regenerate database-schema.js
    console.log('\n📝 Regenerating database-schema.js...');
    await generateSchemaFile();
    console.log('✅ database-schema.js updated');
    
    console.log('\n✅ Hero slider collection created successfully!');
    console.log('\n📋 Collection Details:');
    console.log('  Collection Name: hero_sliders');
    console.log(`  Total Records: ${successCount}`);
    console.log('  Fields: 16 (including SEO fields)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run the script
createHeroSliderTable();

