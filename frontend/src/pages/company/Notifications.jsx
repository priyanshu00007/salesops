import { useState } from 'react';
import { CheckCheck, User, Calendar, CheckSquare, MessageSquare, AlertCircle, Megaphone, Star, Trash2, Send } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'mention', icon: MessageSquare, content: 'Rahul Sharma mentioned you in Project Alpha', time: '5 mins ago', read: false },
  { id: 2, type: 'task', icon: CheckSquare, content: 'Task "API documentation" assigned to you', time: '15 mins ago', read: false },
  { id: 3, type: 'meeting', icon: Calendar, content: 'Meeting reminder: Sprint Planning in 30 mins', time: '25 mins ago', read: false },
  { id: 4, type: 'deadline', icon: AlertCircle, content: 'Project Alpha deadline is tomorrow', time: '1 hr ago', read: false },
  { id: 5, type: 'announcement', icon: Megaphone, content: 'Company Town Hall at 10 AM tomorrow', time: '2 hrs ago', read: true },
  { id: 6, type: 'approval', icon: Star, content: 'Neha Gupta submitted a leave request', time: '3 hrs ago', read: true },
  { id: 7, type: 'task', icon: CheckSquare, content: 'Sprint review completed - 8 tasks done', time: '5 hrs ago', read: true },
  { id: 8, type: 'user', icon: User, content: 'New employee Deepak Verma joined Engineering', time: '1 day ago', read: true },
];

const typeColors = { mention: 'bg-blue-500', task: 'bg-emerald-500', meeting: 'bg-violet-500', deadline: 'bg-red-500', announcement: 'bg-amber-500', approval: 'bg-cyan-500', user: 'bg-gray-500' };

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const sendBroadcast = () => {
    if (!broadcastTitle || !broadcastMsg) return;
    setNotifs(prev => [{ id: Date.now(), type: 'announcement', icon: Megaphone, content: `${broadcastTitle}: ${broadcastMsg}`, time: 'Just now', read: false }, ...prev]);
    setShowBroadcast(false);
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  const unread = notifs.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">{unread.length} unread notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700">
            <Megaphone className="h-4 w-4" /> Broadcast to Company
          </button>
          {unread.length > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} className={`rounded-xl border p-4 transition-all hover:shadow-sm cursor-pointer ${n.read ? 'border-gray-200 bg-white' : 'border-blue-100 bg-blue-50/50'}`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${typeColors[n.type]} bg-opacity-10`}>
                <n.icon className={`h-4 w-4 ${typeColors[n.type].replace('bg-', 'text-')}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">{n.content}</p>
                <p className="mt-0.5 text-xs text-gray-500">{n.time}</p>
              </div>
              <div className="flex items-center gap-1">
                {!n.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                <button onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }} className="rounded-lg p-1 text-gray-400 opacity-0 hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setShowBroadcast(false); setBroadcastTitle(''); setBroadcastMsg(''); }}>
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">Broadcast to Company</h3>
            <p className="mt-1 text-sm text-gray-500">Send an announcement to all employees across the organization.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} placeholder="e.g., Office Closure, Town Hall Reminder" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Write your announcement here..." className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400" rows={4} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowBroadcast(false); setBroadcastTitle(''); setBroadcastMsg(''); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={sendBroadcast} disabled={!broadcastTitle || !broadcastMsg} className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50">
                <Send className="h-4 w-4" /> Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
