import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types/index.js';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api.js';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
  isAuthenticated: boolean;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentAdmin = async () => {
    const token = getAuthToken();
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setAdmin(res.data);
      } else {
        removeAuthToken();
        setAdmin(null);
      }
    } catch (err) {
      removeAuthToken();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setAdmin(res.data);
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // ignore
    } finally {
      removeAuthToken();
      setAdmin(null);
    }
  };

  const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    await api.changePassword(payload);
    if (admin) {
      setAdmin({ ...admin, mustChangePassword: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        changePassword,
        isAuthenticated: !!admin,
        refreshAdmin: fetchCurrentAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
