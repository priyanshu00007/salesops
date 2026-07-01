import { useState } from 'react';
import { LifeBuoy, MessageSquare, Bug, Lightbulb, Search, Send, ChevronRight, FileText, HelpCircle, BookOpen } from 'lucide-react';

const faqs = [
  { q: 'How do I reset my password?', a: 'Go to Settings → Security → Change Password. You can update your password there.' },
  { q: 'How do I apply for leave?', a: 'Go to Leave → Apply Leave, fill in the details, and submit. Your manager will be notified.' },
  { q: 'How do I clock in?', a: 'Go to Attendance and click "Clock In". Make sure location services are enabled.' },
  { q: 'How do I view my performance reviews?', a: 'Go to My Performance → Performance Reviews to see your review history.' },
  { q: 'How do I contact IT support?', a: 'Submit a ticket below, or email it-support@acme.com.' },
];

const categories = [
  { name: 'It & Technical Support', icon: HelpCircle, desc: 'Login issues, software access, hardware', count: 3, color: 'bg-blue-50 text-blue-600' },
  { name: 'Bug Report', icon: Bug, desc: 'Report application errors or glitches', count: 2, color: 'bg-red-50 text-red-600' },
  { name: 'Feature Request', icon: Lightbulb, desc: 'Suggest new features or improvements', count: 1, color: 'bg-amber-50 text-amber-600' },
  { name: 'Documentation', icon: BookOpen, desc: 'Request or contribute to documentation', count: 0, color: 'bg-violet-50 text-violet-600' },
];

const myTickets = [
  { id: '#TKT-1024', subject: 'Cannot access Jira', category: 'IT Support', status: 'open', date: 'Jun 28', priority: 'high' },
  { id: '#TKT-1023', subject: 'Dashboard loading slowly', category: 'Bug Report', status: 'in-progress', date: 'Jun 25', priority: 'medium' },
  { id: '#TKT-1022', subject: 'Add dark mode toggle', category: 'Feature Request', status: 'resolved', date: 'Jun 20', priority: 'low' },
];

const statusStyles = { open: 'bg-red-100 text-red-700', 'in-progress': 'bg-blue-100 text-blue-700', resolved: 'bg-emerald-100 text-emerald-700', closed: 'bg-gray-100 text-gray-600' };

export default function EmployeeHelp() {
  const [search, setSearch] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-500">Find answers, report issues, or submit feedback</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-xl border border-gray-300 py-3.5 pl-12 pr-4 shadow-sm focus:border-blue-400 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredFaqs.map((faq, i) => (
                <div key={i}>
                  <button onClick={() => setSelectedFaq(selectedFaq === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${selectedFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  {selectedFaq === i && <div className="border-t border-gray-100 px-5 pb-5 pt-3"><p className="text-sm text-gray-600">{faq.a}</p></div>}
                </div>
              ))}
              {filteredFaqs.length === 0 && <p className="p-5 text-sm text-gray-400">No FAQs match your search</p>}
            </div>
          </div>

          {/* My Tickets */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h3 className="text-base font-bold text-gray-900">My Tickets</h3>
              <button onClick={() => setShowTicketForm(!showTicketForm)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">New Ticket</button>
            </div>

            {showTicketForm && (
              <div className="border-b border-gray-100 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600">Subject</label>
                    <input type="text" placeholder="Brief description..." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Category</label>
                    <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                      <option>IT Support</option>
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>Documentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600">Priority</label>
                    <select className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600">Description</label>
                    <textarea rows={4} placeholder="Describe your issue in detail..." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Send className="mr-1 inline h-4 w-4" /> Submit</button>
                  <button onClick={() => setShowTicketForm(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {myTickets.map(t => (
                <div key={t.id} className="flex items-center justify-between p-5 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.subject}</p>
                      <p className="text-xs text-gray-500">{t.id} · {t.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[t.status]}`}>{t.status}</span>
                    <span className="text-xs text-gray-400">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Categories</h3>
            <div className="mt-4 space-y-2">
              {categories.map((c, i) => (
                <button key={i} className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition-all hover:border-blue-200 hover:shadow-sm">
                  <div className={`rounded-lg p-2 ${c.color}`}><c.icon className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.desc}</p>
                  </div>
                  {c.count > 0 && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{c.count}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900">Contact Support</h3>
            <p className="mt-2 text-xs text-gray-500">Need immediate help? Reach out to the support team.</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-600"><span className="font-semibold">Email:</span> support@acme.com</p>
              <p className="text-gray-600"><span className="font-semibold">Chat:</span> Available 9AM-6PM</p>
              <p className="text-gray-600"><span className="font-semibold">Phone:</span> Ext. 1200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
