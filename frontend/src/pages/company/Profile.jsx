import { useState } from 'react';
import { UserCircle, Key, Smartphone, Monitor, Clock, CheckCircle, Laptop, Tablet } from 'lucide-react';

export default function ManagerProfile() {
  const [tab, setTab] = useState('info');

  const sessions = [
    { device: 'Chrome on Windows', ip: '192.168.1.100', lastActive: 'Active now', current: true },
    { device: 'Safari on iPhone', ip: '192.168.1.101', lastActive: '2 hrs ago', current: false },
    { device: 'Firefox on macOS', ip: '203.0.113.50', lastActive: '3 days ago', current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-2xl font-bold text-white">SA</div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Super Admin</h2>
            <p className="text-sm text-gray-500">Platform Administrator</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"><CheckCircle className="mr-1 h-3 w-3" /> Active</span>
            </div>
            <div className="mt-6 space-y-2">
              {[
                { id: 'info', label: 'Personal Info', icon: UserCircle },
                { id: 'security', label: 'Security', icon: Key },
                { id: 'devices', label: 'Devices', icon: Smartphone },
                { id: 'sessions', label: 'Sessions', icon: Monitor },
                { id: 'preferences', label: 'Preferences', icon: Clock },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${tab === t.id ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <t.icon className="h-5 w-5" />{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {tab === 'info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div><label className="block text-sm font-medium text-gray-700">Full Name</label><input defaultValue="Super Admin" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Email</label><input defaultValue="admin@coldsync.io" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Phone</label><input defaultValue="+1-555-0001" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Timezone</label><select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"><option>America/New_York (EST)</option><option>America/Chicago (CST)</option><option>America/Denver (MST)</option><option>America/Los_Angeles (PST)</option></select></div>
                </div>
                <div className="flex justify-end"><button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button></div>
              </div>
            )}
            {tab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">New Password</label><input type="password" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Confirm New Password</label><input type="password" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400" /></div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex justify-end"><button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Update Password</button></div>
                </div>
              </div>
            )}
            {tab === 'devices' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Devices</h2>
                <p className="text-sm text-gray-500">Trusted devices connected to your account. You can remove access to any device.</p>
                <div className="space-y-4">
                  {[
                    { name: 'Windows PC · Chrome', type: 'Desktop', icon: Monitor, ip: '192.168.1.100', lastAccess: 'Active now', trusted: true },
                    { name: 'iPhone 15 Pro · Safari', type: 'Mobile', icon: Smartphone, ip: '192.168.1.101', lastAccess: '2 hrs ago', trusted: true },
                    { name: 'iPad Air · Chrome', type: 'Tablet', icon: Tablet, ip: '192.168.1.102', lastAccess: '5 days ago', trusted: false },
                    { name: 'MacBook Pro · Firefox', type: 'Laptop', icon: Laptop, ip: '203.0.113.50', lastAccess: '3 days ago', trusted: false },
                  ].map(d => (
                    <div key={d.name} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <d.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{d.name}</p>
                            {d.trusted && <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Trusted</span>}
                          </div>
                          <p className="text-xs text-gray-500">{d.type} · {d.ip} · Last access: {d.lastAccess}</p>
                        </div>
                      </div>
                      <button className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'sessions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
                <p className="text-sm text-gray-500">Manage your active login sessions across devices.</p>
                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.ip} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{s.device}</p>
                            {s.current && <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Current</span>}
                          </div>
                          <p className="text-xs text-gray-500">IP: {s.ip} · Last active: {s.lastActive}</p>
                        </div>
                      </div>
                      {!s.current && <button className="text-xs font-medium text-red-600 hover:text-red-700">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email Digest', desc: 'Receive daily email summary', default: true },
                    { label: 'Push Notifications', desc: 'Enable browser push notifications', default: true },
                    { label: 'In-app Sounds', desc: 'Play sounds for notifications', default: false },
                    { label: 'Weekly Reports', desc: 'Receive weekly performance report', default: true },
                  ].map(p => (
                    <div key={p.label} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.label}</p>
                        <p className="text-xs text-gray-500">{p.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked={p.default} />
                        <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end"><button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Preferences</button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
