const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  "perfume_ecommerce",
  "postgres",
  "admin123",
  {
    dialect: 'postgres',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
