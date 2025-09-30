import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { DATABASE_SCHEMA, getTableDefinition } from "../shared/database-schema.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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