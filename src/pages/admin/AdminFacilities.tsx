import React, { useState, useEffect } from 'react';
import { Building2, Image as ImageIcon, Plus, Edit, Trash2, X, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import type { Facility, GalleryItem } from '../../types/index.js';

export function AdminFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'facilities' | 'gallery'>('facilities');
  const [loading, setLoading] = useState(true);

  // Modals
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [facilityForm, setFacilityForm] = useState<{
    title: string;
    description: string;
    image: string;
    category: Facility['category'];
    active: boolean;
  }>({
    title: '',
    description: '',
    image: '',
    category: 'Surgery',
    active: true,
  });

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Operation Theater',
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [facRes, galRes] = await Promise.all([
        api.getFacilities({ activeOnly: false }),
        api.getGallery({ activeOnly: false }),
      ]);
      if (facRes.success && Array.isArray(facRes.data)) setFacilities(facRes.data);
      if (galRes.success && Array.isArray(galRes.data)) setGallery(galRes.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load facilities/gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Facility handlers
  const handleFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.title || !facilityForm.description) {
      showToast('Title and description are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingFacility) {
        const res = await api.updateFacility(editingFacility._id, facilityForm);
        if (res.success) {
          showToast('Facility updated', 'success');
          setFacilities((prev) =>
            prev.map((f) => (f._id === editingFacility._id ? res.data : f))
          );
        }
      } else {
        const res = await api.createFacility(facilityForm);
        if (res.success) {
          showToast('New facility added', 'success');
          setFacilities((prev) => [res.data, ...prev]);
        }
      }
      setFacilityModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving facility', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!window.confirm('Delete this facility record?')) return;
    try {
      const res = await api.deleteFacility(id);
      if (res.success) {
        showToast('Facility deleted', 'info');
        setFacilities((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Gallery handlers
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image) {
      showToast('Title and photo image URL are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingGallery) {
        const res = await api.updateGalleryItem(editingGallery._id, galleryForm);
        if (res.success) {
          showToast('Gallery item updated', 'success');
          setGallery((prev) =>
            prev.map((g) => (g._id === editingGallery._id ? res.data : g))
          );
        }
      } else {
        const res = await api.createGalleryItem(galleryForm);
        if (res.success) {
          showToast('Photo added to gallery', 'success');
          setGallery((prev) => [res.data, ...prev]);
        }
      }
      setGalleryModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving gallery item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Delete this photo from the hospital gallery?')) return;
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        showToast('Photo removed', 'info');
        setGallery((prev) => prev.filter((g) => g._id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <AdminLayout title="Facilities & Visual Gallery">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Tab & Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'facilities'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Facilities ({facilities.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photo Gallery ({gallery.length})
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {activeTab === 'facilities' ? (
              <button
                onClick={() => {
                  setEditingFacility(null);
                  setFacilityForm({
                    title: '',
                    description: '',
                    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
                    category: 'Surgery',
                    active: true,
                  });
                  setFacilityModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                Add Facility
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingGallery(null);
                  setGalleryForm({
                    title: '',
                    description: '',
                    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
                    category: 'Operation Theater',
                    active: true,
                  });
                  setGalleryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Photo
              </button>
            )}
          </div>
        </div>

        {/* Facilities Tab Content */}
        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <img src={fac.image} alt={fac.title} className="w-full h-40 object-cover" />
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                      {fac.category}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{fac.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
                  <button
                    onClick={() => {
                      setEditingFacility(fac);
                      setFacilityForm({
                        title: fac.title,
                        description: fac.description,
                        image: fac.image,
                        category: fac.category,
                        active: fac.active,
                      });
                      setFacilityModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFacility(fac._id)}
                    className="inline-flex items-center gap-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-rose-800/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Tab Content */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1.5">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-slate-800/80 pt-2.5">
                  <button
                    onClick={() => {
                      setEditingGallery(item);
                      setGalleryForm({
                        title: item.title,
                        description: item.description || '',
                        image: item.image,
                        category: item.category,
                        active: item.active,
                      });
                      setGalleryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item._id)}
                    className="inline-flex items-center gap-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-rose-800/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Facility Modal */}
        {facilityModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">
                  {editingFacility ? 'Edit Facility' : 'Add Hospital Facility'}
                </h3>
                <button
                  onClick={() => setFacilityModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFacilitySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Facility Title *</label>
                  <input
                    type="text"
                    required
                    value={facilityForm.title}
                    onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })}
                    placeholder="e.g. Modern Modular Operation Theatre"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Category *</label>
                    <select
                      value={facilityForm.category}
                      onChange={(e) =>
                        setFacilityForm({ ...facilityForm, category: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    >
                      <option value="Surgery">Surgery</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Diagnostic">Diagnostic</option>
                      <option value="Inpatient">Inpatient</option>
                      <option value="Clinical">Clinical</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      value={facilityForm.image}
                      onChange={(e) => setFacilityForm({ ...facilityForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={facilityForm.description}
                    onChange={(e) =>
                      setFacilityForm({ ...facilityForm, description: e.target.value })
                    }
                    placeholder="Describe equipment, sterilization standards, capacity..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={facilityForm.active}
                      onChange={(e) =>
                        setFacilityForm({ ...facilityForm, active: e.target.checked })
                      }
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Active in Public Facilities Section
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFacilityModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-semibold transition"
                  >
                    {saving ? 'Saving...' : 'Save Facility'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {galleryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">
                  {editingGallery ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
                </h3>
                <button
                  onClick={() => setGalleryModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGallerySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="e.g. Laminar Flow Operation Suite"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      placeholder="e.g. Operation Theater"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Photo URL *</label>
                    <input
                      type="url"
                      required
                      value={galleryForm.image}
                      onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Caption / Description</label>
                  <input
                    type="text"
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={galleryForm.active}
                      onChange={(e) =>
                        setGalleryForm({ ...galleryForm, active: e.target.checked })
                      }
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Display in Public Gallery
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-semibold transition"
                  >
                    {saving ? 'Saving...' : 'Save Photo'}
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
