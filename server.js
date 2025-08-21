require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Allow requests from frontend
const allowedOrigins = [
    process.env.PORTFOLIO_URL,     // prod
    process.env.FRONTEND_URL,      // dev (CRA)
    process.env.VITE_URL,           // dev (Vite) 
];

app.use(cors({
    origin: function ( origin, callback ) {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));


app.use(express.json());

console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

app.get("/api/login", (req, res) => {
    const authURL = new URL("https://accounts.spotify.com/authorize");
    const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });

    authURL.search = params.toString();
    res.redirect(authURL.toString());
});

// New Endpoint: Send Client ID and Redirect URI to Frontend
app.get('/api/spotify-auth', (req, res) => {
    res.json({
        clientId: process.env.SPOTIFY_CLIENT_ID || "ERROR: MISSING CLIENT ID",
        redirectUri: process.env.SPOTIFY_REDIRECT_URI || "ERROR: MISSING REDIRECT URI"
    });
});

// Request Spotify Auth Token
app.post('/api/token', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
    }

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to retrieve token' });
    }
});

app.post("/api/refresh-token", async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: "Missing refresh token" });
    }

    try {
        const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to refresh token" });
    }
});


// Start Server
const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

// Handle Process Exit Events Gracefully
const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Closing server...`);
    server.close(() => {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });
};

// Handle crashes and termination signals
process.on('uncaughtException', (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));  // `kill` or system shutdown
process.on('SIGINT', () => shutdown('SIGINT'));    // Ctrl + C in terminal

