const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
  getFeaturedPerfumes,
  updateStock,
} = require('../controllers/perfumeController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a positive number'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a positive number'),
    query('sortBy')
      .optional()
      .isIn(['name', 'price', 'rating', 'createdAt'])
      .withMessage('Sort by must be one of: name, price, rating, createdAt'),
    query('sortOrder')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Sort order must be ASC or DESC'),
  ],
  getAllPerfumes
);

router.get('/featured', getFeaturedPerfumes);

router.get(
  '/:id',
  [
    param('id')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
  ],
  getPerfumeById
);

router.post(
  '/',
  authenticateToken,
  requireAdmin,
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
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('category')
      .isIn(['men', 'women', 'unisex'])
      .withMessage('Category must be one of: men, women, unisex'),
    body('fragranceFamily')
      .isIn(['floral', 'oriental', 'woody', 'fresh', 'citrus', 'spicy', 'fruity', 'aquatic'])
      .withMessage('Fragrance family must be one of: floral, oriental, woody, fresh, citrus, spicy, fruity, aquatic'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('Featured must be a boolean value'),
  ],
  createPerfume
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  uploadSingle,
  [
    param('id')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
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
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    body('category')
      .optional()
      .isIn(['men', 'women', 'unisex'])
      .withMessage('Category must be one of: men, women, unisex'),
    body('fragranceFamily')
      .optional()
      .isIn(['floral', 'oriental', 'woody', 'fresh', 'citrus', 'spicy', 'fruity', 'aquatic'])
      .withMessage('Fragrance family must be one of: floral, oriental, woody, fresh, citrus, spicy, fruity, aquatic'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('Featured must be a boolean value'),
  ],
  updatePerfume
);

router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
  ],
  deletePerfume
);

router.patch(
  '/:id/stock',
  authenticateToken,
  requireAdmin,
  [
    param('id')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
  ],
  updateStock
);

module.exports = router;