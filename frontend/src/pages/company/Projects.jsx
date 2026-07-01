import { useState } from 'react';
import { FolderKanban, Plus, Calendar, Users } from 'lucide-react';
import Modal from '../../components/Modal';

const projects = [
  { id: 1, name: 'Project Alpha', desc: 'New platform dashboard redesign', priority: 'high', status: 'in-progress', progress: 65, deadline: 'Jul 5, 2026', lead: 'Rahul Sharma', members: 5, color: 'bg-blue-500' },
  { id: 2, name: 'Sales Dashboard v2', desc: 'Pipeline analytics upgrade', priority: 'medium', status: 'planning', progress: 20, deadline: 'Jul 15, 2026', lead: 'Priya Patel', members: 3, color: 'bg-emerald-500' },
  { id: 3, name: 'Lead Scoring Model', desc: 'AI-powered lead scoring implementation', priority: 'high', status: 'in-progress', progress: 45, deadline: 'Jul 10, 2026', lead: 'Amit Singh', members: 4, color: 'bg-violet-500' },
  { id: 4, name: 'Q3 Marketing Campaign', desc: 'Multi-channel campaign for Q3', priority: 'medium', status: 'planning', progress: 10, deadline: 'Jul 20, 2026', lead: 'Neha Gupta', members: 6, color: 'bg-amber-500' },
  { id: 5, name: 'Customer Portal', desc: 'Self-service customer portal MVP', priority: 'high', status: 'completed', progress: 100, deadline: 'Jun 28, 2026', lead: 'Vikram Joshi', members: 5, color: 'bg-cyan-500' },
  { id: 6, name: 'API Integration Suite', desc: 'Third-party connectors framework', priority: 'low', status: 'on-hold', progress: 30, deadline: 'Aug 1, 2026', lead: 'Rahul Sharma', members: 3, color: 'bg-rose-500' },
];

const statusColors = { 'in-progress': 'bg-blue-100 text-blue-700', planning: 'bg-amber-100 text-amber-700', completed: 'bg-emerald-100 text-emerald-700', 'on-hold': 'bg-gray-100 text-gray-700' };
const priorityColors = { high: 'text-red-600 bg-red-50', medium: 'text-amber-600 bg-amber-50', low: 'text-blue-600 bg-blue-50' };

export default function Projects() {
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">{projects.length} projects · {projects.filter(p => p.status === 'in-progress').length} in progress</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {['all', 'in-progress', 'planning', 'completed', 'on-hold'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(p => (
          <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${p.color} bg-opacity-10`}>
                <FolderKanban className={`h-5 w-5 ${p.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${priorityColors[p.priority]}`}>{p.priority}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{p.desc}</p>
            <span className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[p.status]}`}>{p.status.replace('-', ' ')}</span>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Progress</span><span>{p.progress}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{p.deadline}</div>
              <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.members}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Project Name</label><input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Priority</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>High</option><option>Medium</option><option>Low</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700">Deadline</label><input type="date" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create Project</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
