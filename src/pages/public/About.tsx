import { ShieldCheck, Target, Heart, Award, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { Link } from '../../utils/router.js';

export function About() {
  const { settings } = useHospital();
  const address = settings?.address || 'Jashore, Khulna Division, Bangladesh';

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            About Jharna Clinic & Hospital
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Dedicated Healthcare Excellence in Jashore
          </h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Founded with a commitment to providing dependable, modern, and compassionate medical care for the community of Jashore and greater South-Western Bangladesh.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Clinical Mission</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              To deliver patient-centered, ethical medical treatments through experienced physicians, modern diagnostic pathology, sterile surgical suites, and round-the-clock emergency support at affordable costs.
            </p>
            <ul className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                Evidence-based maternal and child healthcare.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                Prompt 24/7 trauma triage and acute observation.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                Continuous quality enhancement and strict hospital hygiene.
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Hospital Vision</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              To be the most trusted and preferred community healthcare institution in Jashore, recognized for clinical excellence, professional nursing, transparency, and compassionate patient care.
            </p>
            <ul className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Modern laparoscopic and surgical advancements.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Accurate diagnostic imaging and rapid report turnaround.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Community wellness and preventive medical programs.
              </li>
            </ul>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Clinical Pillars</h2>
            <p className="text-slate-600 text-sm mt-2">
              The standards that govern everyday medical care at Jharna Clinic & Hospital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Ethical & Transparent</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear communication regarding diagnoses, treatment options, procedural costs, and inpatient care plans with zero hidden fees.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Infection Control</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sterile modular operation theatres, biomedical waste disposal, and strict hygiene protocols to safeguard patients from hospital-acquired infections.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-lg">Modern Diagnostics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated clinical pathology, digital X-Ray, and 4D ultrasonography operated by certified technicians and verified by radiologists.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Contact CTA */}
        <div className="bg-teal-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Visit Us in Jashore</h3>
            <p className="text-teal-200 text-sm mt-1 max-w-xl">
              {address}. Our reception desk is open daily to assist patients with doctor consultations and diagnostic testing.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/appointment"
              className="bg-white text-teal-900 font-bold px-5 py-3 rounded-xl text-sm hover:bg-teal-50 transition"
            >
              Book Consultation
            </Link>
            <Link
              to="/contact"
              className="bg-teal-800 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition border border-teal-700"
            >
              Contact Hospital
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
