import { Building2, Building, Users, UserCheck, Phone, Target, Wallet, Activity, ArrowUp, ArrowDown, Download, Calendar, RefreshCw } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { CardSkeleton } from '../../components/Skeleton';

export default function AdminAnalytics() {
  const { data: stats, isLoading, refetch } = useFetch('analytics', '/analytics', { refetchInterval: 60000 });

  const cardItems = stats ? [
    { label: 'Total Companies', value: stats.totalCompanies, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%', isUp: true },
    { label: 'Active Companies', value: stats.activeCompanies, icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+8%', isUp: true },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+15%', isUp: true },
    { label: 'Company Admins', value: stats.managerUsers, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', trend: '+22%', isUp: true },
    { label: 'Total Calls', value: stats.totalCalls, icon: Phone, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+34%', isUp: true },
    { label: 'Total Leads', value: stats.totalLeads, icon: Target, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+18%', isUp: true },
    { label: 'Platform Revenue', value: `$${parseFloat(stats.platformRevenue || 0).toLocaleString()}`, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-100', trend: '+25%', isUp: true },
    { label: 'Total Invoices', value: stats.totalInvoices, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100', trend: '+5%', isUp: true },
  ] : [];

  if (isLoading) return <div className="p-6 md:p-8"><CardSkeleton count={8} /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Comprehensive overview of platform growth and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"><Download className="h-4 w-4" /> Export</button>
          <button onClick={() => refetch()} className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cardItems.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${s.bg}`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
              <div className={`flex items-center text-sm font-medium ${s.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {s.isUp ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}{s.trend}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{s.label}</h3>
              <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead Status Distribution</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" /> All time</div>
        </div>
        {stats && (
          <div className="flex flex-wrap gap-4">
            {Object.entries(stats.leadsByStatus || {}).map(([status, count]) => {
              const max = Math.max(...Object.values(stats.leadsByStatus), 1);
              const pct = (count / max) * 100;
              return (
                <div key={status} className="flex-1 min-w-[120px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium capitalize text-gray-600">{status.replace('-', ' ')}</span>
                    <span className="text-xs font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="h-6 w-full rounded-md bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-md bg-gradient-to-r from-blue-400 to-blue-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
