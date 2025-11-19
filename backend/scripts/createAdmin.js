const mongoose = require('mongoose');
const User = require('../models/Users');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmapin');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    // const existingAdmin = await User.findOne({ email: 'omurwainnocent@gmail.com' });
    // if (existingAdmin) {
    //   console.log('Admin user already exists:', existingAdmin.email);
    //   process.exit(0);
    // }

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      username: 'Admin',
      email: 'admin@gmail.com',
      phone: '0742781691',
      password: 'AdminUser1.', // Change this in production!
      role: 'admin'
    });

    await admin.save();

    console.log("Admin user created successfully!")

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdminUser();