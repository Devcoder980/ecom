// ============================================
// CLOUDFLARE R2 STORAGE SERVICE
// Multi-tenant file storage with subdomain support
// ============================================

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import crypto from 'crypto';

// R2 Configuration
const r2Config = {
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT || 'https://your-account-id.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for R2
};

// Create S3 client for R2
const s3Client = new S3Client(r2Config);

// Multi-tenant bucket configuration
const getBucketName = (subdomain) => {
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    return `${subdomain}-ecommerce-storage`;
  }
  return process.env.R2_BUCKET_NAME || 'ecommerce-storage';
};

// Generate unique filename
const generateUniqueFilename = (originalname, subdomain = 'default') => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const extension = path.extname(originalname);
  const name = path.basename(originalname, extension);
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${subdomain}/${timestamp}-${randomString}-${sanitizedName}${extension}`;
};

// R2 Storage Service Class
class R2StorageService {
  constructor(subdomain = 'default') {
    this.subdomain = subdomain;
    this.bucketName = getBucketName(subdomain);
  }

  // Upload file to R2
  async uploadFile(file, customPath = null) {
    try {
      const key = customPath || generateUniqueFilename(file.originalname, this.subdomain);
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make files publicly accessible
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
          subdomain: this.subdomain,
        },
      });

      const result = await s3Client.send(command);
      
      // Return public URL
      const publicUrl = `${process.env.R2_PUBLIC_URL || r2Config.endpoint}/${this.bucketName}/${key}`;
      
      return {
        success: true,
        key,
        url: publicUrl,
        bucket: this.bucketName,
        etag: result.ETag,
        size: file.size,
        originalName: file.originalname,
      };
    } catch (error) {
      console.error('❌ R2 Upload Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, customPath = null) {
    const results = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, customPath);
      results.push(result);
    }
    
    return results;
  }

  // Delete file from R2
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await s3Client.send(command);
      
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      console.error('❌ R2 Delete Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get signed URL for private files (if needed)
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      
      return {
        success: true,
        signedUrl,
        expiresIn,
      };
    } catch (error) {
      console.error('❌ R2 Signed URL Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get public URL
  getPublicUrl(key) {
    return `${process.env.R2_PUBLIC_URL || r2Config.endpoint}/${this.bucketName}/${key}`;
  }
}

// Multer configuration for R2
const createMulterConfig = (subdomain = 'default') => {
  const storage = multerS3({
    s3: s3Client,
    bucket: getBucketName(subdomain),
    key: (req, file, cb) => {
      const key = generateUniqueFilename(file.originalname, subdomain);
      cb(null, key);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
        subdomain: subdomain,
      });
    },
    acl: 'public-read',
  });

  return multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow common image and document types
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
      }
    },
  });
};

// Middleware to extract subdomain
const extractSubdomain = (req, res, next) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];
  
  // Skip www and localhost
  if (subdomain === 'www' || subdomain === 'localhost' || subdomain === '127.0.0.1') {
    req.subdomain = 'default';
  } else {
    req.subdomain = subdomain;
  }
  
  console.log(`🌐 Request from subdomain: ${req.subdomain}`);
  next();
};

// Initialize R2 storage for a specific subdomain
const initializeR2Storage = (subdomain = 'default') => {
  return new R2StorageService(subdomain);
};

export {
  R2StorageService,
  createMulterConfig,
  extractSubdomain,
  initializeR2Storage,
  getBucketName,
  generateUniqueFilename,
};
