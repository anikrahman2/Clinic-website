import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { useHospital } from '../../context/HospitalContext.js';
import type { Doctor } from '../../types/index.js';

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    qualifications: '',
    specialty: 'Gynecology & Obstetrics',
    designation: 'Senior Consultant',
    experience: '10+ Years',
    bio: '',
    consultationDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday'],
    consultationTime: '05:00 PM - 09:00 PM',
    phone: '',
    appointmentAvailable: true,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { refreshDoctors } = useHospital();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.getDoctors({ activeOnly: false });
      if (res.success && Array.isArray(res.data)) {
        setDoctors(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const openCreateModal = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      qualifications: 'MBBS, FCPS',
      specialty: 'General Medicine',
      designation: 'Consultant Physician',
      experience: '8+ Years',
      bio: '',
      consultationDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday'],
      consultationTime: '05:00 PM - 08:30 PM',
      phone: '+880 1711-000000',
      appointmentAvailable: true,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      photo: doctor.photo,
      qualifications: doctor.qualifications,
      specialty: doctor.specialty,
      designation: doctor.designation,
      experience: doctor.experience,
      bio: doctor.bio || '',
      consultationDays: doctor.consultationDays || ['Saturday', 'Sunday'],
      consultationTime: doctor.consultationTime,
      phone: doctor.phone || '',
      appointmentAvailable: doctor.appointmentAvailable,
      active: doctor.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.qualifications || !formData.specialty) {
      showToast('Please provide doctor name, qualifications, and specialty.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingDoctor) {
        const res = await api.updateDoctor(editingDoctor._id, formData);
        if (res.success) {
          showToast('Doctor profile updated successfully.', 'success');
          setDoctors((prev) =>
            prev.map((d) => (d._id === editingDoctor._id ? res.data : d))
          );
        }
      } else {
        const res = await api.createDoctor(formData);
        if (res.success) {
          showToast('New doctor added successfully.', 'success');
          setDoctors((prev) => [res.data, ...prev]);
        }
      }
      refreshDoctors();
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (doctor: Doctor) => {
    try {
      const res = await api.updateDoctor(doctor._id, { active: !doctor.active });
      if (res.success) {
        showToast(
          `Doctor ${doctor.name} is now ${!doctor.active ? 'Active' : 'Inactive'}`,
          'info'
        );
        setDoctors((prev) =>
          prev.map((d) => (d._id === doctor._id ? { ...d, active: !doctor.active } : d))
        );
        refreshDoctors();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update doctor status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this doctor from the hospital registry?'))
      return;

    try {
      const res = await api.deleteDoctor(id);
      if (res.success) {
        showToast('Doctor profile deleted.', 'info');
        setDoctors((prev) => prev.filter((d) => d._id !== id));
        refreshDoctors();
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Doctor & Specialist Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={fetchDoctors}
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
              Add New Doctor
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="flex gap-4">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                      {doctor.specialty}
                    </span>
                    <button
                      onClick={() => handleToggleActive(doctor)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doctor.active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {doctor.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1.5 truncate">{doctor.name}</h3>
                  <p className="text-xs text-slate-400 truncate">{doctor.qualifications}</p>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1 text-slate-300">
                <div><strong>Visiting:</strong> {doctor.consultationDays?.join(', ')}</div>
                <div><strong>Time:</strong> {doctor.consultationTime}</div>
                <div><strong>Phone/Serial:</strong> {doctor.phone || 'Hospital reception'}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(doctor)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor._id)}
                  className="inline-flex items-center gap-1.5 bg-rose-950/50 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-rose-800/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add / Edit Doctor */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Physician'}
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
                  <label className="font-semibold text-slate-300 block mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. M. A. Rahman"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Qualifications *</label>
                    <input
                      type="text"
                      required
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      placeholder="MBBS, FCPS, MS"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Specialty *</label>
                    <input
                      type="text"
                      required
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="e.g. Cardiology"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Senior Consultant"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Experience</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="12+ Years"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Chamber Timing *</label>
                    <input
                      type="text"
                      required
                      value={formData.consultationTime}
                      onChange={(e) => setFormData({ ...formData, consultationTime: e.target.value })}
                      placeholder="05:00 PM - 09:00 PM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Doctor Phone / Serial</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1711-XXXXXX"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Visiting Days (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.consultationDays.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationDays: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Saturday, Sunday, Monday, Tuesday"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Short Biography</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Clinical interests, medical achievements..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Active in Public Directory
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.appointmentAvailable}
                      onChange={(e) => setFormData({ ...formData, appointmentAvailable: e.target.checked })}
                      className="rounded bg-slate-800 text-teal-600 focus:ring-0"
                    />
                    Available for Online Booking
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
                    {saving ? 'Saving...' : editingDoctor ? 'Update Profile' : 'Create Doctor'}
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
