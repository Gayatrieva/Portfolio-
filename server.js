require('dotenv').config();
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile same-device, Postman)
    if (!origin) return callback(null, true);

    // Allow any localhost / 127.0.0.1 port in development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow any private/LAN IP so real mobile devices on the same WiFi work
    // Covers 192.168.x.x, 10.x.x.x, 172.16-31.x.x
    if (/^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(origin)) {
      return callback(null, true);
    }

    // Allow explicitly listed origins from .env CLIENT_ORIGIN
    const allowed = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim());
    if (allowed.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', portfolioRoutes);
app.use('/api', chatRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.\nRun this to free it:\n  npx kill-port ${PORT}\nThen restart the server.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = app;
