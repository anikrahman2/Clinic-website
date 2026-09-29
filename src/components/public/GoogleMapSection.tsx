import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';

export function GoogleMapSection() {
  const { settings } = useHospital();
  const address = settings?.address || 'Jashore, Khulna Division, Bangladesh';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac';
  const hospitalPhone = settings?.phone || '+880 1711-000000';
  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Hospital Location & Directions
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Conveniently Located in Jashore
          </h2>
          <p className="mt-2 text-slate-600 text-base">
            Easily accessible with 24-hour patient admission, ambulance drive-in, and emergency triage entrance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card: Location details */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
                  Jharna Clinic & Hospital
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {address}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase block">Hours</span>
                    <span className="text-sm font-bold text-slate-800">
                      Emergency & Inpatient: 24/7 Open
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Outpatient Consultations: 08:00 AM - 10:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-rose-600 uppercase block">Emergency Dispatch</span>
                    <span className="text-sm font-bold text-slate-900">{emergencyPhone}</span>
                    <span className="text-xs text-slate-500 block">General Reception: {hospitalPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase block">Transport & Parking</span>
                    <span className="text-xs text-slate-600 leading-relaxed block">
                      Dedicated ambulance bay and convenient patient attendant parking at the main entrance.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition duration-200"
              >
                <Navigation className="w-4 h-4" />
                Get Directions on Google Maps
                <ExternalLink className="w-4 h-4 opacity-75" />
              </a>
            </div>
          </div>

          {/* Interactive / Static Map preview frame */}
          <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 min-h-[380px] relative group">
            <iframe
              title="Jharna Clinic Location Map"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117498.43575971445!2d89.15582963162788!3d23.16782293414924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff108b26f58223%3A0xc3b839632eb51833!2sJashore%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd"
              className="w-full h-full"
            />
            {/* Overlay quick button */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Jharna Clinic & Hospital, Jashore</span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline font-bold hover:text-teal-900"
              >
                Open App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
