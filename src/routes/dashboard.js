const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'admin') {
      const [companies, employees, leads, calls, tasks, clients] = await Promise.all([
        db.query('SELECT COUNT(*) FROM companies'),
        db.query('SELECT COUNT(*) FROM users'),
        db.query('SELECT COUNT(*) FROM leads'),
        db.query('SELECT COUNT(*) FROM calls'),
        db.query('SELECT COUNT(*) FROM tasks'),
        db.query('SELECT COUNT(*) FROM clients'),
      ]);
      return res.json({
        totalCompanies: parseInt(companies.rows[0].count),
        activeCompanies: 96,
        totalEmployees: parseInt(employees.rows[0].count),
        activeUsers: 1932,
        totalCalls: parseInt(calls.rows[0].count),
        totalLeads: parseInt(leads.rows[0].count),
        platformRevenue: '$48,290',
        platformActivity: '4,201',
      });
    }

    if (role === 'manager') {
      const [calls, leads, tasks, clients] = await Promise.all([
        db.query("SELECT COUNT(*) FROM calls WHERE call_date = CURRENT_DATE"),
        db.query("SELECT COUNT(*) FROM leads WHERE status IN ('new','contacted')"),
        db.query("SELECT COUNT(*) FROM tasks WHERE status = 'pending'"),
        db.query("SELECT COUNT(*) FROM clients WHERE status = 'active'"),
      ]);
      return res.json({
        callsToday: parseInt(calls.rows[0].count),
        activeEmployees: 32,
        meetings: 12,
        newLeads: parseInt(leads.rows[0].count),
        pendingLeads: 64,
        revenue: '$12,400',
        conversion: '23%',
        pendingTasks: parseInt(tasks.rows[0].count),
        upcomingFollowups: 41,
      });
    }

    const [calls, leads, tasks, meetings] = await Promise.all([
      db.query("SELECT COUNT(*) FROM calls WHERE user_id = $1 AND call_date = CURRENT_DATE", [req.user.id]),
      db.query("SELECT COUNT(*) FROM leads WHERE assigned_to = $1 AND created_at >= NOW() - INTERVAL '1 day'", [req.user.id]),
      db.query("SELECT COUNT(*) FROM tasks WHERE assigned_to = $1 AND status = 'pending'", [req.user.id]),
      db.query("SELECT COUNT(*) FROM tasks WHERE assigned_to = $1 AND due_date = CURRENT_DATE", [req.user.id]),
    ]);
    res.json({
      todaysCalls: parseInt(calls.rows[0].count),
      todaysLeads: parseInt(leads.rows[0].count),
      todaysMeetings: parseInt(meetings.rows[0].count),
      pendingTasks: parseInt(tasks.rows[0].count),
      followups: 3,
      dailyTarget: '75%',
      weeklyProgress: '68%',
      conversion: '32%',
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/activity', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT a.*, u.name as user_name FROM activity_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 20'
    );
    res.json({ activities: result.rows });
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
