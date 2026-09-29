import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2, X, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import type { FAQ } from '../../types/index.js';

export function AdminFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.getFAQs({ activeOnly: false });
      if (res.success && Array.isArray(res.data)) {
        setFaqs(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      active: faq.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      showToast('Question and answer are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingFaq) {
        const res = await api.updateFAQ(editingFaq._id, formData);
        if (res.success) {
          showToast('FAQ updated.', 'success');
          setFaqs((prev) => prev.map((f) => (f._id === editingFaq._id ? res.data : f)));
        }
      } else {
        const res = await api.createFAQ(formData);
        if (res.success) {
          showToast('New FAQ added.', 'success');
          setFaqs((prev) => [...prev, res.data]);
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ entry?')) return;
    try {
      const res = await api.deleteFAQ(id);
      if (res.success) {
        showToast('FAQ deleted', 'info');
        setFaqs((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <AdminLayout title="Hospital FAQ & Knowledge Base">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            FAQs are utilized by both the public FAQ section and the Jharna Care Assistant AI model.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFaqs}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Add FAQ Question
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      faq.active ? 'text-emerald-400 bg-emerald-950' : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    {faq.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-2">{faq.question}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(faq)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="inline-flex items-center gap-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-rose-800/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add/Edit FAQ */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">
                  {editingFaq ? 'Edit FAQ' : 'Add FAQ Question'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Question *</label>
                  <input
                    type="text"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="e.g. What are the ICU visiting hours?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Emergency, General, Hospital Policies"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Answer *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Provide clear, factual answer..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Active in Public Portal & AI Knowledge Base
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-lg font-semibold transition"
                  >
                    {saving ? 'Saving...' : 'Save Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
