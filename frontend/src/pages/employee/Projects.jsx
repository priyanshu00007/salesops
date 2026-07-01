import { useState } from 'react';
import { FolderKanban, Clock, Users, Calendar, ArrowRight, Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const myProjects = [
  { id: 1, name: 'Q3 Marketing Campaign', role: 'Member', progress: 65, deadline: '2026-08-15', members: 8, tasks: { total: 24, completed: 15 }, status: 'active' },
  { id: 2, name: 'Enterprise Sales Pipeline', role: 'Lead', progress: 40, deadline: '2026-09-01', members: 5, tasks: { total: 18, completed: 7 }, status: 'active' },
  { id: 3, name: 'API Suite v2', role: 'Contributor', progress: 80, deadline: '2026-07-20', members: 12, tasks: { total: 32, completed: 26 }, status: 'active' },
  { id: 4, name: 'Employee Onboarding Portal', role: 'Reviewer', progress: 25, deadline: '2026-10-01', members: 6, tasks: { total: 15, completed: 4 }, status: 'active' },
  { id: 5, name: 'Q2 Data Migration', role: 'Member', progress: 100, deadline: '2026-06-15', members: 4, tasks: { total: 10, completed: 10 }, status: 'completed' },
];

const statusStyles = { active: 'bg-emerald-100 text-emerald-700', completed: 'bg-gray-100 text-gray-600', 'on-hold': 'bg-amber-100 text-amber-700' };

export default function EmployeeProjects() {
  const [search, setSearch] = useState('');

  const filtered = myProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">{myProjects.filter(p => p.status === 'active').length} active · {myProjects.length} total</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-56 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-400 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(project => (
          <div key={project.id} className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[project.status]}`}>{project.status}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">{project.name}</h3>
            <p className="mt-1 text-xs text-gray-500">Role: <span className="font-semibold text-gray-700">{project.role}</span></p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                <div className={`h-2 rounded-full transition-all ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {project.members}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {project.tasks.completed}/{project.tasks.total}</span>
            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 group-hover:border-blue-200 group-hover:text-blue-600">
              View Details <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-gray-400">
            <FolderKanban className="mb-3 h-12 w-12" />
            <p className="text-sm font-medium">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
