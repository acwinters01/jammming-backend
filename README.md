# Jammming Backend

The backend service for **Jammming**, built with **Node.js** and **Express**
It handles Spotify API authentication, playlist creation, and communication between the Jammming frontend and Spotify.


## Features 
- Spotify OAuth Authorization - Securely authenticate users with the Spotify API
- Playlist Management - Create and save playlists directly to a Spotify account
- Token Refresh - Automatically refreshes expired Spotify access tokens
- CORS Enabled - Configured to work with the frontend
- Envirnonments Vairables - Secure handling of API keys and secrets


## Tech Stack
- Node.js
- Express.js
- Spotify Web API
- CORS
- dotenv (environment variable management)
- Render (deployment)

  

## Getting Started

1. Clone the Repository 
```bash 
clone https://github.com/acwinters01/jammming-backend.git
cd jammming-backend
```

2. Install Dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a .env file in the backend root:
```bash
PORT=4000
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_ID=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/ 
FRONTEND_URL=http://localhost:4173/         # Vite preview after build
VITE_URL=http://localhost:5173/             # development
```
Note:
For production set FRONTEND_URL to your deployed frontend URL (e.g., https://acwinters01.github.io).


4. Start the Development Server
```bash
npm run dev
```
  
The backend will be running at:
```bash
http://localhost:4000         # development
```
or use the link from the backend deployment (e.g., https://example-auth-server-j4na.onrender.com)