const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToAdmins } = require('../lib/socket');
const { invoiceSchema, invoiceUpdateSchema } = require('../lib/schemas');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = ' WHERE status = $1';
  }
  const countResult = await db.query(`SELECT COUNT(*) FROM invoices${where}`, params);
  params.push(parseInt(limit), offset);
  const limitIdx = params.length - 2;
  const result = await db.query(
    `SELECT * FROM invoices${where} ORDER BY due_date DESC LIMIT $${limitIdx + 1} OFFSET $${limitIdx + 2}`,
    params
  );
  res.json({ invoices: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const data = invoiceSchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO invoices (company, plan, amount, status, due_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.company, data.plan || 'Starter', data.amount, data.status || 'pending', data.due_date]
  );
  emitToAdmins('invoice:created', result.rows[0]);
  res.status(201).json({ invoice: result.rows[0] });
});

router.patch('/:id', authenticate, authorize('admin'), async (req, res) => {
  const data = invoiceUpdateSchema.parse(req.body);
  const result = await db.query(
    `UPDATE invoices SET status = COALESCE($1, status), amount = COALESCE($2, amount) WHERE id = $3 RETURNING *`,
    [data.status, data.amount, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
  emitToAdmins('invoice:updated', result.rows[0]);
  res.json({ invoice: result.rows[0] });
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
  emitToAdmins('invoice:deleted', { id: req.params.id });
  res.json({ message: 'Invoice deleted' });
});

module.exports = router;
