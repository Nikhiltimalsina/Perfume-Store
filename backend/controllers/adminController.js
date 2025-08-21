const { User, Perfume, Order, OrderItem } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { isActive: true, role: 'user' } });
    const totalPerfumes = await Perfume.count({ where: { isActive: true } });
    const totalOrders = await Order.count();
    
    const revenueResult = await Order.findAll({
      where: { paymentStatus: 'paid' },
      attributes: [
        [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalRevenue'],
      ],
      raw: true,
    });
    
    const totalRevenue = parseFloat(revenueResult[0]?.totalRevenue || 0);

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Perfume,
            as: 'perfume',
            attributes: ['name', 'brand'],
          }],
        },
      ],
    });

    const lowStockPerfumes = await Perfume.findLowStock(10);

    const monthlyRevenue = await Order.findAll({
      where: {
        paymentStatus: 'paid',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      attributes: [
        [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'monthlyRevenue'],
      ],
      raw: true,
    });

    const monthlyRevenueAmount = parseFloat(monthlyRevenue[0]?.monthlyRevenue || 0);

    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalUsers,
        totalPerfumes,
        totalOrders,
        totalRevenue,
        monthlyRevenue: monthlyRevenueAmount,
        recentOrders,
        lowStockPerfumes,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      message: 'Server error retrieving dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Server error retrieving users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          as: 'orders',
          limit: 5,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error retrieving user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findByEmail(updateData.email);
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already exists',
        });
      }
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Server error updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        message: 'Cannot delete admin user',
      });
    }

    await user.update({ isActive: false });

    res.json({
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Server error deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, role = 'user', phone, address } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      message: 'Server error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.createdAt[Op.lte] = new Date(endDate);
    }

    const revenueStats = await Order.findAll({
      where: {
        paymentStatus: 'paid',
        ...dateFilter,
      },
      attributes: [
        [Order.sequelize.fn('DATE_TRUNC', period, Order.sequelize.col('created_at')), 'period'],
        [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'revenue'],
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'orderCount'],
      ],
      group: [Order.sequelize.fn('DATE_TRUNC', period, Order.sequelize.col('created_at'))],
      order: [[Order.sequelize.fn('DATE_TRUNC', period, Order.sequelize.col('created_at')), 'ASC']],
      raw: true,
    });

    res.json({
      message: 'Revenue stats retrieved successfully',
      stats: revenueStats,
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      message: 'Server error retrieving revenue stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getRevenueStats,
};