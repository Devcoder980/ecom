// ============================================
// R2 SETUP SCRIPT
// Configure CloudFlare R2 for multi-tenant storage
// ============================================

import { S3Client, CreateBucketCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// R2 Configuration
const r2Config = {
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
};

const s3Client = new S3Client(r2Config);

// CORS configuration for R2
const corsConfiguration = {
  CORSRules: [
    {
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
      AllowedOrigins: ['*'],
      ExposeHeaders: ['ETag'],
      MaxAgeSeconds: 3000,
    },
  ],
};

// Create bucket for tenant
const createTenantBucket = async (bucketName) => {
  try {
    console.log(`🪣 Creating bucket: ${bucketName}`);
    
    // Create bucket
    const createCommand = new CreateBucketCommand({
      Bucket: bucketName,
    });
    
    await s3Client.send(createCommand);
    console.log(`✅ Bucket created: ${bucketName}`);
    
    // Configure CORS
    const corsCommand = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    });
    
    await s3Client.send(corsCommand);
    console.log(`✅ CORS configured for: ${bucketName}`);
    
    return {
      success: true,
      bucket: bucketName,
      message: 'Bucket created and configured successfully',
    };
  } catch (error) {
    console.error(`❌ Error creating bucket ${bucketName}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Setup all tenant buckets
const setupAllTenantBuckets = async () => {
  try {
    console.log('🚀 Setting up R2 storage for all tenants...');
    
    // Default bucket
    const defaultResult = await createTenantBucket(process.env.R2_BUCKET_NAME || 'ecommerce-storage');
    
    // Tenant buckets (you can add more tenants here)
    const tenants = [
      'store1-ecommerce-storage',
      'store2-ecommerce-storage',
      'store3-ecommerce-storage',
    ];
    
    const results = [defaultResult];
    
    for (const tenant of tenants) {
      const result = await createTenantBucket(tenant);
      results.push(result);
    }
    
    console.log('📊 Setup Results:');
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`✅ ${result.bucket || 'Default'}: ${result.message}`);
      } else {
        console.log(`❌ ${result.bucket || 'Default'}: ${result.error}`);
      }
    });
    
    return results;
  } catch (error) {
    console.error('💥 Setup failed:', error);
    throw error;
  }
};

// Test R2 connection
const testR2Connection = async () => {
  try {
    console.log('🔍 Testing R2 connection...');
    
    // Try to list buckets (this will test the connection)
    const { ListBucketsCommand } = await import('@aws-sdk/client-s3');
    const listCommand = new ListBucketsCommand({});
    
    const response = await s3Client.send(listCommand);
    console.log('✅ R2 connection successful!');
    console.log(`📋 Found ${response.Buckets?.length || 0} buckets`);
    
    return {
      success: true,
      buckets: response.Buckets?.length || 0,
    };
  } catch (error) {
    console.error('❌ R2 connection failed:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Main setup function
const main = async () => {
  try {
    console.log('🌐 CloudFlare R2 Setup Script');
    console.log('================================');
    
    // Check environment variables
    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      console.error('❌ Missing R2 credentials. Please set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your .env file');
      process.exit(1);
    }
    
    // Test connection
    const connectionTest = await testR2Connection();
    if (!connectionTest.success) {
      console.error('❌ Cannot connect to R2. Please check your credentials and endpoint.');
      process.exit(1);
    }
    
    // Setup buckets
    await setupAllTenantBuckets();
    
    console.log('🎉 R2 setup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Update your .env file with the correct R2_PUBLIC_URL');
    console.log('2. Configure your domain to point to R2');
    console.log('3. Test file uploads in your application');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  createTenantBucket,
  setupAllTenantBuckets,
  testR2Connection,
};
