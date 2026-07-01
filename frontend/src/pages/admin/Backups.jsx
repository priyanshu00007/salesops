import { Database, Plus, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useFetch, useCreate } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';

export default function Backups() {
  const { data, isLoading, error } = useFetch('backups', '/admin/backups');
  const backups = data?.backups || [];

  const createMutation = useCreate('backups', '/admin/backups', { successMsg: 'Backup started' });

  const createBackup = () => {
    createMutation.mutate({ name: `Manual Backup ${new Date().toISOString().split('T')[0]}`, type: 'manual' });
  };

  const statusIcon = (s) => {
    if (s === 'completed') return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (s === 'running') return <Clock className="h-4 w-4 text-blue-600" />;
    if (s === 'failed') return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={5} cols={4} /></div>;
  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load backups.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900">Backups</h1><p className="mt-1 text-sm text-gray-500">Manage database and file backups for the platform.</p></div>
        <button onClick={createBackup} disabled={createMutation.isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create Backup
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Name</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Type</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Size</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Created</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {backups.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-gray-400" /><span className="text-sm font-medium text-gray-900">{b.name}</span></div></td>
                <td className="px-6 py-4 text-sm capitalize text-gray-700">{b.type}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{b.size_bytes > 0 ? `${(b.size_bytes / 1048576).toFixed(0)} MB` : '—'}</td>
                <td className="px-6 py-4"><div className="flex items-center gap-1.5">{statusIcon(b.status)}<span className="text-sm capitalize text-gray-700">{b.status}</span></div></td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
