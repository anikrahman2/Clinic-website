import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  X,
  RefreshCw,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/admin/StatusBadge.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import type { Appointment } from '../../types/index.js';

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    status: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments({
        search: search || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        limit: 100,
      });
      if (res.success && Array.isArray(res.data)) {
        setAppointments(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const res = await api.updateAppointmentStatus(id, { status });
      if (res.success) {
        showToast(`Appointment status updated to ${status}`, 'success');
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: status as any } : a))
        );
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: status as any });
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setActionLoading(true);
    try {
      const res = await api.updateAppointmentStatus(selectedAppointment._id, rescheduleData);
      if (res.success && res.data) {
        showToast('Appointment schedule and details updated', 'success');
        setAppointments((prev) =>
          prev.map((a) => (a._id === selectedAppointment._id ? res.data : a))
        );
        setSelectedAppointment(res.data);
        setEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment record?')) return;

    try {
      const res = await api.deleteAppointment(id);
      if (res.success) {
        showToast('Appointment record deleted', 'info');
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        if (selectedAppointment?._id === id) setSelectedAppointment(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <AdminLayout title="Appointment Management">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Controls: Search, Filter, Refresh */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, Patient, Doctor, Phone..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    statusFilter === st
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAppointments}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Appointment ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4">Scheduled Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No appointments found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-mono font-bold text-teal-400">
                        {app.appointmentId}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{app.patientName}</span>
                        <span className="text-[11px] text-slate-400">
                          {app.age} yrs • {app.gender}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">{app.phone}</td>
                      <td className="p-4 max-w-[160px] truncate text-slate-200">
                        {app.doctor}
                        <span className="block text-[10px] text-teal-400 truncate">
                          {app.department}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="block text-slate-200 font-medium">
                          {app.appointmentDate}
                        </span>
                        <span className="text-[11px] text-slate-400">{app.appointmentTime}</span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAppointment(app)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(app);
                              setRescheduleData({
                                status: app.status,
                                appointmentDate: app.appointmentDate,
                                appointmentTime: app.appointmentTime,
                                notes: app.notes || '',
                              });
                              setEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition"
                            title="Reschedule / Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-1.5 text-rose-500/70 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Drawer / Modal */}
        {selectedAppointment && !editModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400 block">
                    {selectedAppointment.appointmentId}
                  </span>
                  <h3 className="font-bold text-white text-base">Appointment Details</h3>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div><strong>Patient:</strong> {selectedAppointment.patientName} ({selectedAppointment.age} yrs, {selectedAppointment.gender})</div>
                  <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
                  {selectedAppointment.email && <div><strong>Email:</strong> {selectedAppointment.email}</div>}
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div><strong>Doctor:</strong> {selectedAppointment.doctor}</div>
                  <div><strong>Department:</strong> {selectedAppointment.department}</div>
                  <div><strong>Scheduled Date & Slot:</strong> {selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}</div>
                  <div><strong>Current Status:</strong> <StatusBadge status={selectedAppointment.status} /></div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <strong>Reason for Visit:</strong>
                  <p className="text-slate-300 mt-1">{selectedAppointment.reason}</p>
                  {selectedAppointment.message && (
                    <p className="text-slate-400 mt-2 italic">"{selectedAppointment.message}"</p>
                  )}
                  {selectedAppointment.notes && (
                    <div className="mt-2 text-teal-300">
                      <strong>Admin Notes:</strong> {selectedAppointment.notes}
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Confirmed')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Completed')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Rejected')}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule / Edit Modal */}
        {editModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">
                  Reschedule / Edit: {selectedAppointment.appointmentId}
                </h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={rescheduleData.status}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={rescheduleData.appointmentDate}
                    onChange={(e) =>
                      setRescheduleData({ ...rescheduleData, appointmentDate: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Appointment Time</label>
                  <input
                    type="text"
                    value={rescheduleData.appointmentTime}
                    onChange={(e) =>
                      setRescheduleData({ ...rescheduleData, appointmentTime: e.target.value })
                    }
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Admin Notes / Prescription instructions</label>
                  <textarea
                    rows={2}
                    value={rescheduleData.notes}
                    onChange={(e) =>
                      setRescheduleData({ ...rescheduleData, notes: e.target.value })
                    }
                    placeholder="Add clinical instructions or notes..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
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
