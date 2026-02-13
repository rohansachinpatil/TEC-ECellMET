const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    marks: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'graded'],
        default: 'pending'
    }
});

// Prevent duplicate submissions for same task
SubmissionSchema.index({ teamId: 1, taskId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
