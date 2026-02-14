require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});
const path = require('path');

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }

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
  const pages = [
    'about',
    'leaderboard',
    'register',
    'login',
    'dashboard',
    'team',
    'tasks',
    'submissions',
  ];
  pages.forEach((page) => {
    app.get(`/${page}`, (req, res) => {
      res.sendFile(path.join(__dirname, 'public', `${page}.html`));
    });
  });

  // Error handling middleware
  app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  });

  app.listen(PORT, () => {
    console.log(`\n🚀 TEC Server running on port ${PORT}`);
    console.log(`📍 Access at: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer();
