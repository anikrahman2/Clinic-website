import {
  Clock,
  FileText,
  AlertCircle,
  ShieldCheck,
  Ambulance,
  HeartHandshake,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.js';
import { Link } from '../../utils/router.js';

export function PatientInformation() {
  const { settings } = useHospital();
  const hospitalPhone = settings?.phone || '+880 1711-000000';
  const emergencyPhone = settings?.emergencyPhone || '[Emergency Number]';

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Patient & Attendant Guidance
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Patient Information & Hospital Guidelines
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Essential guidelines for hospital admissions, inpatient visiting hours, diagnostic report delivery, and patient rights at Jharna Clinic & Hospital.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Visiting Hours */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Inpatient Visiting Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To support patient rest and minimize infection risk, visitor access to inpatient wards and cabins is structured as follows:
            </p>
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <strong>Morning Visiting Slot:</strong>
                <span>11:00 AM – 01:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <strong>Evening Visiting Slot:</strong>
                <span>05:00 PM – 07:00 PM</span>
              </div>
              <div className="flex justify-between">
                <strong>Primary Attendant Pass:</strong>
                <span>1 Attendant Allowed 24/7</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Children under 10 years are advised not to enter intensive clinical zones for their safety.
            </p>
          </div>

          {/* Card 2: Admission Process */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Hospital Admission Checklist</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When admitted for surgery, maternity, or general observation, please have the following items:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Physician referral slip / prescription.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Previous diagnostic test reports and medical records.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                National ID / Passport or Birth Certificate copy.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                Personal clothing and toiletries for the patient.
              </li>
            </ul>
          </div>

          {/* Card 3: Discharge & Billing */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Discharge & Discharge Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discharges are processed after daily consultant morning rounds:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                Comprehensive discharge summary with home medicine schedule.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                Transparent itemized billing generated at the billing counter.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                Follow-up appointment date and post-operative instructions.
              </li>
            </ul>
          </div>

          {/* Card 4: 24/7 Ambulance & Emergency Transfer */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Ambulance className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">24/7 Ambulance & Emergency Transfer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with basic life support, oxygen cylinders, and stretcher facilities for transport across Jashore:
            </p>
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs space-y-1.5 text-rose-950">
              <div><strong>Emergency Dispatch:</strong> {emergencyPhone}</div>
              <div><strong>General Reception:</strong> {hospitalPhone}</div>
              <div className="text-[11px] text-rose-800">
                Call immediately for home pickup or inter-hospital transfer.
              </div>
            </div>
          </div>
        </div>

        {/* Patient Rights Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Patient Rights & Responsibilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-teal-800">Your Rights</h4>
              <ul className="space-y-2">
                <li>• Respectful, nondiscriminatory care regardless of background.</li>
                <li>• Full disclosure of your clinical diagnosis and treatment options.</li>
                <li>• Complete confidentiality of your medical records.</li>
                <li>• An itemized, transparent explanation of all hospital charges.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-teal-800">Your Responsibilities</h4>
              <ul className="space-y-2">
                <li>• Provide accurate medical history and allergy information.</li>
                <li>• Follow the physician's prescribed care instructions.</li>
                <li>• Respect hospital quiet hours and staff safety guidelines.</li>
                <li>• Refrain from smoking or creating noise inside patient zones.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
