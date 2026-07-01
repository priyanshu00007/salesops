import { useState } from 'react';
import { CheckSquare, Plus, MoreHorizontal, Calendar, User, Clock, AlertCircle, Filter, Search, Archive, RotateCcw, XCircle, MessageSquare, UserPlus } from 'lucide-react';
import Modal from '../../components/Modal';

const initialTasks = [
  { id: 1, title: 'Design system migration', project: 'Project Alpha', assignee: 'Rahul Sharma', reporter: 'Priya Patel', priority: 'high', status: 'in-progress', due: '2026-07-05', checklist: { total: 8, done: 5 } },
  { id: 2, title: 'Q3 campaign content draft', project: 'Q3 Marketing', assignee: 'Neha Gupta', reporter: 'Rahul Sharma', priority: 'high', status: 'todo', due: '2026-07-08', checklist: { total: 5, done: 1 } },
  { id: 3, title: 'API endpoint documentation', project: 'API Suite', assignee: 'Deepak Verma', reporter: 'Rahul Sharma', priority: 'medium', status: 'review', due: '2026-07-03', checklist: { total: 3, done: 3 } },
  { id: 4, title: 'Sales pipeline cleanup', project: 'Sales Dashboard', assignee: 'Amit Singh', reporter: 'Priya Patel', priority: 'medium', status: 'todo', due: '2026-07-10', checklist: { total: 6, done: 0 } },
  { id: 5, title: 'Weekly report generation', project: 'Operations', assignee: 'Kavita Singh', reporter: 'Super Admin', priority: 'low', status: 'completed', due: '2026-06-30', checklist: { total: 4, done: 4 } },
  { id: 6, title: 'Client proposal review', project: 'Enterprise Sales', assignee: 'Priya Patel', reporter: 'Amit Singh', priority: 'high', status: 'in-progress', due: '2026-07-02', checklist: { total: 7, done: 4 } },
  { id: 7, title: 'Database optimization', project: 'Project Alpha', assignee: 'Rahul Sharma', reporter: 'Super Admin', priority: 'low', status: 'backlog', due: '2026-07-20', checklist: { total: 4, done: 0 } },
  { id: 8, title: 'User testing session', project: 'Customer Portal', assignee: 'Sneha Reddy', reporter: 'Neha Gupta', priority: 'medium', status: 'todo', due: '2026-07-06', checklist: { total: 3, done: 0 } },
];

const statusColors = { todo: 'bg-gray-100 text-gray-700', 'in-progress': 'bg-blue-100 text-blue-700', review: 'bg-amber-100 text-amber-700', completed: 'bg-emerald-100 text-emerald-700', backlog: 'bg-red-100 text-red-700' };
const priorityColors = { high: 'text-red-600', medium: 'text-amber-600', low: 'text-blue-600' };
const employees = ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Neha Gupta', 'Deepak Verma', 'Sneha Reddy', 'Kavita Singh'];

export default function CompanyTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionTask, setActionTask] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [actionValue, setActionValue] = useState('');

  const filtered = tasks.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.assignee.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAction = (id, type) => {
    const t = tasks.find(x => x.id === id);
    setActionTask(id);
    setActionType(type);
    setActionValue(type === 'reassign' ? t?.assignee : '');
  };

  const handleAction = () => {
    if (!actionTask || !actionType) return;
    setTasks(prev => prev.map(t => {
      if (t.id !== actionTask) return t;
      if (actionType === 'archive') return { ...t, status: 'archived' };
      if (actionType === 'close') return { ...t, status: 'completed' };
      if (actionType === 'reassign') return { ...t, assignee: actionValue || t.assignee };
      return t;
    }));
    setActionTask(null);
    setActionType(null);
    setActionValue('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">{tasks.filter(t => t.status !== 'archived').length} active · {tasks.filter(t => t.status === 'completed').length}/{tasks.length} completed</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Task
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {['all', 'todo', 'in-progress', 'review', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.filter(t => t.status !== 'archived').map(t => (
          <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <input type="checkbox" checked={t.status === 'completed'} className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600" readOnly />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-semibold ${t.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{t.title}</h3>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${statusColors[t.status]}`}>{t.status.replace('-', ' ')}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{t.assignee}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />Reporter: {t.reporter}</span>
                    <span className="flex items-center gap-1"><FolderKanbanIcon className="h-3.5 w-3.5" />{t.project}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Due {t.due}</span>
                    <span className={`font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                  </div>
                  {t.checklist && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(t.checklist.done / t.checklist.total) * 100}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-500">{t.checklist.done}/{t.checklist.total}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Assign</button>
                <button onClick={() => openAction(t.id, 'reassign')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"><UserPlus className="mr-1 inline h-3.5 w-3.5" />Reassign</button>
                <button onClick={() => openAction(t.id, 'close')} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"><CheckSquare className="mr-1 inline h-3.5 w-3.5" />Close</button>
                <button onClick={() => openAction(t.id, 'archive')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"><Archive className="mr-1 inline h-3.5 w-3.5" />Archive</button>
                <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal: Reassign / Archive / Close */}
      {actionTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => { setActionTask(null); setActionType(null); setActionValue(''); }}>
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {actionType === 'archive' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Archive Task</h3>
                <p className="mt-1 text-sm text-gray-500">Are you sure you want to archive this task? It will be moved to the archive.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionTask(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAction} className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">Archive Task</button>
                </div>
              </>
            )}
            {actionType === 'close' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Close Task</h3>
                <p className="mt-1 text-sm text-gray-500">Mark this task as completed. This action can be undone.</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionTask(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAction} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Close Task</button>
                </div>
              </>
            )}
            {actionType === 'reassign' && (
              <>
                <h3 className="text-lg font-bold text-gray-900">Reassign Task</h3>
                <p className="mt-1 text-sm text-gray-500">Select a new assignee for this task.</p>
                <select value={actionValue} onChange={e => setActionValue(e.target.value)} className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                  {employees.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => { setActionTask(null); setActionType(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAction} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Reassign</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Task">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Title</label><input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" rows={2} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Assignee</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">{employees.map(e => <option key={e}>{e}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700">Reporter</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">{employees.map(e => <option key={e}>{e}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Project</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>Project Alpha</option><option>Sales Dashboard</option><option>Q3 Marketing</option><option>API Suite</option><option>Operations</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700">Priority</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>High</option><option>Medium</option><option>Low</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700">Due Date</label><input type="date" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create Task</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FolderKanbanIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
}
