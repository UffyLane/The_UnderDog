const checkResponse = (res) => {
  if (res.ok) return res.json();
  return res.json().catch(() => ({})).then((data) => {
    const message = data.message || `Request failed: ${res.status}`;
    return Promise.reject({ status: res.status, message });
  });
};

const request = (url, options = {}) =>
  fetch(url, options).then(checkResponse);

export default request;
