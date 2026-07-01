const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToAdmins } = require('../lib/socket');
const { settingsSchema } = require('../lib/schemas');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const result = await db.query('SELECT settings FROM platform_settings LIMIT 1');
  res.json({ settings: result.rows[0]?.settings || {} });
});

router.put('/', authenticate, authorize('admin'), async (req, res) => {
  const { settings } = settingsSchema.parse(req.body);
  const existing = await db.query('SELECT id FROM platform_settings LIMIT 1');
  if (existing.rows.length > 0) {
    await db.query('UPDATE platform_settings SET settings = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(settings), existing.rows[0].id]);
  } else {
    await db.query('INSERT INTO platform_settings (settings) VALUES ($1)', [JSON.stringify(settings)]);
  }
  emitToAdmins('settings:updated', settings);
  res.json({ settings });
});

module.exports = router;
