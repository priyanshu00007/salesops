import { useState } from 'react';
import { Bell, CheckCheck, MessageSquare, Calendar, CheckCircle2, AlertTriangle, Info, Clock, Star, Trash2, MoreHorizontal } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'mention', title: 'Rahul mentioned you', desc: 'In Project Alpha - Design Review', time: '10 min ago', read: false },
  { id: 2, type: 'deadline', title: 'Task Due Tomorrow', desc: 'API Documentation must be submitted', time: '1 hr ago', read: false },
  { id: 3, type: 'meeting', title: 'Meeting Reminder', desc: 'Sprint Planning at 10:30 AM', time: '2 hrs ago', read: false },
  { id: 4, type: 'approved', title: 'Leave Approved', desc: 'Your annual leave for Jul 15-17 was approved', time: '5 hrs ago', read: false },
  { id: 5, type: 'comment', title: 'New comment on your task', desc: 'Amit commented on "Fix payment bug"', time: '1 day ago', read: true },
  { id: 6, type: 'update', title: 'Project milestone updated', desc: 'Q3 Campaign reached 50% progress', time: '1 day ago', read: true },
  { id: 7, type: 'review', title: 'Review requested', desc: 'Please review the onboarding documents', time: '2 days ago', read: true },
  { id: 8, type: 'alert', title: 'Password change detected', desc: 'Your password was changed 3 days ago', time: '3 days ago', read: true },
];

const typeStyles = {
  mention: { icon: MessageSquare, bg: 'bg-blue-50 text-blue-600' },
  deadline: { icon: Clock, bg: 'bg-red-50 text-red-600' },
  meeting: { icon: Calendar, bg: 'bg-violet-50 text-violet-600' },
  approved: { icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600' },
  comment: { icon: MessageSquare, bg: 'bg-gray-100 text-gray-600' },
  update: { icon: Star, bg: 'bg-amber-50 text-amber-600' },
  review: { icon: Info, bg: 'bg-cyan-50 text-cyan-600' },
  alert: { icon: AlertTriangle, bg: 'bg-orange-50 text-orange-600' },
};

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">{unreadCount} unread notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
            {['all', 'unread'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium capitalize first:rounded-l-lg last:rounded-r-lg ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{f}</button>
            ))}
          </div>
          <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><CheckCheck className="h-4 w-4" /> Mark All Read</button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(n => {
          const style = typeStyles[n.type] || typeStyles.update;
          return (
            <div key={n.id} className={`group rounded-xl border ${n.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50/30'} p-4 shadow-sm transition-all hover:shadow-md`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                  <style.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h4>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{n.time}</span>
                      <button className="opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-gray-100"><Trash2 className="h-4 w-4 text-gray-400" /></button>
                    </div>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{n.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Bell className="mb-3 h-12 w-12" />
            <p className="text-sm font-medium">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
