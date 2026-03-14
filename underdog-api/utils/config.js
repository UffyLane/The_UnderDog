require('dotenv').config();

const {
  NODE_ENV = 'development',
  PORT = 3000,
  MONGO_URI = 'mongodb://127.0.0.1:27017/underdog_db',
  JWT_SECRET,
  TICKETMASTER_KEY,
} = process.env;

// In production, JWT_SECRET MUST exist
if (NODE_ENV === 'production' && !JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET: NODE_ENV === 'production'
    ? JWT_SECRET
    : JWT_SECRET || 'dev-secret-key',
  TICKETMASTER_KEY,
};