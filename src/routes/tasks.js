const { Router } = require('express');
const db = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { taskSchema, taskStatusSchema } = require('../lib/schemas');
const { emitToUser } = require('../lib/socket');

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query, countQuery;
  const params = [];
  const conditions = [];

  if (req.user.role === 'user') {
    conditions.push('t.assigned_to = $' + (params.length + 1));
    params.push(req.user.id);
  }

  if (status) {
    conditions.push('t.status = $' + (params.length + 1));
    params.push(status);
  }

  const where = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  const countResult = await db.query(`SELECT COUNT(*) FROM tasks t${where}`, params);
  const limitIdx = params.length + 1;
  params.push(parseInt(limit), offset);
  query = `SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id${where} ORDER BY t.due_date ASC LIMIT $${limitIdx} OFFSET $${limitIdx + 1}`;
  const result = await db.query(query, params);
  res.json({ tasks: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
});

router.post('/', authenticate, async (req, res) => {
  const data = taskSchema.parse(req.body);
  const result = await db.query(
    `INSERT INTO tasks (title, description, priority, assigned_to, due_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.title, data.description, data.priority || 'medium', data.assigned_to || req.user.id, data.due_date]
  );
  if (data.assigned_to && data.assigned_to !== req.user.id) {
    emitToUser(data.assigned_to, 'task:created', result.rows[0]);
  }
  res.status(201).json({ task: result.rows[0] });
});

router.patch('/:id', authenticate, async (req, res) => {
  const data = taskStatusSchema.parse(req.body);
  const result = await db.query(
    `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
    [data.status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
  if (result.rows[0].assigned_to) emitToUser(result.rows[0].assigned_to, 'task:updated', result.rows[0]);
  res.json({ task: result.rows[0] });
});

module.exports = router;
