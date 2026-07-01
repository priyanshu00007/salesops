import { useState } from 'react';
import { Users, CheckSquare, Clock, UserCheck, Calendar as CalendarIcon, FileText, Activity, AlertCircle, BarChart3, ArrowRight, Bell, MessageSquare, Briefcase, MoreHorizontal, AlertTriangle } from 'lucide-react';

const kpiCards = [
  { label: 'Total Employees', value: '32', change: '+2 this month', icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'Present Today', value: '28', change: '87% attendance', icon: UserCheck, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { label: 'Tasks Completed', value: '47', change: '+12% vs last week', icon: CheckSquare, bg: 'bg-violet-50', text: 'text-violet-600' },
  { label: 'Tasks Pending', value: '23', change: '5 overdue', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
  { label: 'Projects Running', value: '8', change: '2 due this week', icon: Briefcase, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { label: 'Employees Online', value: '19', change: '59% of team', icon: Activity, bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { label: 'Meetings Today', value: '4', change: '2 remaining', icon: CalendarIcon, bg: 'bg-rose-50', text: 'text-rose-600' },
  { label: 'Employees on Leave', value: '3', change: '2 approved · 1 pending', icon: FileText, bg: 'bg-orange-50', text: 'text-orange-600' },
];

const teams = [
  { name: 'Development', members: 12, productivity: 92, color: 'bg-blue-500' },
  { name: 'Marketing', members: 7, productivity: 85, color: 'bg-emerald-500' },
  { name: 'Sales', members: 15, productivity: 79, color: 'bg-amber-500' },
  { name: 'Support', members: 6, productivity: 94, color: 'bg-violet-500' },
  { name: 'Operations', members: 5, productivity: 88, color: 'bg-cyan-500' },
];

const activities = [
  { user: 'Rahul Sharma', action: 'Completed task', detail: 'Design review for Project Alpha', time: '2 mins ago', avatar: 'RS', bg: 'bg-blue-500' },
  { user: 'Priya Patel', action: 'Uploaded report', detail: 'Monthly sales report Q2', time: '5 mins ago', avatar: 'PP', bg: 'bg-emerald-500' },
  { user: 'Amit Singh', action: 'Started working', detail: 'Lead outreach campaign', time: '10 mins ago', avatar: 'AS', bg: 'bg-amber-500' },
  { user: 'Neha Gupta', action: 'Submitted work log', detail: 'Daily activity report', time: '15 mins ago', avatar: 'NG', bg: 'bg-violet-500' },
  { user: 'Vikram Joshi', action: 'Closed a deal', detail: 'TechVentures - $12,000', time: '25 mins ago', avatar: 'VJ', bg: 'bg-cyan-500' },
];

const workload = [
  { name: 'Rahul Sharma', role: 'Senior Developer', tasks: 8, status: 'overloaded' },
  { name: 'Priya Patel', role: 'Marketing Lead', tasks: 4, status: 'busy' },
  { name: 'Amit Singh', role: 'Sales Rep', tasks: 6, status: 'busy' },
  { name: 'Neha Gupta', role: 'Designer', tasks: 2, status: 'free' },
  { name: 'Vikram Joshi', role: 'Account Manager', tasks: 7, status: 'overloaded' },
  { name: 'Sneha Reddy', role: 'BDR', tasks: 3, status: 'free' },
];

const deadlines = [
  { type: 'Project', title: 'Project Alpha Launch', date: 'Jul 5, 2026', daysLeft: 5, priority: 'high', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
  { type: 'Task', title: 'Q3 Marketing Plan', date: 'Jul 8, 2026', daysLeft: 8, priority: 'medium', icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  { type: 'Meeting', title: 'Quarterly Review', date: 'Jul 3, 2026', daysLeft: 3, priority: 'high', icon: CalendarIcon, color: 'text-rose-600', bg: 'bg-rose-50' },
  { type: 'Approval', title: 'Leave Request - Neha G.', date: 'Jul 2, 2026', daysLeft: 2, priority: 'medium', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const announcements = [
  { title: 'Company Town Hall Tomorrow', desc: 'Mandatory all-hands meeting at 10 AM in Conference Room A.', time: '1 hr ago', pinned: true },
  { title: 'New CRM Integration Rollout', desc: 'Salesforce connector available from next week. Training on Friday.', time: '3 hrs ago', pinned: false },
  { title: 'Office Closed on July 4th', desc: 'Independence Day holiday. All employees off.', time: '1 day ago', pinned: false },
];

export default function CompanyDashboard() {
  const [selActivity, setSelActivity] = useState('all');
  const overdueTasks = 5;
  const pendingApprovals = 3;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8 xl:p-10">
        
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500">Here's what's happening at Acme Corp today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50">
              <Bell className="h-5 w-5" />
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">5</span>
            </button>
            <button className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 active:scale-95">
              <MessageSquare className="h-4 w-4" /> Broadcast
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((k) => (
            <div key={k.label} className="group flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200/50">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.bg} ${k.text} transition-transform group-hover:scale-110`}>
                  <k.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{k.change}</div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900">{k.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alert: Overdue + Pending Approvals */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {overdueTasks > 0 && (
            <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-900">{overdueTasks} Overdue Tasks</p>
                <p className="text-sm text-rose-700">5 tasks past their deadline — needs attention</p>
              </div>
              <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700">View Tasks</button>
            </div>
          )}
          {pendingApprovals > 0 && (
            <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">{pendingApprovals} Pending Approvals</p>
                <p className="text-sm text-amber-700">Leave requests, documents and tasks awaiting your decision</p>
              </div>
              <button className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">Review</button>
            </div>
          )}
        </div>

        {/* Middle Section: Teams, Activity, Workload */}
        <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
          
          {/* Team Overview */}
          <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900">Team Overview</h2>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 p-6">
              <div className="space-y-6">
                {teams.map((t) => (
                  <div key={t.name} className="group">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${t.color} shadow-sm`} />
                        <span className="text-sm font-semibold text-slate-700">{t.name}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{t.members} members</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${t.color} transition-all duration-500 ease-out`} style={{ width: `${t.productivity}%` }} />
                      </div>
                      <span className="w-9 text-right text-sm font-bold text-slate-700">{t.productivity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 pt-0">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                View All Teams <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900">Activity Feed</h2>
              <div className="flex rounded-lg bg-slate-100 p-1">
                {['all', 'tasks', 'calls'].map((t) => (
                  <button key={t} onClick={() => setSelActivity(t)} className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${selActivity === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-5 before:w-px before:bg-slate-100">
                {activities.filter(a => selActivity === 'all' || a.action.toLowerCase().includes(selActivity)).slice(0, 5).map((a) => (
                  <div key={a.time} className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-4 border-white text-xs font-bold text-white shadow-sm ${a.bg}`}>{a.avatar}</div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{a.user}</span> {a.action.toLowerCase()}</p>
                      <p className="mt-0.5 truncate text-sm font-medium text-slate-800">{a.detail}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workload Distribution */}
          <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900">Workload Tracker</h2>
            </div>
            <div className="flex-1 p-6">
              <div className="mb-6 flex gap-4 rounded-xl bg-slate-50 p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Free</span>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600"><span className="h-2 w-2 rounded-full bg-amber-500" /> Busy</span>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600"><span className="h-2 w-2 rounded-full bg-rose-500" /> Overloaded</span>
              </div>
              <div className="space-y-3">
                {workload.map((w) => (
                  <div key={w.name} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{w.name}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{w.role} · {w.tasks} tasks</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${w.status === 'free' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : w.status === 'busy' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 'bg-rose-50 text-rose-700 ring-rose-600/20'}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Deadlines, Actions, Announcements */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          
          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">{deadlines.filter(d => d.priority === 'high').length} Urgent</span>
            </div>
            <div className="space-y-4">
              {deadlines.map((d) => (
                <div key={d.title} className="flex items-start gap-4 rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-sm">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${d.bg} ${d.color}`}><d.icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{d.title}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{d.date} · <span className="font-semibold text-slate-700">{d.daysLeft} days left</span></p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${d.priority === 'high' ? 'bg-rose-50 text-rose-700' : d.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{d.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              <p className="text-sm font-medium text-slate-500">Manager Access</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add Employee', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Create Task', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Schedule Meeting', icon: CalendarIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: 'New Project', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'View Reports', icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'Pending Approvals', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((a) => (
                <button key={a.label} className="group flex flex-col items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm">
                  <div className={`rounded-xl p-3 ${a.bg} transition-transform group-hover:scale-110`}><a.icon className={`h-6 w-6 ${a.color}`} /></div>
                  <span className="text-xs font-bold text-slate-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Announcements</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.title} className={`relative overflow-hidden rounded-xl border p-5 ${a.pinned ? 'border-blue-100 bg-blue-50/50' : 'border-slate-100 bg-white'}`}>
                  {a.pinned && <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />}
                  <div className="flex items-start gap-3">
                    {a.pinned && <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{a.title}</p>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-600">{a.desc}</p>
                      <p className="mt-3 text-xs font-semibold text-slate-400">{a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
