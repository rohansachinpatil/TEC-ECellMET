require('dotenv').config();
const mongoose = require('mongoose');

const Team = require('../models/Team');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const deleteUser = async () => {
  await connectDB();

  const input = process.argv[2];

  if (!input) {
    console.log('Usage: node scripts/deleteUser.js <email_or_phone>');
    process.exit(1);
  }

  try {
    // Find User
    const user = await User.findOne({
      $or: [{ email: input }, { phone: input }],
    });

    if (!user) {
      console.log(`❌ No user found with email or phone: ${input}`);
    } else {
      console.log(`✅ User found: ${user.name} (${user.email}) [ID: ${user._id}]`);

      // Find Team associated with user (as leader)
      const team = await Team.findOne({ leader: user._id });

      if (team) {
        console.log(`   Found associated Team: ${team.teamName} [ID: ${team._id}]`);
        await Team.deleteOne({ _id: team._id });
        console.log(`   🗑️  Team deleted.`);
      }

      // Delete User
      await User.deleteOne({ _id: user._id });
      console.log(`   🗑️  User deleted.`);
    }
  } catch (error) {
    console.error(error);
  }

  process.exit();
};

deleteUser();
