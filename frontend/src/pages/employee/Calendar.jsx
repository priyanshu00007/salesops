import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MoreHorizontal } from 'lucide-react';

const events = [
  { id: 1, title: 'Team Standup', date: '2026-07-01', time: '09:00', duration: '30m', type: 'meeting', color: 'blue' },
  { id: 2, title: 'Sprint Planning', date: '2026-07-01', time: '10:30', duration: '1h', type: 'meeting', color: 'violet' },
  { id: 3, title: 'Project Alpha Review', date: '2026-07-02', time: '14:00', duration: '1h', type: 'meeting', color: 'emerald' },
  { id: 4, title: 'API Documentation Due', date: '2026-07-03', time: '17:00', duration: 'all-day', type: 'deadline', color: 'red' },
  { id: 5, title: "1:1 with Manager", date: '2026-07-02', time: '11:00', duration: '30m', type: 'meeting', color: 'amber' },
];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const colorMap = { blue: 'bg-blue-100 text-blue-700 border-blue-200', violet: 'bg-violet-100 text-violet-700 border-violet-200', emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200', red: 'bg-red-100 text-red-700 border-red-200', amber: 'bg-amber-100 text-amber-700 border-amber-200' };

export default function EmployeeCalendar() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const todayStr = new Date().toISOString().split('T')[0];

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const calendarDays = [];
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push({ day: daysInPrev - i, other: true });
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, other: false });
  while (calendarDays.length % 7 !== 0) calendarDays.push({ day: calendarDays.length - daysInMonth - firstDay + 1, other: true });

  const todayEvents = events.filter(e => e.date === todayStr);
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">{events.length} events this month</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
            {['month', 'week', 'day'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-sm font-medium capitalize first:rounded-l-lg last:rounded-r-lg ${view === v ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{v}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> New Event</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Today's Events</h3>
            {todayEvents.length === 0 && <p className="mt-3 text-sm text-gray-400">No events today</p>}
            <div className="mt-3 space-y-2">
              {todayEvents.map(e => (
                <div key={e.id} className={`rounded-lg border p-3 text-xs ${colorMap[e.color]}`}>
                  <p className="font-semibold">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 opacity-75"><Clock className="h-3 w-3" /> {e.time}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Quick Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Meetings</span><span className="font-semibold">{events.filter(e => e.type === 'meeting').length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deadlines</span><span className="font-semibold">{events.filter(e => e.type === 'deadline').length}</span></div>
            </div>
          </div>
        </div>

        {/* Month Grid */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
            <h2 className="text-lg font-bold text-gray-900">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
          </div>

          {view === 'month' && (
            <>
              <div className="mb-2 grid grid-cols-7">
                {dayNames.map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500">{d}</div>)}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((d, i) => {
                  const dayEvents = getEventsForDay(d.day);
                  const isToday = !d.other && d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  return (
                    <div key={i} className={`min-h-[90px] border-b border-r border-gray-100 p-1.5 ${d.other ? 'bg-gray-50' : ''}`}>
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-blue-600 text-white' : d.other ? 'text-gray-400' : 'text-gray-700'}`}>{d.day}</span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map(e => (
                          <div key={e.id} className={`truncate rounded px-1 py-0.5 text-[9px] font-semibold ${colorMap[e.color].split(' ')[0]} ${colorMap[e.color].split(' ')[1]}`}>{e.title}</div>
                        ))}
                        {dayEvents.length > 2 && <p className="px-1 text-[9px] text-gray-400">+{dayEvents.length - 2} more</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === 'week' && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <p className="text-sm font-medium">Week view coming soon</p>
            </div>
          )}

          {view === 'day' && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <p className="text-sm font-medium">Day view coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
