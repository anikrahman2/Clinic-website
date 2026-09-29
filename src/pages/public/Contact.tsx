import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../services/api.js';

export function Contact() {
  const { settings } = useHospital();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const address = settings?.address || 'Jashore, Khulna Division, Bangladesh';
  const hospitalPhone = settings?.phone || '+880 1711-000000';
  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';
  const email = settings?.email || 'contact@jharnaclinic.com';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac';
  const openingHours = settings?.openingHours || '24 Hours Emergency & Inpatient Care | OPD: 08:00 AM - 10:00 PM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createInquiry(formData);
      if (res.success) {
        setSubmitted(true);
        showToast('Your message has been sent to our hospital desk.', 'success');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            Direct Communication
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Jharna Clinic & Hospital
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Have questions regarding diagnostic tests, hospital admissions, or doctor schedules? Reach out to our hospital administration desk in Jashore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hospital Contact Details & Emergency */}
          <div className="lg:col-span-5 space-y-6">
            {/* 24/7 Emergency Box */}
            <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-rose-950/40 space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-amber-300" />
                <h3 className="font-extrabold text-xl">24/7 Emergency Hotline</h3>
              </div>
              <p className="text-xs text-rose-100 leading-relaxed">
                For acute trauma, cardiac emergencies, delivery emergencies, or ambulance dispatch across Jashore:
              </p>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-amber-200 block uppercase font-semibold">Immediate Helpline:</span>
                <span className="text-2xl font-bold tracking-tight text-white mt-1 block">
                  {emergencyPhone}
                </span>
                <span className="text-[11px] text-rose-200 block mt-1">
                  On-call medical officers & observation beds ready 24 hours.
                </span>
              </div>
            </div>

            {/* General Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Hospital Information
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs font-semibold">Address</strong>
                    <span className="text-slate-600">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs font-semibold">Reception & Inquiries</strong>
                    <span className="text-slate-600">{hospitalPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs font-semibold">Official Email</strong>
                    <span className="text-slate-600">{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-xs font-semibold">Operating Schedule</strong>
                    <span className="text-slate-600">{openingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Send an Inquiry to Hospital Desk
            </h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              Our patient relations team will review your message and reply via phone or email.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Message Received!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out to Jharna Clinic & Hospital. Our administrative desk will get in touch shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-teal-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anisur Rahman"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Surgery Package, Cabin Availability"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or question in detail..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800 outline-none transition resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending Message...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
