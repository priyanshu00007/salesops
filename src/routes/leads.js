const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToRole, emitToUser } = require('../lib/socket');
const { leadSchema, leadUpdateSchema } = require('../lib/schemas');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20, status: filterStatus, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query, countQuery;
  const params = [];
  const conditions = [];

  if (req.user.role === 'user') {
    conditions.push('l.assigned_to = $' + (params.length + 1));
    params.push(req.user.id);
  }

  if (filterStatus) {
    conditions.push('l.status = $' + (params.length + 1));
    params.push(filterStatus);
  }

  if (search) {
    conditions.push('(l.name ILIKE $' + (params.length + 1) + ' OR l.company ILIKE $' + (params.length + 1) + ')');
    params.push(`%${search}%`);
  }

  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  const limitIdx = params.length + 1;

  if (req.user.role === 'user') {
    query = `SELECT l.* FROM leads l${where} ORDER BY l.created_at DESC LIMIT $${limitIdx} OFFSET $${limitIdx + 1}`;
    countQuery = `SELECT COUNT(*) FROM leads l${where}`;
  } else {
    query = `SELECT l.*, u.name as assigned_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id${where} ORDER BY l.created_at DESC LIMIT $${limitIdx} OFFSET $${limitIdx + 1}`;
    countQuery = `SELECT COUNT(*) FROM leads l${where}`;
  }

  const countResult = await db.query(countQuery, params);
  params.push(parseInt(limit), offset);
  const result = await db.query(query, params);
  res.json({ leads: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
  const data = leadSchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO leads (name, company, phone, email, assigned_to, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [data.name, data.company, data.phone, data.email, data.assigned_to, req.user.id]
  );
  if (data.assigned_to) emitToUser(data.assigned_to, 'lead:created', result.rows[0]);
  emitToRole('manager', 'lead:created', result.rows[0]);
  res.status(201).json({ lead: result.rows[0] });
});

router.patch('/:id', authenticate, async (req, res) => {
  const data = leadUpdateSchema.parse(req.body);
  const fields = [];
  const values = [];
  let idx = 1;
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);
  const result = await db.query(
    `UPDATE leads SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
  if (result.rows[0].assigned_to) emitToUser(result.rows[0].assigned_to, 'lead:updated', result.rows[0]);
  res.json({ lead: result.rows[0] });
});

router.delete('/:id', authenticate, authorize('admin', 'manager'), async (req, res) => {
  const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
  res.json({ message: 'Lead deleted' });
});

module.exports = router;
