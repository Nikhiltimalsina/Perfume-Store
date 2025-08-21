const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Perfume = sequelize.define('Perfume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
      isDecimal: true,
    },
  },
  category: {
    type: DataTypes.ENUM('men', 'women', 'unisex'),
    allowNull: false,
  },
  fragranceFamily: {
    type: DataTypes.ENUM(
      'floral',
      'oriental',
      'woody',
      'fresh',
      'citrus',
      'fruity',
      'spicy',
      'aquatic',
      'gourmand'
    ),
    allowNull: false,
  },
  topNotes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  middleNotes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  baseNotes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 1000,
    },
    comment: 'Size in ml',
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  launchYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1900,
      max: new Date().getFullYear(),
    },
  },
  concentration: {
    type: DataTypes.ENUM(
      'parfum',
      'eau_de_parfum',
      'eau_de_toilette',
      'eau_de_cologne',
      'eau_fraiche'
    ),
    allowNull: true,
  },
  longevity: {
    type: DataTypes.ENUM('poor', 'weak', 'moderate', 'long_lasting', 'eternal'),
    allowNull: true,
  },
  sillage: {
    type: DataTypes.ENUM('intimate', 'moderate', 'strong', 'enormous'),
    allowNull: true,
  },
}, {
  tableName: 'perfumes',
  timestamps: true,
  indexes: [
    {
      fields: ['brand'],
    },
    {
      fields: ['category'],
    },
    {
      fields: ['fragranceFamily'],
    },
    {
      fields: ['price'],
    },
    {
      fields: ['isFeatured'],
    },
    {
      fields: ['isActive'],
    },
  ],
});

Perfume.prototype.isInStock = function() {
  return this.stock > 0;
};

Perfume.prototype.getDiscountPercentage = function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
};

Perfume.prototype.updateStock = async function(quantity) {
  this.stock = Math.max(0, this.stock + quantity);
  return await this.save();
};

Perfume.findByCategory = async function(category) {
  return await this.findAll({
    where: {
      category,
      isActive: true,
    },
    order: [['createdAt', 'DESC']],
  });
};

Perfume.findFeatured = async function() {
  return await this.findAll({
    where: {
      isFeatured: true,
      isActive: true,
    },
    order: [['createdAt', 'DESC']],
  });
};

Perfume.findLowStock = async function(threshold = 10) {
  return await this.findAll({
    where: {
      stock: {
        [sequelize.Sequelize.Op.lte]: threshold,
      },
      isActive: true,
    },
    order: [['stock', 'ASC']],
  });
};

module.exports = Perfume;