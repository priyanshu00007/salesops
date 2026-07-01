import { useState, useMemo } from 'react';
import { CalendarDays, Video, CheckSquare, Gift, Sun, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Modal from '../../components/Modal';

const events = [
  { date: 1, items: [{ title: 'Team Standup', type: 'meeting', time: '10:00 AM' }] },
  { date: 3, items: [{ title: 'Sprint Planning', type: 'meeting', time: '10:00 AM' }, { title: 'Design Review', type: 'meeting', time: '2:00 PM' }] },
  { date: 5, items: [{ title: 'Q3 Strategy Meeting', type: 'meeting', time: '2:00 PM' }] },
  { date: 8, items: [{ title: 'Project Alpha Deadline', type: 'deadline', time: 'All day' }] },
  { date: 10, items: [{ title: 'Rahul - Birthday', type: 'birthday', time: 'All day' }] },
  { date: 12, items: [{ title: 'Company Event - Team Outing', type: 'event', time: 'All day' }] },
  { date: 15, items: [{ title: 'All Hands Meeting', type: 'meeting', time: '10:00 AM' }] },
  { date: 18, items: [{ title: 'Quarterly Review', type: 'meeting', time: '2:00 PM' }] },
  { date: 22, items: [{ title: 'Neha - Leave Start', type: 'leave', time: 'All day' }] },
  { date: 26, items: [{ title: 'Company Holiday', type: 'holiday', time: 'All day' }] },
];

const typeColors = { meeting: 'bg-blue-500', deadline: 'bg-red-500', birthday: 'bg-pink-500', event: 'bg-emerald-500', leave: 'bg-amber-500', holiday: 'bg-purple-500' };
const typeIcons = { meeting: Video, deadline: CheckSquare, birthday: Gift, event: Sun, leave: CalendarDays, holiday: CalendarDays };

const today = new Date().getDate();

export default function CompanyCalendar() {
  const [showCreate, setShowCreate] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('June 2026');

  const daysInMonth = 30;
  const firstDay = 1;
  const emptyCells = useMemo(() => (firstDay === 1 ? 0 : 0), [firstDay]);

  const eventMap = useMemo(() => {
    const map = {};
    events.forEach(e => { map[e.date] = e.items; });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">Meetings, deadlines, events, and leaves at a glance.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Event
        </button>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Meeting</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Deadline</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-pink-500" />Birthday</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Event</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Leave</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-purple-500" />Holiday</span>
      </div>

      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200"><ChevronLeft className="h-5 w-5" /></button>
          <h2 className="text-xl font-semibold text-gray-900">{currentMonth}</h2>
          <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Today</button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="border-b border-gray-200 px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: emptyCells }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 bg-gray-50/50 p-2" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = eventMap[day] || [];
            const isToday = day === today;
            return (
              <div key={day} className={`min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors ${isToday ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center text-sm ${isToday ? 'rounded-full bg-blue-600 font-bold text-white' : 'text-gray-700'}`}>{day}</span>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((ev, ei) => {
                    const Icon = typeIcons[ev.type] || CalendarDays;
                    return (
                      <div key={ei} className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${typeColors[ev.type]} bg-opacity-10`}>
                        <Icon className={`h-3 w-3 ${typeColors[ev.type].replace('bg-', 'text-')}`} />
                        <span className="truncate text-[11px] font-medium text-gray-700">{ev.title}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && <div className="text-[11px] text-gray-400">+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-900">Upcoming This Week</h3>
        <div className="space-y-3">
          {events.filter(e => e.date >= today && e.date <= today + 7).flatMap(e => e.items.map((item, i) => (
            <div key={`${e.date}-${i}`} className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${typeColors[item.type]}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.time} · June {e.date}</p>
              </div>
              <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${typeColors[item.type]} bg-opacity-10 ${typeColors[item.type].replace('bg-', 'text-')}`}>{item.type}</span>
            </div>
          )))}
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Event">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Event Title</label><input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Event Type</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>Meeting</option><option>Deadline</option><option>Event</option><option>Holiday</option><option>Leave</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Date</label><input type="date" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Time</label><input type="time" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create Event</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
