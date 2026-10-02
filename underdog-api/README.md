# UnderDog API

> **The Express + MongoDB backend for The UnderDog — a concert finder for Midwest music fans.**

🎵 **[Live App](https://the-under-dog.vercel.app)** | 📦 **[Main Repo](https://github.com/UffyLane/The_UnderDog)** | ⚙️ **[Deployed API](https://the-underdog.onrender.com)**

---

## About

This API powers [The UnderDog](https://the-under-dog.vercel.app). It does four jobs:

1. **Authenticates users** with JWTs and bcrypt-hashed passwords.
2. **Stores each user's saved events** in MongoDB, scoped so users only ever see and delete their own.
3. **Proxies the Ticketmaster Discovery API**, so the Ticketmaster key stays on the server and never ships to the browser.
4. **Proxies SoundCloud and TIDAL search** (in progress), handling their OAuth token exchange server-side.

> Note: hosted on Render's free tier — the first request after a period of inactivity can take ~50 seconds to wake up.

---

## Try It

The live app ([the-under-dog.vercel.app](https://the-under-dog.vercel.app)) has a demo account:

- **Email:** test@underdog.com
- **Password:** Test1234!

Search for an artist such as "Radiohead" or "SZA" to see Ticketmaster events come through this API.

---

## Features

- **JWT authentication** — 7-day tokens, verified by middleware on every protected route
- **Password hashing** with bcrypt (10 salt rounds); the password field is excluded from queries by default
- **Saved events (CRUD)** — create, list, and delete, with owner-only access
- **Request validation** with Celebrate / Joi on signup, signin, and saved-event routes
- **Custom error classes** (400 / 401 / 403 / 404 / 409) feeding one centralized error handler
- **Rate limiting** — 100 requests per 15 minutes per IP
- **Security headers** via Helmet
- **Structured logging** of every request and error with Winston
- **Ticketmaster proxy** so the API key stays server-side
- **SoundCloud + TIDAL search** with cached OAuth client-credentials tokens

---

## Tech Stack

- **Runtime / framework:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Auth & security:** jsonwebtoken, bcryptjs, Helmet, express-rate-limit, CORS
- **Validation:** Celebrate + Joi, validator
- **Logging:** Winston + express-winston
- **HTTP client:** axios (Ticketmaster), built-in `fetch` (SoundCloud, TIDAL)
- **Tooling:** ESLint (Airbnb base + Prettier), nodemon

---

## Project Structure

```
underdog-api/
│
├── app.js                  # Entry point: middleware order, DB connection, server start
│
├── routes/
│   ├── index.js            # /health, /signup, /signin, /events, then the auth wall
│   ├── users.js            # /users/me
│   ├── items.js            # /items (saved events)
│   ├── events.js           # /events (Ticketmaster proxy)
│   ├── music.js            # /music (SoundCloud + TIDAL)
│   └── notFound.js
│
├── controllers/
│   ├── users.js            # signup, signin, current user
│   ├── items.js            # saved events CRUD
│   ├── events.js           # Ticketmaster search
│   └── music.js            # SoundCloud / TIDAL / combined search
│
├── models/
│   ├── user.js             # User schema + findUserByCredentials
│   └── item.js             # Saved event schema
│
├── middlewares/
│   ├── auth.js             # Verifies the Bearer token, sets req.user
│   ├── validate.js         # Celebrate/Joi schemas
│   ├── rateLimiter.js
│   ├── logger.js           # request.log + error.log
│   └── errorHandler.js     # Final error → JSON response
│
├── errors/                 # BadRequest, Unauthorized, Forbidden, NotFound, Conflict
│
└── utils/
    ├── config.js           # Environment variables + production safety check
    ├── constants.js        # Status codes and messages
    ├── soundcloudApi.js    # SoundCloud token caching + track search
    └── tidalApi.js         # TIDAL token caching + track search
```

**Request flow:** `cors → helmet → express.json → request logger → rate limiter → routes → 404 handler → error logger → error handler`. Public routes are registered *before* the `auth` middleware in `routes/index.js`; everything after it requires a valid token.

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check — returns `{ "status": "ok" }` |
| POST | `/signup` | Create an account |
| POST | `/signin` | Log in, receive a JWT |
| GET | `/events?artist=` | Search Ticketmaster events for an artist (up to 20 results, unfiltered by region) |
| GET | `/music/soundcloud/search?query=` | Search SoundCloud tracks |
| GET | `/music/tidal/search?query=` | Search TIDAL tracks |
| GET | `/music/search?query=` | Search both and merge the results |

### Protected — require `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get the current user |
| GET | `/items` | List your saved events, newest first |
| POST | `/items` | Save an event |
| DELETE | `/items/:itemId` | Delete one of your saved events |

### Request bodies

**`POST /signup`**

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "password123" }
```

`name`: 2–30 characters · `email`: valid email · `password`: at least 6 characters.

**`POST /signin`** — returns `{ "token": "<jwt>" }`

```json
{ "email": "jane@example.com", "password": "password123" }
```

**`POST /items`**

```json
{
  "name": "Artist Name",
  "date": "2026-03-12",
  "venue": "The Rave",
  "city": "Milwaukee",
  "state": "WI",
  "url": "https://www.ticketmaster.com/event/..."
}
```

`state` must be a 2-letter code and `url` must be a valid URI. `DELETE /items/:itemId` expects a 24-character hex MongoDB id.

### Errors

Every error returns JSON in the same shape:

```json
{ "statusCode": 401, "message": "Authorization required" }
```

Unexpected server errors return a generic 500 message; internal details are logged, not sent to the client.

---

## Environment Variables

Create a `.env` file in `underdog-api/`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string (defaults to `mongodb://127.0.0.1:27017/underdog_db`) |
| `JWT_SECRET` | **Yes in production** | Secret used to sign tokens. The server refuses to start in production without it; in development it falls back to a dev-only default |
| `TICKETMASTER_API_KEY` | For `/events` | Ticketmaster Discovery API key |
| `SOUNDCLOUD_CLIENT_ID` / `SOUNDCLOUD_CLIENT_SECRET` | For SoundCloud search | SoundCloud API credentials |
| `TIDAL_CLIENT_ID` / `TIDAL_CLIENT_SECRET` | For TIDAL search | TIDAL API credentials |
| `PORT` | No | Defaults to `3000` |
| `NODE_ENV` | No | `development` (default) or `production` |

---

## Running Locally

**Prerequisites:** Node.js 20.19+ and a MongoDB instance (local or Atlas).

```bash
git clone https://github.com/UffyLane/The_UnderDog.git
cd The_UnderDog/underdog-api
npm install
```

Create `.env` (see the table above), then:

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # plain node
```

The API runs at `http://localhost:3000`. Quick check:

```bash
curl http://localhost:3000/health
```

Lint with `npm run lint`.

---

## Security

- Passwords are hashed with bcrypt and never returned by the API
- JWTs expire after 7 days; protected routes reject missing, malformed, or expired tokens
- Owner checks on delete — attempting to delete another user's event returns 403
- Helmet security headers and per-IP rate limiting
- Input validated with Joi before it reaches a controller
- Third-party API keys and OAuth secrets live only on the server

---

## Logging

Winston writes JSON logs to `logs/request.log` and `logs/error.log` (created automatically and git-ignored). In non-production environments the same logs also print to the console.

---

## Deployment

- **API:** Render — https://the-underdog.onrender.com
- **Database:** MongoDB
- **Frontend:** Vercel — https://the-under-dog.vercel.app

Set `NODE_ENV=production`, `JWT_SECRET`, `MONGO_URI`, and the third-party credentials in the Render dashboard.

---

## Known Limitations & Roadmap

- [ ] **Server-side region filtering** — Midwest filtering currently happens in the React app after Ticketmaster returns its 20 results. Passing the state filter to Ticketmaster would make that result cap apply to Midwest events only
- [ ] **Duplicate-save protection** — add a unique `(owner, url)` index so the same event can't be saved twice
- [ ] **Finish SoundCloud and TIDAL integration** and surface those results in the app
- [ ] **Cache Ticketmaster responses** to reduce API calls and latency
- [ ] Automated tests for controllers and middleware
- [ ] Artist following, personalized event feed, and concert notifications

---

## Project Pitch Video

Watch [this video](https://www.loom.com/share/c75047e549214543a6d6e4465de6192d) where I describe the project and some of the challenges I faced while building it.

---

## Author

**Stuart G. Clark Jr.** — [GitHub](https://github.com/UffyLane) · [Portfolio](https://www.uffylanes.com/)

---

## License

ISC
