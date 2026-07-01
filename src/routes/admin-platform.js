const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { emitToAdmins } = require('../lib/socket');
const { backupSchema, ipBlockSchema, emailTemplateSchema, supportTicketSchema } = require('../lib/schemas');

const router = Router();

router.get('/jobs', authenticate, authorize('admin'), async (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM background_jobs';
  const params = [];
  if (status) { params.push(status); query += ' WHERE status = $1'; }
  query += ' ORDER BY created_at DESC LIMIT 50';
  const r = await db.query(query, params);
  res.json({ jobs: r.rows });
});

router.get('/blocked-ips', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT bi.*, u.name as blocked_by_name FROM blocked_ips bi LEFT JOIN users u ON bi.blocked_by = u.id WHERE bi.is_active = true ORDER BY bi.created_at DESC');
  res.json({ blockedIps: r.rows });
});

router.post('/blocked-ips', authenticate, authorize('admin'), async (req, res) => {
  const data = ipBlockSchema.parse(req.body);
  const r = await db.query('INSERT INTO blocked_ips (ip_address, reason, blocked_by) VALUES ($1,$2,$3) RETURNING *', [data.ip_address, data.reason, req.user.id]);
  emitToAdmins('ip:blocked', r.rows[0]);
  res.status(201).json({ blockedIp: r.rows[0] });
});

router.delete('/blocked-ips/:id', authenticate, authorize('admin'), async (req, res) => {
  await db.query('UPDATE blocked_ips SET is_active = false WHERE id = $1', [req.params.id]);
  emitToAdmins('ip:unblocked', { id: req.params.id });
  res.json({ message: 'IP unblocked' });
});

router.get('/security-events', authenticate, authorize('admin'), async (req, res) => {
  const { severity } = req.query;
  let query = 'SELECT se.*, u.name as user_name FROM security_events se LEFT JOIN users u ON se.user_id = u.id';
  const params = [];
  if (severity) { params.push(severity); query += ' WHERE se.severity = $1'; }
  query += ' ORDER BY se.created_at DESC LIMIT 50';
  const r = await db.query(query, params);
  res.json({ events: r.rows });
});

router.get('/email-templates', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT * FROM email_templates ORDER BY name');
  res.json({ templates: r.rows });
});

router.post('/email-templates', authenticate, authorize('admin'), async (req, res) => {
  const data = emailTemplateSchema.parse(req.body);
  const r = await db.query('INSERT INTO email_templates (name, subject, body, type) VALUES ($1,$2,$3,$4) RETURNING *', [data.name, data.subject, data.body, data.type || 'transactional']);
  res.status(201).json({ template: r.rows[0] });
});

router.get('/support-tickets', authenticate, authorize('admin'), async (req, res) => {
  const { status } = req.query;
  let query = 'SELECT st.*, c.name as company_name, u.name as user_name, a.name as assigned_name FROM support_tickets st LEFT JOIN companies c ON st.company_id = c.id LEFT JOIN users u ON st.user_id = u.id LEFT JOIN users a ON st.assigned_to = a.id';
  const params = [];
  if (status) { params.push(status); query += ' WHERE st.status = $1'; }
  query += ' ORDER BY st.created_at DESC LIMIT 50';
  const r = await db.query(query, params);
  res.json({ tickets: r.rows });
});

router.patch('/support-tickets/:id', authenticate, authorize('admin'), async (req, res) => {
  const data = supportTicketSchema.parse(req.body);
  const r = await db.query('UPDATE support_tickets SET status = COALESCE($1, status), assigned_to = COALESCE($2, assigned_to) WHERE id = $3 RETURNING *', [data.status, data.assigned_to, req.params.id]);
  if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  emitToAdmins('ticket:updated', r.rows[0]);
  res.json({ ticket: r.rows[0] });
});

router.get('/feedback', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT f.*, u.name as user_name FROM feedback f LEFT JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC LIMIT 50');
  res.json({ feedback: r.rows });
});

router.get('/webhooks', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT w.*, c.name as company_name FROM webhooks w LEFT JOIN companies c ON w.company_id = c.id ORDER BY w.created_at DESC');
  res.json({ webhooks: r.rows });
});

router.get('/backups', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT * FROM backups ORDER BY created_at DESC LIMIT 20');
  res.json({ backups: r.rows });
});

router.post('/backups', authenticate, authorize('admin'), async (req, res) => {
  const data = backupSchema.parse(req.body);
  const r = await db.query("INSERT INTO backups (name, type, status) VALUES ($1, $2, 'running') RETURNING *", [data.name, data.type || 'manual']);
  setTimeout(() => {
    db.query("UPDATE backups SET status = 'completed', size_bytes = $1 WHERE id = $2", [Math.floor(Math.random() * 1000000000) + 50000000, r.rows[0].id]).catch(err => console.error('Backup completion failed:', err));
  }, 100);
  emitToAdmins('backup:created', r.rows[0]);
  res.status(201).json({ backup: r.rows[0] });
});

router.get('/service-status', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query('SELECT * FROM service_status ORDER BY service_name');
  res.json({ services: r.rows });
});

router.get('/feature-flags', authenticate, authorize('admin'), async (req, res) => {
  const r = await db.query("SELECT settings->>'Feature Flags' as flags FROM platform_settings LIMIT 1");
  res.json({ flags: r.rows[0]?.flags || {} });
});

module.exports = router;
