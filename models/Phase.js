const mongoose = require('mongoose');

const PhaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a phase name'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Helper to check if phase is currently active based on date
PhaseSchema.methods.isCurrent = function () {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Phase', PhaseSchema);
