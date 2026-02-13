require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkUser = async () => {
    await connectDB();

    const input = process.argv[2];

    if (!input) {
        console.log('Usage: node scripts/checkUser.js <phone_or_email>');
        process.exit(1);
    }

    try {
        const user = await User.findOne({
            $or: [{ email: input }, { phone: input }]
        }).populate('teamId');

        if (!user) {
            console.log(`❌ No user found for: ${input}`);
        } else {
            console.log('✅ User Found:');
            console.log(`ID: ${user._id}`);
            console.log(`Name: ${user.name}`);
            console.log(`Phone: '${user.phone}' (Check for spaces or format)`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Team: ${user.teamId ? user.teamId.teamName : 'None'}`);
            console.log(`Password (Hashed): ${user.password}`);
        }

    } catch (error) {
        console.error(error);
    }

    process.exit();
};

checkUser();
