

const router = require('express').Router();

const {
  searchSoundCloud,
  searchTidal,
  searchAllMusic,
} = require('../controllers/music');

router.get('/soundcloud/search', searchSoundCloud);
router.get('/tidal/search', searchTidal);
router.get('/search', searchAllMusic);

module.exports = router;