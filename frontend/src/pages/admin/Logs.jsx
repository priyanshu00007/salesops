import { useState } from 'react';
import { Terminal, AlertTriangle, AlertCircle, Info, Search, X, RefreshCw, Loader2 } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';

const CATEGORIES = [
  { label: 'All', icon: Terminal }, { label: 'INFO', icon: Info }, { label: 'WARN', icon: AlertTriangle }, { label: 'ERROR', icon: AlertCircle },
];

export default function SystemLogs() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const queryKey = ['system-logs', filter, search];
  const queryStr = search
    ? `/logs?level=${filter !== 'All' ? filter : ''}&search=${search}`
    : `/logs${filter !== 'All' ? `?level=${filter}` : ''}`;

  const { data, isLoading, refetch } = useFetch(queryKey, queryStr);
  const logs = data?.logs || [];

  const getLogStyles = (level) => {
    const l = (level || '').toUpperCase();
    switch (l) {
      case 'INFO': return { bg: 'bg-blue-100 text-blue-700', icon: <Info className="h-4 w-4 text-blue-600" /> };
      case 'WARN': return { bg: 'bg-amber-100 text-amber-700', icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> };
      case 'ERROR': return { bg: 'bg-red-100 text-red-700', icon: <AlertCircle className="h-4 w-4 text-red-600" /> };
      default: return { bg: 'bg-gray-100 text-gray-700', icon: <Terminal className="h-4 w-4 text-gray-600" /> };
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="mt-1 text-sm text-gray-500">Real-time audit trail, security events, and error monitoring.</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.label} onClick={() => setFilter(cat.label)}
                className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${filter === cat.label ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="h-4 w-4" />{cat.label}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="w-64 rounded-lg border border-gray-300 py-2 pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          {search && <X className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSearch('')} />}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-900 px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="ml-3 font-mono text-xs text-gray-400">system_logs.log ({logs.length} entries)</span>
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin text-gray-500" />}
          </div>
        </div>
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <Search className="mb-2 h-8 w-8" />
              <p className="text-sm">No logs match your filter</p>
            </div>
          ) : (
            logs.map((log) => {
              const style = getLogStyles(log.level);
              const date = new Date(log.created_at).toLocaleString();
              return (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex w-32 items-center gap-2 flex-shrink-0">
                    {style.icon}
                    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-bold tracking-wider ${style.bg}`}>{log.level.toUpperCase()}</span>
                  </div>
                  <div className="font-mono text-sm text-gray-800 flex-1 truncate">{log.action}</div>
                  <div className="flex flex-shrink-0 items-center gap-4 font-mono text-xs text-gray-500">
                    <span className="hidden sm:inline text-right">[{log.source || 'System'}]</span>
                    <span>{date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
