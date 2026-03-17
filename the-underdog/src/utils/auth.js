const BASE_URL = "http://localhost:3000";

function handleRes(res) {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data?.message || "Request failed");
    });
  }
  return res.json();
}

export function signup({ name, email, password }) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handleRes);
}

export function signin({ email, password }) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleRes);
}

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleRes);
}