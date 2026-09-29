import { HeartPulse, Phone, Mail, MapPin, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from '../../utils/router.js';
import { useHospital } from '../../context/HospitalContext.js';

export function Footer() {
  const { settings } = useHospital();
  const hospitalName = settings?.hospitalName || 'Jharna Clinic & Hospital';
  const hospitalPhone = settings?.phone || '+880 1711-000000';
  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';
  const email = settings?.email || 'contact@jharnaclinic.com';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac';
  const openingHours = settings?.openingHours || '24 Hours Emergency & Inpatient Care | OPD: 08:00 AM - 10:00 PM';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About Hospital */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">{hospitalName}</h3>
                <p className="text-teal-400 text-xs font-semibold">Jashore, Bangladesh</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.tagline || 'Compassionate Healthcare. Trusted by Your Community.'}{' '}
              Providing reliable medical care, modern diagnostic pathology, and dedicated patient-focused services in Jashore.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Certified Healthcare & 24/7 Clinical Support</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-3 border-teal-500 pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition">
                  Hospital Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition">
                  About Our Hospital
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition">
                  Specialist Doctors & Schedule
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition">
                  Clinical Services & Departments
                </Link>
              </li>
              <li>
                <Link to="/diagnostics" className="hover:text-teal-400 transition flex items-center justify-between">
                  <span>Diagnostic Tests & Packages</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.5 rounded">E-Shop</span>
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-teal-400 transition">
                  Hospital Facilities & Gallery
                </Link>
              </li>
              <li>
                <Link to="/patient-information" className="hover:text-teal-400 transition">
                  Patient & Attendant Guide
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-teal-400 font-semibold hover:underline">
                  Book an Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Emergency */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-3 border-rose-500 pl-3">
              Hours & Emergency
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl">
                <span className="text-xs font-semibold text-rose-300 block uppercase">
                  24/7 Emergency Helpline
                </span>
                <span className="text-base font-bold text-white mt-1 block">
                  {emergencyPhone}
                </span>
                <span className="text-xs text-rose-300/80">Immediate ambulance & trauma reception</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300 text-xs">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{openingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-3 border-cyan-500 pl-3">
              Hospital Location
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span className="text-slate-300 text-xs leading-relaxed">
                  {settings?.address || 'Jashore, Khulna Division, Bangladesh'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-300 text-xs">{hospitalPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-slate-300 text-xs">{email}</span>
              </div>
              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white font-semibold px-3 py-2 rounded-lg transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View on Google Maps
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left max-w-2xl leading-relaxed">
            <strong className="text-slate-400">Medical Notice:</strong> Information on this portal is provided for informational and appointment scheduling purposes. For acute clinical conditions, please seek immediate in-person hospital care.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span>© {new Date().getFullYear()} {hospitalName}. All rights reserved.</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-teal-400 transition font-medium">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
