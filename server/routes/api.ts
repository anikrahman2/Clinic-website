import { Router } from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';

import {
  loginAdmin,
  getAdminProfile,
  changePassword,
  logoutAdmin,
} from '../controllers/authController.js';

import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecialties,
} from '../controllers/doctorController.js';

import {
  getAllServices,
  getServiceBySlugOrId,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

import {
  createAppointment,
  getAllAppointments,
  getAppointmentByIdOrTracking,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointmentController.js';

import {
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/facilityController.js';

import {
  getHospitalSettings,
  updateHospitalSettings,
} from '../controllers/settingsController.js';

import {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/faqController.js';

import {
  handleChatMessage,
  bookAppointmentViaChat,
  getConversations,
  getConversationById,
  getChatAnalytics,
} from '../controllers/chatController.js';

import { getDashboardStats } from '../controllers/dashboardController.js';

import {
  getAllDiagnosticTests,
  getDiagnosticTestByIdOrSlug,
  createDiagnosticTest,
  updateDiagnosticTest,
  deleteDiagnosticTest,
  createTestOrder,
  getAllTestOrders,
  getTestOrderByIdOrTracking,
  updateTestOrderStatus,
  deleteTestOrder,
} from '../controllers/diagnosticController.js';

const router = Router();

// --- Auth Routes ---
router.post('/auth/login', loginAdmin);
router.get('/auth/me', protectAdmin, getAdminProfile);
router.post('/auth/change-password', protectAdmin, changePassword);
router.post('/auth/logout', logoutAdmin);

// --- Doctors ---
router.get('/doctors', getAllDoctors);
router.get('/doctors/specialties', getSpecialties);
router.get('/doctors/:id', getDoctorById);
router.post('/doctors', protectAdmin, createDoctor);
router.put('/doctors/:id', protectAdmin, updateDoctor);
router.delete('/doctors/:id', protectAdmin, deleteDoctor);

// --- Services ---
router.get('/services', getAllServices);
router.get('/services/:identifier', getServiceBySlugOrId);
router.post('/services', protectAdmin, createService);
router.put('/services/:id', protectAdmin, updateService);
router.delete('/services/:id', protectAdmin, deleteService);

// --- Appointments ---
router.post('/appointments', createAppointment);
router.get('/appointments', protectAdmin, getAllAppointments);
router.get('/appointments/:id', getAppointmentByIdOrTracking);
router.put('/appointments/:id', protectAdmin, updateAppointmentStatus);
router.put('/appointments/:id/status', protectAdmin, updateAppointmentStatus);
router.delete('/appointments/:id', protectAdmin, deleteAppointment);

// --- Facilities & Gallery ---
router.get('/facilities', getAllFacilities);
router.post('/facilities', protectAdmin, createFacility);
router.put('/facilities/:id', protectAdmin, updateFacility);
router.delete('/facilities/:id', protectAdmin, deleteFacility);

router.get('/gallery', getAllGallery);
router.post('/gallery', protectAdmin, createGalleryItem);
router.put('/gallery/:id', protectAdmin, updateGalleryItem);
router.delete('/gallery/:id', protectAdmin, deleteGalleryItem);

// --- Hospital Settings ---
router.get('/settings', getHospitalSettings);
router.put('/settings', protectAdmin, updateHospitalSettings);

// --- FAQs ---
router.get('/faqs', getAllFAQs);
router.post('/faqs', protectAdmin, createFAQ);
router.put('/faqs/:id', protectAdmin, updateFAQ);
router.delete('/faqs/:id', protectAdmin, deleteFAQ);

// --- Inquiries ---
router.post('/inquiries', createInquiry);
router.get('/inquiries', protectAdmin, getAllInquiries);
router.put('/inquiries/:id', protectAdmin, updateInquiryStatus);
router.delete('/inquiries/:id', protectAdmin, deleteInquiry);

// --- Chatbot ---
router.post('/chat', handleChatMessage);
router.post('/chat/appointment', bookAppointmentViaChat);
router.get('/chat/conversations', protectAdmin, getConversations);
router.get('/chat/conversations/:id', protectAdmin, getConversationById);
router.get('/chat/analytics', protectAdmin, getChatAnalytics);

// --- Dashboard ---
router.get('/dashboard/stats', protectAdmin, getDashboardStats);

// --- Diagnostic Tests & E-Commerce Catalog ---
router.get('/diagnostics', getAllDiagnosticTests);
router.get('/diagnostics/:identifier', getDiagnosticTestByIdOrSlug);
router.post('/diagnostics', protectAdmin, createDiagnosticTest);
router.put('/diagnostics/:id', protectAdmin, updateDiagnosticTest);
router.delete('/diagnostics/:id', protectAdmin, deleteDiagnosticTest);

// --- Diagnostic Test Orders ---
router.post('/test-orders', createTestOrder);
router.get('/test-orders', protectAdmin, getAllTestOrders);
router.get('/test-orders/:identifier', getTestOrderByIdOrTracking);
router.put('/test-orders/:id/status', protectAdmin, updateTestOrderStatus);
router.delete('/test-orders/:id', protectAdmin, deleteTestOrder);

export default router;
