const { Router } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize, authorizeMinRole } = require('../middleware/role');
const { emitToAll } = require('../lib/socket');
const { userSchema, userUpdateSchema, roleUpdateSchema } = require('../lib/schemas');

const router = Router();

router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  const countResult = await db.query(`SELECT COUNT(*) FROM users${where}`, params);
  const limitIdx = params.length + 1;
  params.push(parseInt(limit), offset);
  const result = await db.query(
    `SELECT id, name, email, role, created_at FROM users${where} ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${limitIdx + 1}`,
    params
  );
  res.json({ users: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/users', authenticate, authorize('admin'), async (req, res) => {
  const data = userSchema.parse(req.body);
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [data.email]);
  if (existing.rows.length > 0) return res.status(409).json({ error: 'Email already in use' });
  const hash = await bcrypt.hash(data.password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, created_at`,
    [data.name, data.email, hash, data.role || 'user']
  );
  emitToAll('user:created', result.rows[0]);
  res.status(201).json({ user: result.rows[0] });
});

router.patch('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  const data = userUpdateSchema.parse(req.body);
  const result = await db.query(
    `UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role, created_at`,
    [data.name, data.role, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  emitToAll('user:updated', result.rows[0]);
  res.json({ user: result.rows[0] });
});

router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  emitToAll('user:deleted', { id: req.params.id });
  res.json({ message: 'User deleted' });
});

router.patch('/users/:id/role', authenticate, authorize('admin'), async (req, res) => {
  const data = roleUpdateSchema.parse(req.body);
  const result = await db.query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, created_at`,
    [data.role, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  emitToAll('user:updated', result.rows[0]);
  res.json({ user: result.rows[0] });
});

router.get('/reports', authenticate, authorizeMinRole('manager'), async (req, res) => {
  res.json({
    message: `Access granted. Your role: ${req.user.role}`,
    report: { totalUsers: 0, totalSales: 0, period: '2026-Q2' },
  });
});

router.get('/profile', authenticate, authorize('user', 'manager', 'admin'), async (req, res) => {
  res.json({ profile: req.user });
});

module.exports = router;
