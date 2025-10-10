# 🌐 Subdomain-Based Multi-Tenant Setup Guide

## 🎯 Overview

This guide explains how to set up subdomain-based multi-tenant architecture where each subdomain has its own:
- **MongoDB Database** (e.g., `ecommerce_ecom1`, `ecommerce_ecom2`)
- **Tigris Storage Bucket** (e.g., `ecom1-ecommerce-storage`, `ecom2-ecommerce-storage`)
- **Separate Configuration** for features, limits, and storage

## 🚀 Quick Setup

### 1. Initialize Subdomain Configurations

```bash
cd server
node initialize-subdomains.js
```

This creates default configurations for:
- `localhost` → `ecommerce` database
- `ecom1.localhost` → `ecommerce_ecom1` database  
- `ecom2.localhost` → `ecommerce_ecom2` database

### 2. Configure Hosts File

Add these entries to your `/etc/hosts` file (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 ecom1.localhost
127.0.0.1 ecom2.localhost
127.0.0.1 ecom3.localhost
```

### 3. Set Up Tigris Credentials

Create a `.env` file in your server directory:

```env
# Tigris Storage Configuration
TIGRIS_ACCESS_KEY_ID=your-tigris-access-key-id
TIGRIS_SECRET_ACCESS_KEY=your-tigris-secret-access-key
TIGRIS_ENDPOINT=https://t3.storage.dev
TIGRIS_REGION=auto
TIGRIS_BUCKET_NAME=ecommerce-storage
TIGRIS_PUBLIC_URL=https://t3.storage.dev

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
```

## 🏗️ Architecture

### Database Structure

```
MongoDB Databases:
├── ecommerce/                    # Default (localhost)
│   ├── users
│   ├── products
│   ├── categories
│   └── orders
├── ecom1/                        # ecom1.localhost
│   ├── users
│   ├── products
│   ├── categories
│   └── orders
└── ecom2/                        # ecom2.localhost
    ├── users
    ├── products
    ├── categories
    └── orders
```

### Tigris Storage Structure

```
Tigris Buckets:
├── ecommerce-storage/           # Default (localhost)
│   ├── default/
│   │   ├── products/
│   │   ├── categories/
│   │   └── users/
├── ecom1-ecommerce-storage/    # ecom1.localhost
│   ├── ecom1/
│   │   ├── products/
│   │   ├── categories/
│   │   └── users/
└── ecom2-ecommerce-storage/    # ecom2.localhost
    ├── ecom2/
    │   ├── products/
    │   ├── categories/
    │   └── users/
```

## 🔧 Admin Interface

### Access Subdomain Management

1. Go to `http://localhost:3000/subdomains`
2. Click "Add Configuration" to create new subdomain
3. Configure:
   - **Subdomain**: `ecom3`
   - **Display Name**: `Ecom3 Store`
   - **Database**: `ecommerce_ecom3`
   - **Tigris Bucket**: `ecom3-ecommerce-storage`
   - **Tigris Credentials**: Your Tigris API keys
   - **Features**: Enable/disable features per subdomain
   - **Limits**: Set file size, storage quota limits

### Configuration Options

#### Database Configuration
```javascript
{
  name: "ecom1",
  uri: "mongodb://localhost:27017"
}
```

#### Tigris Configuration
```javascript
{
  accessKeyId: "your-access-key-id",
  secretAccessKey: "your-secret-access-key",
  endpoint: "https://t3.storage.dev",
  region: "auto",
  bucketName: "ecom1-ecommerce-storage",
  publicUrl: "https://t3.storage.dev"
}
```

#### Features Configuration
```javascript
{
  fileUpload: true,
  analytics: true,
  seo: true,
  multiLanguage: false
}
```

#### Limits Configuration
```javascript
{
  maxFileSize: 10485760,      // 10MB
  maxFiles: 10,
  storageQuota: 10737418240   // 10GB
}
```

## 🧪 Testing Subdomains

### 1. Test Default (localhost)
```bash
curl http://localhost:5000/api/tenant/info
# Should return default configuration
```

### 2. Test ecom1 Subdomain
```bash
curl -H "Host: ecom1.localhost:5000" http://localhost:5000/api/tenant/info
# Should return ecom1 configuration
```

### 3. Test ecom2 Subdomain
```bash
curl -H "Host: ecom2.localhost:5000" http://localhost:5000/api/tenant/info
# Should return ecom2 configuration
```

## 📱 Frontend Testing

### 1. Default Store
- URL: `http://localhost:3000`
- Database: `ecommerce`
- Storage: `ecommerce-storage`

### 2. Ecom1 Store
- URL: `http://ecom1.localhost:3000`
- Database: `ecommerce_ecom1`
- Storage: `ecom1-ecommerce-storage`

### 3. Ecom2 Store
- URL: `http://ecom2.localhost:3000`
- Database: `ecommerce_ecom2`
- Storage: `ecom2-ecommerce-storage`

## 🔄 API Endpoints

### Subdomain Configuration Management

```bash
# Get all configurations
GET /api/subdomain-configs

# Get specific configuration
GET /api/subdomain-configs/:subdomain

# Create configuration
POST /api/subdomain-configs
{
  "subdomain": "ecom3",
  "displayName": "Ecom3 Store",
  "database": {
    "name": "ecom3",
    "uri": "mongodb://localhost:27017"
  },
  "tigris": {
    "accessKeyId": "your-key",
    "secretAccessKey": "your-secret",
    "endpoint": "https://t3.storage.dev",
    "region": "auto",
    "bucketName": "ecom3-ecommerce-storage",
    "publicUrl": "https://t3.storage.dev"
  }
}

# Update configuration
PUT /api/subdomain-configs/:subdomain

# Delete configuration
DELETE /api/subdomain-configs/:subdomain

# Test Tigris connection
POST /api/subdomain-configs/:subdomain/test-tigris
```

### Tenant Information

```bash
# Get tenant info for current subdomain
GET /api/tenant/info

# Get tenant info for specific subdomain
GET /api/tenant/info?subdomain=ecom1
```

## 🎯 Benefits

### ✅ **Complete Isolation**
- Separate databases per subdomain
- Separate storage buckets per subdomain
- Independent configurations per subdomain

### ✅ **Easy Management**
- Admin interface for configuration
- Test connections before deployment
- Feature flags per subdomain

### ✅ **Scalable Architecture**
- Add new subdomains easily
- Configure different limits per tenant
- Independent scaling per subdomain

### ✅ **Development Friendly**
- Localhost testing with subdomains
- Easy switching between tenants
- Clear separation of concerns

## 🚀 Production Deployment

### 1. Domain Configuration

```dns
# CNAME records
ecom1.yourdomain.com → your-server.com
ecom2.yourdomain.com → your-server.com
ecom3.yourdomain.com → your-server.com
```

### 2. Environment Variables

```bash
# Production environment
export TIGRIS_ACCESS_KEY_ID=your-production-key
export TIGRIS_SECRET_ACCESS_KEY=your-production-secret
export MONGODB_URI=mongodb://your-production-mongo
```

### 3. SSL Certificates

Configure SSL for each subdomain:
- `ecom1.yourdomain.com`
- `ecom2.yourdomain.com`
- `ecom3.yourdomain.com`

## 🔧 Troubleshooting

### Common Issues

1. **Subdomain not working**
   ```bash
   # Check hosts file
   cat /etc/hosts | grep localhost
   
   # Test with curl
   curl -H "Host: ecom1.localhost:5000" http://localhost:5000/api/tenant/info
   ```

2. **Database connection failed**
   ```bash
   # Check MongoDB connection
   mongosh mongodb://localhost:27017/ecommerce_ecom1
   ```

3. **Tigris connection failed**
   ```bash
   # Test Tigris connection
   curl -X POST http://localhost:5000/api/subdomain-configs/ecom1/test-tigris
   ```

### Debug Mode

Enable debug logging:

```bash
# Add to .env
DEBUG_SUBDOMAIN=true
DEBUG_TIGRIS=true
```

## 📊 Monitoring

### Check Subdomain Status

```bash
# List all configurations
curl http://localhost:5000/api/subdomain-configs

# Check specific subdomain
curl http://localhost:5000/api/subdomain-configs/ecom1
```

### Database Status

```bash
# Check database connections
mongosh --eval "db.adminCommand('listDatabases')"
```

### Storage Status

```bash
# Test Tigris connection for each subdomain
curl -X POST http://localhost:5000/api/subdomain-configs/ecom1/test-tigris
curl -X POST http://localhost:5000/api/subdomain-configs/ecom2/test-tigris
```

## 🎉 You're All Set!

Your multi-tenant subdomain architecture is now ready! Each subdomain will have:
- ✅ **Isolated Database** - Separate MongoDB database
- ✅ **Isolated Storage** - Separate Tigris bucket
- ✅ **Independent Configuration** - Custom features and limits
- ✅ **Admin Management** - Easy configuration through UI

**Next Steps:**
1. Configure your hosts file
2. Set up Tigris credentials
3. Test with different subdomains
4. Add more subdomains as needed

**Happy multi-tenant development! 🚀**
