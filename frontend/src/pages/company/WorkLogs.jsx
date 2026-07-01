import { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, MessageSquare, Search, Clock } from 'lucide-react';

const initialLogs = [
  { id: 1, user: 'Rahul Sharma', date: '2026-06-30', work: 'Completed API integration module, fixed 3 bugs in payment flow', hours: 8, issues: 'Rate limiting on endpoints needs review', plan: 'Start frontend integration tests', status: 'approved', reviewer: 'Priya Patel' },
  { id: 2, user: 'Priya Patel', date: '2026-06-30', work: 'Drafted Q3 marketing strategy, reviewed campaign assets', hours: 7.5, issues: 'None', plan: 'Finalize budget allocation', status: 'approved', reviewer: 'Super Admin' },
  { id: 3, user: 'Amit Singh', date: '2026-06-30', work: 'Made 45 calls, booked 3 meetings, qualified 5 leads', hours: 8, issues: 'CRM sync delay affecting lead updates', plan: 'Follow up on qualified leads', status: 'pending', reviewer: null },
  { id: 4, user: 'Neha Gupta', date: '2026-06-30', work: 'Designed new dashboard mockups, created style guide', hours: 6, issues: 'Need feedback on color scheme', plan: 'Implement final designs', status: 'pending', reviewer: null },
  { id: 5, user: 'Sneha Reddy', date: '2026-06-29', work: 'Handled 15 support tickets, resolved 12', hours: 8, issues: 'Escalated 3 tickets to engineering', plan: 'Follow up on escalated tickets', status: 'rejected', reviewer: 'Rahul Sharma', comment: 'Need more detail on escalated tickets' },
  { id: 6, user: 'Deepak Verma', date: '2026-06-29', work: 'Database optimization, query performance improved by 40%', hours: 8, issues: 'None', plan: 'Continue with indexing', status: 'approved', reviewer: 'Rahul Sharma' },
];

const statusColors = { approved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' };

export default function WorkLogs() {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [rejecting, setRejecting] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const filtered = logs.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search && !l.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

const approve = (id) => setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'approved', reviewer: 'Current Manager' } : l));
const reject = (id) => setRejecting(id);
const confirmReject = (id) => {
  setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected', reviewer: 'Current Manager', comment: rejectComment || 'No reason provided' } : l));
  setRejecting(null);
  setRejectComment('');
};

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Work Logs</h1>
          <p className="mt-1 text-sm text-gray-500">{logs.filter(l => l.status === 'pending').length} pending review · {logs.length} total</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(l => (
          <div key={l.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">{l.user.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{l.user}</h3>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${statusColors[l.status]}`}>{l.status}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{l.date}</span>
                    <span>{l.hours} hrs</span>
                    {l.reviewer && <span>Reviewed by {l.reviewer}</span>}
                  </div>
                </div>
              </div>
              {l.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => approve(l.id)} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><CheckCircle className="h-3.5 w-3.5" /> Approve</button>
                  <button onClick={() => reject(l.id)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><XCircle className="h-3.5 w-3.5" /> Reject</button>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs font-semibold text-blue-700">Today's Work</p>
                <p className="mt-1 text-sm text-blue-900">{l.work}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-700">Issues</p>
                <p className="mt-1 text-sm text-amber-900">{l.issues}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700">Tomorrow's Plan</p>
                <p className="mt-1 text-sm text-emerald-900">{l.plan}</p>
              </div>
            </div>
            {l.status === 'rejected' && l.comment && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-sm text-red-700"><strong>Review comment:</strong> {l.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reject Comment Modal */}
      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setRejecting(null); setRejectComment(''); }}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">Reject Work Log</h3>
            <p className="mt-1 text-sm text-gray-500">Provide a reason for rejection — this will be shared with the employee.</p>
            <textarea
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
              placeholder="Describe why this work log is being rejected..."
              className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
              rows={3}
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { setRejecting(null); setRejectComment(''); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => confirmReject(rejecting)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Reject with Reason</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
