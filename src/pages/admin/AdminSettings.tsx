import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, MapPin, Phone, Mail, Globe, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { useHospital } from '../../context/HospitalContext.js';

export function AdminSettings() {
  const { settings, refreshSettings } = useHospital();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    hospitalName: '',
    tagline: '',
    address: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    googleMapsUrl: '',
    openingHours: '',
    notice: '',
    socialMedia: {
      facebook: '',
      youtube: '',
      whatsapp: '',
    },
    website: {
      logo: '',
      heroImage: '',
      metaTitle: '',
      metaDescription: '',
    },
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        hospitalName: settings.hospitalName || 'Jharna Clinic & Hospital',
        tagline: settings.tagline || 'Compassionate Healthcare. Trusted by Your Community.',
        address: settings.address || 'Jashore, Khulna Division, Bangladesh',
        phone: settings.phone || '+880 1711-000000',
        emergencyPhone: settings.emergencyPhone || '[Emergency Number]',
        email: settings.email || 'contact@jharnaclinic.com',
        googleMapsUrl: settings.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac',
        openingHours: settings.openingHours || '24 Hours Emergency & Inpatient Care | OPD: 08:00 AM - 10:00 PM',
        notice: settings.notice || '',
        socialMedia: {
          facebook: settings.socialMedia?.facebook || '',
          youtube: settings.socialMedia?.youtube || '',
          whatsapp: settings.socialMedia?.whatsapp || '',
        },
        website: {
          logo: settings.website?.logo || '',
          heroImage: settings.website?.heroImage || '',
          metaTitle: settings.website?.metaTitle || '',
          metaDescription: settings.website?.metaDescription || '',
        },
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(formData);
      if (res.success) {
        showToast('Hospital settings saved and updated across website!', 'success');
        refreshSettings();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Hospital Information & Website Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-teal-950/40 border border-teal-800/40 p-4 rounded-2xl flex items-center gap-3 text-xs text-teal-200">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <span>
            Changes saved here automatically update all public pages, banners, contact cards, footer, and the AI chatbot in real-time.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Core Hospital Information */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-400" />
              Hospital Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-300 block mb-1">Full Physical Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-slate-300 block mb-1">Google Maps Verified URL *</label>
              <input
                type="url"
                required
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Google Maps reference: https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac
              </span>
            </div>
          </div>

          {/* Card 2: Contact & Emergency Helpline */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              Contact & 24/7 Emergency Helplines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  24/7 Emergency Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="[Emergency Number] or real hotline"
                  className="w-full bg-slate-900 border border-rose-900/60 rounded-lg p-2.5 text-amber-300 font-bold outline-none focus:ring-1 focus:ring-rose-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Displayed in top emergency banner and triage calls.
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  General Hospital Reception Phone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1711-000000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Hospital Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Operating Hours Notice</label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Website Visuals & Socials */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Website Appearance & Media
            </h3>

            <div className="text-xs">
              <label className="font-semibold text-slate-300 block mb-1">Homepage Hero Image URL</label>
              <input
                type="url"
                value={formData.website.heroImage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    website: { ...formData.website, heroImage: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Meta SEO Title</label>
                <input
                  type="text"
                  value={formData.website.metaTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website: { ...formData.website, metaTitle: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Facebook Page URL</label>
                <input
                  type="url"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Hospital Settings...' : 'Save & Publish Hospital Information'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
