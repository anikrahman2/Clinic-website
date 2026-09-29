import { GoogleGenAI } from '@google/genai';
import {
  DoctorModel,
  ServiceModel,
  FacilityModel,
  SettingsModel,
  FAQModel,
  DiagnosticTestModel,
} from '../models/index.js';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private static getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  /**
   * Dynamically fetch live hospital knowledge from the database to inject into context
   */
  public static async getHospitalContext(): Promise<string> {
    const [settingsList, doctors, services, facilities, faqs, diagnosticTests] = await Promise.all([
      SettingsModel.find(),
      DoctorModel.find({ active: true }),
      ServiceModel.find({ active: true }),
      FacilityModel.find({ active: true }),
      FAQModel.find({ active: true }),
      DiagnosticTestModel.find({ active: true }),
    ]);

    const settings = settingsList[0] || {
      hospitalName: 'Jharna Clinic & Hospital',
      address: 'Jashore, Khulna Division, Bangladesh',
      phone: '+880 1711-000000',
      emergencyPhone: '[Emergency Number]',
      email: 'contact@jharnaclinic.com',
      googleMapsUrl: 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac',
      openingHours: '24/7 Emergency & Inpatient Care | OPD: 08:00 AM - 10:00 PM',
    };

    const doctorSummaries = doctors
      .map(
        (d) =>
          `- ${d.name} (${d.specialty}, ${d.qualifications}): ${d.designation}. Available: ${d.consultationDays.join(', ')} from ${d.consultationTime}. Contact: ${d.phone}`
      )
      .join('\n');

    const serviceSummaries = services
      .map((s) => `- ${s.name} (${s.department}): ${s.description}`)
      .join('\n');

    const facilitySummaries = facilities
      .map((f) => `- ${f.title} (${f.category}): ${f.description}`)
      .join('\n');

    const faqSummaries = faqs
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    const diagnosticSummaries = diagnosticTests
      .map(
        (t) =>
          `- ${t.name} (${t.code}, ${t.category}): Price: ৳${t.discountPrice || t.price} BDT. Sample: ${t.sampleType}. Turnaround: ${t.turnaroundTime}. Fasting required: ${t.fastingRequired ? `Yes (${t.fastingHours} hrs)` : 'No'}. Prep: ${t.preparationNotes}`
      )
      .join('\n');

    return `
HOSPITAL INFORMATION:
- Name: ${settings.hospitalName}
- Location / Address: ${settings.address}
- Google Maps Location: ${settings.googleMapsUrl}
- General Phone: ${settings.phone}
- 24/7 Emergency Phone: ${settings.emergencyPhone}
- Email: ${settings.email}
- Hours: ${settings.openingHours}

AVAILABLE ACTIVE DOCTORS (Seed / Real):
${doctorSummaries}

DEPARTMENTS & CLINICAL SERVICES:
${serviceSummaries}

HOSPITAL FACILITIES:
${facilitySummaries}

DIAGNOSTIC LAB TESTS & HEALTH CHECKUP PACKAGES (E-COMMERCE STORE):
${diagnosticSummaries}

FREQUENTLY ASKED QUESTIONS:
${faqSummaries}
`;
  }

  /**
   * Main chat completion handler
   */
  public static async processMessage(
    userMessage: string,
    history: ChatMessage[] = []
  ): Promise<{ reply: string; bookingIntent?: any }> {
    const lower = userMessage.toLowerCase();

    // Check emergency red flags
    const emergencyKeywords = [
      'chest pain',
      'heart attack',
      'stroke',
      'cannot breathe',
      'unconscious',
      'severe bleeding',
      'poison',
      'head injury',
      'convulsion',
      'seizure',
    ];
    const isEmergency = emergencyKeywords.some((kw) => lower.includes(kw));

    if (isEmergency) {
      return {
        reply: `⚠️ **CRITICAL MEDICAL EMERGENCY ALERT**\n\nIf you or someone nearby is experiencing acute symptoms like chest pain, severe bleeding, or difficulty breathing, **please proceed directly to the nearest hospital emergency room or contact emergency services immediately.**\n\nJharna Clinic & Hospital has a **24/7 Emergency & Trauma Unit** in Jashore ready with on-duty medical officers.\n\n📞 **Emergency Hotline**: [Emergency Number] or visit us in Jashore directly.\n\n*Note: Jharna Care Assistant is an informational tool and cannot treat acute medical emergencies.*`,
      };
    }

    // Check diagnostic attempts
    const diagnosisKeywords = [
      'diagnose me',
      'what disease do i have',
      'what illness do i have',
      'prescribe me',
      'what medicine should i take',
      'what antibiotic',
      'can you diagnose my illness',
      'can you diagnose',
    ];
    if (diagnosisKeywords.some((kw) => lower.includes(kw))) {
      return {
        reply: `I cannot diagnose illnesses or prescribe medication. As **Jharna Care Assistant**, my role is to guide you through our hospital services, provide doctor schedules, and help you schedule in-person consultations with our qualified medical specialists.\n\nFor an accurate physical evaluation and diagnosis, please book an appointment with one of our specialized doctors at Jharna Clinic & Hospital, Jashore. Would you like me to help you schedule an appointment with a relevant department?`,
      };
    }

    // Try calling Gemini API if configured
    const aiClient = this.getGeminiClient();
    const hospitalContext = await this.getHospitalContext();

    if (aiClient) {
      try {
        const modelName = process.env.AI_MODEL || 'gemini-3.8-flash';
        const systemInstruction = `
You are "Jharna Care Assistant", the intelligent healthcare support assistant for Jharna Clinic & Hospital located in Jashore, Khulna Division, Bangladesh.

CRITICAL SAFETY RULES:
1. NEVER diagnose illnesses or conditions.
2. NEVER prescribe medication or dosage.
3. NEVER claim to be a medical doctor.
4. NEVER invent doctors, departments, or facilities not present in the hospital context.
5. For all medical advice, instruct patients to consult a licensed physician at Jharna Clinic & Hospital.
6. For emergencies, urge immediate hospital admission or emergency contact.
7. Only use the database information provided below. If a doctor or test is not listed, politely explain that the information is currently not on file and invite them to call reception at +880 1711-000000.
8. Be respectful, compassionate, professional, and clear.
9. Support both English and Bengali queries naturally.
10. If the user expresses interest in booking an appointment, guide them politely by asking:
    - Patient Name
    - Phone Number
    - Preferred Department or Doctor
    - Preferred Date & Time
    Remind them that appointments are finalized via the official hospital confirmation.

CURRENT LIVE HOSPITAL DATABASE CONTEXT:
${hospitalContext}
`;

        const formattedContents = [
          ...history.slice(-6).map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ];

        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: formattedContents as any,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        if (response.text) {
          return { reply: response.text.trim() };
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, switching to local knowledge engine:', err.message);
      }
    }

    // Reliable Local Fallback Knowledge Engine (guarantees accurate answers without hallucination)
    return this.fallbackKnowledgeResponse(lower, hospitalContext);
  }

  private static async fallbackKnowledgeResponse(
    query: string,
    hospitalContext: string
  ): Promise<{ reply: string }> {
    const doctors = await DoctorModel.find({ active: true });
    const services = await ServiceModel.find({ active: true });
    const settingsList = await SettingsModel.find();
    const settings = settingsList[0] || {};

    if (query.includes('where') || query.includes('location') || query.includes('address') || query.includes('direction')) {
      return {
        reply: `📍 **Jharna Clinic & Hospital Location**:\nWe are located in **Jashore, Khulna Division, Bangladesh**.\n\n- **Full Address**: ${settings.address || 'Jashore, Khulna Division, Bangladesh'}\n- **Google Maps**: You can open our verified map location here: [Google Maps Link](${settings.googleMapsUrl || 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac'})\n- **Directions**: Located centrally in Jashore with convenient patient drop-off and ambulance access.`,
      };
    }

    if (query.includes('doctor') || query.includes('specialist') || query.includes('physician')) {
      const docList = doctors
        .map(
          (d) =>
            `• **${d.name}**\n  - *Specialty*: ${d.specialty}\n  - *Qualifications*: ${d.qualifications}\n  - *Consultation*: ${d.consultationDays.join(', ')} (${d.consultationTime})`
        )
        .join('\n\n');
      return {
        reply: `🩺 **Doctors Available at Jharna Clinic & Hospital**:\n\n${docList}\n\n*Note: Sample profiles shown for demonstration. To book a consultation, use our online booking form or tell me which doctor you would like to visit!*`,
      };
    }

    if (query.includes('service') || query.includes('department') || query.includes('treat') || query.includes('test')) {
      const servList = services.map((s) => `• **${s.name}** (${s.department}): ${s.description}`).join('\n');
      return {
        reply: `🏥 **Our Medical Services & Departments**:\n\n${servList}\n\nWe provide 24/7 emergency response, modern surgical facilities, and automated diagnostic pathology.`,
      };
    }

    if (query.includes('appointment') || query.includes('book') || query.includes('schedule')) {
      return {
        reply: `🗓️ **Booking an Appointment at Jharna Clinic & Hospital**:\n\nYou can easily book an appointment in two ways:\n1. Click the **"Book Appointment"** button on the top menu to fill out our direct online form.\n2. Or provide me with your:\n   - **Full Name**\n   - **Phone Number**\n   - **Preferred Doctor or Department**\n   - **Preferred Date**\n\nOnce submitted, you will receive a unique reference code (e.g. \`JCH-2026-000123\`) and our hospital reception will confirm your slot.`,
      };
    }

    if (query.includes('emergency') || query.includes('ambulance') || query.includes('hotline')) {
      return {
        reply: `🚨 **24/7 Emergency Support**:\n\n- **Emergency Hotline**: ${settings.emergencyPhone || '[Emergency Number]'}\n- **Hospital Phone**: ${settings.phone || '+880 1711-000000'}\n- **Emergency Unit**: Open 24 hours every day for acute trauma, cardiac emergencies, maternal emergencies, and medical observation in Jashore.`,
      };
    }

    if (query.includes('hour') || query.includes('time') || query.includes('open')) {
      return {
        reply: `⏰ **Operating Hours**:\n\n- **Emergency Department & Inpatient Wards**: Open 24 Hours, 7 Days a Week\n- **Outpatient Consultation (OPD)**: Daily from 08:00 AM to 10:00 PM\n- **Diagnostic Lab & Digital Imaging**: 24/7 Emergency Testing available; regular OPD reports collected daily.`,
      };
    }

    // Default polite response
    return {
      reply: `Hello! I am **Jharna Care Assistant** for **Jharna Clinic & Hospital** in Jashore.\n\nI can help you with:\n• Finding available doctors and consultation schedules\n• Hospital departments & specialized treatments\n• Diagnostic lab & imaging facilities\n• Step-by-step appointment booking\n• Hospital location, opening hours & contact details\n\nHow may I assist you today?`,
    };
  }
}
