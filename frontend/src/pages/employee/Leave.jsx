import { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Plus, Minus } from 'lucide-react';

const initialBalances = [
  { type: 'Annual Leave', total: 15, used: 7, remaining: 8, color: 'blue' },
  { type: 'Sick Leave', total: 10, used: 4, remaining: 6, color: 'emerald' },
  { type: 'Personal Leave', total: 5, used: 1, remaining: 4, color: 'violet' },
  { type: 'Comp Off', total: 3, used: 0, remaining: 3, color: 'amber' },
];

const leaveHistory = [
  { type: 'Annual Leave', from: 'Jul 15', to: 'Jul 17', days: 3, status: 'pending', reason: 'Family vacation' },
  { type: 'Sick Leave', from: 'Jun 20', to: 'Jun 20', days: 1, status: 'approved', reason: 'Not feeling well' },
  { type: 'Personal Leave', from: 'May 10', to: 'May 10', days: 1, status: 'approved', reason: 'Personal errand' },
  { type: 'Annual Leave', from: 'Apr 22', to: 'Apr 26', days: 3, status: 'rejected', reason: 'Already requested' },
  { type: 'Annual Leave', from: 'Mar 14', to: 'Mar 18', days: 5, status: 'approved', reason: 'Vacation' },
];

const statusStyles = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-600' };
const colorMap = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600' };

export default function EmployeeLeave() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'Annual Leave', from: '', to: '', reason: '' });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave</h1>
          <p className="mt-1 text-sm text-gray-500">Apply for leave and check your balance</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {showForm ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {showForm ? 'Cancel' : 'Apply Leave'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">New Leave Request</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600">Leave Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Personal Leave</option>
                <option>Comp Off</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600">From</label>
              <input type="date" value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600">To</label>
              <input type="date" value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600">Reason</label>
            <textarea rows={3} value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} placeholder="Briefly describe the reason..." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Submit Request</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Balance Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            {initialBalances.map((b, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{b.type}</p>
                  <div className={`rounded-lg p-1.5 ${colorMap[b.color]}`}><Calendar className="h-4 w-4" /></div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{b.remaining}</p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>{b.used} of {b.total} used</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                  <div className={`h-1.5 rounded-full ${b.color === 'blue' ? 'bg-blue-500' : b.color === 'emerald' ? 'bg-emerald-500' : b.color === 'violet' ? 'bg-violet-500' : 'bg-amber-500'}`} style={{ width: `${(b.used / b.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900">Leave History</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {leaveHistory.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${l.status === 'approved' ? 'bg-emerald-50' : l.status === 'rejected' ? 'bg-red-50' : 'bg-amber-50'}`}>
                      {l.status === 'approved' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : l.status === 'rejected' ? <XCircle className="h-5 w-5 text-red-500" /> : <Clock className="h-5 w-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</p>
                      <p className="text-xs text-gray-500">{l.from} → {l.to} · {l.reason}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[l.status]}`}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
