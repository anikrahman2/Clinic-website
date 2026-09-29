import type { Request, Response } from 'express';
import { AppointmentModel } from '../models/index.js';

function generateAppointmentId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `JCH-${year}-${randomDigits}`;
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const {
      patientName,
      phone,
      email = '',
      age,
      gender,
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      reason,
      message = '',
    } = req.body;

    if (!patientName || !phone || !age || !gender || !doctor || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required appointment details (Patient Name, Phone, Age, Gender, Doctor, Date, Time, and Reason).',
      });
    }

    const appointmentId = generateAppointmentId();

    const newAppointment = await AppointmentModel.create({
      appointmentId,
      patientName: patientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      doctor: doctor.trim(),
      department: department || 'General Medicine',
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
      message: message.trim(),
      status: 'Pending',
      notes: '',
    });

    return res.status(201).json({
      success: true,
      message: 'Your appointment request has been received.',
      appointmentId,
      data: newAppointment,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllAppointments(req: Request, res: Response) {
  try {
    const {
      search,
      status,
      department,
      doctor,
      date,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    let appointments = await AppointmentModel.find();

    // Filters
    if (status && status !== 'All') {
      appointments = appointments.filter((a) => a.status === status);
    }
    if (department && department !== 'All') {
      appointments = appointments.filter((a) => a.department === department);
    }
    if (doctor && doctor !== 'All') {
      appointments = appointments.filter((a) => a.doctor === doctor);
    }
    if (date) {
      appointments = appointments.filter((a) => a.appointmentDate === date);
    }

    // Search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      appointments = appointments.filter(
        (a) =>
          a.appointmentId.toLowerCase().includes(q) ||
          a.patientName.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q)
      );
    }

    // Sorting
    appointments.sort((a: any, b: any) => {
      const fieldA = a[sortBy as string] || '';
      const fieldB = b[sortBy as string] || '';
      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const total = appointments.length;
    const paginated = appointments.slice((pageNum - 1) * limitNum, pageNum * limitNum);

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

export async function getAppointmentByIdOrTracking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let appointment = await AppointmentModel.findOne({ appointmentId: id });
    if (!appointment) {
      appointment = await AppointmentModel.findById(id);
    }

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({ success: true, data: appointment });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, notes, appointmentDate, appointmentTime } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status.' });
    }

    const updatePayload: any = {};
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    if (appointmentDate) updatePayload.appointmentDate = appointmentDate;
    if (appointmentTime) updatePayload.appointmentTime = appointmentTime;

    let updated = await AppointmentModel.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) {
      updated = await AppointmentModel.findOne({ appointmentId: id });
      if (updated) {
        updated = await AppointmentModel.findByIdAndUpdate(updated._id!, updatePayload, { new: true });
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({
      success: true,
      message: `Appointment status updated to ${status || updated.status}`,
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await AppointmentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
