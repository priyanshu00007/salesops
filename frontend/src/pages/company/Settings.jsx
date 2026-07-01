import { useState } from 'react';
import { Cog, Building2, Clock, Bell, Globe, Palette, Shield, Users, MapPin, Sun, Moon } from 'lucide-react';

const sections = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'departments', label: 'Departments', icon: Users },
  { id: 'hours', label: 'Working Hours', icon: Clock },
  { id: 'holidays', label: 'Holidays', icon: Globe },
  { id: 'locations', label: 'Office Locations', icon: MapPin },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
];

export default function CompanySettings() {
  const [active, setActive] = useState('company');
  const [theme, setTheme] = useState('light');

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your company workspace settings.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${active === s.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <s.icon className="h-5 w-5" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {active === 'company' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div><label className="block text-sm font-medium text-gray-700">Company Name</label><input defaultValue="Acme Corp" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Company Email</label><input defaultValue="contact@acme.com" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Phone</label><input defaultValue="+1-555-0100" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Website</label><input defaultValue="https://acme.com" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Address</label><input defaultValue="123 Business Ave, Suite 400, New York, NY 10001" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                </div>
                <div className="flex justify-end"><button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button></div>
              </div>
            )}
            {active === 'hours' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                      <span className="text-sm font-medium text-gray-700">{day}</span>
                      <div className="flex items-center gap-3">
                        {day !== 'Sunday' ? (
                          <>
                            <input type="time" defaultValue="09:00" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
                            <span className="text-gray-400">to</span>
                            <input type="time" defaultValue="18:00" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
                          </>
                        ) : <span className="text-sm text-gray-400">Closed</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end"><button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Hours</button></div>
              </div>
            )}
            {active === 'appearance' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                <div className="flex gap-4">
                  <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Sun className="h-8 w-8 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Light Mode</span>
                  </button>
                  <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Moon className="h-8 w-8 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  </button>
                </div>
              </div>
            )}
            {active === 'notifications' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                {[
                  { label: 'Email notifications for approvals', desc: 'Get emails when someone requests approval' },
                  { label: 'Push notifications for mentions', desc: 'Get notified when someone mentions you' },
                  { label: 'Daily digest emails', desc: 'Receive a daily summary of activity' },
                  { label: 'Weekly report email', desc: 'Receive weekly performance report' },
                  { label: 'SMS for urgent alerts', desc: 'Get SMS for critical notifications' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.label}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            )}
            {(active === 'departments' || active === 'holidays' || active === 'locations' || active === 'roles') && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Cog className="mb-3 h-12 w-12" />
                <p className="text-sm">{sections.find(s => s.id === active)?.label} settings coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
