const User = require('../models/User');
const Team = require('../models/Team');
const { generateToken } = require('../middleware/auth');
// Helper to set cookie
const sendTokenResponse = (user, statusCode, res, message, teamCode = null) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        // secure: true, // Enable in production with HTTPS
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            message,
            token,
            teamCode,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
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
};

// Protect routes - verify JWT token
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

        sendTokenResponse(user, 201, res, 'Team registered successfully', teamCode);

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

        sendTokenResponse(user, 201, res, 'Joined team successfully');

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

        sendTokenResponse(user, 200, res, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
}


// Replace strict res.json responses with helper in key controllers
// ... logic below modifies existing controller flows to use helper ...

// NOTE: For brevity and precision in this tool call, I will modify the specific sections in subsequent calls 
// or use a larger replace block if I can match the whole file structure. 
// However, given the file size, I will modify the specific blocks for login, registerLeader, registerMember.


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
