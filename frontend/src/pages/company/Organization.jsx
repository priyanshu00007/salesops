import { Settings, Building2, Clock, CalendarDays, Users, Briefcase, ShieldAlert, DollarSign } from 'lucide-react';

const MODULES = [
  { title: 'Company Profile', desc: 'Acme Corp · contact@acme.com · 555-0100', icon: Building2 },
  { title: 'Departments', desc: 'Sales (24), Marketing (8), Support (12)', icon: Users },
  { title: 'Teams', desc: 'Enterprise Sales, SMB, Inside Sales, BDR', icon: Briefcase },
  { title: 'Working Hours', desc: 'Mon-Fri 9:00-18:00 · Timezone: EST', icon: Clock },
  { title: 'Holidays', desc: '12 company holidays configured', icon: CalendarDays },
  { title: 'Business Settings', desc: 'Currency: USD · Fiscal year: Jan-Dec', icon: DollarSign },
];

export default function Organization() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your company profile and structure.</p>
      </div>

      <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <h3 className="text-sm font-semibold text-amber-900">Company Admin Controls</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Update Company Profile', 'Company Logo', 'Working Hours', 'Holidays', 'Departments', 'Teams', 'Business Settings'].map(a => (
            <span key={a} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-700 shadow-sm border border-amber-100">{a}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map(m => (
          <div key={m.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-50 p-3">
                <m.icon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{m.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{m.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
