// controllers/music.js

const { searchSoundCloudTracks } = require('../utils/soundcloudApi');
const { searchTidalTracks } = require('../utils/tidalApi');

// GET /music/soundcloud/search?query=artistOrSong
const searchSoundCloud = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).send({ message: 'Search query is required' });
    }

    const results = await searchSoundCloudTracks(query);

    return res.status(200).send(results);
  } catch (err) {
    return next(err);
  }
};

// GET /music/tidal/search?query=artistOrSong
const searchTidal = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).send({ message: 'Search query is required' });
    }

    const results = await searchTidalTracks(query);

    return res.status(200).send(results);
  } catch (err) {
    return next(err);
  }
};

// GET /music/search?query=artistOrSong
// This searches both APIs and combines the results.
const searchAllMusic = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).send({ message: 'Search query is required' });
    }

    const [soundCloudResults, tidalResults] = await Promise.allSettled([
      searchSoundCloudTracks(query),
      searchTidalTracks(query),
    ]);

    const results = [];

    if (soundCloudResults.status === 'fulfilled') {
      results.push(...soundCloudResults.value);
    }

    if (tidalResults.status === 'fulfilled') {
      results.push(...tidalResults.value);
    }

    return res.status(200).send(results);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  searchSoundCloud,
  searchTidal,
  searchAllMusic,
};