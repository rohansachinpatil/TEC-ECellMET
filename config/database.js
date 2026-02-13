const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`\n✅ MongoDB Connected Successfully!`);
        console.log(`💻 Host: ${conn.connection.host}`);
        console.log(`💾 Database: ${conn.connection.name}`);
        console.log(`🔌 Status: Connected\n`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Failed!`);
        console.error(`Error: ${error.message}`);
        console.error(`\nPossible Fixes:`);
        console.error(`1. Check if your IP is whitelisted in MongoDB Atlas.`);
        console.error(`2. Verify your MONGO_URI in .env file.`);
        console.error(`3. Ensure your internet connection is stable.\n`);
        process.exit(1);
    }
};

module.exports = connectDB;
