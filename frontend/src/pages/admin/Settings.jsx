import { useState } from 'react';
import { Palette, Mail, MessageSquare, HardDrive, Fingerprint, ShieldCheck, Sliders, ShieldAlert, CheckCircle, Loader2, X } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import api from '../../api/axios';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import { CardSkeleton } from '../../components/Skeleton';

const MODULES = [
  { title: 'Global Branding', desc: 'Logo, colors, favicon, custom domain', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-100', fields: ['Logo URL', 'Primary Color', 'Favicon URL', 'Custom Domain'] },
  { title: 'Email Configuration', desc: 'SMTP, templates, send limits', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100', fields: ['SMTP Host', 'SMTP Port', 'Username', 'From Address'] },
  { title: 'SMS Providers', desc: 'Twilio, Vonage, AWS SNS integrations', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100', fields: ['Provider', 'API Key', 'Sender ID'] },
  { title: 'Storage Options', desc: 'S3, GCS, Azure Blob, file size limits', icon: HardDrive, color: 'text-amber-600', bg: 'bg-amber-100', fields: ['Storage Provider', 'Bucket Name', 'Region', 'Max File Size'] },
  { title: 'Authentication', desc: 'SSO, OAuth, MFA, password policy', icon: Fingerprint, color: 'text-indigo-600', bg: 'bg-indigo-100', fields: ['Auth Method', 'Session Timeout', 'MFA Required', 'Password Min Length'] },
  { title: 'Security Policies', desc: 'IP whitelist, session timeouts, audit rules', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-100', fields: ['IP Whitelist', 'Session Timeout', 'Audit Level', 'Max Login Attempts'] },
  { title: 'Feature Flags', desc: 'Enable or disable modules platform-wide', icon: Sliders, color: 'text-purple-600', bg: 'bg-purple-100', fields: ['Module Name', 'Enabled', 'Target Roles'] },
];

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetch('admin-settings', '/admin/settings');
  const dbSettings = data?.settings || {};

  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  const openSettings = (module) => {
    setSelected(module);
    setValues(dbSettings[module.title] || {});
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = { ...dbSettings, [selected.title]: values };
    try {
      await api.put('/admin/settings', { settings: updated });
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success(`${selected.title} settings saved`);
      setSelected(null);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="p-6 md:p-8"><CardSkeleton count={7} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Global configuration and integrations. Click a card to edit.</p>
      </div>

      <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-indigo-600" /><h3 className="text-sm font-semibold text-indigo-900">Super Admin Access Configuration</h3></div>
        <div className="flex flex-wrap gap-2">
          {MODULES.map(s => <span key={s.title} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm border border-indigo-100">{s.title}</span>)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isConfigured = !!dbSettings[m.title];
          return (
            <div key={m.title} onClick={() => openSettings(m)} className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${m.bg}`}><Icon className={`h-6 w-6 ${m.color}`} /></div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{m.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{m.desc}</p>
                    {isConfigured && <span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle className="h-3 w-3" /> Configured</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Settings'}>
        {selected && (
          <div className="space-y-4">
            {selected.fields.map(f => (
              <div key={f}>
                <label className="mb-1 block text-sm font-medium text-gray-700">{f}</label>
                <input type="text" value={values[f] || ''} onChange={e => setValues({ ...values, [f]: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder={`Enter ${f.toLowerCase()}`} />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setSelected(null)} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save Settings</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
