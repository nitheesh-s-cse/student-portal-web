// ═══════════════════════════════════════════════════════════
//  server.js  –  Main Entry Point for Student Portal Backend
//
//  WHAT THIS FILE DOES (beginner explanation):
//  ─────────────────────────────────────────────────────────
//  1. Loads environment variables from .env file
//  2. Creates an Express "app" (like a web server)
//  3. Registers middleware (cors, json parser, sessions)
//  4. Connects routes (admin routes, student routes, captcha)
//  5. Serves the frontend HTML files
//  6. Starts listening on PORT 5000
// ═══════════════════════════════════════════════════════════

require('dotenv').config();  // loads .env file into process.env

const express        = require('express');
const session        = require('express-session');
const cors           = require('cors');
const path           = require('path');

// Import our route files
const adminRoutes   = require('./routes/admin');
const studentRoutes = require('./routes/student');
const captchaRoutes = require('./routes/captcha');

// Create the Express application
const app  = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : true;

// ── MIDDLEWARE ────────────────────────────────────────────────
// Middleware = functions that run on EVERY request before your route

app.set('trust proxy', 1);

// 1. CORS: Allow requests from frontend (different port during dev)
app.use(cors({
  origin: allowedOrigins,
  credentials: true          // allow cookies/sessions
}));

// 2. JSON Parser: automatically parse JSON request bodies
//    Without this, req.body would be undefined
app.use(express.json());

// 3. URL-Encoded Parser: for HTML form submissions
app.use(express.urlencoded({ extended: true }));

// 4. Session Middleware
//    Sessions store user login info on the SERVER side.
//    The browser only gets a cookie with a session ID.
app.use(session({
  secret:            process.env.SESSION_SECRET || 'fallback_secret_change_me',
  resave:            false,   // don't save session if nothing changed
  saveUninitialized: false,   // don't create session until something is stored
  proxy:             isProduction,
  cookie: {
    secure:   isProduction, // HTTPS only in production
    httpOnly: true,          // JavaScript cannot read this cookie (security)
    sameSite: isProduction ? 'none' : 'lax',
    maxAge:   2 * 60 * 60 * 1000  // session expires in 2 hours
  }
}));

// ── STATIC FILES ──────────────────────────────────────────────
// Serve the frontend folder so HTML/CSS/JS files are accessible
// "path.join(__dirname, '../frontend/public')" means:
// go up one folder from backend/, then into frontend/public/
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ── API ROUTES ────────────────────────────────────────────────
// All admin API endpoints start with /api/admin
app.use('/api/admin',   adminRoutes);

// All student API endpoints start with /api/student
app.use('/api/student', studentRoutes);

// CAPTCHA endpoint
app.use('/api/captcha',  captchaRoutes);

// ── PAGE ROUTES ───────────────────────────────────────────────
// These serve the correct HTML page when user visits a URL

// Student login page (default homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Student dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/dashboard.html'));
});

// Admin login page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/admin-login.html'));
});

// Admin dashboard
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/admin-dashboard.html'));
});

// ── 404 Handler ───────────────────────────────────────────────
// If no route matches, send 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────
// Catches any unhandled errors in route handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════╗');
  console.log(`║  Student Portal Backend Running       ║`);
  console.log(`║  URL: http://localhost:${PORT}          ║`);
  console.log(`║  Admin: http://localhost:${PORT}/admin  ║`);
  console.log('╚══════════════════════════════════════╝');
});
