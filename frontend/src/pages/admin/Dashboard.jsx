import { Building2, CheckCircle2, Users, UserCheck, PhoneCall, ClipboardList, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { CardSkeleton } from '../../components/Skeleton';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useFetch('admin-stats', '/dashboard/stats', { refetchInterval: 30000 });
  const { data: activityData, isLoading: activityLoading } = useFetch('admin-activity', '/dashboard/activity', { refetchInterval: 30000 });

  const activities = activityData?.activities || [];
  const isLoading = statsLoading || activityLoading;

  const cardData = stats ? [
    { label: 'Total Companies', value: stats.totalCompanies, change: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Companies', value: stats.activeCompanies, change: '+8%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Total Employees', value: stats.totalEmployees, change: '+15%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Active Users', value: stats.activeUsers, change: '+22%', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Calls', value: stats.totalCalls, change: '+34%', icon: PhoneCall, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Leads', value: stats.totalLeads, change: '+18%', icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Platform Revenue', value: stats.platformRevenue, change: '+25%', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Active Today', value: stats.platformActivity, change: '+5%', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100' },
  ] : [];

  if (statsError) {
    return (
      <div className="m-8 rounded-lg bg-red-50 p-6 text-red-600 flex items-center space-x-3">
        <AlertCircle size={24} />
        <p className="font-medium">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your entire SaaS platform metrics</p>
      </div>

      {isLoading ? <CardSkeleton count={8} /> : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="font-medium text-emerald-600">{stat.change}</span>
                  <span className="ml-2 text-gray-400">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h2>
        </div>
        <div className="p-6">
          {activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start space-x-4">
                  <div className="relative mt-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                    {index !== activities.length - 1 && (
                      <div className="absolute left-1.5 top-4 -ml-px h-full w-0.5 bg-gray-100"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user_name}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
