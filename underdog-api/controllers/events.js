const axios = require("axios");

const { TICKETMASTER_API_KEY } = process.env;

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

// Mirrors the-underdog/src/utils/constants.js — kept in sync manually since
// the frontend and backend are separate Node projects with no shared code.
const MIDWEST_STATES = ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'];

// The trending strip loads on every landing-page visit, not just on search,
// so an in-memory cache keeps that from hammering Ticketmaster's API (and
// its rate limit) every time someone opens the homepage. 20 minutes is fine
// for "what's on this week" — it doesn't need to be second-fresh.
const TRENDING_CACHE_TTL_MS = 20 * 60 * 1000;
let trendingCache = { events: [], fetchedAt: 0 };

const toTicketmasterDateTime = (date) => `${date.toISOString().split('.')[0]}Z`;

const searchEvents = async (req, res, next) => {
  try {
    const { artist } = req.query;

    if (!artist) {
      return res.status(400).send({ message: 'Artist query required' });
    }

    if (!TICKETMASTER_API_KEY) {
      return res.status(500).send({ message: 'Ticketmaster API key is missing on server' });
    }

    const response = await axios.get(BASE_URL, {
      params: {
        keyword: artist,
        apikey: TICKETMASTER_API_KEY,
        size: 20,
      },
    });

    return res.send(response.data);
  } catch (err) {
    return next(err);
  }
};

const getTrendingEvents = async (req, res, next) => {
  try {
    const cacheAge = Date.now() - trendingCache.fetchedAt;

    if (cacheAge < TRENDING_CACHE_TTL_MS) {
      return res.send({ _embedded: { events: trendingCache.events } });
    }

    if (!TICKETMASTER_API_KEY) {
      return res.status(500).send({ message: 'Ticketmaster API key is missing on server' });
    }

    const now = new Date();
    const twoWeeksOut = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const response = await axios.get(BASE_URL, {
      params: {
        apikey: TICKETMASTER_API_KEY,
        classificationName: 'music',
        countryCode: 'US',
        sort: 'date,asc',
        startDateTime: toTicketmasterDateTime(now),
        endDateTime: toTicketmasterDateTime(twoWeeksOut),
        size: 100,
      },
    });

    const allEvents = response.data?._embedded?.events || [];

    const midwestEvents = allEvents.filter((eventItem) => {
      const stateCode = eventItem?._embedded?.venues?.[0]?.state?.stateCode;
      return stateCode && MIDWEST_STATES.includes(stateCode);
    });

    const trimmed = midwestEvents.slice(0, 12);

    trendingCache = { events: trimmed, fetchedAt: Date.now() };

    return res.send({ _embedded: { events: trimmed } });
  } catch (err) {
    return next(err);
  }
};

module.exports = { searchEvents, getTrendingEvents };