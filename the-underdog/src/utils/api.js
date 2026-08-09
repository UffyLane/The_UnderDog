import request from "./request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchEvents = (artist) => {
  const encodedArtist = encodeURIComponent((artist || "").trim());
  return request(`${BASE_URL}/events?artist=${encodedArtist}`);
};

// Hits /music/search, which queries SoundCloud + Tidal in parallel and
// gracefully drops whichever source fails (e.g. Tidal creds not yet live).
export const searchMusic = (query) => {
  const encodedQuery = encodeURIComponent((query || "").trim());
  return request(`${BASE_URL}/music/search?query=${encodedQuery}`);
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getItems = (token) =>
  request(`${BASE_URL}/items`, { headers: authHeaders(token) });

export const createItem = (data, token) =>
  request(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const deleteItem = (itemId, token) =>
  request(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
