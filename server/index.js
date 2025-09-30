import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { DATABASE_SCHEMA, getTableDefinition } from "../shared/database-schema.js";
import { cleanupOrphanedFiles, getFileStats } from "./utils/fileCleanup.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldName = file.fieldname;
    const uploadPath = path.join(uploadsDir, fieldName);
    
    // Create subdirectory for each field type
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File type validation function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/svg+xml': ['.svg'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
    'application/zip': ['.zip'],
    'application/x-rar-compressed': ['.rar']
  };

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Check if file type is allowed
  if (allowedTypes[mimeType] && allowedTypes[mimeType].includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${mimeType} is not allowed. Allowed types: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Error handling middleware for file uploads
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name.' });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({ error: error.message });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({ error: 'File upload failed' });
});

// 🔗 MongoDB connect
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_admin";
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB");

// Cache for dynamic models
const models = {};

// Schema validation function
function validateData(tableName, data) {
  const tableDef = getTableDefinition(tableName);
  if (!tableDef) {
    throw new Error(`Table ${tableName} not found in schema`);
  }

  const errors = [];
  
  for (const field of tableDef.fields) {
    const value = data[field.name];
    
    // Required field validation
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label} is required`);
      continue;
    }
    
    // Skip validation if field is not provided and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Type validation
    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field.label} must be a valid email`);
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`${field.label} must be a valid URL`);
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`${field.label} must be a number`);
        } else {
          const numValue = Number(value);
          if (field.validation?.min !== undefined && numValue < field.validation.min) {
            errors.push(`${field.label} must be at least ${field.validation.min}`);
          }
          if (field.validation?.max !== undefined && numValue > field.validation.max) {
            errors.push(`${field.label} must be at most ${field.validation.max}`);
          }
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors.push(`${field.label} must be true or false`);
        }
        break;
    }
    
    // Pattern validation
    if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
      errors.push(`${field.label} format is invalid`);
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return true;
}

function getModel(collectionName) {
  if (!models[collectionName]) {
    // Very simple dynamic schema
    const schema = new mongoose.Schema({}, { strict: false });
    models[collectionName] = mongoose.model(
      collectionName,
      schema,
      collectionName
    );
  }
  return models[collectionName];
}

// 📁 File Upload Endpoint
app.post("/api/upload/:fieldName", upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;
    
    // Log file upload
    console.log(`File uploaded: ${req.file.originalname} -> ${req.file.filename}`);
    
    res.json({
      success: true,
      fileUrl: fileUrl,
      fullUrl: fullUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      fieldname: req.file.fieldname,
      uploadedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📁 Multiple File Upload Endpoint
app.post("/api/upload-multiple/:fieldName", upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files.map(file => {
      const fileUrl = `/uploads/${file.fieldname}/${file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;
      
      return {
        fileUrl: fileUrl,
        fullUrl: fullUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        fieldname: file.fieldname,
        uploadedAt: new Date().toISOString()
      };
    });
    
    console.log(`Multiple files uploaded: ${files.length} files`);
    
    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (err) {
    console.error('Multiple file upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ File Delete Endpoint
app.delete("/api/upload/:fieldName/:filename", (req, res) => {
  try {
    const { fieldName, filename } = req.params;
    const filePath = path.join(uploadsDir, fieldName, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    console.log(`File deleted: ${filePath}`);
    
    res.json({
      success: true,
      message: 'File deleted successfully',
      filename: filename
    });
  } catch (err) {
    console.error('File deletion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📁 Get File Info Endpoint
app.get("/api/upload/:fieldName/:filename", (req, res) => {
  try {
    const { fieldName, filename } = req.params;
    const filePath = path.join(uploadsDir, fieldName, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const stats = fs.statSync(filePath);
    const fileUrl = `/uploads/${fieldName}/${filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;
    
    res.json({
      success: true,
      fileUrl: fileUrl,
      fullUrl: fullUrl,
      filename: filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    });
  } catch (err) {
    console.error('File info error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🧹 File Cleanup Endpoint
app.post("/api/upload/cleanup/:fieldName", async (req, res) => {
  try {
    const { fieldName } = req.params;
    const Model = getModel('media'); // Use media collection for cleanup
    
    const result = await cleanupOrphanedFiles(Model, fieldName);
    
    res.json({
      success: true,
      message: `Cleanup completed for ${fieldName}`,
      cleaned: result.cleaned,
      errors: result.errors
    });
  } catch (err) {
    console.error('File cleanup error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📊 File Statistics Endpoint
app.get("/api/upload/stats/:fieldName", (req, res) => {
  try {
    const { fieldName } = req.params;
    const stats = getFileStats(fieldName);
    
    res.json({
      success: true,
      fieldName: fieldName,
      stats: stats
    });
  } catch (err) {
    console.error('File stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Create
app.post("/api/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    
    // Validate data against schema
    validateData(collection, req.body);
    
    const Model = getModel(collection);
    const doc = new Model(req.body);
    await doc.save();
    res.json({ success: true, data: doc, id: doc._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Read all with pagination and search
app.get("/api/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 10, search = "", sortBy = "_id", sortOrder = "desc" } = req.query;
    
    const Model = getModel(collection);
    const query = {};
    
    // Simple search across all fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    
    const docs = await Model.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Model.countDocuments(query);
    
    res.json({
      data: docs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Read by ID
app.get("/api/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const Model = getModel(collection);
    const doc = await Model.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟡 Update
app.put("/api/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    // Validate data against schema
    validateData(collection, req.body);
    
    const Model = getModel(collection);
    const doc = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 Delete
app.delete("/api/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const Model = getModel(collection);
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 Get collection stats
app.get("/api/:collection/stats", async (req, res) => {
  try {
    const { collection } = req.params;
    const Model = getModel(collection);
    const total = await Model.countDocuments();
    const active = await Model.countDocuments({ is_active: true });
    const inactive = await Model.countDocuments({ is_active: false });
    
    res.json({
      total,
      active,
      inactive
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get schema definition
app.get("/api/schema/:collection", (req, res) => {
  try {
    const { collection } = req.params;
    const tableDef = getTableDefinition(collection);
    if (!tableDef) {
      return res.status(404).json({ error: "Table not found in schema" });
    }
    res.json({ success: true, data: tableDef });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get all schemas
app.get("/api/schema", (req, res) => {
  try {
    res.json({ success: true, data: DATABASE_SCHEMA });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));