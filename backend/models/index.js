const { sequelize } = require('../config/db');
const User = require('./User');
const Perfume = require('./perfume');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Cart = require('./cart');

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

OrderItem.belongsTo(Perfume, {
  foreignKey: 'perfumeId',
  as: 'perfume',
});

Perfume.hasMany(OrderItem, {
  foreignKey: 'perfumeId',
  as: 'orderItems',
});

User.hasMany(Cart, {
  foreignKey: 'userId',
  as: 'cartItems',
  onDelete: 'CASCADE',
});

Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Cart.belongsTo(Perfume, {
  foreignKey: 'perfumeId',
  as: 'perfume',
});

Perfume.hasMany(Cart, {
  foreignKey: 'perfumeId',
  as: 'cartItems',
});

const models = {
  User,
  Perfume,
  Order,
  OrderItem,
  Cart,
  sequelize,
};

module.exports = models;