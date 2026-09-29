import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, Phone, Award, Stethoscope, ChevronRight } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { Link } from '../../utils/router.js';

export function Doctors() {
  const { doctors, loading } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Specialties
  const specialties = useMemo(() => {
    const list = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));
    return ['All', ...list];
  }, [doctors]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDoctors.slice(start, start + itemsPerPage);
  }, [filteredDoctors, currentPage, itemsPerPage]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            Medical Faculty & Consultants
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Consultant Physicians & Surgeons
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Find specialist doctors available at Jharna Clinic & Hospital, Jashore. Check consultation days, timing, and reserve your appointment slot online.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by doctor name, specialty, degree..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 transition"
            />
          </div>

          {/* Specialty Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline-block" />
            <div className="flex gap-1.5 flex-wrap">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    setCurrentPage(1);
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    selectedSpecialty === spec
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : paginatedDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search or selecting a different specialty.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All');
              }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-teal-800 shadow-xs border border-teal-100">
                      {doctor.experience}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                      {doctor.specialty}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xl mt-3">{doctor.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{doctor.qualifications}</p>
                    <p className="text-xs text-slate-800 font-semibold mt-2">{doctor.designation}</p>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {doctor.bio}
                    </p>

                    {/* Schedule block */}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-1.5 bg-slate-50/80 p-3 rounded-xl">
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Visiting Days:</strong> {doctor.consultationDays.join(', ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <div>
                          <strong>Time:</strong> {doctor.consultationTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-2">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/appointment?doctor=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(doctor.specialty)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Visit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(idx + 1);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                  currentPage === idx + 1
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
