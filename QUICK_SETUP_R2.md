# 🚀 Quick Setup Guide - CloudFlare R2 Integration

## ✅ What's Been Implemented

### 1. **R2 Storage Service** (`r2-storage.js`)
- Multi-tenant file storage with subdomain support
- Automatic bucket selection based on subdomain
- Fallback to local storage for development
- File type validation and size limits

### 2. **Multi-Tenant Configuration** (`multi-tenant-config.js`)
- Subdomain-based tenant management
- Feature flags per tenant
- Storage quotas and limits
- Tenant statistics and monitoring

### 3. **Updated File Upload Endpoints**
- `/api/upload` - Single file upload with R2
- `/api/upload-multiple` - Multiple file upload with R2
- `/api/:collection/upload` - Table-specific uploads with R2

### 4. **Environment Configuration** (`env.example`)
- R2 credentials and endpoint configuration
- Multi-tenant settings
- File upload limits and CORS settings

## 🔧 Setup Steps

### Step 1: Get CloudFlare R2 Credentials

1. Go to [CloudFlare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Create a new R2 bucket or use existing
4. Go to **Manage R2 API tokens**
5. Create a new API token with R2 permissions
6. Copy the **Access Key ID** and **Secret Access Key**

### Step 2: Configure Environment Variables

Create a `.env` file in your server directory:

```bash
# Copy the example file
cp env.example .env

# Edit with your R2 credentials
nano .env
```

Add your R2 credentials:

```env
# CloudFlare R2 Configuration
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto
R2_BUCKET_NAME=ecommerce-storage
R2_PUBLIC_URL=https://your-custom-domain.com

# Multi-tenant Configuration
DEFAULT_SUBDOMAIN=default
ENABLE_MULTI_TENANT=true
```

### Step 3: Setup R2 Buckets

```bash
# Run the setup script
node setup-r2.js
```

This will:
- Test your R2 connection
- Create buckets for all tenants
- Configure CORS settings
- Set up proper permissions

### Step 4: Test the Integration

```bash
# Start your server
npm run dev

# Test file upload
curl -X POST http://localhost:5000/api/upload \
  -F "file=@test-image.jpg"
```

## 🌐 Multi-Tenant Architecture

### Subdomain Structure

| Subdomain | Database | Bucket | Example |
|-----------|----------|--------|---------|
| `localhost` | `ecommerce` | `ecommerce-storage` | Development |
| `store1.yourdomain.com` | `store1_ecommerce` | `store1-ecommerce-storage` | Store 1 |
| `store2.yourdomain.com` | `store2_ecommerce` | `store2-ecommerce-storage` | Store 2 |

### File Organization

```
R2 Storage:
├── ecommerce-storage/           # Default tenant
│   ├── default/                # localhost files
│   │   ├── products/
│   │   ├── categories/
│   │   └── users/
│   └── store1/                 # store1.yourdomain.com
│       ├── products/
│       └── categories/
├── store1-ecommerce-storage/   # Dedicated bucket
└── store2-ecommerce-storage/   # Dedicated bucket
```

## 🔧 Configuration Options

### Add New Tenant

```javascript
// In multi-tenant-config.js
const newTenant = {
  name: 'Store 3',
  domain: 'store3.yourdomain.com',
  database: 'store3_ecommerce',
  bucket: 'store3-ecommerce-storage',
  features: {
    fileUpload: true,
    analytics: true,
    seo: true,
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    storageQuota: 10 * 1024 * 1024 * 1024, // 10GB
  }
};

addTenant('store3', newTenant);
```

### Custom File Limits

```javascript
// Per-tenant limits
const limits = {
  maxFileSize: 10 * 1024 * 1024, // 10MB per file
  maxFiles: 10, // 10 files per request
  storageQuota: 10 * 1024 * 1024 * 1024, // 10GB total
};
```

## 📁 File Upload Examples

### Single File Upload

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('File URL:', data.file.url);
  // https://your-domain.com/store1/1759224873398-abc123-image.jpg
});
```

### Multiple File Upload

```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

fetch('/api/upload-multiple', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  data.files.forEach(file => {
    console.log('File URL:', file.url);
  });
});
```

### Table-Specific Upload

```javascript
const formData = new FormData();
formData.append('fieldName', 'image_url');
formData.append('recordId', '64f8a1b2c3d4e5f6a7b8c9d0');
formData.append('image_url', fileInput.files[0]);

fetch('/api/products/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Uploaded files:', data.uploadedFiles);
});
```

## 🚀 Production Deployment

### 1. Domain Configuration

```dns
# CNAME record for file storage
files.yourdomain.com -> your-account-id.r2.cloudflarestorage.com
```

### 2. Environment Variables

```bash
# Production environment
export R2_ACCESS_KEY_ID=your-production-key
export R2_SECRET_ACCESS_KEY=your-production-secret
export R2_PUBLIC_URL=https://files.yourdomain.com
```

### 3. SSL Certificate

R2 automatically provides SSL certificates for your custom domain.

## 🔍 Monitoring

### Check Tenant Status

```javascript
import { getTenantStats } from './multi-tenant-config.js';

const stats = await getTenantStats('store1', mongoose);
console.log(stats);
```

### File Operations

```javascript
import { R2StorageService } from './r2-storage.js';

const storage = new R2StorageService('store1');

// Upload
const result = await storage.uploadFile(file);

// Delete
await storage.deleteFile('store1/old-file.jpg');

// Get signed URL
const signedUrl = await storage.getSignedUrl('store1/private-file.pdf');
```

## 🎯 Benefits

### ✅ **Free 10GB Storage**
- Each tenant gets 10GB free storage
- Automatic scaling beyond free tier
- Global CDN distribution

### ✅ **Multi-Tenant Isolation**
- Separate buckets per tenant
- Subdomain-based routing
- Isolated file storage

### ✅ **High Performance**
- Global CDN distribution
- Fast file delivery worldwide
- Automatic SSL certificates

### ✅ **Easy Management**
- Simple API for file operations
- Automatic cleanup and organization
- Built-in monitoring and statistics

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Run setup script
   node setup-r2.js
   ```

2. **Authentication Failed**
   ```bash
   # Check credentials
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

```bash
# Enable debug logging
export DEBUG_R2=true
```

## 🎉 You're All Set!

Your multi-tenant R2 storage is now ready! Each subdomain will have its own isolated storage, and files will be automatically organized by tenant.

**Next Steps:**
1. Configure your domain DNS
2. Test file uploads
3. Add more tenants as needed
4. Monitor storage usage

**Happy coding! 🚀**
