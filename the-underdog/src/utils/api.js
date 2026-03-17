import {
  TICKETMASTER_BASE_URL,
  TICKETMASTER_API_KEY,
} from "./constants";

export function searchEvents(artist) {
  return fetch(`${import.meta.env.VITE_API_URL}/events?artist=${artist}`)
    .then((res) => res.json());
}

import request from "./request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getItems = (token) =>
  request(`${BASE_URL}/items`, { headers: authHeaders(token) });

export const createItem = (data, token) =>
  request(`${BASE_URL}/items`, {
    method: "POST",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteItem = (itemId, token) =>
  request(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
