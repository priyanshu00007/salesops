import { useState } from 'react';
import { Link2, Plus, Trash2, Loader2 } from 'lucide-react';
import { useFetch, useCreate, useRemove } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';
import Modal from '../../components/Modal';

export default function ApiKeys() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', company_id: '', permissions: 'read' });

  const { data, isLoading } = useFetch('api-keys', '/admin/api-keys');
  const keys = data?.apiKeys || [];

  const createMutation = useCreate('api-keys', '/admin/api-keys', { successMsg: 'API key created' });
  const deleteMutation = useRemove('api-keys', '/admin/api-keys', { successMsg: 'API key revoked' });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync({ ...form, permissions: form.permissions.split(',').map(p => p.trim()) });
    setShowCreate(false);
    setForm({ name: '', company_id: '', permissions: 'read' });
  };

  const revoke = (id) => {
    if (!window.confirm('Revoke this API key?')) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={5} cols={5} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">API Keys</h1><p className="mt-1 text-sm text-gray-500">Manage API keys for platform and tenant integrations.</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> Create Key</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Name</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Company</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Key</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Permissions</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Last Used</th><th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {keys.map(k => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{k.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{k.company_name || '—'}</td>
                <td className="px-6 py-4"><span className="font-mono text-xs text-gray-500">{k.key_value?.substring(0, 20)}...</span></td>
                <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{(k.permissions || []).map((p, i) => <span key={i} className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">{p}</span>)}</div></td>
                <td className="px-6 py-4 text-sm text-gray-500">{k.last_used ? new Date(k.last_used).toLocaleString() : 'Never'}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => revoke(k.id)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Key Name</label><input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Permissions (comma separated)</label><input type="text" value={form.permissions} onChange={e => setForm({ ...form, permissions: e.target.value })} placeholder="read, write" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>
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
