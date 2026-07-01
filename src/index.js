require('dotenv/config');
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { initSocket } = require('./lib/socket');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const companiesRoutes = require('./routes/companies');
const leadsRoutes = require('./routes/leads');
const callsRoutes = require('./routes/calls');
const tasksRoutes = require('./routes/tasks');
const clientsRoutes = require('./routes/clients');
const invoicesRoutes = require('./routes/invoices');
const settingsRoutes = require('./routes/settings');
const analyticsRoutes = require('./routes/analytics');
const logsRoutes = require('./routes/logs');
const adminCoreRoutes = require('./routes/admin-core');
const adminPlatformRoutes = require('./routes/admin-platform');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

initSocket(server);

app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin', adminCoreRoutes);
app.use('/api/admin', adminPlatformRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', logsRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
