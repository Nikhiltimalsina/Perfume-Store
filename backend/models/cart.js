const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
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
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['perfumeId'],
    },
    {
      unique: true,
      fields: ['userId', 'perfumeId'],
    },
  ],
});

Cart.findByUser = async function(userId) {
  return await this.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

Cart.addItem = async function(userId, perfumeId, quantity = 1) {
  const existingItem = await this.findOne({
    where: { userId, perfumeId },
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    return await existingItem.save();
  } else {
    return await this.create({ userId, perfumeId, quantity });
  }
};

Cart.updateQuantity = async function(userId, perfumeId, quantity) {
  const item = await this.findOne({
    where: { userId, perfumeId },
  });

  if (!item) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    return await item.destroy();
  } else {
    item.quantity = quantity;
    return await item.save();
  }
};

Cart.removeItem = async function(userId, perfumeId) {
  const item = await this.findOne({
    where: { userId, perfumeId },
  });

  if (item) {
    return await item.destroy();
  }

  return null;
};

Cart.clearCart = async function(userId) {
  return await this.destroy({
    where: { userId },
  });
};

Cart.getCartTotal = async function(userId) {
  const cartItems = await this.findAll({
    where: { userId },
    include: [{
      model: require('./perfume'),
      attributes: ['price'],
    }],
  });

  return cartItems.reduce((total, item) => {
    return total + (item.quantity * parseFloat(item.Perfume.price));
  }, 0);
};

module.exports = Cart;