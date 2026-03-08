import request from "./request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchEvents = (artist) => {
  const encodedArtist = encodeURIComponent((artist || "").trim());
  return request(`${BASE_URL}/events?artist=${encodedArtist}`);
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
