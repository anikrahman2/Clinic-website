import { PhoneCall, AlertTriangle, MapPin } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';

export function EmergencyBanner() {
  const { settings } = useHospital();
  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac';

  return (
    <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white text-xs sm:text-sm py-2 px-4 shadow-sm border-b border-rose-950/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-300"></span>
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong className="font-semibold text-rose-100">24/7 Emergency & Ambulance Service:</strong>{' '}
            <span className="underline decoration-dotted font-bold text-amber-200">{emergencyPhone}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium ml-auto">
          <span className="hidden md:inline-block text-rose-200">
            Centrally Located in Jashore • 24 Hours Triage & Observation
          </span>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded text-white transition text-xs font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-300" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
