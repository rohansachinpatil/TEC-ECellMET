require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB and start server
const startServer = async () => {
    await connectDB();

    // Middleware
    app.use(require('cookie-parser')());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    // API Routes
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/submissions', require('./routes/submissions'));
    app.use('/api/tasks', require('./routes/tasks'));

    // Frontend Routes (Serving HTML files)
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Serve other HTML pages dynamically based on filename
    const pages = ['about', 'leaderboard', 'register', 'login', 'dashboard', 'team', 'tasks', 'submissions'];
    pages.forEach(page => {
        app.get(`/${page}`, (req, res) => {
            res.sendFile(path.join(__dirname, 'public', `${page}.html`));
        });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    });

    app.listen(PORT, () => {
        console.log(`\n🚀 TEC Server running on port ${PORT}`);
        console.log(`📍 Access at: http://localhost:${PORT}`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
};

startServer();
