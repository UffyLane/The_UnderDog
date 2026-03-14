const router = require('express').Router();
const { searchEvents } = require('../controllers/events');

router.get('/', searchEvents);

module.exports = router;