import { useState, useEffect } from 'react';
import { MessageSquare, Search, Trash2, CheckCircle2, Clock, Mail, Phone, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/admin/StatusBadge.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import type { Inquiry } from '../../types/index.js';

export function AdminMessages() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Inquiry | null>(null);
  const { showToast } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getInquiries({
        status: filter !== 'All' ? filter : undefined,
        search: search || undefined,
      });
      if (res.success && Array.isArray(res.data)) {
        setInquiries(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.updateInquiryStatus(id, status);
      if (res.success) {
        showToast(`Message marked as ${status}`, 'success');
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: status as any } : i))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as any });
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await api.deleteInquiry(id);
      if (res.success) {
        showToast('Inquiry deleted.', 'info');
        setInquiries((prev) => prev.filter((i) => i._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <AdminLayout title="Patient Inquiries & Messages">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Controls */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
              placeholder="Search sender, phone, subject..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex gap-1.5">
              {['All', 'New', 'Read', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    filter === st
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={fetchInquiries}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inquiries Grid & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs">Loading messages...</div>
              ) : inquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No inquiries found.</div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    onClick={() => {
                      setSelectedMessage(inq);
                      if (inq.status === 'New') {
                        handleUpdateStatus(inq._id, 'Read');
                      }
                    }}
                    className={`p-4 hover:bg-slate-900/60 cursor-pointer transition space-y-1.5 ${
                      selectedMessage?._id === inq._id ? 'bg-slate-900/80 border-l-4 border-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{inq.name}</span>
                      <StatusBadge status={inq.status} />
                    </div>
                    <div className="text-teal-400 font-semibold text-xs truncate">
                      {inq.subject}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{inq.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{inq.phone}</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail Card */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              Inquiry Details
            </h3>

            {selectedMessage ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{selectedMessage.name}</span>
                    <StatusBadge status={selectedMessage.status} />
                  </div>
                  <div className="text-slate-300"><strong>Phone:</strong> {selectedMessage.phone}</div>
                  {selectedMessage.email && (
                    <div className="text-slate-300"><strong>Email:</strong> {selectedMessage.email}</div>
                  )}
                  <div className="text-[10px] text-slate-500">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <strong className="text-teal-300 block text-xs">Subject:</strong>
                  <div className="font-semibold text-white">{selectedMessage.subject}</div>
                  <strong className="text-teal-300 block text-xs pt-2">Message:</strong>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'Resolved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/40 font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select an inquiry from the inbox to read and manage.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
