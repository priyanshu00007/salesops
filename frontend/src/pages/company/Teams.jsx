import { useState } from 'react';
import { Users2, Plus, MoreHorizontal, Crown } from 'lucide-react';
import Modal from '../../components/Modal';

const initialTeams = [
  { id: 1, name: 'Platform Engineering', lead: 'Rahul Sharma', members: 6, projects: 3, dept: 'Engineering', color: 'bg-blue-500' },
  { id: 2, name: 'Enterprise Sales', lead: 'Priya Patel', members: 8, projects: 4, dept: 'Sales', color: 'bg-emerald-500' },
  { id: 3, name: 'SMB Sales', lead: 'Amit Singh', members: 7, projects: 2, dept: 'Sales', color: 'bg-amber-500' },
  { id: 4, name: 'Growth Marketing', lead: 'Neha Gupta', members: 4, projects: 3, dept: 'Marketing', color: 'bg-violet-500' },
  { id: 5, name: 'Customer Support', lead: 'Sneha Reddy', members: 5, projects: 1, dept: 'Support', color: 'bg-cyan-500' },
  { id: 6, name: 'Creative Design', lead: 'Vikram Joshi', members: 3, projects: 2, dept: 'Design', color: 'bg-rose-500' },
];

export default function Teams() {
  const [teams, setTeams] = useState(initialTeams);
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="mt-1 text-sm text-gray-500">{teams.length} teams · {teams.reduce((s, t) => s + t.members, 0)} total members</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teams.map(t => (
          <div key={t.id} className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.color} bg-opacity-10`}>
                <Users2 className={`h-6 w-6 ${t.color.replace('bg-', 'text-')}`} />
              </div>
              <button onClick={() => setMenuOpen(menuOpen === t.id ? null : t.id)} className="rounded-lg p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Crown className="h-3.5 w-3.5 text-amber-500" /> {t.lead}
            </div>
            <div className="mt-1 text-xs text-gray-400">{t.dept}</div>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span><strong>{t.members}</strong> members</span>
              <span><strong>{t.projects}</strong> projects</span>
            </div>
            <div className="mt-4 flex -space-x-2">
              {Array.from({ length: Math.min(t.members, 5) }).map((_, i) => (
                <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gray-400 to-gray-500 text-[10px] font-bold text-white">U</div>
              ))}
              {t.members > 5 && <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-500">+{t.members - 5}</div>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Team">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="e.g. Enterprise Sales" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
              <option>Engineering</option><option>Sales</option><option>Marketing</option><option>Support</option><option>Design</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Lead</label>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
              <option>Rahul Sharma</option><option>Priya Patel</option><option>Amit Singh</option><option>Neha Gupta</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create Team</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
