const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const { PORT, MONGO_URI } = require('./utils/config');

const app = express();

// CORS
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Security + JSON parsing
app.use(helmet());
app.use(express.json());

// Logging + rate limiting
app.use(requestLogger);
app.use(rateLimiter);

// Database
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// Error logging
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.warn(`✅ UnderDog API listening on port ${PORT}`);
});