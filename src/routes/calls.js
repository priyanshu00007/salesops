const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { callSchema } = require('../lib/schemas');
const { emitToUser } = require('../lib/socket');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query, countQuery;
  const params = [];

  if (req.user.role === 'user') {
    query = 'SELECT * FROM calls WHERE user_id = $1 ORDER BY call_date DESC, created_at DESC LIMIT $2 OFFSET $3';
    countQuery = 'SELECT COUNT(*) FROM calls WHERE user_id = $1';
    params.push(req.user.id);
  } else {
    query = `SELECT c.*, u.name as user_name FROM calls c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.call_date DESC, c.created_at DESC LIMIT $1 OFFSET $2`;
    countQuery = 'SELECT COUNT(*) FROM calls';
  }

  const countResult = await db.query(countQuery, params.slice());
  params.push(parseInt(limit), offset);
  const result = await db.query(query, params);
  res.json({ calls: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, async (req, res) => {
  const data = callSchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO calls (lead_id, user_id, lead_name, type, duration, result, notes, call_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [data.lead_id, req.user.id, data.lead_name, data.type, data.duration, data.result, data.notes, data.call_date || new Date().toISOString().split('T')[0]]
  );
  if (data.lead_id) emitToUser(req.user.id, 'call:created', result.rows[0]);
  res.status(201).json({ call: result.rows[0] });
});

module.exports = router;
