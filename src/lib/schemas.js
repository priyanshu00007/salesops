const { z } = require('zod');

const companySchema = z.object({
  name: z.string().min(1).max(255),
  plan: z.enum(['Starter', 'Professional', 'Enterprise']).optional(),
});

const companyStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'pending']),
});

const leadSchema = z.object({
  name: z.string().min(1).max(255),
  company: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
});

const leadUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  company: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
});

const callSchema = z.object({
  lead_id: z.number().int().positive().optional().nullable(),
  lead_name: z.string().max(255).optional().nullable(),
  type: z.enum(['inbound', 'outbound', 'follow-up']).optional(),
  duration: z.number().int().min(0).optional(),
  result: z.string().max(50).optional().nullable(),
  notes: z.string().optional().nullable(),
  call_date: z.string().optional(),
});

const taskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  due_date: z.string().optional().nullable(),
});

const taskStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

const clientSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  owner_id: z.string().uuid().optional().nullable(),
});

const invoiceSchema = z.object({
  company: z.string().min(1).max(255),
  plan: z.string().max(255).optional(),
  amount: z.number().positive(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
  due_date: z.string().optional().nullable(),
});

const invoiceUpdateSchema = z.object({
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
  amount: z.number().positive().optional(),
});

const userSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
  role: z.enum(['admin', 'manager', 'user']).optional(),
});

const userUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(['admin', 'manager', 'user']).optional(),
});

const roleUpdateSchema = z.object({
  role: z.enum(['admin', 'manager', 'user']),
});

const settingsSchema = z.object({
  settings: z.record(z.any()),
});

const apiKeySchema = z.object({
  name: z.string().min(1).max(255),
  company_id: z.string().uuid().optional().nullable(),
  permissions: z.array(z.string()).optional(),
});

const backupSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['manual', 'scheduled', 'auto']).optional(),
});

const ipBlockSchema = z.object({
  ip_address: z.string().min(1).max(45),
  reason: z.string().max(500).optional().nullable(),
});

const emailTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  subject: z.string().min(1).max(500),
  body: z.string().min(1),
  type: z.enum(['transactional', 'campaign', 'alert']).optional(),
});

const supportTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
});

module.exports = {
  companySchema, companyStatusSchema,
  leadSchema, leadUpdateSchema,
  callSchema,
  taskSchema, taskStatusSchema,
  clientSchema,
  invoiceSchema, invoiceUpdateSchema,
  userSchema, userUpdateSchema, roleUpdateSchema,
  settingsSchema,
  apiKeySchema,
  backupSchema,
  ipBlockSchema,
  emailTemplateSchema,
  supportTicketSchema,
};
