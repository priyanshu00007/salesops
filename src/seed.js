require('dotenv/config');

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pgConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'sales2',
};

async function seed() {
  const pool = new Pool(pgConfig);

  try {
    const initSQL = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf-8');
    await pool.query(initSQL);
    console.log('Tables ready.');

    const existing = await pool.query('SELECT COUNT(*) FROM users');
    const alreadySeeded = parseInt(existing.rows[0].count) > 0;

    if (alreadySeeded) {
      console.log('Users already seeded. Checking settings...');
    }

    if (!alreadySeeded) {
      const hash = await bcrypt.hash('password123', 10);

    await pool.query(`INSERT INTO users (name, email, password, role) VALUES
      ('Super Admin', 'admin@salesops.com', $1, 'admin'),
      ('Acme Manager', 'manager@acme.com', $1, 'manager'),
      ('Rahul Sharma', 'rahul@acme.com', $1, 'user'),
      ('Priya Patel', 'priya@acme.com', $1, 'user'),
      ('Amit Singh', 'amit@acme.com', $1, 'user'),
      ('Neha Gupta', 'neha@acme.com', $1, 'user')
    `, [hash]);
    console.log('Users seeded.');

    await pool.query(`INSERT INTO companies (name, status, plan, employees_count, revenue) VALUES
      ('Acme Corp', 'active', 'Enterprise', 32, '$12,400'),
      ('TechStar Inc', 'active', 'Professional', 28, '$8,200'),
      ('GlobalSoft', 'suspended', 'Starter', 12, '$3,100'),
      ('DataFlow Ltd', 'pending', 'Starter', 8, '$0'),
      ('InnovateCo', 'active', 'Enterprise', 67, '$24,500'),
      ('PeakSales', 'active', 'Professional', 34, '$9,800')
    `);
    console.log('Companies seeded.');

    const users = await pool.query('SELECT id, name FROM users WHERE role = $1', ['user']);

    await pool.query(`INSERT INTO leads (name, company, phone, email, status, assigned_to) VALUES
      ('Rajesh Kumar', 'TechVentures', '+91-9876543210', 'rajesh@techventures.com', 'new', $1),
      ('Sneha Reddy', 'InnoSoft', '+91-8765432109', 'sneha@innosoft.com', 'contacted', $2),
      ('Vikram Joshi', 'CloudBase', '+91-7654321098', 'vikram@cloudbase.io', 'qualified', $1),
      ('Ananya Iyer', 'DataMint', '+91-6543210987', 'ananya@datamint.com', 'proposal', $2),
      ('Arjun Nair', 'WebCraft', '+91-5432109876', 'arjun@webcraft.com', 'closed-won', $1),
      ('Deepak Verma', 'AppForge', '+91-4321098765', 'deepak@appforge.com', 'callback', $2),
      ('Kavita Singh', 'CloudBase', '+91-3210987654', 'kavita@cloudbase.io', 'new', $1),
      ('Rohit Mehta', 'TechVentures', '+91-2109876543', 'rohit@techventures.com', 'qualified', $2)
    `, [users.rows[0].id, users.rows[1].id]);
    console.log('Leads seeded.');

    const rajesh = await pool.query("SELECT id FROM leads WHERE name = 'Rajesh Kumar'");
    const sneha = await pool.query("SELECT id FROM leads WHERE name = 'Sneha Reddy'");
    const vikram = await pool.query("SELECT id FROM leads WHERE name = 'Vikram Joshi'");
    const ananya = await pool.query("SELECT id FROM leads WHERE name = 'Ananya Iyer'");
    const rahulId = users.rows[0].id;
    const priyaId = users.rows[1].id;

    await pool.query(`INSERT INTO calls (lead_id, user_id, lead_name, type, duration, result, call_date) VALUES
      ($1, $5, 'Rajesh Kumar', 'Outgoing', '12:34', 'Interested', '2026-06-30'),
      ($2, $6, 'Sneha Reddy', 'Incoming', '8:22', 'Meeting Scheduled', '2026-06-30'),
      ($3, $5, 'Vikram Joshi', 'Outgoing', '15:10', 'No Answer', '2026-06-29'),
      ($4, $6, 'Ananya Iyer', 'Outgoing', '6:45', 'Callback Requested', '2026-06-29'),
      ($1, $5, 'Rajesh Kumar', 'Outgoing', '9:15', 'Follow-up Scheduled', '2026-06-28'),
      ($3, $5, 'Vikram Joshi', 'Incoming', '4:30', 'Wrong Number', '2026-06-27')
    `, [rajesh.rows[0].id, sneha.rows[0].id, vikram.rows[0].id, ananya.rows[0].id, rahulId, priyaId]);
    console.log('Calls seeded.');

    await pool.query(`INSERT INTO tasks (title, description, priority, status, assigned_to, due_date) VALUES
      ('Follow up with Rajesh Kumar', 'Send proposal and pricing', 'high', 'pending', $1, '2026-07-02'),
      ('Prepare proposal for TechVentures', 'Create detailed proposal document', 'high', 'in-progress', $2, '2026-07-01'),
      ('Update lead status for Vikram Joshi', 'Mark as qualified in CRM', 'medium', 'completed', $1, '2026-06-30'),
      ('Schedule demo with CloudBase', 'Coordinate with engineering team', 'low', 'pending', $2, '2026-07-03'),
      ('Send meeting notes', 'Email summary to Sneha Reddy', 'medium', 'completed', $1, '2026-06-29'),
      ('Review quarterly pipeline', 'Analyze conversion metrics', 'high', 'in-progress', $2, '2026-07-05')
    `, [users.rows[0].id, users.rows[1].id]);
    console.log('Tasks seeded.');

    const manager = await pool.query("SELECT id FROM users WHERE role = 'manager' LIMIT 1");

    await pool.query(`INSERT INTO clients (name, email, phone, status, owner_id) VALUES
      ('TechVentures', 'info@techventures.com', '+91-9876543210', 'active', $1),
      ('InnoSoft', 'contact@innosoft.com', '+91-8765432109', 'active', $2),
      ('CloudBase', 'hello@cloudbase.io', '+91-7654321098', 'negotiation', $1),
      ('DataMint', 'hello@datamint.com', '+91-6543210987', 'active', $2)
    `, [users.rows[0].id, users.rows[1].id]);
    console.log('Clients seeded.');

    await pool.query(`INSERT INTO activity_logs (user_id, action, level, source) VALUES
      ($1, 'Logged in', 'info', 'AuthService'),
      ($2, 'Created new lead: Kavita Singh', 'info', 'LeadsAPI'),
      ($3, 'Exported company report', 'warn', 'ReportsModule'),
      ($1, 'Failed login attempt', 'warn', 'AuthService'),
      ($1, 'Updated lead status: Rajesh Kumar', 'info', 'LeadsAPI'),
      ($2, 'Deleted lead: Test Lead', 'error', 'LeadsAPI'),
      ($1, 'Connected to database replica', 'info', 'PostgresDb'),
      ($3, 'API rate limit approaching for client-42', 'warn', 'APIGateway'),
      ($1, 'Payment gateway timeout for invoice INV-042', 'error', 'BillingService'),
      ($1, 'Feature flag "ai_lead_scoring" enabled', 'info', 'AdminAPI')
    `, [
      users.rows[0].id, users.rows[1].id,
      manager.rows[0].id,
    ]);
    console.log('Activity logs seeded.');
    }

    const settingsExist = await pool.query('SELECT COUNT(*) FROM platform_settings');
    if (parseInt(settingsExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO platform_settings (settings) VALUES ($1)`, [JSON.stringify({
        'Global Branding': { 'Logo URL': 'https://salesops.com/logo.png', 'Primary Color': '#2563eb', 'Favicon URL': '/favicon.ico', 'Custom Domain': 'app.salesops.com' },
        'Email Configuration': { 'SMTP Host': 'smtp.sendgrid.net', 'SMTP Port': '587', 'Username': 'apikey', 'From Address': 'noreply@salesops.com' },
        'SMS Providers': { 'Provider': 'Twilio', 'API Key': 'SK********', 'Sender ID': 'SALESOPS' },
        'Storage Options': { 'Storage Provider': 'AWS S3', 'Bucket Name': 'salesops-uploads', 'Region': 'us-east-1', 'Max File Size': '50MB' },
        'Authentication': { 'Auth Method': 'JWT + OAuth2', 'Session Timeout': '24h', 'MFA Required': 'No', 'Password Min Length': '8' },
        'Security Policies': { 'IP Whitelist': '0.0.0.0/0', 'Session Timeout': '3600s', 'Audit Level': 'Detailed', 'Max Login Attempts': '5' },
        'Feature Flags': { 'Module Name': 'AI Lead Scoring', 'Enabled': 'Yes', 'Target Roles': 'admin,manager' },
      })]);
      console.log('Platform settings seeded.');
    }

    const comps = await pool.query('SELECT id, name FROM companies');
    const compMap = {};
    comps.rows.forEach(r => { compMap[r.name] = r.id; });

    // Company Requests
    const reqExist = await pool.query('SELECT COUNT(*) FROM company_requests');
    if (parseInt(reqExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO company_requests (company_name, contact_name, contact_email, phone, plan, status) VALUES
        ('NexGen Corp', 'Arun Mehta', 'arun@nexgen.com', '+91-9988776655', 'enterprise', 'pending'),
        ('CloudBase Inc', 'Neha Kapoor', 'neha@cloudbase.io', '+91-8877665544', 'professional', 'pending'),
        ('DataSync Ltd', 'Ravi Sharma', 'ravi@datasync.com', '+91-7766554433', 'starter', 'approved')
      `);
      console.log('Company requests seeded.');
    }

    // Subscription Plans
    const plansExist = await pool.query('SELECT COUNT(*) FROM subscription_plans');
    if (parseInt(plansExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO subscription_plans (name, code, description, price_monthly, price_yearly, max_users, max_storage_gb, features) VALUES
        ('Starter', 'starter', 'For small teams getting started', 29, 290, 10, 5, '["Basic Analytics", "Email Support", "5 GB Storage"]'),
        ('Professional', 'professional', 'For growing businesses', 99, 990, 50, 50, '["Advanced Analytics", "Priority Support", "50 GB Storage", "API Access", "Custom Roles"]'),
        ('Enterprise', 'enterprise', 'For large organizations', 299, 2990, -1, 500, '["All Features", "24/7 Support", "500 GB Storage", "SSO", "Audit Logs", "Custom Integrations", "SLA Guarantee"]')
      `);
      console.log('Subscription plans seeded.');
    }

    const plans = await pool.query('SELECT id, code FROM subscription_plans');
    const planMap = {};
    plans.rows.forEach(r => { planMap[r.code] = r.id; });

    // Company Subscriptions
    const subsExist = await pool.query('SELECT COUNT(*) FROM company_subscriptions');
    if (parseInt(subsExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO company_subscriptions (company_id, plan_id, status, billing_cycle, current_period_start, current_period_end) VALUES
        ($1, $2, 'active', 'monthly', '2026-06-01', '2026-07-01'),
        ($3, $4, 'active', 'yearly', '2026-01-01', '2027-01-01'),
        ($5, $6, 'active', 'monthly', '2026-06-15', '2026-07-15'),
        ($7, $8, 'active', 'monthly', '2026-05-01', '2026-06-01')
      `, [compMap['Acme Corp'], planMap['enterprise'], compMap['TechStar Inc'], planMap['professional'], compMap['InnovateCo'], planMap['enterprise'], compMap['PeakSales'], planMap['professional']]);
      console.log('Subscriptions seeded.');
    }

    // Company Usage
    const usageExist = await pool.query('SELECT COUNT(*) FROM company_usage');
    if (parseInt(usageExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO company_usage (company_id, metric, value, recorded_date) VALUES
        ($1, 'api_calls', 12458, '2026-06-30'), ($1, 'storage_gb', 32, '2026-06-30'), ($1, 'active_users', 28, '2026-06-30'),
        ($2, 'api_calls', 8921, '2026-06-30'), ($2, 'storage_gb', 18, '2026-06-30'), ($2, 'active_users', 22, '2026-06-30'),
        ($3, 'api_calls', 45210, '2026-06-30'), ($3, 'storage_gb', 89, '2026-06-30'), ($3, 'active_users', 58, '2026-06-30')
      `, [compMap['Acme Corp'], compMap['TechStar Inc'], compMap['InnovateCo']]);
      console.log('Usage seeded.');
    }

    // Company Domains
    const domExist = await pool.query('SELECT COUNT(*) FROM company_domains');
    if (parseInt(domExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO company_domains (company_id, domain, verified) VALUES
        ($1, 'acme.com', true), ($1, 'acme.co.uk', false),
        ($2, 'techstar.io', true), ($3, 'innovateco.com', true)
      `, [compMap['Acme Corp'], compMap['TechStar Inc'], compMap['InnovateCo']]);
      console.log('Domains seeded.');
    }

    // Departments
    const deptExist = await pool.query('SELECT COUNT(*) FROM departments');
    if (parseInt(deptExist.rows[0].count) === 0) {
      const deptData = [
        [compMap['Acme Corp'], 'Engineering', 12], [compMap['Acme Corp'], 'Sales', 8], [compMap['Acme Corp'], 'Marketing', 5], [compMap['Acme Corp'], 'HR', 3],
        [compMap['TechStar Inc'], 'Engineering', 10], [compMap['TechStar Inc'], 'Sales', 6], [compMap['TechStar Inc'], 'Support', 4],
        [compMap['InnovateCo'], 'Engineering', 20], [compMap['InnovateCo'], 'Sales', 15], [compMap['InnovateCo'], 'Product', 8], [compMap['InnovateCo'], 'Design', 6],
      ];
      for (const d of deptData) {
        await pool.query('INSERT INTO departments (company_id, name, head_count) VALUES ($1, $2, $3)', d);
      }
      console.log('Departments seeded.');
    }

    const allUsers = await pool.query('SELECT id, name, email, role FROM users ORDER BY created_at');
    const usrs = allUsers.rows;

    // Company Owners
    const ownersExist = await pool.query('SELECT COUNT(*) FROM company_owners');
    if (parseInt(ownersExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO company_owners (company_id, user_id, role) VALUES
        ($1, $2, 'owner'), ($3, $4, 'owner'), ($5, $2, 'admin')
      `, [compMap['Acme Corp'], usrs[1].id, compMap['TechStar Inc'], usrs[0].id, compMap['InnovateCo']]);
      console.log('Company owners seeded.');
    }

    // Sessions
    const sessExist = await pool.query('SELECT COUNT(*) FROM sessions');
    if (parseInt(sessExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO sessions (user_id, ip_address, user_agent, is_active, last_activity, expires_at) VALUES
        ($1, '192.168.1.100', 'Mozilla/5.0 Chrome/120', true, NOW(), NOW() + INTERVAL '24 hours'),
        ($2, '192.168.1.101', 'Mozilla/5.0 Firefox/121', true, NOW(), NOW() + INTERVAL '24 hours'),
        ($3, '10.0.0.50', 'Mozilla/5.0 Safari/17', true, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '23 hours'),
        ($4, '192.168.1.102', 'Mozilla/5.0 Edge/120', false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour')
      `, [usrs[0].id, usrs[1].id, usrs[2].id, usrs[3].id]);
      console.log('Sessions seeded.');
    }

    // Invitations
    const invExist = await pool.query('SELECT COUNT(*) FROM invitations');
    if (parseInt(invExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO invitations (company_id, email, role, token, status, invited_by, expires_at) VALUES
        ($1, 'newhire@acme.com', 'user', 'tok_' || gen_random_uuid()::text, 'pending', $2, NOW() + INTERVAL '7 days'),
        ($1, 'contractor@acme.com', 'user', 'tok_' || gen_random_uuid()::text, 'accepted', $2, NOW() + INTERVAL '7 days'),
        ($3, 'engineer@techstar.io', 'manager', 'tok_' || gen_random_uuid()::text, 'pending', $4, NOW() + INTERVAL '7 days'),
        ($5, 'admin@innovateco.com', 'manager', 'tok_' || gen_random_uuid()::text, 'expired', $2, NOW() - INTERVAL '1 day')
      `, [compMap['Acme Corp'], usrs[1].id, compMap['TechStar Inc'], usrs[0].id, compMap['InnovateCo']]);
      console.log('Invitations seeded.');
    }

    // Login History
    const loginExist = await pool.query('SELECT COUNT(*) FROM login_history');
    if (parseInt(loginExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO login_history (user_id, email, ip_address, user_agent, success, failure_reason) VALUES
        ($1, 'admin@salesops.com', '192.168.1.100', 'Chrome/120', true, NULL),
        ($2, 'manager@acme.com', '192.168.1.101', 'Firefox/121', true, NULL),
        ($3, 'rahul@acme.com', '192.168.1.102', 'Safari/17', true, NULL),
        (NULL, 'unknown@evil.com', '10.0.0.99', 'Python/3.11', false, 'Invalid credentials'),
        (NULL, 'admin@salesops.com', '203.0.113.50', 'curl/8.0', false, 'Invalid password'),
        ($1, 'admin@salesops.com', '192.168.1.100', 'Chrome/120', true, NULL)
      `, [usrs[0].id, usrs[1].id, usrs[2].id]);
      console.log('Login history seeded.');
    }

    // Role Templates
    const rtExist = await pool.query('SELECT COUNT(*) FROM role_templates');
    if (parseInt(rtExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO role_templates (name, description, permissions, is_system) VALUES
        ('Super Admin', 'Full platform access', '["*"]', true),
        ('Company Admin', 'Full company access', '["company.*", "users.*", "billing.read"]', true),
        ('Manager', 'Team management access', '["team.*", "leads.*", "reports.read"]', true),
        ('Employee', 'Basic operational access', '["leads.read", "calls.*", "tasks.*", "profile.*"]', true),
        ('Auditor', 'Read-only access for auditing', '["*.read", "reports.*"]', false),
        ('Developer', 'API and integration access', '["api.*", "webhooks.*", "logs.read"]', false)
      `);
      console.log('Role templates seeded.');
    }

    // Access Policies
    const apExist = await pool.query('SELECT COUNT(*) FROM access_policies');
    if (parseInt(apExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO access_policies (name, description, resource, action, conditions) VALUES
        ('Allow Company Read', 'Allow reading company data', 'company', 'read', '{"role": ["admin", "manager"]}'),
        ('Allow Company Write', 'Allow modifying company data', 'company', 'write', '{"role": ["admin"]}'),
        ('Allow User Management', 'Allow managing users', 'users', '*', '{"role": ["admin", "manager"]}'),
        ('Allow Billing Access', 'Allow billing operations', 'billing', '*', '{"role": ["admin"]}'),
        ('Allow Reporting', 'Allow viewing reports', 'reports', 'read', '{"role": ["admin", "manager", "user"]}')
      `);
      console.log('Access policies seeded.');
    }

    // API Keys
    const akExist = await pool.query('SELECT COUNT(*) FROM api_keys');
    if (parseInt(akExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO api_keys (name, company_id, key_value, permissions, last_used) VALUES
        ('Acme Production', $1, 'sk_' || gen_random_uuid()::text, '["read","write"]', NOW() - INTERVAL '1 hour'),
        ('Acme Development', $1, 'sk_' || gen_random_uuid()::text, '["read"]', NOW() - INTERVAL '1 day'),
        ('TechStar API', $2, 'sk_' || gen_random_uuid()::text, '["read","write","admin"]', NOW() - INTERVAL '5 minutes'),
        ('InnovateCo Integration', $3, 'sk_' || gen_random_uuid()::text, '["read"]', NULL)
      `, [compMap['Acme Corp'], compMap['TechStar Inc'], compMap['InnovateCo']]);
      console.log('API keys seeded.');
    }

    // OAuth Providers
    const oauthExist = await pool.query('SELECT COUNT(*) FROM oauth_providers');
    if (parseInt(oauthExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO oauth_providers (name, provider, client_id, client_secret, redirect_url, is_enabled) VALUES
        ('Google Workspace', 'google', 'google-client-id-123', 'gs*********secret', 'https://app.salesops.com/auth/google/callback', true),
        ('Microsoft Azure AD', 'microsoft', 'ms-client-id-456', 'ms*********secret', 'https://app.salesops.com/auth/microsoft/callback', true),
        ('GitHub', 'github', 'gh-client-id-789', 'gh*********secret', 'https://app.salesops.com/auth/github/callback', false),
        ('Okta', 'okta', 'okta-client-id-012', 'ok*********secret', 'https://app.salesops.com/auth/okta/callback', false)
      `);
      console.log('OAuth providers seeded.');
    }

    // Payments
    const payExist = await pool.query('SELECT COUNT(*) FROM payments');
    if (parseInt(payExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO payments (company_id, amount, currency, method, status, transaction_id, paid_at) VALUES
        ($1, 299.00, 'USD', 'stripe', 'completed', 'ch_' || gen_random_uuid()::text, NOW() - INTERVAL '5 days'),
        ($1, 299.00, 'USD', 'stripe', 'completed', 'ch_' || gen_random_uuid()::text, NOW() - INTERVAL '1 month'),
        ($2, 99.00, 'USD', 'paypal', 'completed', 'pay_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days'),
        ($3, 299.00, 'USD', 'stripe', 'pending', 'ch_' || gen_random_uuid()::text, NULL),
        ($4, 99.00, 'USD', 'bank_transfer', 'failed', 'bt_' || gen_random_uuid()::text, NULL)
      `, [compMap['Acme Corp'], compMap['TechStar Inc'], compMap['InnovateCo'], compMap['GlobalSoft']]);
      console.log('Payments seeded.');
    }

    // Coupons
    const coupExist = await pool.query('SELECT COUNT(*) FROM coupons');
    if (parseInt(coupExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO coupons (code, discount_type, discount_value, max_uses, current_uses, is_active, expires_at) VALUES
        ('LAUNCH20', 'percentage', 20, 100, 45, true, '2026-12-31'),
        ('SAVE50', 'fixed', 50, 50, 12, true, '2026-09-30'),
        ('YEARLY25', 'percentage', 25, 200, 0, true, '2027-01-01'),
        ('EXPIRED10', 'percentage', 10, 50, 50, false, '2026-01-01')
      `);
      console.log('Coupons seeded.');
    }

    // Tax Rates
    const taxExist = await pool.query('SELECT COUNT(*) FROM tax_rates');
    if (parseInt(taxExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO tax_rates (name, country, region, rate) VALUES
        ('US Standard', 'US', 'All States', 0.0000),
        ('US California', 'US', 'California', 0.0725),
        ('US New York', 'US', 'New York', 0.0888),
        ('UK VAT', 'GB', 'All Regions', 0.2000),
        ('EU VAT Standard', 'EU', 'All Regions', 0.2100),
        ('India GST 18%', 'IN', 'All States', 0.1800),
        ('Australia GST', 'AU', 'All Regions', 0.1000)
      `);
      console.log('Tax rates seeded.');
    }

    // Background Jobs
    const bjExist = await pool.query('SELECT COUNT(*) FROM background_jobs');
    if (parseInt(bjExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO background_jobs (name, type, status, progress, payload, started_at, completed_at) VALUES
        ('Daily Backup', 'backup', 'completed', 100, '{"type": "full"}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
        ('Invoice Reminder', 'email', 'completed', 100, '{"template": "invoice_reminder"}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes'),
        ('Data Sync - Salesforce', 'sync', 'running', 67, '{"source": "salesforce", "records": 12450}', NOW() - INTERVAL '10 minutes', NULL),
        ('Report Generation', 'report', 'pending', 0, '{"report": "monthly_revenue"}', NULL, NULL),
        ('Cache Warmup', 'maintenance', 'failed', 45, '{"cache_keys": 1200}', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),
        ('User Import CSV', 'import', 'completed', 100, '{"file": "users_batch_3.csv"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours')
      `);
      console.log('Background jobs seeded.');
    }

    // Blocked IPs
    const bipExist = await pool.query('SELECT COUNT(*) FROM blocked_ips');
    if (parseInt(bipExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO blocked_ips (ip_address, reason, blocked_by, expires_at) VALUES
        ('203.0.113.50', 'Brute force attack detected', $1, NOW() + INTERVAL '7 days'),
        ('198.51.100.25', 'Known malicious scanner', $1, NOW() + INTERVAL '30 days'),
        ('10.0.0.99', 'Internal policy violation', $1, NULL)
      `, [usrs[0].id]);
      console.log('Blocked IPs seeded.');
    }

    // Security Events
    const seExist = await pool.query('SELECT COUNT(*) FROM security_events');
    if (parseInt(seExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO security_events (event_type, severity, description, ip_address, user_id, metadata) VALUES
        ('login_failed', 'medium', 'Repeated failed login from unknown IP', '203.0.113.50', NULL, '{"attempts": 15}'),
        ('password_changed', 'info', 'Admin changed their password', '192.168.1.100', $1, '{}'),
        ('api_key_created', 'info', 'New API key created for Acme Corp', '192.168.1.101', $2, '{"key_name": "Production API"}'),
        ('suspicious_login', 'high', 'Login from unusual geographic location', '45.33.32.156', $3, '{"country": "Russia", "city": "Moscow"}'),
        ('rate_limit_exceeded', 'medium', 'API rate limit exceeded for client', '10.0.0.50', NULL, '{"endpoint": "/api/leads", "requests": 1200}'),
        ('mfa_disabled', 'high', 'Admin disabled MFA for company', '192.168.1.100', $1, '{"company": "Acme Corp"}')
      `, [usrs[0].id, usrs[1].id, usrs[2].id]);
      console.log('Security events seeded.');
    }

    // Email Templates
    const etExist = await pool.query('SELECT COUNT(*) FROM email_templates');
    if (parseInt(etExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO email_templates (name, subject, body, type) VALUES
        ('Welcome Email', 'Welcome to {{platform}}!', '<h1>Welcome {{name}}!</h1><p>Get started with your account.</p>', 'transactional'),
        ('Invoice Reminder', 'Invoice {{number}} is due soon', '<p>Dear {{name}}, your invoice of {{amount}} is due on {{date}}.</p>', 'transactional'),
        ('Password Reset', 'Reset your password', '<p>Click <a href="{{link}}">here</a> to reset your password.</p>', 'transactional'),
        ('Weekly Digest', 'Your {{platform}} Weekly Digest', '<h2>Weekly Summary</h2><p>{{stats}}</p>', 'campaign'),
        ('Invitation', 'You have been invited to {{platform}}', '<p>{{inviter}} has invited you to join {{platform}}.</p>', 'transactional'),
        ('Security Alert', 'Security alert for your account', '<p>A {{event}} was detected on your account.</p>', 'alert')
      `);
      console.log('Email templates seeded.');
    }

    // Support Tickets
    const stExist = await pool.query('SELECT COUNT(*) FROM support_tickets');
    if (parseInt(stExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO support_tickets (company_id, user_id, subject, description, priority, status, assigned_to) VALUES
        ($1, $2, 'Cannot access billing page', 'Getting 403 error when accessing /billing', 'high', 'open', $3),
        ($1, $4, 'Need to increase storage limit', 'We are approaching our 5GB limit, need upgrade', 'medium', 'open', NULL),
        ($5, $6, 'API integration failing', 'Webhook returns 500 error intermittently', 'high', 'in-progress', $3),
        ($7, $4, 'Feature request: bulk export', 'Would be useful to export all leads as CSV', 'low', 'closed', NULL)
      `, [compMap['Acme Corp'], usrs[1].id, usrs[0].id, usrs[2].id, compMap['InnovateCo'], usrs[3].id, compMap['TechStar Inc']]);
      console.log('Support tickets seeded.');
    }

    // Feedback
    const fbExist = await pool.query('SELECT COUNT(*) FROM feedback');
    if (parseInt(fbExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO feedback (user_id, type, subject, message, status) VALUES
        ($1, 'feature_request', 'Dark mode', 'Please add a dark mode option, it would help with late night work.', 'new'),
        ($2, 'bug_report', 'Export button not working', 'The CSV export on the leads page seems to be broken for large datasets.', 'reviewed'),
        ($3, 'feedback', 'Great platform!', 'Really enjoying the new dashboard layout. Much cleaner!', 'new'),
        ($4, 'feature_request', 'Mobile app', 'Would love to see a mobile app for checking tasks on the go.', 'new')
      `, [usrs[0].id, usrs[1].id, usrs[2].id, usrs[3].id]);
      console.log('Feedback seeded.');
    }

    // Webhooks
    const whExist = await pool.query('SELECT COUNT(*) FROM webhooks');
    if (parseInt(whExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO webhooks (company_id, name, url, events) VALUES
        ($1, 'Slack Notifications', 'https://hooks.slack.com/services/T0/B0/xxx', '["lead.created", "deal.won", "ticket.updated"]'),
        ($1, 'Zapier Integration', 'https://hooks.zapier.com/hooks/catch/123/abc/', '["company.updated", "user.created"]'),
        ($2, 'Internal Webhook', 'https://api.techstar.io/webhooks/v1', '["*"]')
      `, [compMap['Acme Corp'], compMap['TechStar Inc']]);
      console.log('Webhooks seeded.');
    }

    // Backups
    const bkExist = await pool.query('SELECT COUNT(*) FROM backups');
    if (parseInt(bkExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO backups (name, type, size_bytes, status, location, created_at) VALUES
        ('Daily Full Backup 2026-06-30', 'automated', 524288000, 'completed', 's3://backups/daily/2026-06-30/', NOW() - INTERVAL '2 hours'),
        ('Weekly Full Backup 2026-06-28', 'automated', 510000000, 'completed', 's3://backups/weekly/2026-06-28/', NOW() - INTERVAL '3 days'),
        ('Pre-Migration Backup', 'manual', 498000000, 'completed', 's3://backups/manual/pre-migration/', NOW() - INTERVAL '7 days'),
        ('Logical Dump - Users', 'manual', 25000000, 'completed', 's3://backups/manual/users-export/', NOW() - INTERVAL '14 days')
      `);
      console.log('Backups seeded.');
    }

    // Service Status
    const ssExist = await pool.query('SELECT COUNT(*) FROM service_status');
    if (parseInt(ssExist.rows[0].count) === 0) {
      await pool.query(`INSERT INTO service_status (service_name, status, message, last_checked, response_time_ms) VALUES
        ('API Gateway', 'healthy', 'All routes operational', NOW(), 45),
        ('PostgreSQL Primary', 'healthy', 'Connected, replication lag 0ms', NOW(), 12),
        ('PostgreSQL Replica', 'healthy', 'Streaming replication active', NOW(), 15),
        ('Redis Cache', 'healthy', 'Hit rate 94.2%', NOW(), 3),
        ('Background Workers', 'healthy', '6 workers online, 0 stuck jobs', NOW(), 22),
        ('Email Service', 'degraded', 'Queue backlog of 142 messages', NOW(), 350),
        ('Storage S3', 'healthy', 'All buckets accessible', NOW(), 89),
        ('CDN', 'healthy', 'Edge locations: 47 POPs', NOW(), 34),
        ('Payment Gateway', 'healthy', 'Stripe API responding', NOW(), 120),
        ('Search Index', 'healthy', 'Index up to date', NOW(), 55)
      `);
      console.log('Service status seeded.');
    }
    console.log('\nDemo accounts (password: password123):');
    console.log('  admin@salesops.com   → Super Admin');
    console.log('  manager@acme.com     → Company Admin');
    console.log('  rahul@acme.com       → Employee');
    console.log('  priya@acme.com       → Employee');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
