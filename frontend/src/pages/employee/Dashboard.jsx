import { useState } from 'react';
import { CheckSquare, Calendar, Bell, Clock, Briefcase, BarChart3, Target, TrendingUp, ArrowRight, Play, UserCheck, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const todaysTasks = [
  { title: 'Review Q3 campaign assets', project: 'Q3 Marketing', priority: 'high', status: 'in-progress' },
  { title: 'Update client proposal draft', project: 'Enterprise Sales', priority: 'medium', status: 'todo' },
  { title: 'Complete API documentation', project: 'API Suite', priority: 'high', status: 'todo' },
  { title: 'Send follow-up emails', project: 'Lead Outreach', priority: 'low', status: 'completed' },
];

const meetings = [
  { title: 'Team Standup', time: '9:00 AM', room: 'Conference A' },
  { title: 'Sprint Planning', time: '10:30 AM', room: 'Virtual' },
  { title: '1:1 with Manager', time: '2:00 PM', room: 'Meeting Room 2' },
];

const notifications = [
  { text: 'Task "API docs" due tomorrow', time: '1 hr ago', type: 'deadline' },
  { text: 'Meeting reminder: Sprint Planning', time: '2 hrs ago', type: 'meeting' },
  { text: 'Rahul mentioned you in Project Alpha', time: '4 hrs ago', type: 'mention' },
  { text: 'Leave request approved', time: '1 day ago', type: 'approved' },
];

const activityLog = [
  { time: '09:20', action: 'Completed Task', detail: 'Fixed payment flow bug' },
  { time: '10:15', action: 'Uploaded Document', detail: 'Q3 Report draft.pdf' },
  { time: '11:05', action: 'Commented on Project', detail: 'Project Alpha - Design review' },
  { time: '12:30', action: 'Leave Request Submitted', detail: 'Annual leave - July 15' },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Employee';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Good morning, {firstName}!</h1>
        <p className="mt-1 text-sm text-gray-500">{today} · Here's your work overview</p>
      </div>

      {/* Today's Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-700">Tasks Due Today</p>
            <span className="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800">3</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-900">4</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-emerald-700">Completed</p>
            <CheckSquare className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-900">12</p>
          <p className="mt-1 text-xs text-emerald-600">+3 vs yesterday</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-700">Leave Balance</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">14</p>
          <p className="mt-1 text-xs text-amber-600">8 annual · 6 sick</p>
        </div>
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-sm font-medium text-violet-700">Work Hours Today</p>
          <p className="mt-2 text-3xl font-bold text-violet-900">6.5</p>
          <p className="mt-1 text-xs text-violet-600">Clocked in · 8h target</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tasks Today */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900">Today's Tasks</h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{todaysTasks.filter(t => t.status !== 'completed').length} pending</span>
          </div>
          <div className="divide-y divide-gray-100">
            {todaysTasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                <input type="checkbox" checked={t.status === 'completed'} readOnly className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${t.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</p>
                  <p className="text-xs text-gray-500">{t.project}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${t.priority === 'high' ? 'bg-red-50 text-red-700' : t.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{t.priority}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-4">
            <button className="flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View All Tasks <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Today's Meetings */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900">Today's Meetings</h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{meetings.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {meetings.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.time} · {m.room}</p>
                </div>
                <button className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">Join</button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-4">
            <button className="flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View Calendar <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {activityLog.map((a, i) => (
              <div key={i} className="flex items-start gap-4 p-4 hover:bg-gray-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">{a.time}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{a.action}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-4">
            <button className="flex w-full items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">View All Activity <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-blue-50 p-3"><CheckSquare className="h-5 w-5 text-blue-600" /></div>
            <span className="text-xs font-semibold text-gray-700">Update Task</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-emerald-50 p-3"><Briefcase className="h-5 w-5 text-emerald-600" /></div>
            <span className="text-xs font-semibold text-gray-700">Apply Leave</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-amber-50 p-3"><Upload className="h-5 w-5 text-amber-600" /></div>
            <span className="text-xs font-semibold text-gray-700">Upload File</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-violet-50 p-3"><Calendar className="h-5 w-5 text-violet-600" /></div>
            <span className="text-xs font-semibold text-gray-700">Join Meeting</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-cyan-50 p-3"><Play className="h-5 w-5 text-cyan-600" /></div>
            <span className="text-xs font-semibold text-gray-700">Clock In</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="rounded-lg bg-rose-50 p-3"><BarChart3 className="h-5 w-5 text-rose-600" /></div>
            <span className="text-xs font-semibold text-gray-700">View Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
