const BASE_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("jwt");
}

function handleRes(res) {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data?.message || "Request failed");
    });
  }
  return res.json();
}

export function getSavedEvents() {
  return fetch(`${BASE_URL}/items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleRes);
}

export function saveEvent(item) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then(handleRes);
}

export function deleteSavedEvent(itemId) {
  return fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(handleRes);
}