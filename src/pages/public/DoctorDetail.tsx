import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Award,
  ChevronLeft,
  CheckCircle,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useRouter, Link } from '../../utils/router.js';
import { useHospital } from '../../context/HospitalContext.js';
import type { Doctor } from '../../types/index.js';
import { api } from '../../services/api.js';

export function DoctorDetail() {
  const { path } = useRouter();
  const { doctors } = useHospital();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract ID from pathname: /doctors/:id
  const doctorId = path.split('/doctors/')[1]?.split('?')[0];

  useEffect(() => {
    if (!doctorId) return;

    // Check in context first
    const found = doctors.find((d) => d._id === doctorId);
    if (found) {
      setDoctor(found);
      setLoading(false);
      return;
    }

    // Fetch from backend
    api
      .getDoctorById(doctorId)
      .then((res) => {
        if (res.success && res.data) {
          setDoctor(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [doctorId, doctors]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The physician profile you are looking for is currently unavailable or has been updated.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 mt-5 bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Doctors
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Left Photo & Quick Schedule Card */}
            <div className="md:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-full h-80 object-cover object-top"
                />
              </div>

              <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-teal-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  Consultation Schedule
                </h4>
                <div className="space-y-2 text-xs text-teal-900/90">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-teal-950 font-semibold">Visiting Days:</strong>
                      <span>{doctor.consultationDays.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-teal-950 font-semibold">Chamber Timing:</strong>
                      <span>{doctor.consultationTime}</span>
                    </div>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-start gap-2 pt-1 border-t border-teal-200/60">
                      <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-teal-950 font-semibold">Doctor Serial/Phone:</strong>
                        <span>{doctor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    to={`/appointment?doctor=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(doctor.specialty)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    Book In-Person Appointment
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
                  {doctor.specialty}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                  {doctor.name}
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">{doctor.qualifications}</p>
                <p className="text-sm font-bold text-teal-700 mt-2">{doctor.designation}</p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>Clinical Experience: <strong>{doctor.experience}</strong></span>
                </div>
              </div>

              {/* Biography */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Professional Biography</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {doctor.bio ||
                    `${doctor.name} is a dedicated medical specialist serving at Jharna Clinic & Hospital in Jashore. Providing comprehensive diagnostic evaluations, patient-centric treatment plans, and continuous clinical care.`}
                </p>
              </div>

              {/* Patient Care Highlights */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Patient Care Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>In-depth physical evaluation</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Post-consultation follow-up</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Automated diagnostic coordination</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Patient privacy guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
