import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Tigris S3-compatible storage configuration
// Support both naming conventions (with and without _STORAGE)
const accessKeyId = process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || process.env.TIGRIS_ACCESS_KEY_ID;
const secretAccessKey = process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || process.env.TIGRIS_SECRET_ACCESS_KEY;
const endpoint = process.env.TIGRIS_STORAGE_ENDPOINT || process.env.TIGRIS_ENDPOINT || 'https://fly.storage.tigris.dev';

const tigrisConfig = {
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: false,
};

console.log('🔍 Checking Tigris credentials...');
console.log('Access Key:', accessKeyId ? '✅ Set' : '❌ Not set');
console.log('Secret Key:', secretAccessKey ? '✅ Set' : '❌ Not set');
console.log('Endpoint:', tigrisConfig.endpoint);

// Create S3 client for Tigris
let s3Client = null;
let isTigrisConfigured = false;

// Check if Tigris is configured
if (tigrisConfig.credentials.accessKeyId && tigrisConfig.credentials.secretAccessKey) {
  try {
    s3Client = new S3Client(tigrisConfig);
    isTigrisConfigured = true;
    console.log('✅ Tigris storage configured successfully');
  } catch (error) {
    console.error('❌ Error configuring Tigris storage:', error.message);
    throw new Error('Tigris storage configuration failed. Please check your credentials.');
  }
} else {
  console.error('❌ Tigris credentials are missing!');
  console.error('Please create a .env file in the server directory with:');
  console.error('TIGRIS_STORAGE_ACCESS_KEY_ID=your_access_key');
  console.error('TIGRIS_STORAGE_SECRET_ACCESS_KEY=your_secret_key');
  throw new Error('Tigris credentials are required. Please check your .env file');
}

// Bucket name - support both naming conventions
const BUCKET_NAME = process.env.TIGRIS_STORAGE_BUCKET || process.env.TIGRIS_BUCKET_NAME || process.env.TIGRIS_BUCKET || 'ecom';
console.log('📦 Bucket Name:', BUCKET_NAME);

// Generate unique filename
const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname);
  const nameWithoutExt = path.basename(originalname, ext);
  return `${nameWithoutExt}-${timestamp}-${randomString}${ext}`;
};

// Tigris Storage Service Class
export class TigrisStorageService {
  constructor() {
    this.s3Client = s3Client;
    this.bucketName = BUCKET_NAME;
    this.isConfigured = isTigrisConfigured;
  }

  // Upload single file
  async uploadFile(file, folder = 'uploads') {
    if (!this.isConfigured) {
      throw new Error('Tigris storage is not configured');
    }

    const filename = generateUniqueFilename(file.originalname);
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
      
      return {
        filename: filename,
        key: key,
        url: this.getPublicUrl(key),
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      console.error('❌ Tigris upload error:', error);
      throw new Error(`Failed to upload file to Tigris: ${error.message}`);
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = 'uploads') {
    if (!this.isConfigured) {
      throw new Error('Tigris storage is not configured');
    }

    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  // Delete file
  async deleteFile(key) {
    if (!this.isConfigured) {
      throw new Error('Tigris storage is not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      return { success: true, key };
    } catch (error) {
      console.error('❌ Tigris delete error:', error);
      throw new Error(`Failed to delete file from Tigris: ${error.message}`);
    }
  }

  // Get public URL for a file
  getPublicUrl(key) {
    // Tigris public URL format: https://bucket-name.fly.storage.tigris.dev/path
    return `https://${this.bucketName}.fly.storage.tigris.dev/${key}`;
  }
}

// Create Multer configuration for Tigris
export const createTigrisMulter = () => {
  if (!isTigrisConfigured) {
    console.error('❌ Cannot create Tigris multer - not configured');
    return null;
  }

  try {
    const storage = multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const filename = generateUniqueFilename(file.originalname);
        const key = `uploads/${filename}`;
        console.log(`🔑 Generated key for upload: ${key}`);
        cb(null, key);
      },
    });

    console.log('✅ Multer storage configured for Tigris');

    return multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        console.log(`📋 Checking file: ${file.originalname}, type: ${file.mimetype}`);
        
        // Allow images and documents
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          console.log(`✅ File type allowed: ${file.mimetype}`);
          cb(null, true);
        } else {
          console.log(`❌ File type rejected: ${file.mimetype}`);
          cb(new Error('Invalid file type. Only images and documents are allowed.'));
        }
      },
    });
  } catch (error) {
    console.error('❌ Error creating Tigris multer:', error);
    throw error;
  }
};

// Export storage instance
export const tigrisStorage = new TigrisStorageService();

// Export configuration status
export const isTigrisEnabled = isTigrisConfigured;

export default {
  TigrisStorageService,
  tigrisStorage,
  createTigrisMulter,
  isTigrisEnabled,
};

