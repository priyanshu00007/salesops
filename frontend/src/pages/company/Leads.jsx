import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { TableSkeleton } from '../../components/Skeleton';
import Pagination from '../../components/Pagination';

export default function CompanyLeads() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFetch(['manager-leads', page], `/leads?page=${page}&limit=20`);
  const leads = data?.leads || [];
  const total = data?.total || 0;

  const getStatusBadge = (s) => {
    const map = { new: 'bg-blue-100 text-blue-800', contacted: 'bg-amber-100 text-amber-800', qualified: 'bg-purple-100 text-purple-800', proposal: 'bg-indigo-100 text-indigo-800', 'closed-won': 'bg-emerald-100 text-emerald-800', callback: 'bg-pink-100 text-pink-800' };
    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${map[s] || 'bg-gray-100 text-gray-800'}`}>{s}</span>;
  };

  if (isLoading) return <div className="p-6 md:p-8"><TableSkeleton rows={6} cols={5} /></div>;
  if (error) return <div className="p-6 md:p-8 text-center text-red-600">Failed to load leads.</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and track all leads across the company.</p>
      </div>

      <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h3 className="text-sm font-semibold text-amber-900">Lead Actions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Import CSV', 'Import Excel', 'Bulk Assign', 'Bulk Update', 'Bulk Delete', 'Merge Duplicates', 'Archive Leads', 'Restore Leads'].map(a => (
            <span key={a} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-700 shadow-sm border border-amber-100">{a}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Assigned</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{l.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.phone}</td>
                  <td className="px-6 py-4">{getStatusBadge(l.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.assigned_name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination page={page} limit={20} total={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
