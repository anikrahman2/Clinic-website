export interface Doctor {
  _id: string;
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

export interface Service {
  _id: string;
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

export interface Appointment {
  _id: string;
  appointmentId: string;
  patientName: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  doctor: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: 'Diagnostic' | 'Clinical' | 'Inpatient' | 'Emergency' | 'Surgery';
  active: boolean;
  order?: number;
}

export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  active: boolean;
  order?: number;
}

export interface HospitalSettings {
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
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order?: number;
}

export interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Resolved';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  mustChangePassword?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface DashboardStats {
  summary: {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalDoctors: number;
    activeDoctors: number;
    totalServices: number;
    newInquiries: number;
    totalInquiries: number;
    totalConversations: number;
  };
  charts: {
    statusCounts: Record<string, number>;
    popularDepartments: { name: string; count: number }[];
    appointmentsByMonth: { month: string; count: number }[];
    appointmentsByDay: { day: string; count: number }[];
  };
  recentAppointments: Appointment[];
  recentInquiries: Inquiry[];
}

export interface DiagnosticTest {
  _id: string;
  name: string;
  code: string;
  slug: string;
  category: 'Pathology & Blood' | 'Radiology & Imaging' | 'Cardiology & ECG' | 'Diabetes & Hormone' | 'Pregnancy & Maternal' | 'Health Packages';
  price: number;
  discountPrice?: number;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours?: number;
  turnaroundTime: string;
  parametersCount?: number;
  description: string;
  preparationNotes: string;
  isPopular?: boolean;
  isPackage?: boolean;
  packageTests?: string[];
  active: boolean;
}

export interface TestOrderItem {
  testId: string;
  name: string;
  code: string;
  price: number;
}

export interface TestOrder {
  _id: string;
  orderId: string;
  patientName: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  collectionType: 'Hospital Visit' | 'Home Sample Collection';
  address?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  items: TestOrderItem[];
  subtotal: number;
  collectionFee: number;
  totalAmount: number;
  status: 'Pending' | 'Sample Collected' | 'Processing in Lab' | 'Report Ready' | 'Cancelled';
  paymentMethod: 'Cash on Collection / Counter' | 'bKash / Nagad' | 'Card at Hospital Desk';
  paymentStatus: 'Unpaid' | 'Paid';
  reportNotes?: string;
  createdAt: string;
  updatedAt: string;
}

