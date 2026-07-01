import { useState } from 'react';
import { Mail, UserPlus, MoreHorizontal, Search, ArrowUpDown, Lock, Unlock, RotateCcw, Trash2, UserCheck, UserX, Download } from 'lucide-react';
import Modal from '../../components/Modal';

const initialEmployees = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@acme.com', role: 'Senior Developer', dept: 'Engineering', team: 'Platform', status: 'active', phone: '+91-9876543210', joined: 'Jan 2024', tasks: 5, avatar: 'RS' },
  { id: 2, name: 'Priya Patel', email: 'priya@acme.com', role: 'Marketing Lead', dept: 'Marketing', team: 'Growth', status: 'active', phone: '+91-8765432109', joined: 'Mar 2024', tasks: 3, avatar: 'PP' },
  { id: 3, name: 'Amit Singh', email: 'amit@acme.com', role: 'Sales Rep', dept: 'Sales', team: 'Enterprise', status: 'active', phone: '+91-7654321098', joined: 'Feb 2024', tasks: 7, avatar: 'AS' },
  { id: 4, name: 'Neha Gupta', email: 'neha@acme.com', role: 'UI Designer', dept: 'Design', team: 'Creative', status: 'active', phone: '+91-6543210987', joined: 'Jun 2024', tasks: 2, avatar: 'NG' },
  { id: 5, name: 'Vikram Joshi', email: 'vikram@acme.com', role: 'Account Manager', dept: 'Sales', team: 'Enterprise', status: 'suspended', phone: '+91-5432109876', joined: 'Aug 2023', tasks: 0, avatar: 'VJ' },
  { id: 6, name: 'Sneha Reddy', email: 'sneha@acme.com', role: 'BDR', dept: 'Sales', team: 'SMB', status: 'active', phone: '+91-4321098765', joined: 'Oct 2024', tasks: 4, avatar: 'SR' },
  { id: 7, name: 'Deepak Verma', email: 'deepak@acme.com', role: 'Developer', dept: 'Engineering', team: 'Platform', status: 'locked', phone: '+91-3210987654', joined: 'May 2024', tasks: 6, avatar: 'DV' },
  { id: 8, name: 'Kavita Singh', email: 'kavita@acme.com', role: 'Content Writer', dept: 'Marketing', team: 'Content', status: 'active', phone: '+91-2109876543', joined: 'Nov 2024', tasks: 3, avatar: 'KS' },
];

const statusColors = { active: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20', suspended: 'bg-red-100 text-red-700 ring-red-600/20', locked: 'bg-amber-100 text-amber-700 ring-amber-600/20' };

export default function CompanyEmployees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [selDept, setSelDept] = useState('all');
  const [selStatus, setSelStatus] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showResetPwd, setShowResetPwd] = useState(null);
  const [showTransfer, setShowTransfer] = useState(null);

  const filtered = employees.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (selDept !== 'all' && e.dept !== selDept) return false;
    if (selStatus !== 'all' && e.status !== selStatus) return false;
    return true;
  });

  const updateStatus = (id, status) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  const removeEmployee = (id) => setEmployees(prev => prev.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">{employees.length} total · {employees.filter(e => e.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <UserPlus className="h-4 w-4" /> Invite Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
        </div>
        <select value={selDept} onChange={e => setSelDept(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400">
          <option value="all">All Departments</option>
          <option>Engineering</option><option>Sales</option><option>Marketing</option><option>Design</option><option>Support</option>
        </select>
        <select value={selStatus} onChange={e => setSelStatus(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400">
          <option value="all">All Status</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="locked">Locked</option>
        </select>
      </div>

      {/* Employee Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Team</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Tasks</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white">{e.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{e.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" />{e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-700">{e.dept}</span></td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-700">{e.team}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ${statusColors[e.status]}`}>{e.status}</span>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-700">{e.tasks}</span></td>
                  <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setMenuOpen(menuOpen === e.id ? null : e.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {menuOpen === e.id && (
                      <div className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg" onMouseLeave={() => setMenuOpen(null)}>
                        {[
                          { label: 'Edit Profile', icon: UserCheck, action: () => {} },
                          { label: e.status === 'suspended' ? 'Reactivate' : 'Suspend', icon: e.status === 'suspended' ? UserCheck : UserX, action: () => updateStatus(e.id, e.status === 'suspended' ? 'active' : 'suspended') },
                          { label: e.status === 'locked' ? 'Unlock Account' : 'Lock Account', icon: e.status === 'locked' ? Unlock : Lock, action: () => updateStatus(e.id, e.status === 'locked' ? 'active' : 'locked') },
                          { label: 'Reset Password', icon: RotateCcw, action: () => setShowResetPwd(e) },
                          { label: 'Transfer', icon: ArrowUpDown, action: () => setShowTransfer(e) },
                          { label: 'Delete', icon: Trash2, action: () => { if (confirm('Delete this employee?')) removeEmployee(e.id); }, danger: true },
                        ].map(a => (
                          <button key={a.label} onClick={a.action} className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <a.icon className="h-4 w-4" />{a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm text-gray-500">No employees match your filters.</div>}
      </div>

      {/* Invite Modal */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Employee">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="john@acme.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option>Engineering</option><option>Sales</option><option>Marketing</option><option>Design</option><option>Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option>Employee</option><option>Team Lead</option><option>Manager</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowInvite(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Send Invitation</button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={!!showResetPwd} onClose={() => setShowResetPwd(null)} title={`Reset Password - ${showResetPwd?.name || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">A password reset link will be sent to <strong>{showResetPwd?.email}</strong>. The link expires in 24 hours.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowResetPwd(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Send Reset Link</button>
          </div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={!!showTransfer} onClose={() => setShowTransfer(null)} title={`Transfer Employee - ${showTransfer?.name || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Transfer this employee to another team or department.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Department</label>
              <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option>Engineering</option><option>Sales</option><option>Marketing</option><option>Design</option><option>Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Team</label>
              <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option>Platform</option><option>Enterprise</option><option>SMB</option><option>Growth</option><option>Creative</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowTransfer(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Transfer</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
