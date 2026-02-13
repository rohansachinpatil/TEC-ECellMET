const express = require('express');
const router = express.Router();
const { registerLeader, registerMember, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register-leader', registerLeader);
router.post('/register-member', registerMember);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
