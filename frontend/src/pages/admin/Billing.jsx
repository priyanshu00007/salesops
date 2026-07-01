import { useState } from 'react';
import { DollarSign, FileText, Clock, AlertCircle, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useFetch, useCreate, useUpdate, useRemove } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';

export default function AdminBilling() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [form, setForm] = useState({ company: '', plan: 'Starter', amount: '', status: 'pending', due_date: '' });

  const { data, isLoading } = useFetch(['invoices', page], `/invoices?page=${page}&limit=20`);
  const invoices = data?.invoices || [];
  const total = data?.total || 0;

  const createMutation = useCreate('invoices', '/invoices', { successMsg: 'Invoice created' });
  const updateMutation = useUpdate('invoices', '/invoices', { successMsg: 'Invoice updated' });
  const deleteMutation = useRemove('invoices', '/invoices', { successMsg: 'Invoice deleted' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync({ ...form, amount: parseFloat(form.amount) });
    setShowCreate(false);
    setForm({ company: '', plan: 'Starter', amount: '', status: 'pending', due_date: '' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({ id: showEdit.id, data: { ...form, amount: parseFloat(form.amount) } });
    setShowEdit(null);
  };

  const updateStatus = (id, status) => updateMutation.mutate({ id, data: { status } });

  const deleteInvoice = (id, company) => {
    if (!window.confirm(`Delete invoice for ${company}?`)) return;
    deleteMutation.mutate(id);
  };

  const getStatusBadge = (status) => {
    const styles = { paid: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20', pending: 'bg-amber-100 text-amber-800 ring-amber-600/20', overdue: 'bg-red-100 text-red-800 ring-red-600/20' };
    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={5} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage tenant plans, MRR, and invoicing.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'Monthly Revenue', value: `$${invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(String(i.amount || '0').replace(/[$,]/g, '')), 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Total Invoices', value: total || invoices.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Pending', value: invoices.filter(i => i.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-500">{stat.label}</p><p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p></div>
              <div className={`rounded-full p-3 ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Plan & Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Due Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{i.company}</td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-900">${parseFloat(String(i.amount || '0').replace(/[$,]/g, '')).toLocaleString()}</div><div className="text-xs text-gray-500">{i.plan}</div></td>
                  <td className="px-6 py-4">{getStatusBadge(i.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{i.due_date ? new Date(i.due_date).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {i.status !== 'paid' && <button onClick={() => updateStatus(i.id, 'paid')} className="rounded p-2 text-emerald-600 hover:bg-emerald-50"><DollarSign className="h-4 w-4" /></button>}
                      <button onClick={() => { setShowEdit(i); setForm({ company: i.company, plan: i.plan, amount: i.amount?.toString()?.replace(/[$,]/g, '') || '', status: i.status, due_date: i.due_date?.split('T')[0] || '' }); }} className="rounded p-2 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteInvoice(i.id, i.company)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination page={page} limit={20} total={total} onPageChange={setPage} />
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Invoice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Company</label><input type="text" required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Plan</label>
              <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>Starter</option><option>Professional</option><option>Enterprise</option>
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Amount ($)</label><input type="number" required min={1} step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Due Date</label><input type="date" required value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Invoice">
        <form onSubmit={handleEdit} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Company</label><input type="text" required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Plan</label>
              <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option>Starter</option><option>Professional</option><option>Enterprise</option>
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Amount ($)</label><input type="number" required min={1} step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Due Date</label><input type="date" required value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={updateMutation.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
