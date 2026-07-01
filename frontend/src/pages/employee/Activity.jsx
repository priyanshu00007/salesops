import { useState } from 'react';
import { Activity as ActivityIcon, CheckSquare, FileText, MessageSquare, Calendar, Clock, UserPlus, Edit, ListFilter } from 'lucide-react';

const activities = [
  { id: 1, type: 'task', action: 'Completed Task', detail: 'Fixed payment integration bug', project: 'API Suite', time: '09:20 AM', date: 'Today', icon: CheckSquare, color: 'emerald' },
  { id: 2, type: 'document', action: 'Uploaded Document', detail: 'Q3 Campaign Brief.pdf', project: 'Q3 Marketing', time: '10:15 AM', date: 'Today', icon: FileText, color: 'blue' },
  { id: 3, type: 'comment', action: 'Commented on Project', detail: '"Looks good, let\'s finalize the design"', project: 'Project Alpha', time: '11:05 AM', date: 'Today', icon: MessageSquare, color: 'violet' },
  { id: 4, type: 'leave', action: 'Leave Request Submitted', detail: 'Annual leave - Jul 15 to Jul 17', project: '', time: '12:30 PM', date: 'Today', icon: Calendar, color: 'amber' },
  { id: 5, type: 'task', action: 'Started Task', detail: 'Draft enterprise proposal template', project: 'Enterprise Sales', time: '09:00 AM', date: 'Yesterday', icon: CheckSquare, color: 'emerald' },
  { id: 6, type: 'comment', action: 'Replied to Thread', detail: '"Updated the API docs as requested"', project: 'API Suite', time: '02:15 PM', date: 'Yesterday', icon: MessageSquare, color: 'violet' },
  { id: 7, type: 'profile', action: 'Updated Profile', detail: 'Changed profile picture', project: '', time: '11:30 AM', date: 'Yesterday', icon: Edit, color: 'gray' },
  { id: 8, type: 'meeting', action: 'Attended Meeting', detail: 'Sprint Planning - 1h', project: 'Internal', time: '10:30 AM', date: 'Jun 28', icon: Clock, color: 'blue' },
  { id: 9, type: 'task', action: 'Completed Task', detail: 'Prepare weekly report deck', project: 'Internal', time: '04:00 PM', date: 'Jun 27', icon: CheckSquare, color: 'emerald' },
  { id: 10, type: 'document', action: 'Downloaded Document', detail: 'Employee Handbook v5.pdf', project: '', time: '03:20 PM', date: 'Jun 27', icon: FileText, color: 'blue' },
];

const colorMap = { emerald: 'bg-emerald-50 text-emerald-600', blue: 'bg-blue-50 text-blue-600', violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600', gray: 'bg-gray-100 text-gray-500' };

export default function EmployeeActivity() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
          <p className="mt-1 text-sm text-gray-500">Your personal activity timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
            {['all', 'task', 'document', 'comment', 'meeting'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium capitalize first:rounded-l-lg last:rounded-r-lg ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{f === 'all' ? 'All' : f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" />
        <div className="space-y-0">
          {filtered.map((a, i) => (
            <div key={a.id} className="relative flex items-start gap-5 pb-8">
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[a.color]}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{a.action}</p>
                    <p className="text-sm text-gray-500">{a.detail}</p>
                    {a.project && <p className="mt-0.5 text-xs text-gray-400">in {a.project}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-gray-700">{a.time}</p>
                    <p className="text-xs text-gray-400">{a.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <ActivityIcon className="mb-3 h-12 w-12" />
          <p className="text-sm font-medium">No activity found</p>
        </div>
      )}
    </div>
  );
}
