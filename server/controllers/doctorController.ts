import type { Request, Response } from 'express';
import { DoctorModel } from '../models/index.js';

export async function getAllDoctors(req: Request, res: Response) {
  try {
    const { search, specialty, activeOnly, page = 1, limit = 50 } = req.query;

    let filter: any = {};
    if (activeOnly !== 'false') {
      filter.active = true;
    }
    if (specialty && specialty !== 'All') {
      filter.specialty = specialty;
    }

    let doctors = await DoctorModel.find(filter);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.qualifications.toLowerCase().includes(q) ||
          d.designation.toLowerCase().includes(q)
      );
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 50;
    const total = doctors.length;
    const paginated = doctors.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: paginated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDoctorById(req: Request, res: Response) {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, data: doctor });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createDoctor(req: Request, res: Response) {
  try {
    const {
      name,
      photo,
      qualifications,
      specialty,
      designation,
      experience,
      bio,
      consultationDays,
      consultationTime,
      phone,
      appointmentAvailable = true,
      active = true,
    } = req.body;

    if (!name || !qualifications || !specialty || !consultationTime) {
      return res.status(400).json({
        success: false,
        message: 'Name, qualifications, specialty, and consultation times are required.',
      });
    }

    const newDoctor = await DoctorModel.create({
      name,
      photo: photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      qualifications,
      specialty,
      designation: designation || 'Consultant Specialist',
      experience: experience || '5+ Years Experience',
      bio: bio || '',
      consultationDays: Array.isArray(consultationDays) ? consultationDays : ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      consultationTime,
      phone: phone || '',
      appointmentAvailable: Boolean(appointmentAvailable),
      active: active !== false,
    });

    return res.status(201).json({ success: true, data: newDoctor });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateDoctor(req: Request, res: Response) {
  try {
    const updated = await DoctorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteDoctor(req: Request, res: Response) {
  try {
    const deleted = await DoctorModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, message: 'Doctor profile deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSpecialties(req: Request, res: Response) {
  try {
    const doctors = await DoctorModel.find();
    const specialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));
    return res.json({ success: true, data: specialties });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
