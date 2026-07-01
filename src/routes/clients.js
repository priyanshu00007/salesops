const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { clientSchema } = require('../lib/schemas');

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '';
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    where = ' WHERE (cl.name ILIKE $1 OR cl.email ILIKE $1)';
  }
  const countResult = await db.query(`SELECT COUNT(*) FROM clients cl${where}`, params);
  params.push(parseInt(limit), offset);
  const limitIdx = params.length - 2;
  const result = await db.query(
    `SELECT cl.*, u.name as owner_name FROM clients cl LEFT JOIN users u ON cl.owner_id = u.id${where} ORDER BY cl.created_at DESC LIMIT $${limitIdx + 1} OFFSET $${limitIdx + 2}`,
    params
  );
  res.json({ clients: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
  const data = clientSchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO clients (name, email, phone, owner_id) VALUES ($1,$2,$3,$4) RETURNING *`,
    [data.name, data.email, data.phone, data.owner_id || req.user.id]
  );
  res.status(201).json({ client: result.rows[0] });
});

router.delete('/:id', authenticate, authorize('admin', 'manager'), async (req, res) => {
  const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
  res.json({ message: 'Client deleted' });
});

module.exports = router;
