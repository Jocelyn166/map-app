# Map Location Picker App

A simple full-stack map application that allows users to select locations on a 2D map, save them to a database, and view previously saved locations.

This project was built as part of a technical assessment using Vue.js, Vuex, Node.js, Express, and SQLite.

---

## Features

- Interactive Google Map
- Select a location by clicking on the map
- Reverse geocode coordinates into a readable address
- Save selected locations to a SQLite database
- View all previously saved locations in a paginated table
- Responsive layout (desktop and mobile)
- Accessible UI with keyboard and screen-reader support

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
├─ client/ # Vue frontend
├─ server/ # Express + SQLite backend
└─ README.md

---

## Prerequisites

- Node.js (v18 or later recommended)
- npm
- A Google Maps API key
- A Google Maps MAP ID

---

## Environment Variables

### Client (`client/.env.example`)

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_MAP_ID=your_map_id
VITE_API_BASE_URL=http://localhost:3000


Server (server/.env.example)
PORT=3000
DB_PATH=./locations.db
NODE_ENV=development

Copy .env.example to .env in both folders and fill in the values.
The actual values will be sent via email.

Installation
1. Clone the repository
git clone https://github.com/your-username/map-app.git
cd map-app

2. Install server dependencies
cd server
npm install

3. Install client dependencies
cd ../client
npm install

Running the App
Start the backend
cd server
npm start


The server will run at:

http://localhost:3000

Start the frontend
cd client
npm run dev


The app will be available at:

http://localhost:5173

Author

Juan(Jocelyn)

```
