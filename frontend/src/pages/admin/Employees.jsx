import { useState } from 'react';
import { ShieldAlert, Key, Lock, Unlock, UserX, Mail, Calendar, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useFetch, useCreate, useUpdate, useRemove } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';

const SUPER_ADMIN_ACTIONS = [
  { label: 'Reset Passwords', icon: Key }, { label: 'Lock Accounts', icon: Lock },
  { label: 'Unlock Accounts', icon: Unlock }, { label: 'Delete Users', icon: UserX },
];

export default function AdminEmployees() {
  const [page, setPage] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editForm, setEditForm] = useState({ name: '', role: '' });

  const { data, isLoading, error } = useFetch(['admin-users', page], `/admin/users?page=${page}&limit=20`);
  const employees = data?.users || [];
  const total = data?.total || 0;

  const inviteMutation = useCreate('admin-users', '/admin/users', { successMsg: 'Employee invited successfully' });
  const editMutation = useUpdate('admin-users', '/admin/users', { successMsg: 'Employee updated' });
  const deleteMutation = useRemove('admin-users', '/admin/users', { successMsg: 'Employee deleted' });

  const handleInvite = async (e) => {
    e.preventDefault();
    await inviteMutation.mutateAsync(inviteForm);
    setShowInvite(false);
    setInviteForm({ name: '', email: '', password: '', role: 'user' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await editMutation.mutateAsync({ id: showEdit.id, data: editForm });
    setShowEdit(null);
  };

  const deleteUser = (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  const getRoleBadge = (role) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('admin')) return 'bg-purple-100 text-purple-800 ring-purple-600/20';
    if (r.includes('manager')) return 'bg-blue-100 text-blue-800 ring-blue-600/20';
    return 'bg-gray-100 text-gray-800 ring-gray-600/20';
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={4} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-1 text-sm text-gray-500">Global employee oversight across all companies.</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Invite Employee
        </button>
      </div>

      <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-indigo-600" /><h3 className="text-sm font-semibold text-indigo-900">Global Super Admin Actions</h3></div>
        <div className="flex flex-wrap gap-3">
          {SUPER_ADMIN_ACTIONS.map(a => { const Icon = a.icon; return <span key={a.label} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 shadow-sm border border-indigo-100"><Icon className="h-3.5 w-3.5" />{a.label}</span>; })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {error ? <div className="flex flex-col items-center p-10"><p className="text-red-600">Failed to load employee data.</p></div> : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Date Added</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{getInitials(e.name)}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{e.name}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" />{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleBadge(e.role)}`}>{e.role?.charAt(0).toUpperCase() + e.role?.slice(1)}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500"><div className="flex items-center gap-1"><Calendar className="h-4 w-4 text-gray-400" />{new Date(e.created_at).toLocaleDateString()}</div></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setShowEdit(e); setEditForm({ name: e.name, role: e.role }); }} className="rounded p-2 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteUser(e.id, e.name)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Employee">
        <form onSubmit={handleInvite} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Name</label><input type="text" required value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Email</label><input type="email" required value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Password</label><input type="password" required minLength={6} value={inviteForm.password} onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="user">Employee</option><option value="manager">Company Admin</option><option value="admin">Platform Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowInvite(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={inviteMutation.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {inviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Invite'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Employee">
        <form onSubmit={handleEdit} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Name</label><input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="user">Employee</option><option value="manager">Company Admin</option><option value="admin">Platform Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={editMutation.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
