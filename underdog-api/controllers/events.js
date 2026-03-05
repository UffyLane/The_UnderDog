const axios = require('axios');

const { TICKETMASTER_API_KEY } = process.env;

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const searchEvents = async (req, res, next) => {
  try {
    const { artist } = req.query;

    if (!artist) {
      return res.status(400).send({ message: 'Artist query required' });
    }

    const response = await axios.get(BASE_URL, {
      params: {
        keyword: artist,
        apikey: TICKETMASTER_API_KEY,
      },
    });

    res.send(response.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { searchEvents };