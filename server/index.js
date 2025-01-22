// server/index.js
const express = require('express');
const app = express();
const Pusher = require('pusher');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const resultRoute = require('./routes/result');
const { errorHandle } = require('./middlewares/errorHandle');
const connectDb = require('./config/db');
require('dotenv').config();

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

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

// Add pusher to req object
app.use((req, res, next) => {
  req.pusher = pusher;
  next();
});

// Database connection
connectDb();

// Routes
app.use('/api', resultRoute);

// Handle 404
app.all('*', (req, res) => {
  res.status(404).json("This page does not exist");
});

// Error handling
app.use(errorHandle);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3006;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;