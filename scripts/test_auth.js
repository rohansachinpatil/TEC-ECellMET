const mongoose = require('mongoose');

const Team = require('../models/Team');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err);
    process.exit(1);
  }
};

const testAuth = async () => {
  await connectDB();

  // 1. Register Leader
  const leaderData = {
    name: 'Test Leader',
    email: `leader${Date.now()}@test.com`,
    phone: `99999${Math.floor(Math.random() * 100000)}`,
    city: 'Test City',
    year: 'FE',
    branch: 'CS',
    password: 'password123',
    teamName: `Test Team ${Date.now()}`,
    collegeName: 'Test College',
  };

  console.log('Registering Leader...');
  // Simulate logic from authController.registerLeader
  // Note: We are testing the Models and Logic, not the API endpoint directly via HTTP (unless we use axios)
  // Actually, testing the controller logic via models is faster for debugging.

  try {
    // Generate Code
    const teamCode = await Team.generateTeamCode();
    console.log('Generated Schema Code:', teamCode);

    // Create User
    const leader = await User.create({
      ...leaderData,
      role: 'leader',
      instituteName: leaderData.collegeName,
    });

    // Create Team
    const team = await Team.create({
      teamName: leaderData.teamName,
      teamCode,
      collegeName: leaderData.collegeName,
      leader: leader._id,
      members: [leader._id],
    });

    leader.teamId = team._id;
    await leader.save();

    console.log('✅ Leader Registered. Team Code:', teamCode);

    // 2. Register Member
    const memberData = {
      name: 'Test Member',
      email: `member${Date.now()}@test.com`,
      phone: `88888${Math.floor(Math.random() * 100000)}`,
      year: 'SE',
      branch: 'IT',
      password: 'password123',
      teamCode: teamCode,
    };

    console.log('Registering Member...');
    const foundTeam = await Team.findOne({ teamCode: memberData.teamCode });
    if (!foundTeam) throw new Error(`Team not found with code ${memberData.teamCode}`);

    const member = await User.create({
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      year: memberData.year,
      branch: memberData.branch,
      password: memberData.password,
      role: 'member',
      teamId: foundTeam._id,
      instituteName: foundTeam.collegeName,
    });

    foundTeam.members.push(member._id);
    await foundTeam.save();

    console.log('✅ Member Registered and Joined Team.');

    // 3. Login Leader
    console.log('Logging in Leader...');
    const loggedInLeader = await User.findOne({ phone: leaderData.phone }).select('+password');
    const isMatch = await loggedInLeader.comparePassword(leaderData.password);
    if (isMatch) console.log('✅ Leader Login Successful');
    else console.log('❌ Leader Login Failed');
  } catch (error) {
    console.error('❌ Test Failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

testAuth();
