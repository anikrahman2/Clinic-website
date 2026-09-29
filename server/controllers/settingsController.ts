import type { Request, Response } from 'express';
import { SettingsModel } from '../models/index.js';

export async function getHospitalSettings(req: Request, res: Response) {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = await SettingsModel.create({
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
          metaDescription: 'Quality medical care, modern diagnostics, and dedicated patient-focused healthcare in Jashore.',
        },
      });
    }

    return res.json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateHospitalSettings(req: Request, res: Response) {
  try {
    let settings = await SettingsModel.findOne({});
    if (!settings) {
      settings = await SettingsModel.create(req.body);
    } else {
      settings = await SettingsModel.findByIdAndUpdate(settings._id!, req.body, { new: true });
    }

    return res.json({
      success: true,
      message: 'Hospital information updated successfully.',
      data: settings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
