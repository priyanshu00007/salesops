import { useState } from 'react';
import { BarChart3, TrendingUp, CalendarCheck, CheckSquare, Users as UsersIcon, Download, Eye, Printer } from 'lucide-react';

const reportTypes = [
  { label: 'Employee Performance', icon: UsersIcon, desc: 'Individual performance metrics and task completion', color: 'bg-blue-500' },
  { label: 'Project Progress', icon: TrendingUp, desc: 'Project status, milestones, and completion rates', color: 'bg-emerald-500' },
  { label: 'Task Reports', icon: CheckSquare, desc: 'Task distribution, overdue items, and trends', color: 'bg-violet-500' },
  { label: 'Attendance', icon: Eye, desc: 'Employee attendance, leaves, and punctuality', color: 'bg-amber-500' },
  { label: 'Leave Reports', icon: CalendarCheck, desc: 'Leave balances, requests, and trends', color: 'bg-cyan-500' },
  { label: 'Department Reports', icon: BarChart3, desc: 'Cross-department performance comparison', color: 'bg-rose-500' },
];

const monthlyStats = [
  { month: 'Jan', calls: 1200, leads: 310, meetings: 78, conversion: '21%' },
  { month: 'Feb', calls: 1350, leads: 340, meetings: 85, conversion: '23%' },
  { month: 'Mar', calls: 1100, leads: 290, meetings: 72, conversion: '20%' },
  { month: 'Apr', calls: 1450, leads: 380, meetings: 95, conversion: '25%' },
  { month: 'May', calls: 1300, leads: 350, meetings: 82, conversion: '22%' },
  { month: 'Jun', calls: 1250, leads: 330, meetings: 80, conversion: '24%' },
];

export default function CompanyReports() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">Comprehensive reports and data exports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export All
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-8 flex gap-2">
        {['weekly', 'monthly', 'quarterly', 'yearly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-4 py-2 text-sm font-medium ${period === p ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
        ))}
      </div>

      {/* Report Type Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map(r => (
          <div key={r.label} className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-3 ${r.color} bg-opacity-10`}>
                <r.icon className={`h-6 w-6 ${r.color.replace('bg-', 'text-')}`} />
              </div>
              <button className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100">
                <Download className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">{r.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{r.desc}</p>
            <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">View Report →</button>
          </div>
        ))}
      </div>

      {/* Monthly Stats Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Monthly Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Month</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Calls</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Leads</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Meetings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Conversion</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyStats.map((m, i) => {
                const prev = monthlyStats[i - 1];
                const change = prev ? ((parseInt(m.calls) - parseInt(prev.calls)) / parseInt(prev.calls) * 100).toFixed(1) : null;
                return (
                  <tr key={m.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{m.calls.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{m.leads}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{m.meetings}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.conversion}</td>
                    <td className="px-6 py-4">
                      {change && (
                        <span className={`text-sm font-medium ${change.startsWith('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                          {change.startsWith('-') ? '' : '+'}{change}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
