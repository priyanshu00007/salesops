const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToAdmins } = require('../lib/socket');
const { apiKeySchema } = require('../lib/schemas');

const router = Router();

router.get('/subscriptions', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT cs.*, c.name as company_name, sp.name as plan_name FROM company_subscriptions cs LEFT JOIN companies c ON cs.company_id = c.id LEFT JOIN subscription_plans sp ON cs.plan_id = sp.id ORDER BY cs.created_at DESC');
  res.json({ subscriptions: r.rows });
});

router.get('/api-keys', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT ak.*, c.name as company_name FROM api_keys ak LEFT JOIN companies c ON ak.company_id = c.id ORDER BY ak.created_at DESC');
  res.json({ apiKeys: r.rows });
});

router.post('/api-keys', authenticate, authorize('admin'), async (req, res) => {
  const data = apiKeySchema.parse(req.body);
  const key_value = 'sk_' + require('crypto').randomBytes(24).toString('hex');
  const r = await db.query('INSERT INTO api_keys (name, company_id, key_value, permissions) VALUES ($1,$2,$3,$4) RETURNING *', [data.name, data.company_id, key_value, JSON.stringify(data.permissions || ['read'])]);
  emitToAdmins('apikey:created', r.rows[0]);
  res.status(201).json({ apiKey: r.rows[0] });
});

router.delete('/api-keys/:id', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('DELETE FROM api_keys WHERE id = $1 RETURNING id', [req.params.id]);
  if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  emitToAdmins('apikey:deleted', { id: req.params.id });
  res.json({ message: 'API key revoked' });
});

module.exports = router;
