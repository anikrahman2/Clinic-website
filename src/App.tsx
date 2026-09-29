import { useEffect } from 'react';
import { useRouter, RouterProvider } from './utils/router.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { HospitalProvider } from './context/HospitalContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { CartProvider } from './context/CartContext.js';

// Public Components
import { EmergencyBanner } from './components/public/EmergencyBanner.js';
import { Navbar } from './components/public/Navbar.js';
import { Footer } from './components/public/Footer.js';
import { ChatbotWidget } from './components/public/ChatbotWidget.js';
import { CartDrawer } from './components/public/CartDrawer.js';

// Public Pages
import { Home } from './pages/public/Home.js';
import { About } from './pages/public/About.js';
import { Doctors } from './pages/public/Doctors.js';
import { DoctorDetail } from './pages/public/DoctorDetail.js';
import { Services } from './pages/public/Services.js';
import { ServiceDetail } from './pages/public/ServiceDetail.js';
import { Facilities } from './pages/public/Facilities.js';
import { AppointmentPage } from './pages/public/AppointmentPage.js';
import { Contact } from './pages/public/Contact.js';
import { PatientInformation } from './pages/public/PatientInformation.js';
import { Diagnostics } from './pages/public/Diagnostics.js';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin.js';
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminAppointments } from './pages/admin/AdminAppointments.js';
import { AdminDoctors } from './pages/admin/AdminDoctors.js';
import { AdminServices } from './pages/admin/AdminServices.js';
import { AdminFacilities } from './pages/admin/AdminFacilities.js';
import { AdminPatients } from './pages/admin/AdminPatients.js';
import { AdminMessages } from './pages/admin/AdminMessages.js';
import { AdminFaqs } from './pages/admin/AdminFaqs.js';
import { AdminChatbot } from './pages/admin/AdminChatbot.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';
import { AdminDiagnostics } from './pages/admin/AdminDiagnostics.js';

function AppRoutes() {
  const { path } = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  // Handle Admin Login page directly
  if (path === '/admin/login') {
    if (isAuthenticated) {
      return <AdminDashboard />;
    }
    return <AdminLogin />;
  }

  // Handle Admin Protected Routes
  if (path.startsWith('/admin')) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400 font-bold text-sm">
          Loading Jharna Hospital Admin Portal...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin />;
    }

    if (path === '/admin' || path === '/admin/') return <AdminDashboard />;
    if (path.startsWith('/admin/appointments')) return <AdminAppointments />;
    if (path.startsWith('/admin/diagnostics')) return <AdminDiagnostics />;
    if (path.startsWith('/admin/doctors')) return <AdminDoctors />;
    if (path.startsWith('/admin/services')) return <AdminServices />;
    if (path.startsWith('/admin/facilities') || path.startsWith('/admin/gallery'))
      return <AdminFacilities />;
    if (path.startsWith('/admin/patients')) return <AdminPatients />;
    if (path.startsWith('/admin/messages')) return <AdminMessages />;
    if (path.startsWith('/admin/faqs')) return <AdminFaqs />;
    if (path.startsWith('/admin/chatbot')) return <AdminChatbot />;
    if (path.startsWith('/admin/settings')) return <AdminSettings />;

    return <AdminDashboard />;
  }

  // Render Public Website with layout
  const renderPublicPage = () => {
    if (path === '/' || path === '') return <Home />;
    if (path === '/about') return <About />;
    if (path.startsWith('/doctors/')) return <DoctorDetail />;
    if (path === '/doctors') return <Doctors />;
    if (path.startsWith('/services/')) return <ServiceDetail />;
    if (path === '/services') return <Services />;
    if (path === '/facilities') return <Facilities />;
    if (path === '/appointment') return <AppointmentPage />;
    if (path === '/diagnostics' || path === '/tests' || path === '/lab-tests') return <Diagnostics />;
    if (path === '/contact') return <Contact />;
    if (path === '/patient-information') return <PatientInformation />;

    // 404 Fallback
    return <Home />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-600 selection:text-white">
      <EmergencyBanner />
      <Navbar />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer />
      <ChatbotWidget />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <AuthProvider>
          <HospitalProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </HospitalProvider>
        </AuthProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
