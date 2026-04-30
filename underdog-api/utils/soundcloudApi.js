

let cachedToken = null;
let tokenExpiresAt = 0;

// This function gets a SoundCloud access token using your backend credentials.
// We cache the token so your app does not ask SoundCloud for a new token on every request.
const getSoundCloudToken = async () => {
  const now = Date.now();

  // If we already have a token and it has not expired, reuse it.
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing SoundCloud API credentials');
  }

  // SoundCloud requires Basic Auth for client_credentials.
  // Basic Auth means: base64(client_id:client_secret)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://secure.soundcloud.com/oauth/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
  const errorText = await response.text();

  throw new Error(
    `Failed to get SoundCloud access token: ${response.status} ${errorText}`
  );
}

  const data = await response.json();

  cachedToken = data.access_token;

  // SoundCloud tokens are usually about 1 hour.
  // We subtract 60 seconds so we refresh before it fully expires.
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;

  return cachedToken;
};

// This function searches SoundCloud tracks.
const searchSoundCloudTracks = async (query) => {
  const token = await getSoundCloudToken();

  const params = new URLSearchParams({
    q: query,
    limit: '10',
    linked_partitioning: 'true',
    access: 'playable',
  });

  const response = await fetch(`https://api.soundcloud.com/tracks?${params}`, {
    headers: {
      Accept: 'application/json; charset=utf-8',
      Authorization: `OAuth ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search SoundCloud tracks');
  }

  const data = await response.json();

  const tracks = data.collection || data;

  // We normalize the result so the frontend gets clean, predictable data.
  return tracks.map((track) => ({
    source: 'soundcloud',
    externalId: track.id,
    title: track.title,
    artist: track.user?.username || 'Unknown artist',
    artworkUrl: track.artwork_url,
    trackUrl: track.permalink_url,
    duration: track.duration,
  }));
};

module.exports = {
  searchSoundCloudTracks,
};