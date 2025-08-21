const { connectDB } = require('../config/db');
const { User, Perfume } = require('../models');
require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database connected for seeding...');

    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL || 'admin@perfume.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        role: 'admin',
        phone: '+1234567890',
        address: '123 Admin Street, Admin City, AC 12345',
        isActive: true,
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    const perfumeCount = await Perfume.count();
    if (perfumeCount === 0) {
      const samplePerfumes = [
        {
          name: 'Chanel No. 5',
          brand: 'Chanel',
          description: 'A timeless classic with notes of ylang-ylang, rose, and sandalwood. This iconic fragrance has been captivating women for decades with its sophisticated and elegant scent profile.',
          price: 150.00,
          category: 'women',
          fragranceFamily: 'floral',
          stock: 50,
          imageUrl: 'https://example.com/chanel-no5.jpg',
          rating: 4.8,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Dior Sauvage',
          brand: 'Dior',
          description: 'A fresh and spicy fragrance with bergamot, pepper, and ambroxan. Perfect for the modern man who appreciates bold and confident scents.',
          price: 120.00,
          category: 'men',
          fragranceFamily: 'fresh',
          stock: 75,
          imageUrl: 'https://example.com/dior-sauvage.jpg',
          rating: 4.7,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Tom Ford Black Orchid',
          brand: 'Tom Ford',
          description: 'A luxurious and mysterious fragrance with black orchid, spices, and dark chocolate. An intoxicating blend that works beautifully for both men and women.',
          price: 200.00,
          category: 'unisex',
          fragranceFamily: 'oriental',
          stock: 30,
          imageUrl: 'https://example.com/tom-ford-black-orchid.jpg',
          rating: 4.6,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Versace Bright Crystal',
          brand: 'Versace',
          description: 'A vibrant and floral fragrance with pomegranate, peony, and musk. Light and refreshing, perfect for everyday wear.',
          price: 80.00,
          category: 'women',
          fragranceFamily: 'floral',
          stock: 60,
          imageUrl: 'https://example.com/versace-bright-crystal.jpg',
          rating: 4.4,
          isFeatured: false,
          isActive: true,
        },
        {
          name: 'Acqua di Gio',
          brand: 'Giorgio Armani',
          description: 'A fresh aquatic fragrance with sea notes, bergamot, and rosemary. Inspired by the beauty of Pantelleria, this scent captures the essence of the Mediterranean.',
          price: 95.00,
          category: 'men',
          fragranceFamily: 'aquatic',
          stock: 45,
          imageUrl: 'https://example.com/acqua-di-gio.jpg',
          rating: 4.5,
          isFeatured: false,
          isActive: true,
        },
        {
          name: 'Yves Saint Laurent Black Opium',
          brand: 'Yves Saint Laurent',
          description: 'A seductive and addictive fragrance with coffee, vanilla, and white flowers. Bold and modern, perfect for the confident woman.',
          price: 110.00,
          category: 'women',
          fragranceFamily: 'oriental',
          stock: 40,
          imageUrl: 'https://example.com/ysl-black-opium.jpg',
          rating: 4.6,
          isFeatured: false,
          isActive: true,
        },
        {
          name: 'Creed Aventus',
          brand: 'Creed',
          description: 'A sophisticated blend of pineapple, birch, and musk. This luxury fragrance is inspired by the dramatic life of a historic emperor.',
          price: 350.00,
          category: 'men',
          fragranceFamily: 'fruity',
          stock: 20,
          imageUrl: 'https://example.com/creed-aventus.jpg',
          rating: 4.9,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Dolce & Gabbana Light Blue',
          brand: 'Dolce & Gabbana',
          description: 'A fresh and Mediterranean fragrance with lemon, apple, and cedarwood. Captures the spirit of the Italian summer.',
          price: 75.00,
          category: 'unisex',
          fragranceFamily: 'citrus',
          stock: 55,
          imageUrl: 'https://example.com/dg-light-blue.jpg',
          rating: 4.3,
          isFeatured: false,
          isActive: true,
        },
        {
          name: 'Maison Margiela REPLICA Jazz Club',
          brand: 'Maison Margiela',
          description: 'A warm and smoky fragrance with tobacco, rum, and vanilla. Evokes the atmosphere of a cozy jazz club.',
          price: 140.00,
          category: 'unisex',
          fragranceFamily: 'woody',
          stock: 35,
          imageUrl: 'https://example.com/mm-jazz-club.jpg',
          rating: 4.5,
          isFeatured: false,
          isActive: true,
        },
        {
          name: 'Viktor & Rolf Spicebomb',
          brand: 'Viktor & Rolf',
          description: 'An explosive blend of spices with chili, saffron, and tobacco. A bold and masculine fragrance for the adventurous man.',
          price: 105.00,
          category: 'men',
          fragranceFamily: 'spicy',
          stock: 42,
          imageUrl: 'https://example.com/vr-spicebomb.jpg',
          rating: 4.4,
          isFeatured: false,
          isActive: true,
        },
      ];

      await Perfume.bulkCreate(samplePerfumes);
      console.log(`${samplePerfumes.length} sample perfumes created successfully`);
    } else {
      console.log('Perfumes already exist in database');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();