import { useState } from 'react';
import { Moon, Sun, Globe, Clock, Bell, Lock, Eye, Smartphone, Monitor, Palette } from 'lucide-react';

export default function EmployeeSettings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false,
    twoFactor: false,
    reducedMotion: false,
    fontSize: 'medium',
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Customize your experience</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Appearance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Appearance</h3>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Theme</p><p className="text-xs text-gray-500">Choose light or dark mode</p></div>
              </div>
              <div className="flex items-center rounded-lg border border-gray-200">
                <button onClick={() => setSettings({...settings, theme: 'light'})} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${settings.theme === 'light' ? 'bg-blue-600 text-white rounded-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Sun className="h-4 w-4" /> Light</button>
                <button onClick={() => setSettings({...settings, theme: 'dark'})} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${settings.theme === 'dark' ? 'bg-blue-600 text-white rounded-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Moon className="h-4 w-4" /> Dark</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Font Size</p><p className="text-xs text-gray-500">Adjust text size</p></div>
              </div>
              <select value={settings.fontSize} onChange={e => setSettings({...settings, fontSize: e.target.value})} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Reduced Motion</p><p className="text-xs text-gray-500">Minimize animations</p></div>
              </div>
              <button onClick={() => toggle('reducedMotion')} className={`relative h-6 w-11 rounded-full transition-colors ${settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.reducedMotion ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Language & Region</h3>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Language</p><p className="text-xs text-gray-500">Interface language</p></div>
              </div>
              <select value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Timezone</p><p className="text-xs text-gray-500">Your local timezone</p></div>
              </div>
              <select value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Chicago">Central Time (US)</option>
                <option value="America/Denver">Mountain Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
                <option value="Europe/London">London (UK)</option>
                <option value="Asia/Kolkata">India (IST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          <div className="mt-5 space-y-5">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: Bell },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push alerts', icon: Smartphone },
              { key: 'desktopNotifications', label: 'Desktop Notifications', desc: 'Show desktop notification popups', icon: Monitor },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <div><p className="text-sm font-medium text-gray-900">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                </div>
                <button onClick={() => toggle(item.key)} className={`relative h-6 w-11 rounded-full transition-colors ${settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings[item.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Security</h3>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-400" />
                <div><p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security</p></div>
              </div>
              <button onClick={() => toggle('twoFactor')} className={`relative h-6 w-11 rounded-full transition-colors ${settings.twoFactor ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.twoFactor ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-900">Change Password</p>
              <p className="mt-1 text-xs text-gray-500">Update your account password</p>
              <button className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Change Password</button>
            </div>
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-900">Active Sessions</p>
              <p className="mt-1 text-xs text-gray-500">You are logged in on 2 devices</p>
              <button className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Manage Sessions</button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save Settings</button>
          <button className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
}
