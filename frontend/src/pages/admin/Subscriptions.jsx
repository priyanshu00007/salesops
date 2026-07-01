import { CheckCircle, XCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';

export default function Subscriptions() {
  const { data, isLoading, error } = useFetch('subscriptions', '/admin/subscriptions');
  const subs = data?.subscriptions || [];

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={5} cols={5} /></div>;

  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load subscriptions.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1><p className="mt-1 text-sm text-gray-500">Monitor company subscriptions across all plans.</p></div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Company</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Plan</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Billing</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Period</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {subs.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.company_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{s.plan_name}</td>
                <td className="px-6 py-4 text-sm capitalize text-gray-700">{s.billing_cycle}</td>
                <td className="px-6 py-4">{s.status === 'active' ? <span className="inline-flex items-center gap-1 text-sm text-emerald-600"><CheckCircle className="h-4 w-4" /> Active</span> : <span className="inline-flex items-center gap-1 text-sm text-gray-400"><XCircle className="h-4 w-4" /> {s.status}</span>}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.current_period_start ? `${new Date(s.current_period_start).toLocaleDateString()} - ${new Date(s.current_period_end).toLocaleDateString()}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
