import { useState } from 'react';
import { BarChart3, TrendingUp, Target, ArrowUp, ArrowDown, Download } from 'lucide-react';

const metrics = [
  { label: 'Employee Productivity', value: '87%', change: '+5%', trend: 'up', icon: TrendingUp, color: 'bg-emerald-500' },
  { label: 'Department Efficiency', value: '82%', change: '+3%', trend: 'up', icon: BarChart3, color: 'bg-blue-500' },
  { label: 'Project Completion', value: '68%', change: '+12%', trend: 'up', icon: Target, color: 'bg-violet-500' },
  { label: 'Weekly Progress', value: '73%', change: '-2%', trend: 'down', icon: TrendingUp, color: 'bg-amber-500' },
];

const deptProductivity = [
  { name: 'Engineering', productivity: 92, tasks: 45, completed: 38, trend: 'up' },
  { name: 'Sales', productivity: 79, tasks: 62, completed: 41, trend: 'up' },
  { name: 'Marketing', productivity: 85, tasks: 28, completed: 22, trend: 'down' },
  { name: 'Support', productivity: 94, tasks: 35, completed: 32, trend: 'up' },
  { name: 'Design', productivity: 88, tasks: 18, completed: 14, trend: 'up' },
  { name: 'Operations', productivity: 76, tasks: 22, completed: 15, trend: 'down' },
];

const weeklyData = { mon: 82, tue: 85, wed: 79, thu: 88, fri: 91, sat: 45, sun: 30 };
const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], value: Math.floor(60 + Math.random() * 35) }));

export default function CompanyAnalytics() {
  const [period, setPeriod] = useState('weekly');

  const data = period === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Data-driven insights for your company.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Period Toggle */}
      <div className="mb-6 flex gap-2">
        {['weekly', 'monthly', 'quarterly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-4 py-2 text-sm font-medium ${period === p ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{m.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{m.value}</p>
                <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${m.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {m.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{m.change}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${m.color} bg-opacity-10`}>
                <m.icon className={`h-6 w-6 ${m.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Productivity */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Department Productivity</h2>
          <div className="space-y-4">
            {deptProductivity.map(d => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{d.name}</span>
                  <span className="text-xs text-gray-500">{d.completed}/{d.tasks} tasks · {d.productivity}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${d.trend === 'up' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${d.productivity}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{period === 'weekly' ? 'Weekly' : 'Monthly'} Productivity</h2>
          <div className="flex items-end justify-between gap-1" style={{ height: 200 }}>
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-blue-500 transition-all hover:bg-blue-600" style={{ height: `${(val / 100) * 180}px` }} title={`${val}%`} />
                <span className="text-[10px] text-gray-500">{typeof key === 'string' && key.length <= 3 ? key : key.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Insights</h2>
          <div className="space-y-3">
            {[
              'Support team has highest productivity at 94%',
              'Sales team task completion dropped by 5% this week',
              'Project completion rate improved by 12% this month',
              'Peak productivity hours are 10 AM - 12 PM',
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                <BarChart3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <p className="text-sm text-blue-900">{insight}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Progress</h2>
          <div className="space-y-3">
            {[
              { label: 'Tasks Completed', value: '156/210', progress: 74, color: 'bg-blue-500' },
              { label: 'Projects On Track', value: '6/8', progress: 75, color: 'bg-emerald-500' },
              { label: 'Attendance Rate', value: '94%', progress: 94, color: 'bg-violet-500' },
              { label: 'Goal Achievement', value: '82%', progress: 82, color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
