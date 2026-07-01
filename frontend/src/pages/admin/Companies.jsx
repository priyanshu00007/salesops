import { useState } from 'react';
import { Building2, ShieldCheck, Trash2, Ban, RefreshCw, CheckCircle, Users, Briefcase, Plus, Loader2 } from 'lucide-react';
import { useFetch, useCreate, useUpdate, useRemove } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';

export default function Companies() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', plan: 'Starter' });

  const { data, isLoading, error } = useFetch(['companies', page], `/companies?page=${page}&limit=20`);
  const companies = data?.companies || [];
  const total = data?.total || 0;

  const createMutation = useCreate('companies', '/companies', { successMsg: 'Company created successfully' });
  const updateMutation = useUpdate('companies', '/companies', { successMsg: 'Company updated' });
  const deleteMutation = useRemove('companies', '/companies', { successMsg: 'Company deleted' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync(form);
    setShowCreate(false);
    setForm({ name: '', plan: 'Starter' });
  };

  const updateStatus = (id, status) => updateMutation.mutate({ id, data: { status } });
  const deleteCompany = (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const getStatusBadge = (status) => {
    const styles = { active: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20', suspended: 'bg-red-100 text-red-800 ring-red-600/20', pending: 'bg-amber-100 text-amber-800 ring-amber-600/20' };
    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={4} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all tenant organizations.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Company
        </button>
      </div>

      <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600" /><h3 className="text-sm font-semibold text-blue-900">Super Admin Capabilities</h3></div>
        <div className="flex flex-wrap gap-2">
          {['Create Company', 'Suspend Company', 'Delete Company', 'Restore Company', 'Approve Company'].map(a => (
            <span key={a} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm border border-blue-100">{a}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {error ? <div className="p-8 text-center text-red-600">Failed to load companies.</div> : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Details</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50"><Building2 className="h-5 w-5 text-indigo-600" /></div>
                          <div><div className="text-sm font-medium text-gray-900">{c.name}</div></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-600"><Users className="mr-2 h-4 w-4 text-gray-400" />{c.employees_count} Employees</div>
                          <div className="flex items-center text-sm text-gray-600"><Briefcase className="mr-2 h-4 w-4 text-gray-400" />{c.plan} Plan ({c.revenue})</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {updateMutation.isPending && updateMutation.variables?.id === c.id ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : (
                            <>
                              {c.status === 'active' && <button onClick={() => updateStatus(c.id, 'suspended')} className="rounded p-2 text-amber-600 hover:bg-amber-50"><Ban className="h-4 w-4" /></button>}
                              {c.status === 'suspended' && <button onClick={() => updateStatus(c.id, 'active')} className="rounded p-2 text-emerald-600 hover:bg-emerald-50"><RefreshCw className="h-4 w-4" /></button>}
                              {c.status === 'pending' && <button onClick={() => updateStatus(c.id, 'active')} className="rounded p-2 text-emerald-600 hover:bg-emerald-50"><CheckCircle className="h-4 w-4" /></button>}
                              <button onClick={() => deleteCompany(c.id, c.name)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                            </>
                          )}
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
          </>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Company">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Plan</label>
            <select value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>Starter</option><option>Professional</option><option>Enterprise</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
