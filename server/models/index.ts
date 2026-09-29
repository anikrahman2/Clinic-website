import fs from 'fs';
import mongoose, { Schema } from 'mongoose';
import { STORE_PATH, getIsMongoConnected } from '../config/db.js';
import type {
  IAdmin,
  IDoctor,
  IService,
  IAppointment,
  IFacility,
  IGallery,
  IHospitalSettings,
  IFAQ,
  IInquiry,
  IChatConversation,
  IDiagnosticTest,
  ITestOrder,
} from './types.js';

// --- Mongoose Schemas ---
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    mustChangePassword: { type: Boolean, default: false },
    lastLogin: { type: String },
  },
  { timestamps: true }
);

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    photo: { type: String, default: '' },
    qualifications: { type: String, required: true },
    specialty: { type: String, required: true },
    designation: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String, default: '' },
    consultationDays: [{ type: String }],
    consultationTime: { type: String, required: true },
    phone: { type: String, default: '' },
    appointmentAvailable: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Activity' },
    image: { type: String, default: '' },
    department: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    doctor: { type: String, required: true },
    department: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    reason: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const FacilitySchema = new Schema<IFacility>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Diagnostic', 'Clinical', 'Inpatient', 'Emergency', 'Surgery'],
      required: true,
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    category: { type: String, default: 'General' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HospitalSettingsSchema = new Schema<IHospitalSettings>(
  {
    hospitalName: { type: String, default: 'Jharna Clinic & Hospital' },
    tagline: { type: String, default: 'Compassionate Healthcare. Trusted by Your Community.' },
    address: { type: String, default: 'Jashore, Khulna Division, Bangladesh' },
    phone: { type: String, default: '+880 1711-000000' },
    emergencyPhone: { type: String, default: '[Emergency Number]' },
    email: { type: String, default: 'info@jharnaclinic.com' },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac',
    },
    openingHours: { type: String, default: '24 Hours Emergency & Inpatient Service' },
    notice: { type: String, default: 'Quality medical care and patient-focused healthcare services in Jashore.' },
    socialMedia: {
      facebook: { type: String, default: 'https://facebook.com' },
      youtube: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    website: {
      logo: { type: String, default: '' },
      heroImage: { type: String, default: '' },
      metaTitle: { type: String, default: 'Jharna Clinic & Hospital — Jashore' },
      metaDescription: {
        type: String,
        default: 'Quality medical care and patient-focused healthcare services in Jashore, Bangladesh.',
      },
    },
  },
  { timestamps: true }
);

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Read', 'Resolved'], default: 'New' },
  },
  { timestamps: true }
);

const ChatConversationSchema = new Schema<IChatConversation>(
  {
    conversationId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system'] },
        content: { type: String },
        timestamp: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const DiagnosticTestSchema = new Schema<IDiagnosticTest>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        'Pathology & Blood',
        'Radiology & Imaging',
        'Cardiology & ECG',
        'Diabetes & Hormone',
        'Pregnancy & Maternal',
        'Health Packages',
      ],
      required: true,
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    sampleType: { type: String, required: true },
    fastingRequired: { type: Boolean, default: false },
    fastingHours: { type: Number, default: 0 },
    turnaroundTime: { type: String, required: true },
    parametersCount: { type: Number, default: 1 },
    description: { type: String, required: true },
    preparationNotes: { type: String, default: '' },
    isPopular: { type: Boolean, default: false },
    isPackage: { type: Boolean, default: false },
    packageTests: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TestOrderSchema = new Schema<ITestOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    collectionType: {
      type: String,
      enum: ['Hospital Visit', 'Home Sample Collection'],
      default: 'Hospital Visit',
    },
    address: { type: String, default: '' },
    preferredDate: { type: String, required: true },
    preferredTimeSlot: { type: String, required: true },
    items: [
      {
        testId: { type: String, required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    collectionFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Sample Collected', 'Processing in Lab', 'Report Ready', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Collection / Counter', 'bKash / Nagad', 'Card at Hospital Desk'],
      default: 'Cash on Collection / Counter',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    reportNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Mongoose Models
export const MongooseAdmin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export const MongooseDoctor = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
export const MongooseService = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export const MongooseAppointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export const MongooseFacility = mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);
export const MongooseGallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
export const MongooseHospitalSettings = mongoose.models.HospitalSettings || mongoose.model<IHospitalSettings>('HospitalSettings', HospitalSettingsSchema);
export const MongooseFAQ = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
export const MongooseInquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
export const MongooseChatConversation = mongoose.models.ChatConversation || mongoose.model<IChatConversation>('ChatConversation', ChatConversationSchema);
export const MongooseDiagnosticTest = mongoose.models.DiagnosticTest || mongoose.model<IDiagnosticTest>('DiagnosticTest', DiagnosticTestSchema);
export const MongooseTestOrder = mongoose.models.TestOrder || mongoose.model<ITestOrder>('TestOrder', TestOrderSchema);

// --- Dual-Layer Unified Repository (Works with MongoDB or local store) ---
function loadStore(): Record<string, any[]> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store file:', err);
  }
  return {
    admins: [],
    doctors: [],
    services: [],
    appointments: [],
    facilities: [],
    gallery: [],
    settings: [],
    faqs: [],
    inquiries: [],
    chatConversations: [],
  };
}

function saveStore(data: Record<string, any[]>) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}

export function createModelWrapper<T extends { _id?: string }>(
  collectionName: string,
  mongooseModel: mongoose.Model<any>
) {
  return {
    async find(filter: any = {}): Promise<T[]> {
      if (getIsMongoConnected()) {
        return (await mongooseModel.find(filter).lean()) as T[];
      }
      const store = loadStore();
      const list = (store[collectionName] || []) as T[];
      return list.filter((item: any) => {
        for (const key of Object.keys(filter)) {
          if (filter[key] === undefined) continue;
          if (filter[key] instanceof RegExp) {
            if (!filter[key].test(item[key])) return false;
          } else if (typeof filter[key] === 'object' && filter[key] !== null) {
            if (filter[key].$regex) {
              const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i');
              if (!regex.test(item[key])) return false;
            } else if (filter[key].$in) {
              if (!filter[key].$in.includes(item[key])) return false;
            }
          } else if (item[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    },

    async findOne(filter: any): Promise<T | null> {
      if (getIsMongoConnected()) {
        return (await mongooseModel.findOne(filter).lean()) as T | null;
      }
      const results = await this.find(filter);
      return results[0] || null;
    },

    async findById(id: string): Promise<T | null> {
      if (getIsMongoConnected()) {
        return (await mongooseModel.findById(id).lean()) as T | null;
      }
      const store = loadStore();
      const list = (store[collectionName] || []) as T[];
      const found = list.find((item: any) => item._id === id || item.id === id);
      return found || null;
    },

    async create(data: Partial<T>): Promise<T> {
      const now = new Date().toISOString();
      if (getIsMongoConnected()) {
        const doc = await mongooseModel.create(data);
        return doc.toObject() as T;
      }
      const store = loadStore();
      if (!store[collectionName]) store[collectionName] = [];
      const newDoc: any = {
        _id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
        ...data,
        createdAt: (data as any).createdAt || now,
        updatedAt: now,
      };
      store[collectionName].unshift(newDoc);
      saveStore(store);
      return newDoc as T;
    },

    async findByIdAndUpdate(id: string, update: Partial<T>, options?: any): Promise<T | null> {
      const now = new Date().toISOString();
      if (getIsMongoConnected()) {
        return (await mongooseModel.findByIdAndUpdate(id, update, { new: true, ...options }).lean()) as T | null;
      }
      const store = loadStore();
      const list = (store[collectionName] || []) as any[];
      const index = list.findIndex((item) => item._id === id || item.id === id);
      if (index === -1) return null;
      const updated = {
        ...list[index],
        ...update,
        updatedAt: now,
      };
      list[index] = updated;
      store[collectionName] = list;
      saveStore(store);
      return updated as T;
    },

    async findByIdAndDelete(id: string): Promise<T | null> {
      if (getIsMongoConnected()) {
        return (await mongooseModel.findByIdAndDelete(id).lean()) as T | null;
      }
      const store = loadStore();
      const list = (store[collectionName] || []) as any[];
      const index = list.findIndex((item) => item._id === id || item.id === id);
      if (index === -1) return null;
      const deleted = list.splice(index, 1)[0];
      store[collectionName] = list;
      saveStore(store);
      return deleted as T;
    },

    async countDocuments(filter: any = {}): Promise<number> {
      if (getIsMongoConnected()) {
        return await mongooseModel.countDocuments(filter);
      }
      const docs = await this.find(filter);
      return docs.length;
    },

    async deleteMany(filter: any = {}): Promise<void> {
      if (getIsMongoConnected()) {
        await mongooseModel.deleteMany(filter);
        return;
      }
      const store = loadStore();
      store[collectionName] = [];
      saveStore(store);
    },

    async insertMany(docs: Partial<T>[]): Promise<T[]> {
      const now = new Date().toISOString();
      if (getIsMongoConnected()) {
        const created = await mongooseModel.insertMany(docs);
        return created.map((c: any) => c.toObject()) as T[];
      }
      const store = loadStore();
      if (!store[collectionName]) store[collectionName] = [];
      const newDocs = docs.map((d: any, idx) => ({
        _id: 'doc_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substring(2, 6),
        ...d,
        createdAt: d.createdAt || now,
        updatedAt: now,
      }));
      store[collectionName].push(...newDocs);
      saveStore(store);
      return newDocs as T[];
    },
  };
}

// Unified Models for Application Use
export const AdminModel = createModelWrapper<IAdmin>('admins', MongooseAdmin);
export const DoctorModel = createModelWrapper<IDoctor>('doctors', MongooseDoctor);
export const ServiceModel = createModelWrapper<IService>('services', MongooseService);
export const AppointmentModel = createModelWrapper<IAppointment>('appointments', MongooseAppointment);
export const FacilityModel = createModelWrapper<IFacility>('facilities', MongooseFacility);
export const GalleryModel = createModelWrapper<IGallery>('gallery', MongooseGallery);
export const SettingsModel = createModelWrapper<IHospitalSettings>('settings', MongooseHospitalSettings);
export const FAQModel = createModelWrapper<IFAQ>('faqs', MongooseFAQ);
export const InquiryModel = createModelWrapper<IInquiry>('inquiries', MongooseInquiry);
export const ChatConversationModel = createModelWrapper<IChatConversation>('chatConversations', MongooseChatConversation);
export const DiagnosticTestModel = createModelWrapper<IDiagnosticTest>('diagnosticTests', MongooseDiagnosticTest);
export const TestOrderModel = createModelWrapper<ITestOrder>('testOrders', MongooseTestOrder);

