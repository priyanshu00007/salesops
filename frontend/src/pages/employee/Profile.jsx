import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Camera, Save, Globe, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul@acme.com',
    phone: '+1-555-123-4567',
    location: 'New York, USA',
    department: 'Engineering',
    role: 'Senior Developer',
    bio: 'Passionate developer with 5+ years experience. Focused on building scalable web applications.',
    linkedin: 'linkedin.com/in/rahulsharma',
    github: 'github.com/rahulsharma',
    website: 'rahulsharma.dev',
    avatar: null,
  });

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
                {form.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow-md hover:shadow-lg">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.role}</p>
            <p className="text-xs text-gray-400">{form.department}</p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="h-4 w-4 text-gray-400" /> {form.email}</div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="h-4 w-4 text-gray-400" /> {form.phone}</div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin className="h-4 w-4 text-gray-400" /> {form.location}</div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><Calendar className="h-4 w-4 text-gray-400" /> Joined Mar 2024</div>
            </div>

            <div className="mt-6 flex gap-3">
              <span className="rounded-lg bg-gray-100 p-2 text-gray-600"><LinkIcon className="h-4 w-4" /></span>
              <span className="rounded-lg bg-gray-100 p-2 text-gray-600"><LinkIcon className="h-4 w-4" /></span>
              <span className="rounded-lg bg-gray-100 p-2 text-gray-600"><Globe className="h-4 w-4" /></span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Department</label>
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none">
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Role</label>
                <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600">Bio</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
            </div>

            <h3 className="mt-8 text-base font-bold text-gray-900">Social Links</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600">LinkedIn</label>
                <input type="text" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">GitHub</label>
                <input type="text" value={form.github} onChange={e => setForm({...form, github: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600">Website</label>
                <input type="text" value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Save className="h-4 w-4" /> Save Changes</button>
              <button className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
