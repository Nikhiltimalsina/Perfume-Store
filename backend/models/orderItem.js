const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  perfumeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'perfumes',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  perfumeSnapshot: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Snapshot of perfume data at time of order',
  },
}, {
  tableName: 'order_items',
  timestamps: true,
  hooks: {
    beforeSave: (orderItem) => {
      orderItem.totalPrice = orderItem.quantity * orderItem.unitPrice;
    },
  },
  indexes: [
    {
      fields: ['orderId'],
    },
    {
      fields: ['perfumeId'],
    },
  ],
});

OrderItem.prototype.calculateTotal = function() {
  return this.quantity * this.unitPrice;
};

module.exports = OrderItem;