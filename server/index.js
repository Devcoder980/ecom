import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));