import { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';

const initialRequests = [
  { id: 1, type: 'Leave', user: 'Neha Gupta', reason: 'Annual leave - family vacation', date: 'Jul 5-7, 2026', status: 'pending', submitted: 'Jun 28, 2026', avatar: 'NG' },
  { id: 2, type: 'Document', user: 'Amit Singh', reason: 'Sales report Q2 - needs manager sign-off', date: 'Jul 2, 2026', status: 'pending', submitted: 'Jun 29, 2026', avatar: 'AS' },
  { id: 3, type: 'Task', user: 'Rahul Sharma', reason: 'Requesting extension for Project Alpha deadline', date: 'Jul 10, 2026', status: 'pending', submitted: 'Jun 30, 2026', avatar: 'RS' },
  { id: 4, type: 'Leave', user: 'Deepak Verma', reason: ' Sick leave - 2 days', date: 'Jul 1-2, 2026', status: 'approved', submitted: 'Jun 27, 2026', avatar: 'DV' },
  { id: 5, type: 'Document', user: 'Priya Patel', reason: 'Marketing budget proposal for Q3', date: 'Jul 5, 2026', status: 'rejected', submitted: 'Jun 25, 2026', avatar: 'PP' },
  { id: 6, type: 'Project', user: 'Rahul Sharma', reason: 'New project request - Customer Feedback Portal', date: 'Jul 15, 2026', status: 'pending', submitted: 'Jun 30, 2026', avatar: 'RS' },
];

const typeColors = { Leave: 'bg-violet-100 text-violet-700', Document: 'bg-blue-100 text-blue-700', Task: 'bg-amber-100 text-amber-700', Project: 'bg-emerald-100 text-emerald-700' };
const statusIcons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
const statusColors = { pending: 'text-amber-600', approved: 'text-emerald-600', rejected: 'text-red-600' };

export default function Approvals() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState('pending');

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pending = requests.filter(r => r.status === 'pending');

  const updateStatus = (id, status) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">{pending.length} pending requests need your attention</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {/* Pending Banner */}
      {pending.length > 0 && filter === 'pending' && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">{pending.length} request{pending.length > 1 ? 's' : ''} awaiting your decision</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(r => {
          const StatusIcon = statusIcons[r.status];
          return (
            <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">{r.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${typeColors[r.type]}`}>{r.type}</span>
                      <StatusIcon className={`h-4 w-4 ${statusColors[r.status]}`} />
                      <span className={`text-xs font-medium capitalize ${statusColors[r.status]}`}>{r.status}</span>
                    </div>
                    <p className="mt-1 text-base font-semibold text-gray-900">{r.reason}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{r.user}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{r.date}</span>
                      <span>Submitted {r.submitted}</span>
                    </div>
                  </div>
                </div>
                {r.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateStatus(r.id, 'approved')} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"><CheckCircle className="h-4 w-4" /> Approve</button>
                    <button onClick={() => updateStatus(r.id, 'rejected')} className="flex items-center gap-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"><XCircle className="h-4 w-4" /> Reject</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
