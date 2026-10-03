const router = require('express').Router();
const { searchEvents, getTrendingEvents } = require('../controllers/events');

router.get('/trending', getTrendingEvents);
router.get('/', searchEvents);

module.exports = router;