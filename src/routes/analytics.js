const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [companies, users, leads, calls, invoices] = await Promise.all([
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END), 0) as active FROM companies', ['active']),
      db.query('SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN role = $1 THEN 1 ELSE 0 END), 0) as managers FROM users', ['manager']),
      db.query('SELECT status, COUNT(*)::int as count FROM leads GROUP BY status'),
      db.query('SELECT COUNT(*)::int as total FROM calls'),
      db.query("SELECT COUNT(*)::int as total, COALESCE(SUM(CAST(REPLACE(REPLACE(amount, '$', ''), ',', '') AS DECIMAL)), 0) as revenue FROM invoices WHERE status = 'paid'"),
    ]);

    const leadStats = {};
    leads.rows.forEach(r => { leadStats[r.status] = r.count; });

    res.json({
      totalCompanies: parseInt(companies.rows[0].total),
      activeCompanies: parseInt(companies.rows[0].active),
      totalUsers: parseInt(users.rows[0].total),
      managerUsers: parseInt(users.rows[0].managers),
      totalLeads: leads.rows.reduce((s, r) => s + r.count, 0),
      leadsByStatus: leadStats,
      totalCalls: calls.rows[0].total,
      totalInvoices: invoices.rows[0].total,
      platformRevenue: invoices.rows[0].revenue,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
