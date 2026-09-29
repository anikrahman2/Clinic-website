import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HospitalSettings, Doctor, Service } from '../types/index.js';
import { api } from '../services/api.js';

interface HospitalContextType {
  settings: HospitalSettings | null;
  doctors: Doctor[];
  services: Service[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
  refreshDoctors: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const defaultSettings: HospitalSettings = {
  hospitalName: 'Jharna Clinic & Hospital',
  tagline: 'Compassionate Healthcare. Trusted by Your Community.',
  address: 'Jashore, Khulna Division, Bangladesh',
  phone: '+880 1711-000000',
  emergencyPhone: '[Emergency Number]',
  email: 'contact@jharnaclinic.com',
  googleMapsUrl: 'https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac',
  openingHours: '24 Hours Emergency & Inpatient Care | OPD: 08:00 AM - 10:00 PM',
  notice: 'Quality medical care and patient-focused healthcare services in Jashore.',
  socialMedia: {
    facebook: 'https://facebook.com',
    youtube: '',
    whatsapp: '',
  },
  website: {
    logo: '',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    metaTitle: 'Jharna Clinic & Hospital — Jashore, Bangladesh',
    metaDescription: 'Quality medical care and patient-focused healthcare services in Jashore.',
  },
};

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<HospitalSettings>(defaultSettings);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Failed to load hospital settings:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.getDoctors({ activeOnly: true });
      if (res.success && Array.isArray(res.data)) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.warn('Failed to load doctors:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.getServices({ activeOnly: true });
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn('Failed to load services:', err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchSettings(), fetchDoctors(), fetchServices()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <HospitalContext.Provider
      value={{
        settings,
        doctors,
        services,
        loading,
        refreshSettings: fetchSettings,
        refreshDoctors: fetchDoctors,
        refreshServices: fetchServices,
        refreshAll,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
