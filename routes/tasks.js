const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all active tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true }).populate('phase').sort({ deadline: 1 });

    // Add expired status to each task
    const tasksWithStatus = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      maxMarks: task.maxMarks,
      phase: task.phase,
      isActive: task.isActive,
      isExpired: task.isExpired(),
    }));

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks: tasksWithStatus,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        maxMarks: task.maxMarks,
        phase: task.phase,
        isActive: task.isActive,
        isExpired: task.isExpired(),
      },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task',
    });
  }
});

module.exports = router;
