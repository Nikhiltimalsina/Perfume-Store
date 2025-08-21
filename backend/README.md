# Perfume E-commerce Backend API

A comprehensive backend API for a perfume e-commerce platform built with Node.js, Express, PostgreSQL, and Sequelize.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for perfumes with filtering and search
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create orders, track status, and manage order history
- **Admin Dashboard**: User management, product management, and analytics
- **Security**: Rate limiting, input validation, and secure password hashing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, cors, bcryptjs
- **Rate Limiting**: express-rate-limit

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Bun package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
bun install
```

3. Create a PostgreSQL database:
```sql
CREATE DATABASE perfume_ecommerce;
```

4. Configure environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and other settings.

5. Run database migrations and seed data:
```bash
bun run seed
```

6. Start the development server:
```bash
bun run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=perfume_ecommerce
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3001

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

# Default Admin Credentials
ADMIN_EMAIL=admin@perfume.com
ADMIN_PASSWORD=Admin123!
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Perfumes
- `GET /api/perfumes` - Get all perfumes (with filtering and pagination)
- `GET /api/perfumes/featured` - Get featured perfumes
- `GET /api/perfumes/:id` - Get perfume by ID
- `POST /api/perfumes` - Create perfume (Admin only)
- `PUT /api/perfumes/:id` - Update perfume (Admin only)
- `DELETE /api/perfumes/:id` - Delete perfume (Admin only)
- `PATCH /api/perfumes/:id/stock` - Update stock (Admin only)

### Orders & Cart
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/cart/items` - Get cart items
- `POST /api/orders/cart/items` - Add item to cart
- `PUT /api/orders/cart/items/:perfumeId` - Update cart item
- `DELETE /api/orders/cart/items/:perfumeId` - Remove item from cart
- `DELETE /api/orders/cart/clear` - Clear cart

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/revenue-stats` - Get revenue statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Deactivate user
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order by ID
- `PATCH /api/admin/orders/:id/status` - Update order status

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Users
- `id` (Primary Key)
- `firstName`, `lastName`
- `email` (Unique)
- `password` (Hashed)
- `role` (admin/user)
- `phone`, `address`, `dateOfBirth`
- `isActive`, `lastLogin`
- `createdAt`, `updatedAt`

### Perfumes
- `id` (Primary Key)
- `name`, `brand`, `description`
- `price`, `category`, `fragranceFamily`
- `stock`, `imageUrl`, `rating`
- `isFeatured`, `isActive`
- `createdAt`, `updatedAt`

### Orders
- `id` (Primary Key)
- `orderNumber` (Unique)
- `userId` (Foreign Key)
- `status`, `totalAmount`, `subtotal`
- `taxAmount`, `shippingAmount`, `discountAmount`
- `paymentMethod`, `paymentStatus`
- `shippingAddress`, `billingAddress`
- `notes`, `trackingNumber`
- `estimatedDelivery`, `deliveredAt`, `cancelledAt`
- `createdAt`, `updatedAt`

### OrderItems
- `id` (Primary Key)
- `orderId` (Foreign Key)
- `perfumeId` (Foreign Key)
- `quantity`, `unitPrice`, `totalPrice`
- `perfumeSnapshot` (JSON)
- `createdAt`, `updatedAt`

### Cart
- `id` (Primary Key)
- `userId` (Foreign Key)
- `perfumeId` (Foreign Key)
- `quantity`
- `createdAt`, `updatedAt`

## Scripts

- `bun run dev` - Start development server with nodemon
- `bun run start` - Start production server
- `bun run seed` - Seed database with initial data
- `bun run test` - Run tests

## Default Admin Credentials

- **Email**: admin@perfume.com
- **Password**: Admin123!

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- SQL injection prevention with Sequelize ORM

## Error Handling

The API includes comprehensive error handling with:
- Validation errors
- Database constraint errors
- Authentication errors
- Global error handler
- Development vs production error responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.