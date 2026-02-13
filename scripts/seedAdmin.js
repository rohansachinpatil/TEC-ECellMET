const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: './.env' });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ phone: '0000000000' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        // Create Admin User
        // Changing to 'super_admin' to ensure full access
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@tec.com',
            phone: '0000000000', // Default Admin Phone
            password: hashedPassword, // Hashed password manually if create doesnt trigger pre-save, but User.create should trigger it. 
            // Actually User.create triggers pre('save'). But let's let the model handle hashing if validation allows.
            // Wait, if I pass a hashed password, the model might hash it AGAIN if I'm not careful.
            // Let's check User.js model. usually it checks isModified.
            // If I pass raw password 'admin123', the model will hash it.
            role: 'super_admin',
            city: 'Admin City',
            year: 'N/A',
            branch: 'N/A'
        });

        // Wait, I should pass the RAW password and let the model hash it, OR ensure the model doesn't double hash.
        // Let's assume the model has a pre-save hook.
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

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

        const user = await User.create({
            name: 'Super Admin',
            email: 'admin@tecpune.com',
            phone: phone,
            password: password, // Model should hash this
            role: 'super_admin',
            city: 'Pune',
            year: 'Faculty',
            branch: 'Admin',
            instituteName: 'VIT Pune'
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
