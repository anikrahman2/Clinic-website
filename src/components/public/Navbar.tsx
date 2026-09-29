import { useState } from 'react';
import { Menu, X, Calendar, Phone, Activity, Lock, HeartPulse, ShoppingBag } from 'lucide-react';
import { Link, useRouter } from '../../utils/router.js';
import { useHospital } from '../../context/HospitalContext.js';
import { useCart } from '../../context/CartContext.js';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useHospital();
  const { path } = useRouter();
  const { totalCount, setIsCartOpen } = useCart();

  const hospitalName = settings?.hospitalName || 'Jharna Clinic & Hospital';
  const hospitalPhone = settings?.phone || '+880 1711-000000';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Services', href: '/services' },
    { label: 'Diagnostic Tests', href: '/diagnostics' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Patient Info', href: '/patient-information' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Hospital contact top bar */}
      <div className="hidden lg:block bg-slate-50 border-b border-slate-100 text-xs text-slate-600 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              Reception & Appointments: <strong className="text-slate-800">{hospitalPhone}</strong>
            </span>
            <span className="text-slate-400">|</span>
            <span>{settings?.address || 'Jashore, Khulna Division, Bangladesh'}</span>
            <span className="text-slate-400">|</span>
            <span>OPD: 08:00 AM - 10:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-700 transition font-medium"
            >
              <Lock className="w-3 h-3" />
              Hospital Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition duration-300">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight group-hover:text-teal-700 transition">
                {hospitalName}
              </span>
              <span className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
                Jashore, Bangladesh • Healthcare Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? path === '/' : path.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition group"
              title="View Diagnostic Test Basket"
              aria-label="View Diagnostic Test Basket"
            >
              <ShoppingBag className="w-5 h-5 transition group-hover:scale-110" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-teal-700/25 transition hover:shadow-lg active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
          </div>

          {/* Mobile hamburger & cart */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Test Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <Link
              to="/appointment"
              className="sm:hidden bg-teal-600 text-white p-2 rounded-lg"
              title="Book Appointment"
            >
              <Calendar className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? path === '/' : path.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-2">
              {totalCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-teal-300 py-2.5 rounded-xl font-bold text-xs shadow-md border border-slate-700"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                  View Diagnostic Basket ({totalCount} items)
                </button>
              )}
              <Link
                to="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                Book In-Person Appointment
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs text-slate-600 py-2 rounded-lg hover:bg-slate-50 font-medium border border-slate-200"
              >
                Hospital Staff & Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
