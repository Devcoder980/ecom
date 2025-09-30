import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import database schema
import { DATABASE_SCHEMA } from '../schema/database-schema.js';
import { 
  getAllSchemas, 
  getSchemaByTable, 
  createSchema, 
  updateSchema, 
  deleteSchema,
  generateSchemaFile,
  getDynamicModel
} from './schema-manager.js';

// 🔗 MongoDB connect
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce_admin";
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB");

// 🗄️ Auto-create tables if they don't exist
const initializeDatabase = async () => {
  try {
    console.log("🚀 Initializing database tables...");
    
    // Check if any schemas exist in database
    const existingSchemas = await getAllSchemas();
    console.log(`📋 Found ${existingSchemas.length} existing schemas in database`);
    
    if (existingSchemas.length === 0) {
      console.log("⚠️  No schemas found in database. Creating from DATABASE_SCHEMA...");
      
      // Create all schemas from DATABASE_SCHEMA
      for (const [tableName, schemaData] of Object.entries(DATABASE_SCHEMA)) {
        try {
          console.log(`📝 Creating schema for ${tableName}...`);
          
          // Convert schema fields from object to array format
          const fieldsArray = Object.entries(schemaData.fields).map(([fieldName, fieldData]) => ({
            name: fieldName,
            ...fieldData
          }));
          
          const schemaToCreate = {
            tableName: tableName,
            label: schemaData.label,
            description: schemaData.description,
            fields: fieldsArray,
            isActive: true
          };
          
          await createSchema(schemaToCreate);
          console.log(`✅ Schema created for ${tableName}`);
        } catch (error) {
          console.error(`❌ Error creating schema for ${tableName}:`, error.message);
        }
      }
      
      console.log("🎉 Database initialization completed!");
    } else {
      console.log("✅ Database already has schemas. Skipping initialization.");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
};

// Initialize database on startup
await initializeDatabase();

// Cache for dynamic models
const models = {};

// Function to clear model cache
function clearModelCache(collectionName = null) {
  if (collectionName) {
    // Clear specific model
    delete models[collectionName];
    if (mongoose.models[collectionName]) {
      delete mongoose.models[collectionName];
    }
  } else {
    // Clear all models
    Object.keys(models).forEach(key => delete models[key]);
    Object.keys(mongoose.models).forEach(key => {
      if (key !== 'SchemaDefinition') { // Keep schema definition model
        delete mongoose.models[key];
      }
    });
  }
}

// Function to normalize table names and handle pluralization
function normalizeTableName(tableName) {
  // Common pluralization mappings
  const pluralMappings = {
    'categorys': 'categories',
    'category': 'categories',
    'product': 'products',
    'user': 'users',
    'order': 'orders',
    'customer': 'customers',
    'review': 'reviews',
    'coupon': 'coupons',
    'inquiry': 'inquiries',
    'blog_post': 'blog_posts',
    'blog_category': 'blog_categories',
    'cms_page': 'cms_pages',
    'faq': 'faqs',
    'menu': 'menus',
    'banner': 'banners',
    'media': 'media',
    'setting': 'settings',
    'activity_log': 'activity_logs'
  };
  
  // Check if we have a direct mapping
  if (pluralMappings[tableName]) {
    return pluralMappings[tableName];
  }
  
  // If not found, return the original name
  return tableName;
}

async function getModel(collectionName) {
  // Normalize the collection name first
  const normalizedName = normalizeTableName(collectionName);
  
  if (!models[normalizedName]) {
    try {
      // Check if model already exists in mongoose
      if (mongoose.models[normalizedName]) {
        // Delete existing model to allow recompilation
        delete mongoose.models[normalizedName];
      }
      
      // Try to get schema from database first
      const schema = await getSchemaByTable(normalizedName);
      const mongooseSchema = new mongoose.Schema({}, { strict: false });
      models[normalizedName] = mongoose.model(normalizedName, mongooseSchema);
    } catch (error) {
      // Fallback to static schema
      const staticSchema = DATABASE_SCHEMA[normalizedName];
      if (!staticSchema) {
        throw new Error(`Schema not found for collection: ${collectionName} (normalized: ${normalizedName})`);
      }
      
      // Check if model already exists in mongoose
      if (mongoose.models[normalizedName]) {
        // Delete existing model to allow recompilation
        delete mongoose.models[normalizedName];
      }
      
      const mongooseSchema = new mongoose.Schema({}, { strict: false });
      models[normalizedName] = mongoose.model(normalizedName, mongooseSchema);
    }
  }
  return models[normalizedName];
}

// 🟢 Create

// 📋 Get all available collections/schemas
app.get("/api/schemas", async (req, res) => {
  try {
    const schemas = await getAllSchemas();
    const schemaList = schemas.map(schema => ({
      _id: schema._id,
      name: schema.tableName,
      label: schema.label,
      description: schema.description,
      fieldCount: schema.fields.length,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt
    }));
    
    res.json(schemaList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 SCHEMA MANAGEMENT APIs

// Get schema definition by table name
app.get("/api/schema/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const schema = await getSchemaByTable(tableName);
    res.json(schema);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// 🔗 Get relationship data for a specific table
app.get("/api/relationship/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const { search = '', limit = 1000, displayField = 'name' } = req.query;
    
    console.log(`🔗 Relationship request for table: ${tableName}`);
    console.log(`🔗 Normalized table name: ${normalizeTableName(tableName)}`);
    
    const Model = await getModel(tableName);
    let query = {};
    
    // Add search functionality if search term provided
    if (search) {
      query = {
        $or: [
          { [displayField]: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { label: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const data = await Model.find(query)
      .limit(parseInt(limit))
      .select('_id name title label sku email')
      .lean();
    
    res.json({
      success: true,
      data: data,
      total: data.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new schema definition
app.post("/api/schema", async (req, res) => {
  try {
    const schema = await createSchema(req.body);
    await generateSchemaFile(); // Update the schema file
    res.json({ success: true, data: schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update schema definition
app.put("/api/schema/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const schema = await updateSchema(id, req.body);
    await generateSchemaFile(); // Update the schema file
    res.json({ success: true, data: schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete schema definition
app.delete("/api/schema/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const schema = await deleteSchema(id);
    await generateSchemaFile(); // Update the schema file
    res.json({ success: true, data: schema });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Regenerate schema file
app.post("/api/schema/regenerate", async (req, res) => {
  try {
    const schemaObject = await generateSchemaFile();
    res.json({ 
      success: true, 
      message: "Schema file regenerated successfully",
      collections: Object.keys(schemaObject).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧹 Clear model cache
app.post("/api/models/clear", (req, res) => {
  try {
    const { collection } = req.body;
    clearModelCache(collection);
    res.json({ 
      success: true, 
      message: collection ? `Model cache cleared for ${collection}` : 'All model cache cleared' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗄️ Initialize database tables
app.post("/api/database/initialize", async (req, res) => {
  try {
    console.log("🚀 Manual database initialization triggered...");
    
    // Check if any schemas exist in database
    const existingSchemas = await getAllSchemas();
    console.log(`📋 Found ${existingSchemas.length} existing schemas in database`);
    
    if (existingSchemas.length === 0) {
      console.log("⚠️  No schemas found in database. Creating from DATABASE_SCHEMA...");
      
      let createdCount = 0;
      let errorCount = 0;
      
      // Create all schemas from DATABASE_SCHEMA
      for (const [tableName, schemaData] of Object.entries(DATABASE_SCHEMA)) {
        try {
          console.log(`📝 Creating schema for ${tableName}...`);
          
          // Convert schema fields from object to array format
          const fieldsArray = Object.entries(schemaData.fields).map(([fieldName, fieldData]) => ({
            name: fieldName,
            ...fieldData
          }));
          
          const schemaToCreate = {
            tableName: tableName,
            label: schemaData.label,
            description: schemaData.description,
            fields: fieldsArray,
            isActive: true
          };
          
          await createSchema(schemaToCreate);
          console.log(`✅ Schema created for ${tableName}`);
          createdCount++;
        } catch (error) {
          console.error(`❌ Error creating schema for ${tableName}:`, error.message);
          errorCount++;
        }
      }
      
      res.json({ 
        success: true, 
        message: `Database initialization completed! Created ${createdCount} schemas, ${errorCount} errors.`,
        created: createdCount,
        errors: errorCount
      });
    } else {
      res.json({ 
        success: true, 
        message: `Database already has ${existingSchemas.length} schemas. No initialization needed.`,
        existing: existingSchemas.length
      });
    }
  } catch (error) {
    console.error("❌ Error during manual initialization:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔵 Read all with pagination and search
app.get("/api/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 10, search = "", sortBy = "_id", sortOrder = "desc" } = req.query;
    
    const Model = await getModel(collection);
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

// 📊 Get collection stats
app.get("/api/:collection/stats", async (req, res) => {
  try {
    const { collection } = req.params;
    const Model = await getModel(collection);
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

// 📋 Get schema for a collection
app.get("/api/:collection/schema", async (req, res) => {
  try {
    const { collection } = req.params;
    const schema = DATABASE_SCHEMA[collection];
    
    if (!schema) {
      return res.status(404).json({ error: "Schema not found for collection" });
    }
    
    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Read by ID
app.get("/api/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const Model = await getModel(collection);
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
    const Model = await getModel(collection);
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
    const Model = await getModel(collection);
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 File upload endpoint
app.post("/api/upload", upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Multiple file upload endpoint
app.post("/api/upload-multiple", upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));
    
    res.json({
      success: true,
      files: files
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Table-specific file upload endpoint (supports multiple files)
app.post("/api/:collection/upload", upload.any(), async (req, res) => {
  try {
    const { collection } = req.params;
    const { fieldName, recordId } = req.body;
    
    console.log(`📁 File upload for ${collection}:`);
    console.log('📄 Body:', req.body);
    console.log('📁 Files:', req.files);
    console.log('🆔 Record ID:', recordId);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const uploadedFiles = {};
    
    // Group files by field name
    req.files.forEach(file => {
      const fileFieldName = file.fieldname;
      const fileUrl = `/uploads/${file.filename}`;
      
      console.log(`📁 Processing file: fieldname=${fileFieldName}, filename=${file.filename}`);
      
      if (!uploadedFiles[fileFieldName]) {
        uploadedFiles[fileFieldName] = [];
      }
      uploadedFiles[fileFieldName].push(fileUrl);
      
      console.log(`📁 File uploaded: ${fileFieldName} -> /uploads/${file.filename}`);
    });
    
    // Convert single file arrays to single URLs for backward compatibility
    const processedFiles = {};
    Object.keys(uploadedFiles).forEach(fieldName => {
      if (uploadedFiles[fieldName].length === 1) {
        processedFiles[fieldName] = uploadedFiles[fieldName][0];
      } else {
        processedFiles[fieldName] = uploadedFiles[fieldName];
      }
    });
    
    // If recordId is provided, update the existing record with the new file URLs
    if (recordId) {
      try {
        const Model = await getModel(collection);
        const updateData = {};
        
        // Update each field with its uploaded files
        Object.keys(processedFiles).forEach(fieldName => {
          updateData[fieldName] = processedFiles[fieldName];
          console.log(`📝 Setting ${fieldName} = ${processedFiles[fieldName]}`);
        });
        
        console.log(`📝 Final updateData:`, updateData);
        
        const updatedRecord = await Model.findByIdAndUpdate(
          recordId,
          { $set: updateData },
          { new: true }
        );
        
        if (updatedRecord) {
          console.log(`✅ Updated record ${recordId} with new files:`, updateData);
          console.log(`📄 Updated record data:`, updatedRecord);
        } else {
          console.log(`⚠️ Record ${recordId} not found for update`);
        }
      } catch (updateErr) {
        console.error('❌ Error updating record with files:', updateErr);
        // Don't fail the upload if record update fails
      }
    }
    
    res.json({
      success: true,
      collection: collection,
      fieldName: fieldName,
      recordId: recordId,
      uploadedFiles: processedFiles
    });
  } catch (err) {
    console.error('❌ Error uploading file:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Create new document (JSON only, no files)
app.post("/api/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const Model = await getModel(collection);
    
    console.log(`📝 Creating document in ${collection}:`);
    console.log('📄 Body:', req.body);
    
    const doc = new Model(req.body);
    await doc.save();
    console.log('✅ Document saved successfully:', doc._id);
    res.json({ success: true, data: doc, id: doc._id });
  } catch (err) {
    console.error('❌ Error creating document:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🔄 Update document (JSON only, no files)
app.put("/api/:collection/:id", async (req, res) => {
  try {
    const { collection, id } = req.params;
    const Model = await getModel(collection);
    
    console.log(`📝 Updating document in ${collection}:`);
    console.log('📄 Body:', req.body);
    
    const doc = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    console.log('✅ Document updated successfully:', doc._id);
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('❌ Error updating document:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));