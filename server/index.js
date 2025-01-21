// server/index.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['https://funoonfiesta.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const resultRoute = require('./routes/result');
const { errorHandle } = require('./middlewares/errorHandle');
const connectDb = require('./config/db');
require('dotenv').config();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Middleware
app.use(cors({
  origin: ['https://funoonfiesta.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Database connection
connectDb();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Optional: Add custom events here
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Add io instance to req object for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/', resultRoute);

// Handle 404
app.all('*', (req, res) => {
  res.status(404).json("This page does not exist");
});

// Error handling
app.use(errorHandle);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Update server startup to use HTTP server
const PORT = process.env.PORT || 3006;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
