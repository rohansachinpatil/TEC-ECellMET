require('dotenv').config();
const path = require('path');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoose = require('mongoose');
const xss = require('xss-clean');

const globalErrorHandler = require('./middleware/errorHandlers');
const AppError = require('./utils/appError');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 8080;

/**
 * Establishes a connection to the MongoDB database.
 * Falls back to an in-memory database if connection fails in the development environment.
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Falling back to In-Memory Database (mongodb-memory-server)...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`✅  In-Memory MongoDB Connected: ${conn.connection.host}`);
        console.log('📝  Note: Data will not persist after server restart.');
      } catch (memErr) {
        console.error('❌  Failed to start In-Memory Database:', memErr);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// CORS
app.use(cors());

// Serving static files
app.use(express.static('public'));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/tasks', require('./routes/tasks'));

// Frontend Routes
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

// Handle unhandled routes (404)
app.all('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  } else {
    // For frontend routes, maybe 404 page or redirect to home?
    // Current behavior seems to rely on static handling, but let's be explicit
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')); // Fallback to index or specific 404 page
  }
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 TEC Server running on port ${PORT}`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

connectDB();
