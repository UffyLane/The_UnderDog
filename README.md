
# The UnderDog

> **Find Midwest shows for the artists you love.**

🎵 **[Live Demo](https://the-under-dog.vercel.app)** | 📦 **[Backend API](https://github.com/UffyLane/The_UnderDog/tree/main/underdog-api)**

---

## Why I Built This

Most concert discovery apps — BandsInTown, Songkick — are built on the same two APIs: Spotify and YouTube. Big artists, big platforms, big venues.

The UnderDog is built differently. Instead of the usual suspects, it integrates with **Ticketmaster**, **SoundCloud**, and **Tidal** — platforms that surface artists the algorithm doesn't always push to the top. The goal is to help Midwest music fans find shows from artists they actually follow, not just the ones with the biggest marketing budgets.

---

## Try It

**Live app:** https://the-under-dog.vercel.app

Test credentials:
- **Email:** test@underdog.com
- **Password:** Test1234!

Search for any artist (e.g. "Radiohead", "SZA", "Logic") to see Midwest events pulled from Ticketmaster.

---

## Features

- **Artist search** — powered by the Ticketmaster Discovery API
- **Midwest filtering** — results scoped to IL, OH, MI, IN, WI, MN, MO, IA, KS, NE
- **Authentication** — secure sign up / log in with JWT
- **Save events** — authenticated users can save concerts to their profile dashboard
- **Protected routes** — unauthenticated users are redirected to sign in
- **Toast notifications** — real-time feedback for user actions
- **Skeleton loaders** — smooth loading states while fetching events

---

## Tech Stack

**Frontend**
- React + Vite
- React Router v6
- Context API (global auth state)
- CSS Modules

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Celebrate / Joi request validation
- Winston request + error logging
- Helmet security headers
- Rate limiting

**APIs**
- Ticketmaster Discovery API (active)
- SoundCloud API (in progress)
- Tidal API (in progress)

---

## Project Structure

```
THE_UNDERDOG/
│
├── the-underdog/          # React frontend
│   ├── src/
│   │   ├── components/    # AuthModal, EventCard, Header, SearchForm, Toast...
│   │   ├── pages/         # Home, Profile
│   │   ├── contexts/      # CurrentUserContext
│   │   └── utils/         # api.js, auth.js, apiClient.js
│   └── vite.config.js
│
└── underdog-api/          # Express backend
    ├── controllers/       # users, events, items, music
    ├── models/            # User, Item (Mongoose schemas)
    ├── routes/            # index, users, events, items, music
    ├── middlewares/       # auth, validate, errorHandler, logger, rateLimiter
    ├── errors/            # Custom error classes (400, 401, 403, 404, 409)
    └── utils/             # config, soundcloudApi, tidalApi
```

---

## Running Locally

**Clone the repo**
```bash
git clone https://github.com/UffyLane/The_UnderDog.git
cd The_UnderDog
```

**Backend**
```bash
cd underdog-api
npm install
```

Create `.env`:
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/underdog_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

```bash
npm run dev
```

**Frontend**
```bash
cd the-underdog
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:3000
VITE_TICKETMASTER_KEY=your_ticketmaster_key
```

```bash
npm run dev
# runs at http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Create account |
| POST | `/signin` | No | Log in, receive JWT |
| GET | `/users/me` | Yes | Get current user |
| GET | `/items` | Yes | Get saved events |
| POST | `/items` | Yes | Save an event |
| DELETE | `/items/:itemId` | Yes | Remove saved event |

---

## Roadmap

- [ ] SoundCloud API integration — surface independent artists
- [ ] Tidal API integration — high-fidelity artist discovery
- [ ] Artist following system
- [ ] Personalized event feed based on saved artists
- [ ] Concert notifications
- [ ] Mobile-optimized UI
- [ ] Event calendar view

---

## Author

**Stuart G. Clark Jr.**
[GitHub](https://github.com/UffyLane)

---

## License

MIT
