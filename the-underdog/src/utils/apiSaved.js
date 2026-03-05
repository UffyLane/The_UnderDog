import request from "./request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getItems = (token) =>
  request(`${BASE_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });