import { useState } from 'react';
import { Play, Square, Coffee, Timer, Calendar, CheckCircle2, XCircle, AlertCircle, Clock, MapPin } from 'lucide-react';

const attendanceHistory = [
  { date: 'Jun 30', clockIn: '08:52', clockOut: '17:38', breaks: '45m', total: '7h 46m', status: 'present' },
  { date: 'Jun 29', clockIn: '09:05', clockOut: '17:15', breaks: '30m', total: '7h 10m', status: 'present' },
  { date: 'Jun 28', clockIn: '08:30', clockOut: '18:00', breaks: '1h', total: '8h 30m', status: 'present' },
  { date: 'Jun 27', clockIn: null, clockOut: null, breaks: '-', total: '-', status: 'absent' },
  { date: 'Jun 26', clockIn: '08:45', clockOut: '17:00', breaks: '45m', total: '7h 15m', status: 'present' },
];

const statusStyles = { present: 'bg-emerald-100 text-emerald-700', absent: 'bg-red-100 text-red-700', late: 'bg-amber-100 text-amber-700' };

export default function EmployeeAttendance() {
  const [clockedIn, setClockedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ in: null, breakStart: null, breaks: [] });

  const toggleClock = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setCurrentEntry({ in: '08:52', breakStart: null, breaks: [] });
    } else {
      setClockedIn(false);
      setOnBreak(false);
      setCurrentEntry({ in: null, breakStart: null, breaks: [] });
    }
  };

  const toggleBreak = () => {
    if (!onBreak) {
      setOnBreak(true);
      setCurrentEntry(prev => ({ ...prev, breakStart: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }));
    } else {
      setOnBreak(false);
      setCurrentEntry(prev => ({ ...prev, breaks: [...prev.breaks, `${prev.breakStart} - ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`], breakStart: null }));
    }
  };

  const weeklyStats = { total: '38h 41m', avg: '7h 44m', present: 5, absent: 0, late: 0 };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Track your clock-ins, breaks, and attendance history</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Clock In/Out Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full ${clockedIn ? 'bg-emerald-50' : 'bg-gray-100'}`}>
              {clockedIn ? (
                <div className="relative">
                  <Clock className={`h-10 w-10 ${onBreak ? 'text-amber-500' : 'text-emerald-500'}`} />
                  {onBreak && <Coffee className="absolute -right-2 -top-2 h-5 w-5 text-amber-500" />}
                </div>
              ) : (
                <Timer className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{clockedIn ? (onBreak ? 'On Break' : 'Clocked In') : 'Not Clocked In'}</h3>
            <p className="mt-1 text-sm text-gray-500">Today · Office</p>

            <div className="mt-6 flex gap-3">
              {!clockedIn ? (
                <button onClick={toggleClock} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700">
                  <Play className="h-5 w-5" /> Clock In
                </button>
              ) : (
                <>
                  <button onClick={toggleBreak} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-colors ${onBreak ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                    <Coffee className="h-5 w-5" /> {onBreak ? 'Resume' : 'Break'}
                  </button>
                  <button onClick={toggleClock} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">
                    <Square className="h-5 w-5" /> Clock Out
                  </button>
                </>
              )}
            </div>
          </div>

          {clockedIn && <div className="mt-6 rounded-lg bg-blue-50 p-3 text-sm">
            <p className="flex items-center gap-2 text-blue-700"><MapPin className="h-4 w-4" /> Clocked in at Office · {currentEntry.in}</p>
            {currentEntry.breaks.length > 0 && <p className="mt-1 flex items-center gap-2 text-blue-600"><Coffee className="h-4 w-4" /> Breaks taken: {currentEntry.breaks.length}</p>}
          </div>}
        </div>

        {/* Weekly Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">This Week</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Total Hours</p>
              <p className="text-xl font-bold text-gray-900">{weeklyStats.total}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Daily Average</p>
              <p className="text-xl font-bold text-gray-900">{weeklyStats.avg}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-600">Present</p>
              <p className="text-xl font-bold text-emerald-800">{weeklyStats.present}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-600">Late</p>
              <p className="text-xl font-bold text-amber-800">{weeklyStats.late}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Attendance Rate</span>
              <span className="font-semibold">100%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 w-full rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* History */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Recent History</h3>
          <div className="mt-4 space-y-2">
            {attendanceHistory.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${a.status === 'present' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {a.status === 'present' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{a.date}</p>
                    <p className="text-xs text-gray-500">{a.clockIn || '-'} - {a.clockOut || '-'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[a.status]}`}>{a.status}</span>
                  <p className="mt-0.5 text-xs text-gray-500">{a.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
