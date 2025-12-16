# Map Location Picker App

A full-stack web application that allows users to select locations on an interactive map, save them to a database, and view previously saved locations.

This project was developed as part of a technical assessment using **Vue.js**, **Vuex**, **Node.js**, **Express**, and **SQLite**.

---

## Features

- Interactive Google Map
- Select locations by clicking directly on the map
- Reverse geocoding to convert coordinates into human-readable addresses
- Persist selected locations in a SQLite database
- View saved locations in a paginated table
- Fully responsive layout (desktop & mobile)
- Accessible UI with keyboard navigation and screen-reader support
- Optimistic UI updates for a smooth user experience

---

## Tech Stack

### Frontend

- Vue 3 (Vite)
- Vuex
- Google Maps JavaScript API

### Backend

- Node.js
- Express
- SQLite

---

## Project Structure

map-app/
├─ client/        # Vue 3 frontend
├─ server/        # Express + SQLite backend
└─ README.md

---

## Prerequisites

### Node.js (v18 or later recommended)

### npm

### Google Maps API Key

### Google Maps Map ID

---

## Environment Variables

### Client

Create a .env file in the client directory using the example below:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_MAP_ID=your_map_id
VITE_API_BASE_URL=http://localhost:3000
```

Copy client/.env.example to client/.env and replace the placeholder values.
Actual secret values will be shared privately via email.


### Server

Create a .env file in the server directory:

```env
PORT=3000
DB_PATH=./locations.db
NODE_ENV=development
```


---

## Installation

### Clone the Repository
```env
git clone https://github.com/Jocelyn166/map-app.git
cd map-app
```


### Install Server Dependencies
```env
cd server
npm install
```

### Install Client Dependencies
```env
cd ../client
npm install
```

---

## Running the Application

### Start the Backend Server
```env
cd server
npm start
```

Backend API will be available at:
http://localhost:3000


### Start the Frontend
```env
cd client
npm run dev
```

The frontend will be available at:
http://localhost:5173


---

## Notes

The SQLite database file is created automatically on first run.

Environment files (.env) and database files are excluded from version control.

