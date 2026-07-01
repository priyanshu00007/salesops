import { Phone } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';

export default function EmployeeCalls() {
  const { data, isLoading, error } = useFetch('user-calls', '/calls?limit=50');
  const calls = data?.calls || [];

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={4} /></div>;
  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load calls.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Call Log</h1>
        <p className="mt-1 text-sm text-gray-500">Your recorded calls and outcomes.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Result</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {calls.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-50 p-2"><Phone className="h-4 w-4 text-blue-600" /></div>
                      <span className="text-sm font-medium text-gray-900">{c.lead_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{c.type}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.duration}</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">{c.result}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.call_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
