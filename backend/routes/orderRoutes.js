const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/',
  [
    body('shippingAddress')
      .isObject()
      .withMessage('Shipping address must be an object'),
    body('shippingAddress.street')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address is required and must not exceed 200 characters'),
    body('shippingAddress.city')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City is required and must not exceed 100 characters'),
    body('shippingAddress.postalCode')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Postal code is required and must not exceed 20 characters'),
    body('shippingAddress.country')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Country is required and must not exceed 100 characters'),
    body('billingAddress')
      .optional()
      .isObject()
      .withMessage('Billing address must be an object'),
    body('billingAddress.street')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address must not exceed 200 characters'),
    body('billingAddress.city')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City must not exceed 100 characters'),
    body('billingAddress.postalCode')
      .optional()
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Postal code must not exceed 20 characters'),
    body('billingAddress.country')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Country must not exceed 100 characters'),
    body('paymentMethod')
      .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'])
      .withMessage('Payment method must be one of: credit_card, debit_card, paypal, bank_transfer, cash_on_delivery'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must not exceed 1000 characters'),
  ],
  createOrder
);

router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('status')
      .optional()
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Status must be one of: pending, processing, shipped, delivered, cancelled'),
  ],
  getUserOrders
);

router.get(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Order ID must be a positive integer'),
  ],
  getOrderById
);

router.patch(
  '/:id/cancel',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Order ID must be a positive integer'),
  ],
  cancelOrder
);

router.get('/cart/items', getCart);

router.post(
  '/cart/items',
  [
    body('perfumeId')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
    body('quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99'),
  ],
  addToCart
);

router.put(
  '/cart/items/:perfumeId',
  [
    param('perfumeId')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
    body('quantity')
      .isInt({ min: 0, max: 99 })
      .withMessage('Quantity must be between 0 and 99'),
  ],
  updateCartItem
);

router.delete(
  '/cart/items/:perfumeId',
  [
    param('perfumeId')
      .isUUID()
      .withMessage('Perfume ID must be a valid UUID'),
  ],
  removeFromCart
);

router.delete('/cart/clear', clearCart);

module.exports = router;