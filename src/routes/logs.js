const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { level, search } = req.query;
    let query = 'SELECT a.*, u.name as user_name FROM activity_logs a LEFT JOIN users u ON a.user_id = u.id';
    const params = [];
    const conditions = [];

    if (level && level !== 'All') {
      params.push(level.toLowerCase());
      conditions.push(`LOWER(a.level) = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(LOWER(a.action) LIKE LOWER($${params.length}) OR LOWER(a.source) LIKE LOWER($${params.length}))`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.created_at DESC LIMIT 100';

    const result = await db.query(query, params);
    res.json({ logs: result.rows });
  } catch (err) {
    console.error('Logs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
