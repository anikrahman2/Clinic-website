const BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('jharna_admin_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('jharna_admin_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('jharna_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; data: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<{ success: boolean; data: any }>('/auth/me'),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: () => {
    removeAuthToken();
    return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
  },

  // Doctors
  getDoctors: (params?: { search?: string; specialty?: string; activeOnly?: boolean; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.specialty) q.append('specialty', params.specialty);
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.page) q.append('page', String(params.page));
    if (params?.limit) q.append('limit', String(params.limit));
    return request<{ success: boolean; total: number; data: any[] }>(`/doctors?${q.toString()}`);
  },
  getDoctorById: (id: string) => request<{ success: boolean; data: any }>(`/doctors/${id}`),
  getDoctorSpecialties: () => request<{ success: boolean; data: string[] }>('/doctors/specialties'),
  createDoctor: (data: any) =>
    request<{ success: boolean; data: any }>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDoctor: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDoctor: (id: string) =>
    request<{ success: boolean; message: string }>(`/doctors/${id}`, { method: 'DELETE' }),

  // Services
  getServices: (params?: { activeOnly?: boolean; department?: string }) => {
    const q = new URLSearchParams();
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.department) q.append('department', params.department);
    return request<{ success: boolean; data: any[] }>(`/services?${q.toString()}`);
  },
  getServiceByIdOrSlug: (id: string) => request<{ success: boolean; data: any }>(`/services/${id}`),
  createService: (data: any) =>
    request<{ success: boolean; data: any }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    request<{ success: boolean; message: string }>(`/services/${id}`, { method: 'DELETE' }),

  // Appointments
  createAppointment: (data: any) =>
    request<{ success: boolean; message: string; appointmentId: string; data: any }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAppointments: (params?: { search?: string; status?: string; department?: string; doctor?: string; date?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.status) q.append('status', params.status);
    if (params?.department) q.append('department', params.department);
    if (params?.doctor) q.append('doctor', params.doctor);
    if (params?.date) q.append('date', params.date);
    if (params?.page) q.append('page', String(params.page));
    if (params?.limit) q.append('limit', String(params.limit));
    return request<{ success: boolean; total: number; data: any[] }>(`/appointments?${q.toString()}`);
  },
  getAppointmentById: (id: string) => request<{ success: boolean; data: any }>(`/appointments/${id}`),
  updateAppointmentStatus: (id: string, payload: { status?: string; notes?: string; appointmentDate?: string; appointmentTime?: string }) =>
    request<{ success: boolean; message: string; data: any }>(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteAppointment: (id: string) =>
    request<{ success: boolean; message: string }>(`/appointments/${id}`, { method: 'DELETE' }),

  // Facilities & Gallery
  getFacilities: (params?: { activeOnly?: boolean; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.category) q.append('category', params.category);
    return request<{ success: boolean; data: any[] }>(`/facilities?${q.toString()}`);
  },
  createFacility: (data: any) =>
    request<{ success: boolean; data: any }>('/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFacility: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFacility: (id: string) =>
    request<{ success: boolean; message: string }>(`/facilities/${id}`, { method: 'DELETE' }),

  getGallery: (params?: { activeOnly?: boolean; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.category) q.append('category', params.category);
    return request<{ success: boolean; data: any[] }>(`/gallery?${q.toString()}`);
  },
  createGalleryItem: (data: any) =>
    request<{ success: boolean; data: any }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateGalleryItem: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGalleryItem: (id: string) =>
    request<{ success: boolean; message: string }>(`/gallery/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request<{ success: boolean; data: any }>('/settings'),
  updateSettings: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // FAQs
  getFAQs: (params?: { activeOnly?: boolean; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.category) q.append('category', params.category);
    return request<{ success: boolean; data: any[] }>(`/faqs?${q.toString()}`);
  },
  createFAQ: (data: any) =>
    request<{ success: boolean; data: any }>('/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFAQ: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFAQ: (id: string) =>
    request<{ success: boolean; message: string }>(`/faqs/${id}`, { method: 'DELETE' }),

  // Inquiries
  createInquiry: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getInquiries: (params?: { status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    return request<{ success: boolean; data: any[] }>(`/inquiries?${q.toString()}`);
  },
  updateInquiryStatus: (id: string, status: string) =>
    request<{ success: boolean; data: any }>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id: string) =>
    request<{ success: boolean; message: string }>(`/inquiries/${id}`, { method: 'DELETE' }),

  // Chatbot
  sendChatMessage: (data: { message: string; conversationId?: string; sessionId?: string }) =>
    request<{ success: boolean; reply: string; conversationId: string; sessionId: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  bookAppointmentViaChat: (data: any) =>
    request<{ success: boolean; message: string; appointmentId: string; data: any }>('/chat/appointment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getChatConversations: () => request<{ success: boolean; data: any[] }>('/chat/conversations'),
  getChatConversationById: (id: string) => request<{ success: boolean; data: any }>(`/chat/conversations/${id}`),
  getChatAnalytics: () => request<{ success: boolean; data: any }>('/chat/analytics'),

  // Dashboard
  getDashboardStats: () => request<{ success: boolean; data: any }>('/dashboard/stats'),

  // Diagnostics & E-Commerce Catalog
  getDiagnosticTests: (params?: { category?: string; search?: string; isPackage?: boolean; isPopular?: boolean; activeOnly?: boolean; sortBy?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.isPackage !== undefined) q.append('isPackage', String(params.isPackage));
    if (params?.isPopular !== undefined) q.append('isPopular', String(params.isPopular));
    if (params?.activeOnly !== undefined) q.append('activeOnly', String(params.activeOnly));
    if (params?.sortBy) q.append('sortBy', params.sortBy);
    return request<{ success: boolean; count: number; data: any[] }>(`/diagnostics?${q.toString()}`);
  },
  getDiagnosticTestByIdOrSlug: (id: string) =>
    request<{ success: boolean; data: any }>(`/diagnostics/${id}`),
  createDiagnosticTest: (data: any) =>
    request<{ success: boolean; data: any }>('/diagnostics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDiagnosticTest: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/diagnostics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDiagnosticTest: (id: string) =>
    request<{ success: boolean; message: string }>(`/diagnostics/${id}`, { method: 'DELETE' }),

  // Diagnostic Test Orders
  createTestOrder: (data: any) =>
    request<{ success: boolean; message: string; orderId: string; data: any }>('/test-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getTestOrders: (params?: { search?: string; status?: string; collectionType?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.status) q.append('status', params.status);
    if (params?.collectionType) q.append('collectionType', params.collectionType);
    return request<{ success: boolean; count: number; data: any[] }>(`/test-orders?${q.toString()}`);
  },
  getTestOrderById: (id: string) =>
    request<{ success: boolean; data: any }>(`/test-orders/${id}`),
  updateTestOrderStatus: (id: string, payload: { status?: string; paymentStatus?: string; reportNotes?: string }) =>
    request<{ success: boolean; message: string; data: any }>(`/test-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTestOrder: (id: string) =>
    request<{ success: boolean; message: string }>(`/test-orders/${id}`, { method: 'DELETE' }),
};
