const Submission = require('../models/Submission');
const Task = require('../models/Task');
const Team = require('../models/Team');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'public/uploads/submissions';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Format: TeamCode_TaskID_Timestamp.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (PDF only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
}).single('file'); // 'file' is the field name in form-data

// @desc    Submit a Task (Upload PDF)
// @route   POST /api/submissions/:taskId
// @access  Private (Leader/Member)
exports.submitTask = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
            }

            const taskId = req.params.taskId;
            const teamId = req.user.teamId; // From authMiddleware

            // Check if task exists and is active
            const task = await Task.findById(taskId).populate('phase');
            if (!task) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            // Check deadline
            if (new Date() > new Date(task.deadline)) {
                // Delete uploaded file if deadline passed
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ success: false, message: 'Deadline has passed' });
            }

            // Check if already submitted
            let submission = await Submission.findOne({ teamId, taskId });
            if (submission) {
                // Update existing submission
                // Delete old file
                const oldPath = path.join(__dirname, '..', 'public', submission.fileUrl); // fileUrl is relative
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }

                submission.fileName = req.file.filename;
                submission.fileUrl = `/uploads/submissions/${req.file.filename}`;
                submission.submittedAt = Date.now();
                await submission.save();
            } else {
                // Create new submission
                submission = await Submission.create({
                    teamId,
                    taskId,
                    fileName: req.file.filename,
                    fileUrl: `/uploads/submissions/${req.file.filename}`,
                    status: 'pending'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Task submitted successfully',
                submission
            });

        } catch (error) {
            console.error('Submission error:', error);
            // Cleanup uploaded file on error
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({
                success: false,
                message: 'Server error dealing with submission'
            });
        }
    });
};

// @desc    Get My Submission for a Task
// @route   GET /api/submissions/:taskId/me
// @access  Private (Leader/Member)
exports.getMySubmission = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            teamId: req.user.teamId,
            taskId: req.params.taskId
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'No submission found' });
        }

        res.status(200).json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Get My Submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching submission'
        });
    }
};

// @desc    Get All My Submissions
// @route   GET /api/submissions
// @access  Private (Leader/Member)
exports.getAllMySubmissions = async (req, res) => {
    try {
        const teamId = req.user.teamId;
        const submissions = await Submission.find({ teamId });

        res.status(200).json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error('Get All My Submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching submissions'
        });
    }
};

// @desc    Get All Submissions for a Task (Admin/Evaluator)
// @route   GET /api/submissions/task/:taskId
// @access  Private (Admin/Evaluator)
exports.getSubmissionsByTask = async (req, res) => {
    try {
        const submissions = await Submission.find({ taskId: req.params.taskId })
            .populate('teamId', 'teamName teamCode')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            submissions
        });
    } catch (error) {
        console.error('Get Submissions By Task error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching submissions'
        });
    }
};

// @desc    Grade a Submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Admin/Evaluator)
exports.gradeSubmission = async (req, res) => {
    try {
        const { marks, remarks } = req.body;

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                marks,
                remarks,
                status: 'graded'
            },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Submission graded successfully',
            submission
        });
    } catch (error) {
        console.error('Grade Submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error grading submission'
        });
    }
};
