import { useState } from 'react';
import { Activity, ArrowRight, ChevronRight, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { Link } from '../../utils/router.js';

export function Services() {
  const { services, loading } = useHospital();
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', ...Array.from(new Set(services.map((s) => s.department).filter(Boolean)))];

  const filteredServices = selectedDept === 'All'
    ? services
    : services.filter((s) => s.department === selectedDept);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            Clinical Excellence
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Departments & Hospital Services
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            From modern laparoscopic surgery and maternal care to 24-hour trauma triage and automated pathology, explore our specialized medical capabilities in Jashore.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                selectedDept === dept
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 uppercase tracking-wider">
                      {service.department}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xl mt-3">{service.name}</h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    View details & specialists <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/appointment?department=${encodeURIComponent(service.department)}`}
                    className="text-xs font-semibold bg-teal-50 text-teal-800 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
