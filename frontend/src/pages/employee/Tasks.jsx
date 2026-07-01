import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, MessageSquare, Paperclip, User, MoreHorizontal, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const initialTasks = [
  { id: 1, title: 'Update Q3 campaign landing page', project: 'Q3 Marketing', assignee: 'Rahul Sharma', due: '2026-07-05', status: 'in-progress', priority: 'high', comments: 3, attachments: 2 },
  { id: 2, title: 'Draft enterprise proposal template', project: 'Enterprise Sales', assignee: 'Priya Patel', due: '2026-07-07', status: 'todo', priority: 'medium', comments: 1, attachments: 0 },
  { id: 3, title: 'Fix payment integration bug', project: 'API Suite', assignee: 'Amit Verma', due: '2026-07-02', status: 'completed', priority: 'high', comments: 5, attachments: 1 },
  { id: 4, title: 'Prepare weekly report deck', project: 'Internal', assignee: 'Rahul Sharma', due: '2026-07-04', status: 'todo', priority: 'medium', comments: 0, attachments: 0 },
  { id: 5, title: 'Review onboarding docs', project: 'Employee Training', assignee: 'Neha Singh', due: '2026-07-08', status: 'in-progress', priority: 'low', comments: 2, attachments: 3 },
  { id: 6, title: 'Call ABC Corp follow-up', project: 'Lead Outreach', assignee: 'Rahul Sharma', due: '2026-07-03', status: 'todo', priority: 'high', comments: 0, attachments: 0 },
];

const statusColors = { 'todo': 'bg-gray-100 text-gray-700', 'in-progress': 'bg-blue-100 text-blue-700', 'completed': 'bg-emerald-100 text-emerald-700' };
const priorityColors = { 'high': 'text-red-600', 'medium': 'text-amber-600', 'low': 'text-blue-600' };

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tasks.filter(t => {
    if (filter === 'todo' && t.status !== 'todo') return false;
    if (filter === 'in-progress' && t.status !== 'in-progress') return false;
    if (filter === 'completed' && t.status !== 'completed') return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const next = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'todo';
      return { ...t, status: next };
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">{tasks.filter(t => t.status !== 'completed').length} pending · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="w-56 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-400 focus:outline-none" />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> New Task</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {['all', 'todo', 'in-progress', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
              <button onClick={() => toggleStatus(task.id)} className="mt-0.5">
                {task.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-gray-300 hover:text-blue-400" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-sm font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">{task.project}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColors[task.status]}`}>{task.status}</span>
                    <span className={`text-xs font-semibold ${priorityColors[task.priority]}`}>{task.priority}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {task.assignee}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {task.comments}</span>
                  <span className="flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {task.attachments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CheckCircle2 className="mb-3 h-12 w-12" />
            <p className="text-sm font-medium">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
