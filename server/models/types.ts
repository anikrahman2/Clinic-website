export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
  mustChangePassword?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDoctor {
  _id?: string;
  name: string;
  photo: string;
  qualifications: string;
  specialty: string;
  designation: string;
  experience: string;
  bio: string;
  consultationDays: string[];
  consultationTime: string;
  phone: string;
  appointmentAvailable: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  department: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAppointment {
  _id?: string;
  appointmentId: string;
  patientName: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  doctor: string; // Doctor Name or ID
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFacility {
  _id?: string;
  title: string;
  description: string;
  image: string;
  category: 'Diagnostic' | 'Clinical' | 'Inpatient' | 'Emergency' | 'Surgery';
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGallery {
  _id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHospitalSettings {
  _id?: string;
  hospitalName: string;
  tagline: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  googleMapsUrl: string;
  openingHours: string;
  notice?: string;
  socialMedia: {
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
  website: {
    logo?: string;
    heroImage?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  updatedAt?: string;
}

export interface IFAQ {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInquiry {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Resolved';
  createdAt?: string;
  updatedAt?: string;
}

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface IChatConversation {
  _id?: string;
  conversationId: string;
  sessionId: string;
  messages: IChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IDiagnosticTest {
  _id?: string;
  name: string;
  code: string;
  slug: string;
  category: 'Pathology & Blood' | 'Radiology & Imaging' | 'Cardiology & ECG' | 'Diabetes & Hormone' | 'Pregnancy & Maternal' | 'Health Packages';
  price: number; // in BDT ৳
  discountPrice?: number;
  sampleType: string; // e.g. 'Blood (Serum)', 'Urine', 'No Sample (Imaging)'
  fastingRequired: boolean;
  fastingHours?: number;
  turnaroundTime: string; // e.g. 'Reports in 3-4 Hours', 'Same Day', '24 Hours'
  parametersCount?: number;
  description: string;
  preparationNotes: string;
  isPopular?: boolean;
  isPackage?: boolean;
  packageTests?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestOrderItem {
  testId: string;
  name: string;
  code: string;
  price: number;
}

export interface ITestOrder {
  _id?: string;
  orderId: string; // e.g. JCH-DIAG-2026-004512
  patientName: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  collectionType: 'Hospital Visit' | 'Home Sample Collection';
  address?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  items: ITestOrderItem[];
  subtotal: number;
  collectionFee: number;
  totalAmount: number;
  status: 'Pending' | 'Sample Collected' | 'Processing in Lab' | 'Report Ready' | 'Cancelled';
  paymentMethod: 'Cash on Collection / Counter' | 'bKash / Nagad' | 'Card at Hospital Desk';
  paymentStatus: 'Unpaid' | 'Paid';
  reportNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

