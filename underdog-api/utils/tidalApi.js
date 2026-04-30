

let cachedToken = null;
let tokenExpiresAt = 0;

// This function gets a TIDAL access token using backend credentials.
const getTidalToken = async () => {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.TIDAL_CLIENT_ID;
  const clientSecret = process.env.TIDAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing TIDAL API credentials');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://auth.tidal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get TIDAL access token');
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;

  return cachedToken;
};

// This function searches TIDAL catalog data.
const searchTidalTracks = async (query) => {
  const token = await getTidalToken();

  const params = new URLSearchParams({
    query,
    countryCode: 'US',
    limit: '10',
  });

  const response = await fetch(`https://openapi.tidal.com/v2/searchresults/${encodeURIComponent(query)}?${params}`, {
    headers: {
      Accept: 'application/vnd.tidal.v1+json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search TIDAL tracks');
  }

  const data = await response.json();

  // TIDAL response shapes can vary depending on endpoint/version.
  // This keeps the app from crashing while we confirm the exact payload.
  const tracks =
    data?.included?.filter((item) => item.type === 'tracks') ||
    data?.data?.relationships?.tracks?.data ||
    [];

  return tracks.map((track) => ({
    source: 'tidal',
    externalId: track.id,
    title: track.attributes?.title || 'Unknown title',
    artist: track.attributes?.artistName || 'Unknown artist',
    artworkUrl: null,
    trackUrl: null,
    duration: track.attributes?.duration || null,
  }));
};

module.exports = {
  searchTidalTracks,
};