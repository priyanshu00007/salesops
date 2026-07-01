import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

const PERMISSION_ROWS = [
  ['View Leads', '✓', '✓', '✓'],
  ['Edit Leads', '✓', '✓', '✓'],
  ['Delete Leads', '✓', '✓', '✗'],
  ['Export Reports', '✓', '✓', '✗'],
  ['Import Spreadsheets', '✓', '✓', '✗'],
  ['Download Documents', '✓', '✓', '✓'],
  ['Manage Integrations', '✓', '✓', '✗'],
  ['View All Calls', '✓', '✓', '✗'],
  ['Assign Leads', '✓', '✓', '✗'],
  ['Bulk Operations', '✓', '✓', '✗'],
  ['Delete Employees', '✓', '✗', '✗'],
  ['Company Settings', '✓', '✗', '✗'],
];

export default function Permissions() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Role Permissions</h1>
        <p className="mt-1 text-sm text-gray-500">Configure what each role can access across the platform.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Feature</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-purple-800">Admin</span>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-blue-800">Manager</span>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-gray-800">Employee</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PERMISSION_ROWS.map(([feature, ...roles]) => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                  {roles.map((val, i) => (
                    <td key={i} className="px-6 py-4 text-center">
                      {val === '✓' ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="mx-auto h-5 w-5 text-red-400" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
