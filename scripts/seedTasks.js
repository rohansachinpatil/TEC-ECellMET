require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Phase = require('../models/Phase'); // Assuming Phase model exists, need to check if required

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedTasks = async () => {
    await connectDB();

    const tasks = [
        {
            title: 'Market Research Report',
            description: 'Conduct comprehensive market research for your proposed idea. Include target audience, market size, trends, and opportunities.',
            deadline: new Date('2026-02-15T23:59:59'),
            maxMarks: 100,
            phaseName: 'Round 1'
        },
        {
            title: 'Problem Statement',
            description: 'Define the core problem your startup aims to solve. Explain why this problem is important and who it affects.',
            deadline: new Date('2026-02-10T23:59:59'),
            maxMarks: 100,
            phaseName: 'Round 1'
        },
        {
            title: 'Competitor Analysis',
            description: 'Identify and analyze your top 5 competitors. Compare features, pricing, strengths, and weaknesses.',
            deadline: new Date('2026-02-18T23:59:59'),
            maxMarks: 100,
            phaseName: 'Round 1'
        },
        {
            title: 'Business Model Canvas',
            description: 'Create a detailed Business Model Canvas covering all 9 building blocks for your startup idea.',
            deadline: new Date('2026-02-23T23:59:59'),
            maxMarks: 150,
            phaseName: 'Round 1'
        },
        {
            title: 'Idea Pitch Deck',
            description: 'Create a compelling 10-slide pitch deck presenting your startup idea, problem, solution, and team.',
            deadline: new Date('2026-02-05T23:59:59'),
            maxMarks: 100,
            phaseName: 'Round 1'
        },
        {
            title: 'Team Introduction Video',
            description: 'Record a 2-3 minute video introducing your team members, their roles, and why you\'re passionate about this idea.',
            deadline: new Date('2026-02-25T23:59:59'),
            maxMarks: 50,
            phaseName: 'Round 1'
        }
    ];

    try {
        // Clear existing tasks
        await Task.deleteMany({});
        console.log('Tasks cleared...');

        // We need to handle Phases. If Phase model exists and is required by Task schema
        // Let's create a default phase "Round 1" if possible, or just mock ID if schema allows string (checked schema, it's ObjectId ref)

        // Check if we need to create a phase
        // The Task schema says: phase: { type: ObjectId, ref: 'Phase', required: true }
        // So we MUST create a phase first.

        // Let's try to define Phase model inline if not available or just use mongoose model if already registered
        let PhaseModel;
        try {
            PhaseModel = mongoose.model('Phase');
        } catch {
            const PhaseSchema = new mongoose.Schema({
                name: { type: String, required: true },
                isActive: { type: Boolean, default: true }
            });
            PhaseModel = mongoose.model('Phase', PhaseSchema);
        }

        // Create Round 1 Phase
        let round1 = await PhaseModel.findOne({ name: 'Round 1' });
        if (!round1) {
            round1 = await PhaseModel.create({ name: 'Round 1', isActive: true });
            console.log('Created Phase: Round 1');
        }

        // Assign phase ID to tasks
        const tasksWithPhase = tasks.map(t => ({
            ...t,
            phase: round1._id
        }));

        await Task.insertMany(tasksWithPhase);
        console.log('✅ Tasks Imported!');

    } catch (error) {
        console.error(error);
    }

    process.exit();
};

seedTasks();
