import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Activity,
  MessageSquare,
  Bot,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { StatusBadge } from '../../components/admin/StatusBadge.js';
import { api } from '../../services/api.js';
import type { DashboardStats } from '../../types/index.js';
import { Link } from '../../utils/router.js';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Hospital Operations Overview">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top greeting & refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Hospital Metrics & Activity
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time appointments, doctor workload, inquiries, and automated chatbot metrics.
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="self-start inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* 8 Metric KPI Cards */}
        {loading && !stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-28 bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Appointments */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Total Appointments</span>
                <Calendar className="w-4 h-4 text-teal-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stats?.summary.totalAppointments ?? 0}
                </span>
                <span className="text-[11px] text-teal-400 block mt-1">All time registrations</span>
              </div>
            </div>

            {/* 2. Pending */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Pending Requests</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {stats?.summary.pendingAppointments ?? 0}
                </span>
                <span className="text-[11px] text-amber-400/80 block mt-1">Needs confirmation</span>
              </div>
            </div>

            {/* 3. Confirmed */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Confirmed Visits</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {stats?.summary.confirmedAppointments ?? 0}
                </span>
                <span className="text-[11px] text-emerald-400/80 block mt-1">Ready for consultation</span>
              </div>
            </div>

            {/* 4. Completed */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Completed Visits</span>
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                  {stats?.summary.completedAppointments ?? 0}
                </span>
                <span className="text-[11px] text-blue-400/80 block mt-1">Consultation fulfilled</span>
              </div>
            </div>

            {/* 5. Total Doctors */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Hospital Doctors</span>
                <UserCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stats?.summary.totalDoctors ?? 0}
                </span>
                <span className="text-[11px] text-cyan-400 block mt-1">
                  {stats?.summary.activeDoctors ?? 0} actively taking visits
                </span>
              </div>
            </div>

            {/* 6. Total Services */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Departments & Care</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stats?.summary.totalServices ?? 0}
                </span>
                <span className="text-[11px] text-indigo-400 block mt-1">Specialized clinical wings</span>
              </div>
            </div>

            {/* 7. Inquiries */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">New Inquiries</span>
                <MessageSquare className="w-4 h-4 text-rose-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
                  {stats?.summary.newInquiries ?? 0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  of {stats?.summary.totalInquiries ?? 0} total messages
                </span>
              </div>
            </div>

            {/* 8. Chat Conversations */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Chat Assistant Logs</span>
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-300">
                  {stats?.summary.totalConversations ?? 0}
                </span>
                <span className="text-[11px] text-purple-400 block mt-1">Patient interactions</span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Status Distribution */}
          <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="font-bold text-white text-sm">Appointment Status Breakdown</h3>
            <div className="space-y-3 pt-2">
              {stats?.charts?.statusCounts &&
                Object.entries(stats.charts.statusCounts).map(([status, count]) => {
                  const total = stats.summary.totalAppointments || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{status}</span>
                        <span className="text-slate-400 font-bold">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'Confirmed'
                              ? 'bg-emerald-500'
                              : status === 'Pending'
                              ? 'bg-amber-500'
                              : status === 'Completed'
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Chart 2: Popular Departments */}
          <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="font-bold text-white text-sm">Appointments by Department</h3>
            <div className="space-y-3 pt-2">
              {stats?.charts?.popularDepartments && stats.charts.popularDepartments.length > 0 ? (
                stats.charts.popularDepartments.slice(0, 5).map((dept) => {
                  const max = stats.charts.popularDepartments[0]?.count || 1;
                  const pct = Math.round((dept.count / max) * 100);
                  return (
                    <div key={dept.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium truncate max-w-[180px]">
                          {dept.name}
                        </span>
                        <span className="text-teal-400 font-bold">{dept.count}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">No department activity yet.</div>
              )}
            </div>
          </div>

          {/* Chart 3: Appointments by Day/Month */}
          <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="font-bold text-white text-sm">Monthly Trend</h3>
            <div className="space-y-3 pt-2">
              {stats?.charts?.appointmentsByMonth && stats.charts.appointmentsByMonth.length > 0 ? (
                stats.charts.appointmentsByMonth.map((m) => {
                  const max = Math.max(...stats.charts.appointmentsByMonth.map((x) => x.count), 1);
                  const pct = Math.round((m.count / max) * 100);
                  return (
                    <div key={m.month} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{m.month}</span>
                        <span className="text-cyan-400 font-bold">{m.count} visits</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">Trend data updating...</div>
              )}
            </div>
          </div>
        </div>

        {/* Tables: Recent Appointments & Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Recent Appointments</h3>
              <Link
                to="/admin/appointments"
                className="text-xs text-teal-400 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-lg">ID / Patient</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                    stats.recentAppointments.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-900/40">
                        <td className="p-3">
                          <span className="font-mono text-teal-400 font-bold block text-[11px]">
                            {app.appointmentId}
                          </span>
                          <span className="font-semibold text-white">{app.patientName}</span>
                        </td>
                        <td className="p-3 truncate max-w-[140px] text-slate-300">{app.doctor}</td>
                        <td className="p-3 whitespace-nowrap text-slate-400">
                          {app.appointmentDate}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-6 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Recent Patient Messages</h3>
              <Link
                to="/admin/messages"
                className="text-xs text-teal-400 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
                stats.recentInquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{inq.name}</span>
                      <StatusBadge status={inq.status} />
                    </div>
                    <p className="text-[11px] text-teal-300 font-medium truncate">{inq.subject}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{inq.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-6 text-center">No messages yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
