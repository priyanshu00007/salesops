import { useState } from 'react';
import { Building2, Plus, Pencil, Users, Briefcase } from 'lucide-react';
import Modal from '../../components/Modal';

const initialDepts = [
  { id: 1, name: 'Engineering', head: 'Rahul Sharma', employees: 8, teams: 2, budget: '$120K', color: 'bg-blue-500' },
  { id: 2, name: 'Sales', head: 'Priya Patel', employees: 15, teams: 3, budget: '$200K', color: 'bg-emerald-500' },
  { id: 3, name: 'Marketing', head: 'Neha Gupta', employees: 7, teams: 2, budget: '$80K', color: 'bg-violet-500' },
  { id: 4, name: 'Design', head: 'Vikram Joshi', employees: 3, teams: 1, budget: '$50K', color: 'bg-amber-500' },
  { id: 5, name: 'Customer Support', head: 'Sneha Reddy', employees: 6, teams: 1, budget: '$60K', color: 'bg-cyan-500' },
  { id: 6, name: 'Operations', head: 'Deepak Verma', employees: 5, teams: 1, budget: '$45K', color: 'bg-rose-500' },
  { id: 7, name: 'Finance', head: 'Kavita Singh', employees: 3, teams: 1, budget: '$35K', color: 'bg-orange-500' },
  { id: 8, name: 'HR', head: 'Ananya Iyer', employees: 2, teams: 1, budget: '$30K', color: 'bg-indigo-500' },
];

export default function Departments() {
  const [depts, setDepts] = useState(initialDepts);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="mt-1 text-sm text-gray-500">{depts.length} departments · {depts.reduce((s, d) => s + d.employees, 0)} total employees</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {depts.map(d => (
          <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${d.color} bg-opacity-10`}>
                <Building2 className={`h-6 w-6 ${d.color.replace('bg-', 'text-')}`} />
              </div>
              <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><Pencil className="h-4 w-4" /></button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{d.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Head: {d.head}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600"><strong>{d.employees}</strong> employees</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600"><strong>{d.teams}</strong> teams</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Budget: {d.budget}</div>
          </div>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Department">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department Name</label>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="e.g. Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department Head</label>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
              <option>Rahul Sharma</option><option>Priya Patel</option><option>Amit Singh</option><option>Neha Gupta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Annual Budget</label>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="$50,000" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create Department</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
