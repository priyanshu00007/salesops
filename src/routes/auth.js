const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const db = require('../lib/db');
const { signToken } = require('../lib/jwt');
const { authenticate } = require('../middleware/auth');

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  role: z.enum(['admin', 'manager', 'user']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const role = data.role || 'user';

    const result = await db.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [data.name, data.email, hashedPassword, role]
    );

    const user = result.rows[0];
    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await db.query('SELECT * FROM users WHERE email = $1', [data.email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at },
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
