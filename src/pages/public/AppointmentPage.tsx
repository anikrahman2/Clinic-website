import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';

export function AppointmentPage() {
  const { doctors, services, settings } = useHospital();
  const { showToast } = useToast();

  // Parse URL query params if preselected: ?doctor=...&department=...
  const urlParams = new URLSearchParams(window.location.search);
  const initialDoctor = urlParams.get('doctor') || '';
  const initialDept = urlParams.get('department') || '';

  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    department: initialDept || 'Gynecology & Obstetrics',
    doctor: initialDoctor || '',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '10:00 AM',
    reason: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    appointmentId: string;
    patientName: string;
    doctor: string;
    appointmentDate: string;
    appointmentTime: string;
  } | null>(null);

  // Tracking existing appointment state
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [copied, setCopied] = useState(false);

  // Set default doctor when department changes or doctors load
  useEffect(() => {
    if (doctors.length > 0 && !formData.doctor) {
      if (initialDoctor) {
        setFormData((prev) => ({ ...prev, doctor: initialDoctor }));
      } else {
        const matchingDoc = doctors.find((d) => d.specialty.includes(formData.department));
        setFormData((prev) => ({
          ...prev,
          doctor: matchingDoc ? matchingDoc.name : doctors[0].name,
        }));
      }
    }
  }, [doctors, formData.department, initialDoctor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone || !formData.age || !formData.doctor || !formData.reason) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createAppointment({
        ...formData,
        age: Number(formData.age),
      });

      if (res.success && res.appointmentId) {
        setSubmissionResult({
          appointmentId: res.appointmentId,
          patientName: formData.patientName,
          doctor: formData.doctor,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
        });
        showToast('Your appointment request has been received.', 'success');
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit appointment request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.getAppointmentById(trackingId.trim());
      if (res.success && res.data) {
        setTrackingResult(res.data);
      } else {
        setTrackingError('No appointment found matching this reference code.');
      }
    } catch (err: any) {
      setTrackingError(err.message || 'Appointment reference not found. Please verify the code.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Appointment ID copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Online Consultation Booking
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Book an In-Person Appointment
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Submit your appointment request with our specialist doctors at Jharna Clinic & Hospital. Receive an immediate reference code and direct reception confirmation.
          </p>
        </div>

        {/* Success Confirmation State */}
        {submissionResult ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-teal-200 text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Request Registered Successfully
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Your appointment request has been received.
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Thank you, <strong>{submissionResult.patientName}</strong>. Our hospital reception desk will contact you to verify your slot. Please save your reference tracking code:
              </p>
            </div>

            {/* Tracking ID Badge */}
            <div className="max-w-md mx-auto bg-slate-50 border-2 border-teal-300 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase">
                  Appointment Tracking ID
                </span>
                <span className="text-2xl font-mono font-extrabold text-teal-800">
                  {submissionResult.appointmentId}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(submissionResult.appointmentId)}
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy ID'}
              </button>
            </div>

            <div className="max-w-md mx-auto text-left bg-teal-50/50 p-4 rounded-xl border border-teal-100 text-xs text-slate-700 space-y-1">
              <div><strong>Doctor:</strong> {submissionResult.doctor}</div>
              <div><strong>Scheduled Date:</strong> {submissionResult.appointmentDate}</div>
              <div><strong>Preferred Slot:</strong> {submissionResult.appointmentTime}</div>
              <div><strong>Hospital:</strong> Jharna Clinic & Hospital, Jashore</div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setFormData({
                    patientName: '',
                    phone: '',
                    email: '',
                    age: '',
                    gender: 'Male',
                    department: 'Gynecology & Obstetrics',
                    doctor: doctors[0]?.name || '',
                    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    appointmentTime: '10:00 AM',
                    reason: '',
                    message: '',
                  });
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Patient & Consultation Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form accurately. Asterisk (*) denotes required fields.
                  </p>
                </div>

                {/* Patient Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="e.g. Mohammad Rahim"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (BD) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 01711-XXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                {/* Email, Age, Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patient@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 35"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Department & Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Department / Specialty *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        const matchingDoc = doctors.find((d) => d.specialty.includes(newDept));
                        setFormData({
                          ...formData,
                          department: newDept,
                          doctor: matchingDoc ? matchingDoc.name : formData.doctor,
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    >
                      {services.map((s) => (
                        <option key={s._id} value={s.department}>
                          {s.department}
                        </option>
                      ))}
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Doctor *
                    </label>
                    <select
                      required
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    >
                      {doctors.map((d) => (
                        <option key={d._id} value={d.name}>
                          {d.name} ({d.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Consultation Time *
                    </label>
                    <select
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    >
                      <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                      <option value="10:30 AM - 12:00 PM">10:30 AM - 12:00 PM</option>
                      <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                      <option value="05:30 PM - 07:00 PM">05:30 PM - 07:00 PM</option>
                      <option value="07:00 PM - 08:30 PM">07:00 PM - 08:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Reason for Visit / Symptoms *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g. Antenatal checkup, chest pain follow-up, abdominal pain evaluation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Additional Message or Medical History (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any previous prescriptions, known allergies, or special physical assistance needed..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    {submitting ? 'Registering Appointment...' : 'Submit Appointment Request'}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Our team in Jashore will contact you shortly to confirm your booking.
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar Column: Tracking & Assistance */}
            <div className="lg:col-span-4 space-y-6">
              {/* Lookup Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-teal-600" />
                  Track Existing Request
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Already registered? Enter your appointment ID (e.g. JCH-2026-000101) to verify status.
                </p>

                <form onSubmit={handleTrackAppointment} className="space-y-3">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="JCH-2026-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-teal-600 outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading || !trackingId.trim()}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-xl transition"
                  >
                    {trackingLoading ? 'Checking...' : 'Check Status'}
                  </button>
                </form>

                {trackingError && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{trackingError}</span>
                  </div>
                )}

                {trackingResult && (
                  <div className="mt-4 p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-teal-200 pb-1.5">
                      <span className="font-bold text-teal-900">{trackingResult.appointmentId}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          trackingResult.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trackingResult.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {trackingResult.status}
                      </span>
                    </div>
                    <div><strong>Patient:</strong> {trackingResult.patientName}</div>
                    <div><strong>Doctor:</strong> {trackingResult.doctor}</div>
                    <div><strong>Date & Time:</strong> {trackingResult.appointmentDate} at {trackingResult.appointmentTime}</div>
                  </div>
                )}
              </div>

              {/* Fast Phone Assistance */}
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 text-white space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600/50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-300" />
                </div>
                <h4 className="font-bold text-base">Direct Phone Booking</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prefer speaking with reception? Call our appointment desk directly to find the earliest slot.
                </p>
                <div className="pt-2 text-sm font-bold text-teal-300">
                  {settings?.phone || '+880 1711-000000'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Reception hours: 08:00 AM - 10:00 PM Daily
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
