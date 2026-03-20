# UnderDog API

Backend API for **The UnderDog**, a full-stack application that helps users discover and track live music events across the Midwest. The API handles authentication, saved event management, and secure communication with the frontend.

---

## Features

- User authentication with **JWT**
- Secure password hashing with **bcrypt**
- Save and manage favorite events
- Request validation using **Celebrate / Joi**
- Centralized error handling
- Rate limiting for API protection
- Security headers via **Helmet**
- Request and error logging using **Winston**
- MongoDB database with **Mongoose**

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Celebrate / Joi validation
- Winston logging
- Express Rate Limit
- Helmet

---

## Project Structure
backend
│
├── controllers
│ ├── users.js
│ └── items.js
│
├── models
│ ├── user.js
│ └── item.js
│
├── routes
│ ├── index.js
│ ├── users.js
│ └── items.js
│
├── middlewares
│ ├── auth.js
│ ├── errorHandler.js
│ ├── logger.js
│ ├── rateLimiter.js
│ └── validate.js
│
├── utils
│ ├── config.js
│ └── constants.js
│
├── logs
│
└── app.js


---

## Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/yourusername/underdog
cd backend
npm install

Running the Server

Start the development server:

npm run dev

or

npm start

The API will run on:

http://localhost:3000
API Endpoints
Authentication
Register User
POST /signup

Example request body:

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}
Login
POST /signin

Example request body:

{
"email": "john@example.com",
"password": "password123"
}

Returns a JWT token.

Current User
GET /users/me

Requires Authorization header:

Authorization: Bearer <token>
Saved Events
Get saved events
GET /items
Save an event
POST /items

Example request body:

{
"name": "Artist Name",
"date": "2026-03-12",
"venue": "The Rave",
"city": "Milwaukee",
"state": "WI",
"url": "https://ticketlink.com"
}
Delete saved event
DELETE /items/:itemId
Logging

Two log files are generated automatically:

logs/request.log
logs/error.log
Security

The API includes:

JWT authentication

Password hashing with bcrypt

Helmet security headers

Rate limiting

Input validation with Celebrate

Centralized error handling

Future Improvements

Ticketmaster API caching

Event recommendations

Social event sharing

Artist tracking notifications

Deployment: https://the-underdog.onrender.com

## Project Pitch Video
 
 Check out [this video](https://www.loom.com/share/c75047e549214543a6d6e4465de6192d), where I describe my 
 project and some challenges I faced while building it.

Author

Stuart G Clark Jr
