import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { CardSkeleton } from '../../components/Skeleton';

export default function ServiceStatus() {
  const { data, isLoading, error } = useFetch('service-status', '/admin/service-status', { refetchInterval: 15000 });
  const services = data?.services || [];

  const statusIcon = (s) => {
    if (s === 'healthy') return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    if (s === 'degraded') return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    if (s === 'down') return <XCircle className="h-5 w-5 text-red-500" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const statusBg = (s) => {
    if (s === 'healthy') return 'bg-emerald-50 border-emerald-200';
    if (s === 'degraded') return 'bg-amber-50 border-amber-200';
    if (s === 'down') return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  if (isLoading) return <div className="p-6 md:p-8"><CardSkeleton count={3} /></div>;

  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load service status.</div>;

  const healthy = services.filter(s => s.status === 'healthy').length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Service Status</h1><p className="mt-1 text-sm text-gray-500">Real-time health monitoring for all platform services.</p></div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center"><p className="text-2xl font-bold text-emerald-700">{healthy}</p><p className="text-sm text-emerald-600">Healthy</p></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center"><p className="text-2xl font-bold text-amber-700">{services.filter(s => s.status === 'degraded').length}</p><p className="text-sm text-amber-600">Degraded</p></div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center"><p className="text-2xl font-bold text-red-700">{services.filter(s => s.status === 'down').length}</p><p className="text-sm text-red-600">Down</p></div>
      </div>
      <div className="space-y-2">
        {services.map(s => (
          <div key={s.id} className={`flex items-center justify-between rounded-xl border p-4 ${statusBg(s.status)}`}>
            <div className="flex items-center gap-3">
              {statusIcon(s.status)}
              <div><p className="font-semibold text-gray-900">{s.service_name}</p><p className="text-xs text-gray-500">{s.message}</p></div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p className="font-mono">{s.response_time_ms}ms</p>
              <p>{s.last_checked ? new Date(s.last_checked).toLocaleTimeString() : '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
