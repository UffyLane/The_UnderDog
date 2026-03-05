const router = require('express').Router();
const { errors } = require('celebrate');

const auth = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validate');
const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const itemRoutes = require('./items');

router.get('/health', (_req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Public routes
router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);
router.use('/events', require('./events'));

// Protect everything after this
router.use(auth);

router.use('/users', userRoutes);
router.use('/items', itemRoutes);

// Celebrate validation error handler
router.use(errors());

module.exports = router;
