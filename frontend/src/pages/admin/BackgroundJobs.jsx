import { Bot, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';

export default function BackgroundJobs() {
  const { data, isLoading, error } = useFetch('background-jobs', '/admin/jobs', { refetchInterval: 10000 });
  const jobs = data?.jobs || [];

  const statusIcon = (s) => {
    if (s === 'completed') return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (s === 'running') return <Clock className="h-4 w-4 text-blue-600" />;
    if (s === 'failed') return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={5} cols={5} /></div>;

  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load jobs.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Background Jobs</h1><p className="mt-1 text-sm text-gray-500">Monitor scheduled tasks, imports, exports, and system jobs.</p></div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Job</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Type</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Progress</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Duration</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map(j => {
              const started = j.started_at ? new Date(j.started_at) : null;
              const completed = j.completed_at ? new Date(j.completed_at) : null;
              const duration = started && completed ? Math.round((completed - started) / 60000) : null;
              return (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><Bot className="h-4 w-4 text-gray-400" /><span className="text-sm font-medium text-gray-900">{j.name}</span></div></td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-700">{j.type}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1.5">{statusIcon(j.status)}<span className="text-sm capitalize text-gray-700">{j.status}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-gray-200"><div className={`h-2 rounded-full ${j.status === 'failed' ? 'bg-red-500' : j.status === 'running' ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${j.progress}%` }} /></div><span className="text-xs text-gray-500">{j.progress}%</span></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{duration ? `${duration}m` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
