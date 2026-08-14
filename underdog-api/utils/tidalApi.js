

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
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to get TIDAL access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;

  return cachedToken;
};

// TIDAL durations are ISO 8601 (e.g. "PT3M59S"), not milliseconds.
// Convert to ms so the frontend's single formatDuration() works for both sources.
const parseIsoDurationToMs = (iso) => {
  if (!iso) return null;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return null;
  const [, hours, minutes, seconds] = match;
  const totalSeconds =
    (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
  return totalSeconds * 1000;
};

// This function searches TIDAL catalog data.
const searchTidalTracks = async (query) => {
  const token = await getTidalToken();

  const params = new URLSearchParams({
    'filter[query]': query,
    countryCode: 'US',
    include: 'tracks,tracks.artists',
  });

  const response = await fetch(`https://openapi.tidal.com/v2/searchResults?${params}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to search TIDAL tracks: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const included = data?.included || [];

  const tracks = included.filter((item) => item.type === 'tracks');

  // Artists come back as separate included resources; build a lookup so we
  // can resolve each track's artist relationship to an actual name.
  const artistsById = included
    .filter((item) => item.type === 'artists')
    .reduce((map, artist) => {
      map[artist.id] = artist.attributes?.name;
      return map;
    }, {});

  return tracks.map((track) => {
    const artistRefs = track.relationships?.artists?.data || [];
    const artistNames = artistRefs
      .map((ref) => artistsById[ref.id])
      .filter(Boolean);

    return {
      source: 'tidal',
      externalId: track.id,
      title: track.attributes?.title || 'Unknown title',
      artist: artistNames.length > 0 ? artistNames.join(', ') : 'Unknown artist',
      artworkUrl: null,
      trackUrl: `https://tidal.com/browse/track/${track.id}`,
      duration: parseIsoDurationToMs(track.attributes?.duration),
    };
  });
};

module.exports = {
  searchTidalTracks,
};