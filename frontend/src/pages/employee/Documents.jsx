import { useState } from 'react';
import { FileText, Folder, Search, Upload, Download, Trash2, MoreHorizontal, Clock, User, Star, Grid, List } from 'lucide-react';

const categories = [
  { name: 'Personal', icon: FileText, count: 5, color: 'bg-blue-50 text-blue-600' },
  { name: 'Shared with Me', icon: Folder, count: 3, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Project Files', icon: Folder, count: 8, color: 'bg-violet-50 text-violet-600' },
  { name: 'Company Policies', icon: FileText, count: 4, color: 'bg-amber-50 text-amber-600' },
];

const recentFiles = [
  { name: 'Q3 Campaign Brief.pdf', folder: 'Project Files', modified: '2 hrs ago', size: '2.4 MB', starred: true },
  { name: 'Performance Review.docx', folder: 'Personal', modified: 'Yesterday', size: '856 KB', starred: false },
  { name: 'Employee Handbook v5.pdf', folder: 'Company Policies', modified: '3 days ago', size: '12 MB', starred: false },
  { name: 'Meeting Notes - Sprint 12.md', folder: 'Project Files', modified: '1 week ago', size: '24 KB', starred: true },
  { name: 'Expense Report July.xlsx', folder: 'Personal', modified: '1 week ago', size: '156 KB', starred: false },
  { name: 'NDA Template.docx', folder: 'Shared with Me', modified: '2 weeks ago', size: '1.2 MB', starred: false },
];

export default function EmployeeDocuments() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = recentFiles.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) && (activeCat === 'all' || f.folder === activeCat));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your personal and shared files</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-400 focus:outline-none" />
          </div>
          <div className="flex items-center rounded-lg border border-gray-200">
            <button onClick={() => setViewMode('grid')} className={`rounded-l-lg p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}><Grid className="h-4 w-4" /></button>
            <button onClick={() => setViewMode('list')} className={`rounded-r-lg p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}><List className="h-4 w-4" /></button>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Upload className="h-4 w-4" /> Upload</button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button onClick={() => setActiveCat('all')} className={`rounded-xl border p-4 text-left transition-all ${activeCat === 'all' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
          <p className="text-sm font-semibold text-gray-900">All Files</p>
          <p className="text-2xl font-bold text-blue-600">{recentFiles.length}</p>
        </button>
        {categories.map(cat => (
          <button key={cat.name} onClick={() => setActiveCat(cat.name)} className={`rounded-xl border p-4 text-left transition-all ${activeCat === cat.name ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
            <div className={`mb-2 inline-flex rounded-lg p-2 ${cat.color}`}><cat.icon className="h-4 w-4" /></div>
            <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
            <p className="text-xs text-gray-500">{cat.count} files</p>
          </button>
        ))}
      </div>

      {/* File List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((file, i) => (
            <div key={i} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <button>{file.starred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <Star className="h-4 w-4 text-gray-300" />}</button>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 truncate">{file.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{file.folder}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {file.modified}</span>
                <span>{file.size}</span>
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <button className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"><Download className="mr-1 inline h-3 w-3" />Download</button>
                <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase text-gray-500">
            <span className="col-span-4">Name</span>
            <span className="col-span-2">Folder</span>
            <span className="col-span-2">Modified</span>
            <span className="col-span-1">Size</span>
            <span className="col-span-3" />
          </div>
          {filtered.map((file, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 border-b border-gray-50 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">
              <span className="col-span-4 flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-blue-500" /> {file.name}</span>
              <span className="col-span-2 text-gray-500">{file.folder}</span>
              <span className="col-span-2 text-gray-500">{file.modified}</span>
              <span className="col-span-1 text-gray-500">{file.size}</span>
              <span className="col-span-3 flex items-center justify-end gap-2">
                <button className="rounded p-1 hover:bg-gray-100"><Download className="h-4 w-4" /></button>
                <button className="rounded p-1 hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                <button className="rounded p-1 hover:bg-gray-100">{file.starred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <Star className="h-4 w-4" />}</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <FileText className="mb-3 h-12 w-12" />
          <p className="text-sm font-medium">No files found</p>
        </div>
      )}
    </div>
  );
}
