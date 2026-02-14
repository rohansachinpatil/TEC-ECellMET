const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../models/User');

// Load env vars
dotenv.config({ path: './.env' });

// Re-writing to be safer and generic
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    const phone = '9999999999';
    const password = 'adminpassword';

    const userExists = await User.findOne({ phone });

    if (userExists) {
      console.log('Admin user already exists with phone:', phone);
      process.exit();
    }

    const _user = await User.create({
      name: 'Super Admin',
      email: 'admin@tecpune.com',
      phone: phone,
      password: password, // Model should hash this
      role: 'super_admin',
      city: 'Pune',
      year: 'Faculty',
      branch: 'Admin',
      instituteName: 'VIT Pune',
    });

    console.log('✅ Super Admin Created!');
    console.log(`Phone: ${phone}`);
    console.log(`Password: ${password}`);

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

createAdmin();
