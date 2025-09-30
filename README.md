# E-commerce Admin Dashboard

A comprehensive admin dashboard for e-commerce management built with React + TypeScript frontend and Node.js + MongoDB backend.

## Features

- **Complete CRUD Operations** for all database tables
- **Dynamic Table Management** - No need to create separate CRUD for each table
- **SEO-Friendly Database Schema** with all necessary fields
- **Responsive Admin Dashboard** with HTML/CSS styling (no Tailwind)
- **Real-time Statistics** and overview
- **Search and Pagination** for all tables
- **Modal-based Forms** for create/edit operations

## Database Tables Included

- Users & Authentication
- Categories with SEO fields
- Products with variants and SEO
- Customers & Addresses
- Orders & Order Items
- Blog Posts & Categories
- CMS Pages
- Reviews & Testimonials
- Inquiries & Quote Requests
- Newsletter Subscribers
- Coupons & Discounts
- Banners & Sliders
- Navigation Menus
- Media Library
- Settings & Company Info
- SEO Meta Overrides
- Activity Logs

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