const { Cart, Perfume } = require('../models');
const { validationResult } = require('express-validator');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Perfume,
        as: 'perfume',
        where: { isActive: true },
      }],
      order: [['createdAt', 'DESC']],
    });

    const cartTotal = cartItems.reduce((total, item) => {
      return total + (item.quantity * parseFloat(item.perfume.price));
    }, 0);

    const cartCount = cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    res.json({
      message: 'Cart retrieved successfully',
      cartItems,
      cartTotal: parseFloat(cartTotal.toFixed(2)),
      cartCount,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      message: 'Server error retrieving cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { perfumeId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const perfume = await Perfume.findOne({
      where: { id: perfumeId, isActive: true },
    });

    if (!perfume) {
      return res.status(404).json({
        message: 'Perfume not found',
      });
    }

    if (!perfume.isInStock()) {
      return res.status(400).json({
        message: 'Perfume is out of stock',
      });
    }

    const existingCartItem = await Cart.findOne({
      where: { userId, perfumeId },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > perfume.stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} items. Only ${perfume.stock - existingCartItem.quantity} more available.`,
        });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      const cartItemWithPerfume = await Cart.findOne({
        where: { id: existingCartItem.id },
        include: [{
          model: Perfume,
          as: 'perfume',
        }],
      });

      return res.json({
        message: 'Cart updated successfully',
        cartItem: cartItemWithPerfume,
      });
    } else {
      if (quantity > perfume.stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} items. Only ${perfume.stock} available.`,
        });
      }

      const cartItem = await Cart.create({
        userId,
        perfumeId,
        quantity,
      });

      const cartItemWithPerfume = await Cart.findOne({
        where: { id: cartItem.id },
        include: [{
          model: Perfume,
          as: 'perfume',
        }],
      });

      return res.status(201).json({
        message: 'Item added to cart successfully',
        cartItem: cartItemWithPerfume,
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      message: 'Server error adding to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id, userId },
      include: [{
        model: Perfume,
        as: 'perfume',
      }],
    });

    if (!cartItem) {
      return res.status(404).json({
        message: 'Cart item not found',
      });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({
        message: 'Item removed from cart successfully',
      });
    }

    if (quantity > cartItem.perfume.stock) {
      return res.status(400).json({
        message: `Cannot update quantity to ${quantity}. Only ${cartItem.perfume.stock} available.`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCartItem = await Cart.findOne({
      where: { id: cartItem.id },
      include: [{
        model: Perfume,
        as: 'perfume',
      }],
    });

    res.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      message: 'Server error updating cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({
        message: 'Cart item not found',
      });
    }

    await cartItem.destroy();

    res.json({
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      message: 'Server error removing from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { userId },
    });

    res.json({
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      message: 'Server error clearing cart',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};