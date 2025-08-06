# UzbekShop - MERN Stack E-commerce Platform

A full-featured e-commerce platform built with the MERN stack, specifically designed for the Uzbek market with support for Uzbek language and UZS currency.

## Features

### User Features
- 🛍️ Browse 50+ products (clothes and shoes)
- 🔍 Search products in Uzbek language
- 📱 Responsive design with minimalist white/blue theme
- 👤 User registration and authentication
- ⭐ Product reviews and ratings
- 🛒 Shopping cart functionality
- 💰 Prices displayed in UZS currency

### Admin Features
- 🔐 Separate admin login system
- 📊 Comprehensive dashboard with analytics
- 📈 Sales analytics (daily, weekly, monthly, yearly)
- 🏆 Best-selling products tracking
- ✅ Product management (CRUD operations)
- 📝 Order management
- 👥 User management
- 💬 Review moderation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

5. Seed the database with sample data:
```bash
node seedData.js
```

6. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
# Create .env file in frontend directory
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Default Admin Credentials

After running the seed script, you can login to the admin panel with:

- **Email:** admin@uzbekshop.uz
- **Password:** admin123

Access the admin panel at: `http://localhost:3000/admin/login`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products with pagination and filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get best-selling products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics/revenue` - Get revenue analytics
- `GET /api/admin/products` - Get all products for admin
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reviews` - Get all reviews

## Project Structure

```
uzbek-shop/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File uploads directory
│   ├── server.js        # Express server
│   ├── seedData.js      # Database seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## Features in Detail

### Product Management
- Support for multiple product images
- Size and color variants
- Stock management
- Uzbek language support (nameUz, descriptionUz)
- Category system (kiyim, poyabzal, aksessuar)
- Brand and specifications

### Search & Filtering
- Full-text search in Uzbek language
- Filter by category, price range, brand
- Sort by price, date, popularity
- Pagination support

### Admin Analytics
- Revenue tracking (daily, weekly, monthly, yearly)
- Best-selling products identification
- Low stock alerts
- Order status management
- User activity monitoring

### Review System
- 5-star rating system
- User reviews with approval system
- Helpful votes on reviews
- Average rating calculation

## Deployment

### Backend Deployment (Heroku example)

1. Create a Heroku app
2. Set environment variables
3. Deploy the backend code
4. Run the seed script on production

### Frontend Deployment (Netlify/Vercel example)

1. Build the frontend: `npm run build`
2. Deploy the build folder
3. Set the API URL environment variable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact: info@uzbekshop.uz

---

**Note:** This is a demonstration project. For production use, please ensure proper security measures, environment configurations, and testing procedures are in place.