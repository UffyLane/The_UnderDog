
# The UnderDog Frontend

The frontend for **The UnderDog**, a web application that helps users discover live music events in the Midwest and save their favorites.

This application consumes the UnderDog API and integrates with the Ticketmaster Discovery API to retrieve concert information.

---

## Features

- Search concerts by artist
- Midwest-specific filtering
- Save favorite events
- Secure login and signup
- Profile dashboard
- Toast notifications for user feedback
- Protected routes
- Responsive UI

---

## Tech Stack

- React
- Vite
- React Router
- Context API
- Ticketmaster API
- Custom Express backend

---

## Project Structure

src
│
├── components
│ ├── AuthModal
│ ├── ErrorBanner
│ ├── EventCard
│ ├── EventList
│ ├── Header
│ ├── Footer
│ ├── Loader
│ ├── SearchForm
│ └── Toast
│
├── pages
│ ├── Home
│ └── Profile
│
├── contexts
│
├── utils
│ ├── api.js
│ ├── apiClient.js
│ └── auth.js
│
└── App.jsx


---

## Installation

```bash
git clone https://github.com/yourusername/underdog
cd frontend
npm install
Environment Variables

Create a .env file:

VITE_API_URL=http://localhost:3000
VITE_TICKETMASTER_KEY=your_ticketmaster_key
Running the App

Start development server:

npm run dev

Application will run at:

http://localhost:5173
Application Flow

User searches for an artist

Ticketmaster API returns event results

Events are filtered to Midwest states

Logged-in users can save events

Saved events appear in the profile dashboard

Authentication

Authentication uses JWT tokens issued by the backend API.

Token storage:

localStorage

Protected routes redirect unauthenticated users to sign-in.

Future Improvements

Artist following

Personalized event feed

Spotify/Tidal integration

Notifications for upcoming concerts

Event calendar view

## Project Pitch Video
 
 Check out [this video](https://www.loom.com/share/f65c7d924f924c33b11100656eeff1c7), where I describe my 
 project and some challenges I faced while building it.

Author

Stuart G Clark Jr
