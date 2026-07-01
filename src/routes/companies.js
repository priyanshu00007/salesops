const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToAdmins } = require('../lib/socket');
const { companySchema, companyStatusSchema } = require('../lib/schemas');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  let where = '';
  if (search) {
    params.push(`%${search}%`);
    where = ` WHERE name ILIKE $1`;
  }
  params.push(parseInt(limit), offset);
  const countResult = await db.query(`SELECT COUNT(*) FROM companies${where}`, search ? [`%${search}%`] : []);
  const result = await db.query(
    `SELECT * FROM companies${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  res.json({ companies: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const data = companySchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO companies (name, plan) VALUES ($1, $2) RETURNING *`,
    [data.name, data.plan || 'Starter']
  );
  emitToAdmins('company:created', result.rows[0]);
  res.status(201).json({ company: result.rows[0] });
});

router.patch('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  const data = companyStatusSchema.parse(req.body);
  const result = await db.query(
    `UPDATE companies SET status = $1 WHERE id = $2 RETURNING *`,
    [data.status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Company not found' });
  emitToAdmins('company:updated', result.rows[0]);
  res.json({ company: result.rows[0] });
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const result = await db.query('DELETE FROM companies WHERE id = $1 RETURNING id', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Company not found' });
  emitToAdmins('company:deleted', { id: req.params.id });
  res.json({ message: 'Company deleted' });
});

module.exports = router;
