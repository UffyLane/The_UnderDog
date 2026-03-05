const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');


const routes = require('./routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const { PORT, MONGO_URI, NODE_ENV } = require('./utils/config');

const app = express();

app.use(helmet());
const corsOptions = {
  origin: NODE_ENV === 'production'
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);
app.use(rateLimiter);

mongoose
  .connect(MONGO_URI)
  .then(() => console.warn('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.warn(`✅ UnderDog API listening on http://localhost:${PORT}`);
});
