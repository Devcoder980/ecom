# CloudFlare R2 Integration Guide

## 🌐 Multi-Tenant File Storage with CloudFlare R2

This guide explains how to set up and use CloudFlare R2 for file storage in your multi-tenant e-commerce application.

## 📋 Prerequisites

1. **CloudFlare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **R2 Storage** - Enable R2 in your CloudFlare dashboard
3. **API Credentials** - Generate R2 API tokens

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env` file in your server directory:

```bash
# CloudFlare R2 Configuration
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto
R2_BUCKET_NAME=ecommerce-storage
R2_PUBLIC_URL=https://your-custom-domain.com

# Multi-tenant Configuration
DEFAULT_SUBDOMAIN=default
ENABLE_MULTI_TENANT=true
```

### 2. Install Dependencies

```bash
cd server
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer-s3
```

### 3. Setup R2 Buckets

```bash
node setup-r2.js
```

## 🏗️ Architecture Overview

### Multi-Tenant Structure

```
R2 Storage Structure:
├── ecommerce-storage/           # Default tenant
│   ├── default/                # Default subdomain files
│   │   ├── products/
│   │   ├── categories/
│   │   └── users/
│   └── store1/                 # store1.yourdomain.com
│       ├── products/
│       ├── categories/
│       └── users/
├── store1-ecommerce-storage/   # Dedicated bucket for store1
└── store2-ecommerce-storage/   # Dedicated bucket for store2
```

### Subdomain Mapping

| Subdomain | Database | Bucket | Features |
|-----------|----------|--------|----------|
| `localhost` | `ecommerce` | `ecommerce-storage` | Default |
| `store1.yourdomain.com` | `store1_ecommerce` | `store1-ecommerce-storage` | Full features |
| `store2.yourdomain.com` | `store2_ecommerce` | `store2-ecommerce-storage` | Full features |

## 🔧 Configuration

### 1. R2 Storage Service

The `R2StorageService` class handles all file operations:

```javascript
import { R2StorageService } from './r2-storage.js';

// Initialize for specific tenant
const storage = new R2StorageService('store1');

// Upload file
const result = await storage.uploadFile(file);
console.log(result.url); // Public URL
```

### 2. Multi-Tenant Configuration

Configure tenants in `multi-tenant-config.js`:

```javascript
const tenantConfig = {
  tenants: {
    'store1': {
      name: 'Store 1',
      domain: 'store1.yourdomain.com',
      database: 'store1_ecommerce',
      bucket: 'store1-ecommerce-storage',
      features: {
        fileUpload: true,
        analytics: true,
        seo: true,
      },
      limits: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        storageQuota: 10 * 1024 * 1024 * 1024, // 10GB
      }
    }
  }
};
```

## 📁 File Upload Endpoints

### Single File Upload

```bash
POST /api/upload
Content-Type: multipart/form-data

# Request
file: [file]

# Response
{
  "success": true,
  "file": {
    "filename": "store1/1759224873398-abc123-image.jpg",
    "originalname": "image.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "url": "https://your-domain.com/store1/1759224873398-abc123-image.jpg",
    "bucket": "store1-ecommerce-storage",
    "storage": "r2"
  }
}
```

### Multiple File Upload

```bash
POST /api/upload-multiple
Content-Type: multipart/form-data

# Request
files: [file1, file2, file3]

# Response
{
  "success": true,
  "files": [
    {
      "filename": "store1/1759224873398-abc123-image1.jpg",
      "url": "https://your-domain.com/store1/1759224873398-abc123-image1.jpg",
      "storage": "r2"
    }
  ]
}
```

### Table-Specific Upload

```bash
POST /api/:collection/upload
Content-Type: multipart/form-data

# Request
fieldName: "image_url"
recordId: "64f8a1b2c3d4e5f6a7b8c9d0"
image_url: [file]

# Response
{
  "success": true,
  "uploadedFiles": {
    "image_url": "https://your-domain.com/store1/1759224873398-abc123-image.jpg"
  }
}
```

## 🌐 Subdomain Support

### Automatic Subdomain Detection

The system automatically detects subdomains from the `Host` header:

```javascript
// Request from store1.yourdomain.com
// Automatically uses store1 tenant configuration
```

### Manual Subdomain Override

```javascript
// Force specific tenant
const storage = new R2StorageService('store2');
```

## 🔒 Security Features

### 1. File Type Validation

```javascript
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
];
```

### 2. File Size Limits

```javascript
const limits = {
  maxFileSize: 10 * 1024 * 1024, // 10MB per file
  maxFiles: 10, // 10 files per request
  storageQuota: 10 * 1024 * 1024 * 1024, // 10GB per tenant
};
```

### 3. CORS Configuration

```javascript
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
```

## 📊 Monitoring & Analytics

### Tenant Statistics

```javascript
import { getTenantStats } from './multi-tenant-config.js';

const stats = await getTenantStats('store1', mongoose);
console.log(stats);
// {
//   tenant: 'store1',
//   database: 'store1_ecommerce',
//   bucket: 'store1-ecommerce-storage',
//   collections: 31,
//   features: { fileUpload: true, analytics: true },
//   limits: { maxFileSize: 10485760, storageQuota: 10737418240 }
// }
```

### File Operations

```javascript
// Upload file
const uploadResult = await storage.uploadFile(file);

// Delete file
const deleteResult = await storage.deleteFile('store1/1759224873398-abc123-image.jpg');

// Get signed URL (for private files)
const signedUrl = await storage.getSignedUrl('store1/private-file.pdf', 3600);
```

## 🚀 Deployment

### 1. Production Environment

```bash
# Set production environment variables
export R2_ACCESS_KEY_ID=your-production-key
export R2_SECRET_ACCESS_KEY=your-production-secret
export R2_PUBLIC_URL=https://your-production-domain.com
```

### 2. Domain Configuration

Configure your domain to point to R2:

```dns
# CNAME record
files.yourdomain.com -> your-account-id.r2.cloudflarestorage.com
```

### 3. SSL Certificate

R2 automatically provides SSL certificates for your custom domain.

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Run setup script to configure CORS
   node setup-r2.js
   ```

2. **Authentication Errors**
   ```bash
   # Check your R2 credentials
   echo $R2_ACCESS_KEY_ID
   echo $R2_SECRET_ACCESS_KEY
   ```

3. **File Not Found**
   ```bash
   # Check bucket and key
   console.log('Bucket:', bucketName);
   console.log('Key:', fileKey);
   ```

### Debug Mode

Enable debug logging:

```javascript
// Add to your .env
DEBUG_R2=true

// In your code
if (process.env.DEBUG_R2) {
  console.log('R2 Debug:', { bucket, key, url });
}
```

## 📈 Performance Optimization

### 1. CDN Integration

R2 automatically provides global CDN distribution.

### 2. Image Optimization

```javascript
// Resize images before upload
const sharp = require('sharp');

const optimizedImage = await sharp(file.buffer)
  .resize(800, 600)
  .jpeg({ quality: 80 })
  .toBuffer();
```

### 3. Batch Operations

```javascript
// Upload multiple files efficiently
const results = await Promise.all(
  files.map(file => storage.uploadFile(file))
);
```

## 🎯 Best Practices

1. **Use Subdomain-Based Tenants** - Each subdomain gets its own storage
2. **Implement File Cleanup** - Remove unused files regularly
3. **Monitor Storage Usage** - Track quota usage per tenant
4. **Use CDN** - Leverage R2's global CDN for fast delivery
5. **Backup Important Files** - Implement backup strategies

## 📞 Support

For issues and questions:

1. Check the troubleshooting section
2. Review CloudFlare R2 documentation
3. Check server logs for detailed error messages
4. Test with the setup script: `node setup-r2.js`

---

**🎉 Your multi-tenant R2 storage is now ready!**

Each subdomain will have its own isolated storage, and files will be automatically organized by tenant.
