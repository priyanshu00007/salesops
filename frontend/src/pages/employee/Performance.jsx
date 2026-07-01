import { useState } from 'react';
import { BarChart3, TrendingUp, Target, Star, Award, CheckCircle2, Clock, Zap, ArrowUp, ArrowDown } from 'lucide-react';

const metrics = [
  { label: 'Tasks Completed', value: '47', change: '+12', trend: 'up', period: 'this month', icon: CheckCircle2, color: 'emerald' },
  { label: 'On-Time Rate', value: '92%', change: '+5%', trend: 'up', period: 'this quarter', icon: Clock, color: 'blue' },
  { label: 'Productivity Score', value: '86', change: '+3', trend: 'up', period: 'this month', icon: Zap, color: 'violet' },
  { label: 'Project Completion', value: '78%', change: '-2%', trend: 'down', period: 'overall', icon: Target, color: 'amber' },
];

const recentReviews = [
  { period: 'Q2 2026', rating: 4.5, feedback: 'Consistent performer with strong attention to detail.', reviewer: 'Amit Kumar', date: 'Jun 25' },
  { period: 'Q1 2026', rating: 4.2, feedback: 'Good teamwork and communication skills. Needs to improve documentation.', reviewer: 'Amit Kumar', date: 'Mar 28' },
  { period: 'Q4 2025', rating: 4.0, feedback: 'Met expectations. Shows initiative on assigned tasks.', reviewer: 'Amit Kumar', date: 'Dec 20' },
];

const achievements = [
  { title: 'Top Performer - June', badge: 'Gold', icon: Award, color: 'amber' },
  { title: 'Completed 50 Tasks', badge: 'Silver', icon: Star, color: 'gray' },
  { title: 'Perfect Attendance - Q2', badge: 'Platinum', icon: Award, color: 'blue' },
];

const colorMap = { emerald: 'bg-emerald-50 text-emerald-600', blue: 'bg-blue-50 text-blue-600', violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600' };

export default function EmployeePerformance() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Performance</h1>
        <p className="mt-1 text-sm text-gray-500">Track your productivity, reviews, and achievements</p>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${colorMap[m.color]}`}><m.icon className="h-5 w-5" /></div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${m.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {m.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{m.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500">{m.label}</p>
            <p className="mt-1 text-[10px] text-gray-400">{m.period}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Reviews */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900">Performance Reviews</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentReviews.map((r, i) => (
                <div key={i} className="p-5 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900">{r.period}</h4>
                        <span className="flex items-center gap-0.5 text-sm font-semibold text-amber-500">
                          <Star className="h-4 w-4 fill-amber-400" /> {r.rating}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{r.feedback}</p>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Reviewer: {r.reviewer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements & Skills */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Achievements</h3>
            <div className="mt-4 space-y-3">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className={`rounded-lg p-2 ${a.color === 'amber' ? 'bg-amber-50 text-amber-600' : a.color === 'gray' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'}`}><a.icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs font-medium text-gray-500">{a.badge} Badge</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Skill Highlights</h3>
            <div className="mt-4 space-y-3">
              {['Communication', 'Problem Solving', 'Team Collaboration', 'Time Management'].map((skill, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700">{skill}</span>
                    <span className="text-gray-500">{[95, 88, 92, 85][i]}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${[95, 88, 92, 85][i]}%` }} />
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
