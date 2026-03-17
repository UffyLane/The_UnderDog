
# The UnderDog

The UnderDog is a full-stack web application designed to help music fans discover live concerts across the Midwest and track events from their favorite artists.

Users can search for artists, browse upcoming shows, and save events to a personal dashboard for easy access.

The application integrates with the Ticketmaster Discovery API and includes a secure backend with authentication, event persistence, and user profile management.

---

## Live Demo

Coming soon

---

## Screenshots

### Home Search
Users can search for artists and view upcoming Midwest events.

### Event Results
Events are displayed with venue, location, and ticket links.

### Profile Dashboard
Users can manage saved events and view their account information.

---

## Features

### Artist Search
Search for artists using the Ticketmaster Discovery API.

### Midwest Event Filtering
Events are filtered to Midwest states for more relevant results.

### Authentication
Users can securely sign up and log in using JWT authentication.

### Save Events
Authenticated users can save concerts to their personal dashboard.

### Profile Dashboard
Users can manage saved events and track their activity.

### Secure API
The backend includes request validation, rate limiting, logging, and centralized error handling.

---

## Architecture


Frontend (React + Vite)
│
│ REST API
▼
Backend (Node.js + Express)
│
│
▼
MongoDB Database


The application follows a typical **client-server architecture**:

* React frontend for UI
* Express backend API
* MongoDB database for persistence
* Ticketmaster API for event discovery

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- CSS Modules
- Ticketmaster API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Celebrate / Joi validation
- Winston logging
- Helmet security
- Rate limiting

---

## Project Structure


underdog
│
├── frontend
│ ├── src
│ ├── public
│ └── README.md
│
├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middlewares
│ ├── utils
│ └── README.md
│
└── README.md


---

## Installation

Clone the repository.


git clone https://github.com/yourusername/underdog.git

cd underdog


---

### Backend Setup


cd backend
npm install


Create a `.env` file:


PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/underdog_db
JWT_SECRET=your_secret
NODE_ENV=development


Start the backend server:


npm run dev


---

### Frontend Setup


cd frontend
npm install


Create a `.env` file:


VITE_API_URL=http://localhost:3000

VITE_TICKETMASTER_KEY=your_ticketmaster_api_key


Start the frontend:


npm run dev


The application will run at:


http://localhost:5173


---

## API Overview

### Authentication


POST /signup
POST /signin


### Current User


GET /users/me


### Saved Events


GET /items
POST /items
DELETE /items/:itemId


---

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Request validation with Celebrate
- Rate limiting
- Helmet security headers
- Request and error logging
- Centralized error handling

---

## Future Improvements

- Artist following system
- Concert notifications
- Spotify or Tidal integration
- Personalized recommendations
- Event calendar view
- Mobile-optimized UI

---

## Author

Stuart G Clark Jr

---

## License

This project is open source and available under the MIT License.