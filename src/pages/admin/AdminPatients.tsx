import { useState, useEffect, useMemo } from 'react';
import { Users, Search, Phone, Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { StatusBadge } from '../../components/admin/StatusBadge.js';
import type { Appointment } from '../../types/index.js';

interface PatientSummary {
  patientName: string;
  phone: string;
  age: number;
  gender: string;
  totalVisits: number;
  lastVisitDate: string;
  appointments: Appointment[];
}

export function AdminPatients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  useEffect(() => {
    api
      .getAppointments({ limit: 200 })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setAppointments(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate appointments by patient phone or name
  const patients = useMemo(() => {
    const map: Record<string, PatientSummary> = {};

    appointments.forEach((app) => {
      const key = (app.phone || app.patientName).trim();
      if (!map[key]) {
        map[key] = {
          patientName: app.patientName,
          phone: app.phone,
          age: app.age,
          gender: app.gender,
          totalVisits: 0,
          lastVisitDate: app.appointmentDate,
          appointments: [],
        };
      }
      map[key].totalVisits += 1;
      map[key].appointments.push(app);

      if (new Date(app.appointmentDate) > new Date(map[key].lastVisitDate)) {
        map[key].lastVisitDate = app.appointmentDate;
      }
    });

    return Object.values(map);
  }, [appointments]);

  const filteredPatients = patients.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <AdminLayout title="Patient Directory & Consultation Records">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or phone..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            Total Unique Patients: <strong className="text-white">{patients.length}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Patients List Table */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Total Visits</th>
                    <th className="p-4">Last Visit</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        Loading patients...
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr
                        key={p.phone || p.patientName}
                        onClick={() => setSelectedPatient(p)}
                        className={`hover:bg-slate-900/50 cursor-pointer transition ${
                          selectedPatient?.phone === p.phone ? 'bg-slate-900/80' : ''
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-white block">{p.patientName}</span>
                          <span className="text-[10px] text-slate-400">
                            {p.age} yrs • {p.gender}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">{p.phone}</td>
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-400 font-bold border border-teal-800/60 text-[10px]">
                            {p.totalVisits} appointment{p.totalVisits > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-400">
                          {p.lastVisitDate}
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-teal-400 font-semibold inline-flex items-center gap-0.5">
                            Details <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Details & Visit History Card */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-teal-400" />
              Patient Consultation History
            </h3>

            {selectedPatient ? (
              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white text-sm">{selectedPatient.patientName}</div>
                  <div className="text-slate-400">
                    {selectedPatient.age} years old • {selectedPatient.gender}
                  </div>
                  <div className="text-teal-400 font-mono pt-1">
                    Contact: {selectedPatient.phone}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">
                    Appointment Records ({selectedPatient.appointments.length})
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {selectedPatient.appointments.map((app) => (
                      <div
                        key={app._id}
                        className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-teal-400 font-bold">
                            {app.appointmentId}
                          </span>
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="text-white font-medium">{app.doctor}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.appointmentDate} at {app.appointmentTime}
                        </div>
                        <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg mt-1">
                          <strong>Reason:</strong> {app.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select a patient from the directory to review their visit history.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
