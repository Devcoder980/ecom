# E-commerce Admin Dashboard - Schema-Driven UI

A comprehensive admin dashboard for e-commerce management built with **Schema-Driven UI** approach using React + TypeScript frontend and Node.js + MongoDB backend.

## 🎯 **Schema-Driven UI Features**

- **Single Source of Truth** - One schema file defines everything
- **Automatic Form Generation** - Forms are generated from schema definition
- **Dynamic Validation** - Client and server validation from schema
- **Type-Safe Development** - Full TypeScript support
- **SEO-Optimized Fields** - Built-in SEO field management
- **No Code Duplication** - Add new tables without writing forms

## Features

- **Complete CRUD Operations** for all database tables
- **Dynamic Table Management** - No need to create separate CRUD for each table
- **SEO-Friendly Database Schema** with all necessary fields
- **Responsive Admin Dashboard** with HTML/CSS styling (no Tailwind)
- **Real-time Statistics** and overview
- **Search and Pagination** for all tables
- **Schema-Driven Forms** - Automatically generated from schema

## 🗄️ **Database Tables Included**

- **Users & Authentication** - User management with roles
- **Categories** - Product categories with full SEO support
- **Products** - Product catalog with variants and SEO
- **Customers & Addresses** - Customer information management
- **Orders & Order Items** - Order processing and tracking
- **Blog Posts & Categories** - Content management with SEO
- **CMS Pages** - Static pages with SEO optimization
- **Reviews & Testimonials** - Customer feedback system
- **Inquiries & Quote Requests** - Lead management
- **Newsletter Subscribers** - Email marketing
- **Coupons & Discounts** - Promotion management
- **Banners & Sliders** - Homepage content
- **Navigation Menus** - Site navigation
- **Media Library** - File management
- **Settings & Company Info** - System configuration
- **SEO Meta Overrides** - Advanced SEO control
- **Activity Logs** - Audit trail

## 🔧 **Schema-Driven Architecture**

### Single Schema File (`shared/database-schema.ts`)
```typescript
export const DATABASE_SCHEMA = {
  users: {
    name: 'users',
    label: 'Users',
    description: 'User accounts and authentication',
    fields: [
      { name: 'name', type: 'string', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'role', type: 'select', label: 'Role', options: [...] },
      // ... more fields
    ]
  }
  // ... more tables
};
```

### Automatic Features
- **Form Generation** - Forms created from schema
- **Validation** - Client & server validation
- **Field Types** - Input types determined automatically
- **SEO Fields** - Special handling for SEO fields
- **Relationships** - Table relationships defined in schema

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Dynamic schema generation
- RESTful API endpoints

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Custom HTML/CSS styling

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 3. Environment Setup

Create `.env` file in the server directory:
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce_admin
PORT=5000
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client # Frontend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

All endpoints follow the pattern: `/api/:collection`

### CRUD Operations
- `GET /api/:collection` - List all records with pagination
- `GET /api/:collection/:id` - Get single record
- `POST /api/:collection` - Create new record
- `PUT /api/:collection/:id` - Update record
- `DELETE /api/:collection/:id` - Delete record
- `GET /api/:collection/stats` - Get collection statistics

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)
- `search` - Search term
- `sortBy` - Sort field (default: _id)
- `sortOrder` - Sort direction (asc/desc, default: desc)

## Usage

### Dashboard
- View overall statistics
- Quick access to all tables
- Navigate to table management

### Table Management
- Select any table from dropdown
- View, create, edit, delete records
- Search and sort functionality
- Pagination support

### Dynamic Forms
- Forms are generated automatically based on table structure
- No need to create separate forms for each table
- All CRUD operations work seamlessly

## Database Schema

The database includes comprehensive SEO fields for:
- Meta titles and descriptions
- Open Graph tags
- Schema.org structured data
- Canonical URLs
- Focus keywords
- Alt text for images

## Development

### Project Structure
```
├── server/                 # Backend Node.js application
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   └── package.json       # Frontend dependencies
└── package.json          # Root package.json
```

### Adding New Tables
The system automatically handles new tables. Just add them to the MongoDB database and they will be available in the admin interface.

### Customization
- Modify `client/src/components/TableManager.tsx` for table-specific customizations
- Update `client/src/types/index.ts` for TypeScript type definitions
- Customize styling in `client/src/App.css`

## License

MIT License - feel free to use this project for your e-commerce needs.