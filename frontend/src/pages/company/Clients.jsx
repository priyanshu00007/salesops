import { useFetch } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';

export default function CompanyClients() {
  const { data, isLoading, error } = useFetch('manager-clients', '/clients?limit=50');
  const clients = data?.clients || [];

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={5} /></div>;
  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load clients.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your company's client relationships.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.owner_name || '—'}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${c.status === 'active' ? 'bg-emerald-100 text-emerald-800 ring-emerald-600/20' : 'bg-amber-100 text-amber-800 ring-amber-600/20'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
