const express = require('express');
const { body, param, query } = require('express-validator');
const { uploadSingle } = require('../middleware/upload');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getRevenueStats,
} = require('../controllers/adminController');
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
} = require('../controllers/perfumeController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);

router.get('/revenue-stats', getRevenueStats);

router.get(
  '/users',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('role')
      .optional()
      .isIn(['admin', 'user'])
      .withMessage('Role must be admin or user'),
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
  ],
  getAllUsers
);

router.get(
  '/users/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
  ],
  getUserById
);

router.post(
  '/users',
  [
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
      .optional()
      .isIn(['admin', 'user'])
      .withMessage('Role must be admin or user'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Address must not exceed 500 characters'),
  ],
  createUser
);

router.put(
  '/users/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
      .optional()
      .isIn(['admin', 'user'])
      .withMessage('Role must be admin or user'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Address must not exceed 500 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
  ],
  updateUser
);

router.delete(
  '/users/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
  ],
  deleteUser
);

router.get(
  '/orders',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Status must be one of: pending, processing, shipped, delivered, cancelled'),
    query('paymentStatus')
      .optional()
      .isIn(['pending', 'paid', 'failed', 'refunded'])
      .withMessage('Payment status must be one of: pending, paid, failed, refunded'),
  ],
  getAllOrders
);

router.get(
  '/orders/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Order ID must be a positive integer'),
  ],
  getOrderById
);

router.patch(
  '/orders/:id/status',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Order ID must be a positive integer'),
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Status must be one of: pending, processing, shipped, delivered, cancelled'),
    body('trackingNumber')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Tracking number must be between 1 and 100 characters'),
    body('estimatedDelivery')
      .optional()
      .isISO8601()
      .withMessage('Estimated delivery must be a valid date'),
  ],
  updateOrderStatus
);

router.put(
  '/orders/:id',
  [
    param('id')
      .isUUID()
      .withMessage('Order ID must be a valid UUID'),
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Status must be one of: pending, processing, shipped, delivered, cancelled'),
  ],
  updateOrderStatus
);

// Perfume management routes
router.get('/perfumes', getAllPerfumes);

router.get(
  '/perfumes/:id',
  [
    param('id')
      .isLength({ min: 1 })
      .withMessage('Perfume ID is required'),
  ],
  getPerfumeById
);

router.post(
  '/perfumes',
  uploadSingle,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('brand')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Brand must be between 2 and 50 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .isIn(['men', 'women', 'unisex', 'luxury', 'designer', 'niche'])
      .withMessage('Category must be one of: men, women, unisex, luxury, designer, niche'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('fragranceFamily')
      .isIn(['floral', 'oriental', 'woody', 'fresh', 'citrus', 'fruity', 'spicy', 'aquatic', 'gourmand'])
      .withMessage('Fragrance family must be one of: floral, oriental, woody, fresh, citrus, fruity, spicy, aquatic, gourmand'),
    body('size')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Size must be between 1 and 1000 ml'),
  ],
  createPerfume
);

router.put(
  '/perfumes/:id',
  uploadSingle,
  [
    param('id')
      .isLength({ min: 1 })
      .withMessage('Perfume ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('brand')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Brand must be between 2 and 50 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .optional()
      .isIn(['men', 'women', 'unisex', 'luxury', 'designer', 'niche'])
      .withMessage('Category must be one of: men, women, unisex, luxury, designer, niche'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('fragranceFamily')
      .optional()
      .isIn(['floral', 'oriental', 'woody', 'fresh', 'citrus', 'fruity', 'spicy', 'aquatic', 'gourmand'])
      .withMessage('Fragrance family must be one of: floral, oriental, woody, fresh, citrus, fruity, spicy, aquatic, gourmand'),
    body('size')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Size must be between 1 and 1000 ml'),
  ],
  updatePerfume
);

router.delete(
  '/perfumes/:id',
  [
    param('id')
      .isLength({ min: 1 })
      .withMessage('Perfume ID is required'),
  ],
  deletePerfume
);

module.exports = router;