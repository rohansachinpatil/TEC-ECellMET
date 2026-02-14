const express = require('express');

const router = express.Router();
const {
  getStats,
  getAllTeams,
  createPhase,
  getPhases,
  activatePhase,
  createTask,
  getAllTasks,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Protect all routes
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/stats', getStats);
router.get('/teams', getAllTeams);

// Phase Routes
router.post('/phases', createPhase);
router.get('/phases', getPhases);
router.put('/phases/:id/activate', activatePhase);

// Task Routes
router.post('/tasks', createTask);
router.get('/tasks', getAllTasks);

module.exports = router;
