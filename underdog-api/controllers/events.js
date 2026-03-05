const axios = require('axios');
const { TICKETMASTER_KEY } = require('../utils/config');

const searchEvents = (req, res, next) => {
  const { artist } = req.query;

  axios
    .get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        keyword: artist,
        apikey: TICKETMASTER_KEY,
      },
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch(next);
};

module.exports = { searchEvents };