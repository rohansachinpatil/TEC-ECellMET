const User = require('../models/User');
const Team = require('../models/Team');
const { generateToken } = require('../middleware/auth');

// @desc    Register Leader & Create Team
// @route   POST /api/auth/register-leader
// @access  Public
exports.registerLeader = async (req, res) => {
    try {
        const {
            name, email, phone, city, year, branch,
            instagram, linkedin, password,
            teamName, collegeName
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password || !teamName || !collegeName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user (email/phone) already exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Check if team name already exists
        const teamExists = await Team.findOne({ teamName });
        if (teamExists) {
            return res.status(400).json({
                success: false,
                message: 'Team name already taken'
            });
        }

        // Generate Team Code
        const teamCode = await Team.generateTeamCode();

        // Create User (Leader)
        const user = await User.create({
            name,
            email,
            phone,
            city,
            year,
            branch,
            instagram,
            linkedin,
            password,
            role: 'leader',
            instituteName: collegeName
        });

        // Create Team
        const team = await Team.create({
            teamName,
            teamCode,
            collegeName,
            leader: user._id,
            members: [user._id]
        });

        // Update user with teamId
        user.teamId = team._id;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Team registered successfully',
            token,
            teamCode, // Return code to show leader
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                teamId: team._id
            }
        });

    } catch (error) {
        console.error('Leader Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Register Member & Join Team
// @route   POST /api/auth/register-member
// @access  Public
exports.registerMember = async (req, res) => {
    try {
        const {
            name, email, phone, year, branch, password, teamCode
        } = req.body;

        if (!name || !email || !phone || !password || !teamCode) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Find Team by Code
        const team = await Team.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Invalid Team Code'
            });
        }

        // Check team size limit (optional, e.g., max 5)
        if (team.members.length >= 5) {
            return res.status(400).json({
                success: false,
                message: 'Team is full (Max 5 members)'
            });
        }

        // Create User (Member)
        const user = await User.create({
            name,
            email,
            phone,
            year,
            branch,
            password,
            role: 'member',
            teamId: team._id,
            instituteName: team.collegeName // Inherit college from team
        });

        // Add member to team
        team.members.push(user._id);
        await team.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Joined team successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                teamId: team._id
            }
        });

    } catch (error) {
        console.error('Member Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user (Phone + Password)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone number and password'
            });
        }

        // Check for user
        const user = await User.findOne({ phone }).select('+password').populate('teamId');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                phone: user.phone,
                teamId: user.teamId ? user.teamId._id : null
            },
            team: user.teamId ? {
                id: user.teamId._id,
                teamName: user.teamId.teamName,
                teamCode: user.teamId.teamCode,
                collegeName: user.teamId.collegeName,
                rank: user.teamId.rank,
                totalPoints: user.teamId.totalPoints
            } : null
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('teamId');

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                teamId: user.teamId ? user.teamId._id : null
            },
            team: user.teamId ? {
                id: user.teamId._id,
                teamName: user.teamId.teamName,
                teamCode: user.teamId.teamCode,
                collegeName: user.teamId.collegeName,
                totalPoints: user.teamId.totalPoints,
                rank: user.teamId.rank
            } : null
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user data'
        });
    }
};
