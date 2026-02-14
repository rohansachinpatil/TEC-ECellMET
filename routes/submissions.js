const express = require('express');

const router = express.Router();
const {
  submitTask,
  getAllMySubmissions,
  getMySubmission,
  getSubmissionsByTask,
  gradeSubmission,
} = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Protect all routes
router.use(protect);

// Public (Leader/Member) Routes
router.post('/:taskId', authorize('leader', 'member'), submitTask);
router.get('/', authorize('leader', 'member'), getAllMySubmissions);
router.get('/:taskId/me', authorize('leader', 'member'), getMySubmission);

// Admin/Evaluator Routes
router.get('/task/:taskId', authorize('admin', 'super_admin', 'evaluator'), getSubmissionsByTask);
router.put('/:id/grade', authorize('admin', 'super_admin', 'evaluator'), gradeSubmission);

module.exports = router;
