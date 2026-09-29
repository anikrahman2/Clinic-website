import { useState } from 'react';
import {
  Calendar,
  Phone,
  Navigation,
  HeartPulse,
  Award,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight,
  UserCheck,
  ChevronRight,
  HelpCircle,
  Stethoscope,
  Microscope,
  Baby,
  Ambulance,
  ShoppingBag,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Link } from '../../utils/router.js';
import { useHospital } from '../../context/HospitalContext.js';
import { GoogleMapSection } from '../../components/public/GoogleMapSection.js';

export function Home() {
  const { settings, doctors, services } = useHospital();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac';

  const defaultFaqs = [
    {
      q: 'Where is Jharna Clinic & Hospital located in Jashore?',
      a: 'We are situated in Jashore, Khulna Division, Bangladesh. You can view our verified location on Google Maps or use the Get Directions button for GPS navigation directly to our emergency and patient entrance.',
    },
    {
      q: 'How do I book an in-person doctor appointment?',
      a: 'You can use the Book Appointment button on this portal, chat with our Jharna Care Assistant, or call our hospital reception. A unique reference code (e.g. JCH-2026-000123) is provided for verification.',
    },
    {
      q: 'Are 24-hour emergency and surgical facilities available?',
      a: 'Yes. Our 24/7 Emergency & Trauma Unit is continuously staffed with medical officers, observation beds, trauma triage, and round-the-clock diagnostic pathology.',
    },
    {
      q: 'What should patients bring during hospital admission?',
      a: 'Please bring past medical prescriptions, diagnostic test reports, national ID or birth certificate copy, and personal hygiene essentials. Our reception assists with room/cabin allotment.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                Trusted Healthcare in Jashore, Bangladesh
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Compassionate Healthcare.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  Trusted by Your Community.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                Quality medical care and patient-focused healthcare services in Jashore. Providing modern surgical care, dedicated maternal and child health, and 24/7 emergency response.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  Book Appointment
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/15 transition text-sm"
                >
                  <Phone className="w-4 h-4 text-teal-300" />
                  Contact Us
                </Link>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 font-semibold px-5 py-3.5 rounded-xl border border-teal-500/30 transition text-sm"
                >
                  <Navigation className="w-4 h-4 text-teal-300" />
                  Get Directions
                </a>
              </div>

              {/* Emergency Hotline callout */}
              <div className="pt-4 flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span>
                  Emergency Hotline:{' '}
                  <strong className="text-amber-300 font-bold">{emergencyPhone}</strong> (24/7 Immediate Admission)
                </span>
              </div>
            </div>

            {/* Right Card / Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-md p-2">
                <img
                  src={
                    settings?.website?.heroImage ||
                    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Jharna Clinic & Hospital Healthcare"
                  className="w-full h-72 sm:h-84 object-cover rounded-2xl"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/50 pb-3">
                    <span className="font-semibold text-teal-300">Jharna Clinic & Hospital</span>
                    <span>Jashore, Khulna Division</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-700/40 p-2.5 rounded-xl border border-slate-700/30">
                      <span className="text-slate-400 block">Consultation Days</span>
                      <span className="font-bold text-white">Sat – Fri (Daily)</span>
                    </div>
                    <div className="bg-slate-700/40 p-2.5 rounded-xl border border-slate-700/30">
                      <span className="text-slate-400 block">Emergency & OT</span>
                      <span className="font-bold text-emerald-400">24 Hours Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/appointment"
            className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition group duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                Book Appointment
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Schedule doctor consultations with instant tracking code.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-3">
              Book now <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/diagnostics"
            className="bg-white p-5 rounded-2xl shadow-lg border-2 border-teal-500/40 hover:border-teal-500 hover:shadow-xl transition group duration-200 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-2 right-2">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                E-Store
              </span>
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                Diagnostic Lab Tests
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Order tests & health packages online with Home Sample Collection.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-3">
              Browse catalog <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/doctors"
            className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition group duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                Find a Doctor
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Visiting hours, specialties, chamber schedules, and profiles.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-3">
              Browse physicians <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/services"
            className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition group duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                Medical Services
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gynecology, general surgery, medicine, imaging, and 24/7 care.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-3">
              Explore departments <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/contact"
            className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition group duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                Contact Hospital
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Location in Jashore, hotline, directions, and inquiry form.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-3">
              Get in touch <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* About Hospital Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                About Our Medical Center
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Dedicated to Serving the Families of Jashore
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Jharna Clinic & Hospital was established to deliver modern healthcare services to the residents of Jashore and adjacent areas. We combine clinical expertise with compassionate nursing and modern surgical facilities.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    Experienced Doctors
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Specialists in maternal health, surgery, medicine, and child health.
                  </p>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-xs">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    24/7 Response
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    On-call medical officers, emergency triage, and critical support.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-teal-700 font-bold hover:text-teal-800 text-sm"
                >
                  Read full hospital profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80"
                alt="Operating Theatre"
                className="w-full h-56 object-cover rounded-2xl shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                alt="Maternity Ward"
                className="w-full h-56 object-cover rounded-2xl shadow-md mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Services / Departments */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Activity className="w-3.5 h-3.5" />
                Departments & Clinical Care
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Medical Services
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Comprehensive inpatient and outpatient specialties supported by diagnostic imaging and pathology.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service._id}
                className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {service.department}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-2">{service.name}</h3>
                    <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-800"
                  >
                    Department details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Diagnostic Lab & E-Commerce Packages Showcase */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                E-Commerce Diagnostic Lab & Packages
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Order Diagnostic Tests Online.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  Home Sample Collection in Jashore.
                </span>
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                Book pathology tests, specialized hormone profiles, and comprehensive health checkup packages online with transparent pricing in BDT (৳). Enjoy doorstep phlebotomy or fast-track walk-in reporting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/diagnostics"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-teal-500/20 transition text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse All 30+ Tests
              </Link>
              <Link
                to="/diagnostics"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold px-4 py-3 rounded-xl border border-slate-700 transition text-xs"
              >
                Track Your Lab Report
              </Link>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/60 border border-slate-700/70 p-6 rounded-2xl backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Doorstep Home Collection</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Certified hospital phlebotomists arrive at your residence in Jashore with sterile vacutainer equipment. Free on orders above ৳2,000.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-6 rounded-2xl backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Same-Day Digital Reports</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Most routine hematology and biochemistry reports are verified by our clinical pathologists and available online within 3 to 6 hours.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-6 rounded-2xl backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Certified Diagnostic Accuracy</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calibrated Japanese and German automated analyzers with dual validation by qualified consultant pathologists and biochemists.
              </p>
            </div>
          </div>

          {/* Sample Popular Packages Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-800/90 border border-teal-500/40 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl hover:border-teal-400 transition">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-extrabold uppercase bg-teal-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Best Value
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  Comprehensive Checkup
                </span>
                <h4 className="font-extrabold text-white text-lg mt-1">
                  Executive Whole Body Package
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  CBC with ESR, Fasting Glucose, Lipid Profile, Liver Function (SGPT/SGOT), Kidney Function (Creatinine, Urea), Uric Acid, ECG & Urine R/E.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    45+ Parameters
                  </span>
                  <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                    10-12h Fasting
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">৳3,500</span>
                  <span className="text-xs text-slate-500 line-through ml-2">৳4,200</span>
                </div>
                <Link
                  to="/diagnostics"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1"
                >
                  Order Test <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-slate-600 transition">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Diabetes & Endocrine
                </span>
                <h4 className="font-extrabold text-white text-lg mt-1">
                  Fasting Glucose & HbA1c Profile
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Gold standard 3-month average plasma glucose monitoring with automated HPLC glycated hemoglobin analysis for accurate glycemic control.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    Same Day Report
                  </span>
                  <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                    10h Fasting
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">৳950</span>
                  <span className="text-xs text-slate-500 line-through ml-2">৳1,100</span>
                </div>
                <Link
                  to="/diagnostics"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1"
                >
                  Order Test <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-slate-600 transition">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Cardiology & Lipids
                </span>
                <h4 className="font-extrabold text-white text-lg mt-1">
                  Lipid Profile Comprehensive
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Total Cholesterol, HDL (good cholesterol), LDL (bad cholesterol), Triglycerides, and Cardiac Atherogenic Risk Ratio assessment.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    Blood (Serum)
                  </span>
                  <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                    12h Fasting
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">৳1,150</span>
                  <span className="text-xs text-slate-500 line-through ml-2">৳1,300</span>
                </div>
                <Link
                  to="/diagnostics"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1"
                >
                  Order Test <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Stethoscope className="w-3.5 h-3.5" />
                Consultant Specialists
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Medical Specialists
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Consult with our experienced physicians across gynecology, surgery, cardiology, and pediatrics.
              </p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              See all doctors & schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.slice(0, 3).map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-60 object-cover object-top"
                  />
                  <div className="p-6">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                      {doctor.specialty}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-3">{doctor.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{doctor.qualifications}</p>
                    <p className="text-xs text-slate-700 mt-2 font-semibold">{doctor.designation}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      <div>
                        <strong>Days:</strong> {doctor.consultationDays.join(', ')}
                      </div>
                      <div>
                        <strong>Time:</strong> {doctor.consultationTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl text-xs transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA Banner */}
      <section className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Need to see a specialist doctor at Jharna Clinic?
            </h3>
            <p className="text-teal-100 text-sm max-w-2xl">
              Submit your appointment request in advance to avoid waiting. Receive an immediate reference code for priority confirmation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/appointment"
              className="bg-white text-teal-900 hover:bg-teal-50 font-bold px-6 py-3.5 rounded-xl shadow-lg text-sm transition"
            >
              Book In-Person Visit
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/20 text-sm transition"
            >
              Contact Hospital Desk
            </Link>
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <GoogleMapSection />

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Patient & Visitor Information
            </h2>
          </div>

          <div className="space-y-3">
            {defaultFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-teal-600 transition transform ${
                      openFaqIndex === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
