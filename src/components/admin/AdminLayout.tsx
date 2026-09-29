import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  Activity,
  Building2,
  Users,
  MessageSquare,
  HelpCircle,
  Bot,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  KeyRound,
  HeartPulse,
  Bell,
  ShoppingBag,
} from 'lucide-react';
import { Link, useRouter } from '../../utils/router.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

export function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { admin, logout, changePassword } = useAuth();
  const { path, navigate } = useRouter();
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Diagnostic Lab', href: '/admin/diagnostics', icon: ShoppingBag },
    { label: 'Doctors', href: '/admin/doctors', icon: UserCheck },
    { label: 'Services', href: '/admin/services', icon: Activity },
    { label: 'Facilities & Gallery', href: '/admin/facilities', icon: Building2 },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { label: 'AI Chatbot', href: '/admin/chatbot', icon: Bot },
    { label: 'Hospital Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of admin portal.', 'info');
    navigate('/admin/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      showToast('Password updated successfully.', 'success');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-white">Jharna Hospital</h2>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
              Management Portal
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin' ? path === '/admin' : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
          <div className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-white truncate">{admin?.name || 'Administrator'}</div>
            <div className="text-[11px] text-slate-400 truncate">{admin?.email}</div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <span className="text-teal-400 font-bold uppercase">{admin?.role}</span>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <KeyRound className="w-3 h-3" /> Password
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs font-medium transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Jharna Admin</h2>
            <span className="text-[10px] text-teal-400 uppercase font-semibold">Jashore Portal</span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin' ? path === '/admin' : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-between">
            <Link to="/" className="text-xs text-teal-400 font-semibold py-2">
              View Public Website
            </Link>
            <button onClick={handleLogout} className="text-xs text-rose-400 font-semibold py-2">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/40">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Jharna Clinic & Hospital Management
            </span>
          </div>
          <div className="flex items-center gap-3">
            {admin?.mustChangePassword && (
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold animate-pulse"
              >
                ⚠️ Change Default Password
              </button>
            )}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Website
            </Link>
          </div>
        </header>

        {/* Child Page Content */}
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-400" />
                Update Admin Password
              </h3>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-semibold transition"
                >
                  {passwordLoading ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
