import { useState } from 'react';
import { FileText, Folder, Upload, Download, Search, Trash2, FileImage, FileSpreadsheet, File as FileIcon } from 'lucide-react';

const folders = [
  { name: 'Projects', icon: Folder, count: 12, color: 'text-blue-600 bg-blue-50' },
  { name: 'Policies', icon: Folder, count: 5, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Reports', icon: Folder, count: 8, color: 'text-amber-600 bg-amber-50' },
  { name: 'Invoices', icon: Folder, count: 24, color: 'text-violet-600 bg-violet-50' },
  { name: 'Contracts', icon: Folder, count: 6, color: 'text-cyan-600 bg-cyan-50' },
  { name: 'Employee Files', icon: Folder, count: 32, color: 'text-rose-600 bg-rose-50' },
];

const files = [
  { name: 'Q2_Report_Final.pdf', folder: 'Reports', size: '2.4 MB', date: 'Jun 30, 2026', uploadedBy: 'Priya Patel', icon: FileText, color: 'text-red-500' },
  { name: 'Employee_Handbook_v3.docx', folder: 'Policies', size: '1.8 MB', date: 'Jun 28, 2026', uploadedBy: 'Neha Gupta', icon: FileText, color: 'text-blue-500' },
  { name: 'Project_Alpha_Designs.fig', folder: 'Projects', size: '12 MB', date: 'Jun 27, 2026', uploadedBy: 'Neha Gupta', icon: FileIcon, color: 'text-violet-500' },
  { name: 'Sales_Data_June.xlsx', folder: 'Reports', size: '856 KB', date: 'Jun 26, 2026', uploadedBy: 'Amit Singh', icon: FileSpreadsheet, color: 'text-emerald-500' },
  { name: 'Client_Contract_Acme.pdf', folder: 'Contracts', size: '1.2 MB', date: 'Jun 25, 2026', uploadedBy: 'Priya Patel', icon: FileText, color: 'text-amber-500' },
  { name: 'Team_Photo_2026.png', folder: 'Employee Files', size: '3.5 MB', date: 'Jun 24, 2026', uploadedBy: 'Rahul Sharma', icon: FileImage, color: 'text-cyan-500' },
];

export default function Documents() {
  const [view, setView] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = files.filter(f => {
    if (view !== 'all' && f.folder !== view) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">{files.length} files across {folders.length} folders</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Upload className="h-4 w-4" /> Upload File
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400" />
        </div>
      </div>

      {/* Folders */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <button onClick={() => setView('all')} className={`rounded-xl border p-4 text-center transition-all ${view === 'all' ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Folder className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">All Files</p>
        </button>
        {folders.map(f => (
          <button key={f.name} onClick={() => setView(f.name)} className={`rounded-xl border p-4 text-center transition-all ${view === f.name ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
            <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${f.color}`}>
              <f.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">{f.name}</p>
            <p className="text-xs text-gray-500">{f.count} files</p>
          </button>
        ))}
      </div>

      {/* Files */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Folder</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Size</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Uploaded</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(f => (
              <tr key={f.name} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                    <span className="text-sm font-medium text-gray-900">{f.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{f.folder}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{f.size}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-500">{f.date}<br /><span className="text-xs">by {f.uploadedBy}</span></span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><Download className="h-4 w-4" /></button>
                    <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
