# E-commerce Admin Setup Guide

## ✅ Simplified Architecture

The system has been simplified to work with a single database without subdomain complexity. Tigris cloud storage is properly integrated for file uploads.

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://prabhudevrndtechnosoft_db_user:t4ybtSMowqcDyA2l@cluster0.klz0mpb.mongodb.net

# Server Configuration
PORT=5000
NODE_ENV=development

# Tigris Storage Configuration (S3-compatible)
TIGRIS_STORAGE_ACCESS_KEY_ID=tid_pORgpiUGUJSWbeWtEXSZJSHqRNGyFIGNWlGnycbeQbGBVloFra
TIGRIS_STORAGE_SECRET_ACCESS_KEY=tsec_j+RSs+1ES3RYUilYdzYXU1oMnJjnelUBIvqlsPU7sGQ21crDpRe3Kqw3Cp1GAnu42laH+7
TIGRIS_STORAGE_ENDPOINT=https://t3.storage.dev
TIGRIS_BUCKET_NAME=ecommerce-storage
```

### 3. Start Backend

```bash
npm start
```

The backend will:
- Connect to MongoDB (`ecommerce` database)
- Auto-initialize database schemas if empty
- Configure Tigris storage if credentials are provided
- Fallback to local storage if Tigris is not configured
- Listen on http://localhost:5000

### 4. Frontend Setup

```bash
cd client
npm install
npm start
```

The frontend will start on http://localhost:3000

## 📦 Storage Configuration

The system supports two storage modes:

### ☁️ Tigris Cloud Storage (Recommended)
- **Automatic**: If `TIGRIS_STORAGE_ACCESS_KEY_ID` and `TIGRIS_STORAGE_SECRET_ACCESS_KEY` are set
- Files are stored in Tigris S3-compatible cloud storage
- Public URLs are automatically generated
- 10 MB file size limit
- Supports: Images (JPEG, PNG, GIF, WebP, SVG) and Documents (PDF, DOC, DOCX, XLS, XLSX)

### 💾 Local Storage (Fallback)
- **Automatic**: If Tigris credentials are not provided
- Files are stored in `server/uploads/` directory
- Accessible via http://localhost:5000/uploads/
- Same file size and type limits as Tigris

## 🗄️ Database Schema

The system uses a dynamic schema system:

1. **Default Schemas**: Defined in `schema/database-schema.js`
2. **Auto-initialization**: Schemas are automatically created on first connection
3. **Schema Management**: Use the `/schema` page to view and manage schemas
4. **Table Management**: Use the `/tables` page to manage data

### Pre-configured Tables

- **users**: User accounts and authentication
- **categories**: Product categories with SEO
- **subcategories**: Product subcategories
- **products**: Product catalog with variants
- **customers**: Customer information
- **orders**: Order management
- **blog_posts**: Content management
- **reviews**: Customer reviews
- **inquiries**: Customer support
- **coupons**: Discount codes
- **banners**: Homepage banners
- **menus**: Navigation menus
- **media**: File management
- **settings**: System configuration
- **company_info**: Business information
- And many more...

## 🔧 Key Features

### 1. Dynamic Schema Management
- Create, update, and delete schemas via UI
- Support for all field types (text, number, date, select, file, relationship, etc.)
- Automatic MongoDB model generation

### 2. Relationship Fields
- Link tables together (e.g., products → categories)
- Searchable dropdowns for related data
- Display custom fields from related records

### 3. File Upload
- Single and multiple file uploads
- Image preview
- Automatic cloud/local storage handling
- Progress tracking

### 4. Data Management
- CRUD operations for all tables
- Search and filter
- Pagination
- Sorting

## 📁 Project Structure

```
ecom/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SchemaManager.tsx
│   │   │   ├── TableManager.tsx
│   │   │   └── FileUploadStatus.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
│
├── server/                    # Express backend
│   ├── index.js              # Main server file
│   ├── storage-service.js    # Tigris storage integration
│   ├── schema-manager.js     # Schema management
│   ├── .env                  # Environment variables
│   └── package.json
│
└── schema/
    └── database-schema.js    # Default schema definitions
```

## 🔄 API Endpoints

### Schema Management
- `GET /api/schemas` - Get all schemas
- `GET /api/schemas/:table` - Get schema for specific table
- `POST /api/schemas` - Create new schema
- `PUT /api/schemas/:table` - Update schema
- `DELETE /api/schemas/:table` - Delete schema

### Data Management
- `GET /api/:collection` - Get all records (with pagination)
- `GET /api/:collection/:id` - Get single record
- `POST /api/:collection` - Create new record
- `PUT /api/:collection/:id` - Update record
- `DELETE /api/:collection/:id` - Delete record

### File Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload-multiple` - Upload multiple files
- `POST /api/:collection/upload` - Upload files for specific collection

### Relationships
- `GET /api/relationship/:collection` - Get related data for dropdowns

## 🎯 Development Tips

1. **Schema Changes**: Always update schemas via the UI to keep MongoDB models in sync
2. **File Uploads**: Use the `FileUploadStatus` component for consistent upload UI
3. **Relationships**: Configure `relationshipTable` and `relationshipDisplayField` in schema
4. **Storage**: Check console logs to see if Tigris or local storage is being used

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure port 5000 is not in use
- Verify environment variables are set

### Files not uploading
- Check Tigris credentials if using cloud storage
- Verify `uploads/` directory exists for local storage
- Check file size (max 10MB) and type

### Database schema issues
- Clear MongoDB collection if needed
- Restart server to re-initialize schemas
- Use `/api/database/initialize` endpoint to manually initialize

## 📝 Notes

- **Removed Features**: Subdomain multi-tenancy has been removed for simplicity
- **Storage**: Tigris is preferred but local storage works as fallback
- **Database**: Single `ecommerce` database is used
- **Security**: Add authentication/authorization before production use

## 🚀 Next Steps

1. Add user authentication
2. Implement role-based access control
3. Add data validation
4. Configure production MongoDB Atlas
5. Set up Tigris bucket with custom domain
6. Add email notifications
7. Implement audit logging

---

**Happy Coding! 🎉**

