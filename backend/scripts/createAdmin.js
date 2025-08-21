const { connectDB } = require('../config/db');
const { User } = require('../models');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Database connected for admin creation...');

    const adminEmail = "admin@perfumestore.com"
    const adminPassword = "admin123"

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists`);
      process.exit(0);
    }

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890',
      address: '123 Admin Street, Admin City, AC 12345',
      isActive: true,
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Please change the default password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
