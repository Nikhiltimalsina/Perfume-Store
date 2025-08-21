const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ),
    defaultValue: 'pending',
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'cash_on_delivery'),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidAddress(value) {
        if (!value.street || !value.city || !value.postalCode || !value.country ||
            value.street.trim() === '' || value.city.trim() === '' || 
            value.postalCode.trim() === '' || value.country.trim() === '') {
          throw new Error('Complete shipping address is required');
        }
      },
    },
  },
  billingAddress: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: async (order) => {
      if (!order.orderNumber) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        order.orderNumber = `ORD-${timestamp}-${random}`;
      }
    },
  },
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['paymentStatus'],
    },
    {
      fields: ['orderNumber'],
    },
    {
      fields: ['createdAt'],
    },
  ],
});

Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

Order.prototype.canBeRefunded = function() {
  return ['delivered'].includes(this.status) && this.paymentStatus === 'paid';
};

Order.prototype.updateStatus = async function(newStatus, reason = null) {
  this.status = newStatus;
  
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
    if (reason) this.cancellationReason = reason;
  } else if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return await this.save();
};

Order.findByUser = async function(userId, options = {}) {
  return await this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    ...options,
  });
};

Order.findByStatus = async function(status) {
  return await this.findAll({
    where: { status },
    order: [['createdAt', 'DESC']],
  });
};

Order.getRevenueStats = async function(startDate, endDate) {
  const { Op } = require('sequelize');
  
  return await this.findAll({
    where: {
      paymentStatus: 'paid',
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue'],
      [sequelize.fn('AVG', sequelize.col('totalAmount')), 'averageOrderValue'],
    ],
    raw: true,
  });
};

module.exports = Order;