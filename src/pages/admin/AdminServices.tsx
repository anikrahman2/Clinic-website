import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search, Edit, Trash2, X, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { useHospital } from '../../context/HospitalContext.js';
import type { Service } from '../../types/index.js';

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    department: 'Gynecology & Obstetrics',
    description: '',
    icon: 'Activity',
    image: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { refreshServices } = useHospital();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.getServices({ activeOnly: false });
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      department: 'Surgery',
      description: '',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      department: service.department,
      description: service.description,
      icon: service.icon || 'Activity',
      image: service.image,
      active: service.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.department) {
      showToast('Name, department, and description are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        const res = await api.updateService(editingService._id, formData);
        if (res.success) {
          showToast('Service updated successfully.', 'success');
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data : s))
          );
        }
      } else {
        const res = await api.createService(formData);
        if (res.success) {
          showToast('New service department added.', 'success');
          setServices((prev) => [res.data, ...prev]);
        }
      }
      refreshServices();
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await api.updateService(service._id, { active: !service.active });
      if (res.success) {
        showToast(
          `Service is now ${!service.active ? 'Active' : 'Inactive'}`,
          'info'
        );
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, active: !service.active } : s))
        );
        refreshServices();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update service status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this clinical service?')) return;

    try {
      const res = await api.deleteService(id);
      if (res.success) {
        showToast('Service deleted.', 'info');
        setServices((prev) => prev.filter((s) => s._id !== id));
        refreshServices();
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Services & Departments Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services & departments..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={fetchServices}
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
              Add New Service
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div
              key={service._id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div>
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                      {service.department}
                    </span>
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        service.active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base mt-2">{service.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => openEditModal(service)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="inline-flex items-center gap-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-rose-800/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add / Edit Service */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  {editingService ? 'Edit Service' : 'Add Clinical Department'}
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
                  <label className="font-semibold text-slate-300 block mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gynecology & Maternity Care"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Gynecology"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Slug (URL friendly)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="leave blank to auto-generate"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe clinical treatments, surgery facilities, diagnostic procedures..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Active in Public Service Menu
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
                    {saving ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
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
