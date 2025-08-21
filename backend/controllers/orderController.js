const { Order, OrderItem, Cart, Perfume, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = req.body;

    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'Order must contain at least one item',
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const perfume = await Perfume.findByPk(item.perfumeId);
      if (!perfume) {
        return res.status(404).json({
          message: `Perfume with ID ${item.perfumeId} not found`,
        });
      }

      if (!perfume.isInStock() || perfume.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${perfume.name}. Available: ${perfume.stock}`,
        });
      }

      const itemTotal = perfume.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        perfumeId: perfume.id,
        quantity: item.quantity,
        unitPrice: perfume.price,
        totalPrice: itemTotal,
        perfumeSnapshot: {
          name: perfume.name,
          brand: perfume.brand,
          imageUrl: perfume.imageUrl,
          size: perfume.size,
        },
      });
    }

    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal > 100 ? 0 : 10;
    const totalAmount = subtotal + taxAmount + shippingAmount;

    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}-${random}`;

    const order = await Order.create({
      userId,
      orderNumber,
      subtotal,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes,
      status: 'pending',
      paymentStatus: 'pending',
    });

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id,
      });

      const perfume = await Perfume.findByPk(item.perfumeId);
      await perfume.updateStock(-item.quantity);
    }

    await Cart.clearCart(userId);

    const orderWithItems = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Perfume,
          as: 'perfume',
        }],
      }],
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderWithItems,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      message: 'Server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Perfume,
          as: 'perfume',
        }],
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      message: 'Server error retrieving orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const where = { id };
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Perfume,
            as: 'perfume',
          }],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.json({
      message: 'Order retrieved successfully',
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      message: 'Server error retrieving order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status',
      });
    }

    await order.updateStatus(status, reason);

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      message: 'Server error updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const where = { id };
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    const order = await Order.findOne({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
      }],
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        message: 'Order cannot be cancelled in its current status',
      });
    }

    for (const item of order.items) {
      const perfume = await Perfume.findByPk(item.perfumeId);
      if (perfume) {
        await perfume.updateStock(item.quantity);
      }
    }

    await order.updateStatus('cancelled', reason);

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      message: 'Server error cancelling order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Perfume,
            as: 'perfume',
            attributes: ['id', 'name', 'brand', 'imageUrl'],
          }],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      message: 'Server error retrieving orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};