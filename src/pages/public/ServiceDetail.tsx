import { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  ChevronLeft,
  CheckCircle,
  Clock,
  Phone,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';
import { useRouter, Link } from '../../utils/router.js';
import { useHospital } from '../../context/HospitalContext.js';
import type { Service } from '../../types/index.js';
import { api } from '../../services/api.js';

export function ServiceDetail() {
  const { path } = useRouter();
  const { services, doctors } = useHospital();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract slug from URL: /services/:slug
  const slug = path.split('/services/')[1]?.split('?')[0];

  useEffect(() => {
    if (!slug) return;

    // Check context first
    const found = services.find((s) => s.slug === slug || s._id === slug);
    if (found) {
      setService(found);
      setLoading(false);
      return;
    }

    // Fetch from backend
    api
      .getServiceByIdOrSlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setService(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, services]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The medical department or clinical service you requested could not be found.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 mt-5 bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>
    );
  }

  // Related doctors for this department
  const relatedDoctors = doctors.filter(
    (d) =>
      d.specialty.toLowerCase().includes(service.department.toLowerCase()) ||
      service.name.toLowerCase().includes(d.specialty.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Services
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header image banner */}
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-6 sm:p-10">
              <div className="text-white space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-teal-600/90 text-white px-3 py-1 rounded-full border border-teal-400/40">
                  {service.department}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {service.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                  Jharna Clinic & Hospital, Jashore • Advanced clinical facilities and dedicated specialist care.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Service Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Department Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <ShieldCheck className="w-5 h-5 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Sterile Protocols</h4>
                <p className="text-xs text-slate-500 mt-1">
                  High-level disinfection and sterilization of all equipment.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <Clock className="w-5 h-5 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Fast Turnaround</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Prompt admission, scheduled surgeries, and verified reports.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <HeartPulse className="w-5 h-5 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Compassionate Care</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Attentive nursing staff and dedicated resident duty officers.
                </p>
              </div>
            </div>

            {/* Associated Doctors in this Department */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Specialist Physicians in {service.department}
              </h3>

              {relatedDoctors.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                  <span>General physicians and on-call surgeons manage this department daily.</span>
                  <Link
                    to="/appointment"
                    className="font-bold text-teal-700 hover:underline"
                  >
                    Book General Consultation
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      className="border border-slate-200 rounded-xl p-4 flex gap-4 items-center bg-white shadow-xs hover:border-teal-400 transition"
                    >
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{doc.qualifications}</p>
                        <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                          {doc.consultationDays.slice(0, 3).join(', ')} • {doc.consultationTime}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Link
                            to={`/doctors/${doc._id}`}
                            className="text-[11px] font-bold text-slate-700 hover:text-teal-700"
                          >
                            Profile
                          </Link>
                          <span className="text-slate-300">|</span>
                          <Link
                            to={`/appointment?doctor=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(doc.specialty)}`}
                            className="text-[11px] font-bold text-teal-700 hover:underline"
                          >
                            Book Visit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Booking CTA */}
            <div className="bg-gradient-to-r from-teal-800 to-cyan-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Schedule an In-Person Consultation</h4>
                <p className="text-xs text-teal-100 mt-1">
                  Choose your preferred doctor or let our hospital team assign the right specialist.
                </p>
              </div>
              <Link
                to={`/appointment?department=${encodeURIComponent(service.department)}`}
                className="bg-white text-teal-900 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-teal-50 transition shadow-md shrink-0"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
