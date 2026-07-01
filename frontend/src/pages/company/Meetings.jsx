import { useState } from 'react';
import { Video, Plus, Clock, Users, MapPin, Calendar, FileText, RotateCcw, XCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const initialMeetings = [
  { id: 1, title: 'Weekly Team Standup', desc: 'Daily sync with the team', date: '2026-07-01', time: '09:00', duration: '30 min', room: 'Conference A', host: 'Rahul Sharma', attendees: 8, recurring: 'Daily', notes: '' },
  { id: 2, title: 'Sprint Planning', desc: 'Plan sprint goals and tasks', date: '2026-07-03', time: '10:00', duration: '1 hr', room: 'Meeting Room 2', host: 'Priya Patel', attendees: 12, recurring: 'Weekly', notes: '' },
  { id: 3, title: 'Q3 Strategy Review', desc: 'Quarterly review with stakeholders', date: '2026-07-05', time: '14:00', duration: '2 hrs', room: 'Board Room', host: 'Amit Singh', attendees: 20, recurring: null, notes: '' },
  { id: 4, title: 'Client Onboarding Call', desc: 'New client orientation', date: '2026-07-02', time: '11:00', duration: '45 min', room: 'Virtual', host: 'Neha Gupta', attendees: 5, recurring: null, notes: '' },
  { id: 5, title: '1:1 with Rahul', desc: 'Performance review', date: '2026-07-04', time: '15:00', duration: '30 min', room: 'Cafe Area', host: 'Priya Patel', attendees: 2, recurring: 'Bi-weekly', notes: '' },
  { id: 6, title: 'All Hands Meeting', desc: 'Company-wide monthly update', date: '2026-07-15', time: '10:00', duration: '1 hr', room: 'Auditorium', host: 'Super Admin', attendees: 50, recurring: 'Monthly', notes: '' },
];

export default function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [showCreate, setShowCreate] = useState(false);
  const [actionMeeting, setActionMeeting] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionValue, setActionValue] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const handleAction = () => {
    if (!actionMeeting || !actionType) return;
    setMeetings(prev => prev.map(m => {
      if (m.id !== actionMeeting) return m;
      if (actionType === 'cancel') return { ...m, date: 'Cancelled', status: 'cancelled' };
      if (actionType === 'reschedule') return { ...m, date: actionValue || m.date };
      if (actionType === 'notes') return { ...m, notes: actionValue };
      return m;
    }));
    setActionMeeting(null);
    setActionType(null);
    setActionValue('');
  };

  const openAction = (id, type) => {
    const m = meetings.find(x => x.id === id);
    setActionMeeting(id);
    setActionType(type);
    setActionValue(type === 'notes' ? (m?.notes || '') : '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="mt-1 text-sm text-gray-500">{meetings.filter(m => m.status !== 'cancelled').length} scheduled · {meetings.filter(m => m.date === today).length} today</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Video className="h-4 w-4" /> Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {meetings.map(m => (
          <div key={m.id} className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${m.status === 'cancelled' ? 'border-red-200 bg-red-50/50 opacity-70' : 'border-gray-200 bg-white'}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-semibold ${m.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{m.title}</h3>
                    {m.status === 'cancelled' && <span className="rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">Cancelled</span>}
                  </div>
                  <p className="text-sm text-gray-500">{m.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{m.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{m.time} · {m.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{m.room}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{m.attendees}</span>
                  </div>
                  {m.notes && (
                    <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-blue-50 p-2 text-xs text-blue-700">
                      <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      <span>{m.notes}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.recurring && <span className="rounded-md bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-700">{m.recurring}</span>}
                {m.status !== 'cancelled' && (
                  <>
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Join</button>
                    <button onClick={() => openAction(m.id, 'notes')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"><FileText className="mr-1 inline h-3.5 w-3.5" />Notes</button>
                    <button onClick={() => openAction(m.id, 'reschedule')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50"><RotateCcw className="mr-1 inline h-3.5 w-3.5" />Reschedule</button>
                    <button onClick={() => openAction(m.id, 'cancel')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><XCircle className="mr-1 inline h-3.5 w-3.5" />Cancel</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule / Notes / Cancel Action Modal */}
      {actionMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setActionMeeting(null); setActionType(null); setActionValue(''); }}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {actionType === 'cancel' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Cancel Meeting</h3>
                <p className="mt-1 text-sm text-gray-500">Are you sure you want to cancel this meeting? All attendees will be notified.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionMeeting(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Keep Meeting</button>
                  <button onClick={handleAction} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Yes, Cancel</button>
                </div>
              </>
            )}
            {actionType === 'reschedule' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Reschedule Meeting</h3>
                <p className="mt-1 text-sm text-gray-500">Choose a new date for this meeting.</p>
                <input type="date" value={actionValue} onChange={e => setActionValue(e.target.value)} className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-400" />
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionMeeting(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAction} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">Reschedule</button>
                </div>
              </>
            )}
            {actionType === 'notes' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Meeting Notes</h3>
                <p className="mt-1 text-sm text-gray-500">Add or update notes for this meeting.</p>
                <textarea value={actionValue} onChange={e => setActionValue(e.target.value)} placeholder="Enter notes, action items, key decisions..." className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" rows={4} autoFocus />
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionMeeting(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAction} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Notes</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Schedule Meeting">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Meeting Title</label><input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" rows={2} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Date</label><input type="date" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Time</label><input type="time" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Duration</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>30 min</option><option>45 min</option><option>1 hr</option><option>2 hrs</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700">Room</label><input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="Virtual / Room name" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Schedule</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
