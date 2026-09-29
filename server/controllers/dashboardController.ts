import type { Request, Response } from 'express';
import {
  AppointmentModel,
  DoctorModel,
  ServiceModel,
  InquiryModel,
  ChatConversationModel,
} from '../models/index.js';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const [appointments, doctors, services, inquiries, conversations] = await Promise.all([
      AppointmentModel.find(),
      DoctorModel.find(),
      ServiceModel.find(),
      InquiryModel.find(),
      ChatConversationModel.find(),
    ]);

    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
    const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;
    const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
    const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled' || a.status === 'Rejected').length;

    const totalDoctors = doctors.length;
    const activeDoctors = doctors.filter((d) => d.active).length;
    const totalServices = services.length;
    const newInquiries = inquiries.filter((i) => i.status === 'New').length;
    const totalConversations = conversations.length;

    // Status distribution
    const statusCounts = {
      Pending: pendingAppointments,
      Confirmed: confirmedAppointments,
      Completed: completedAppointments,
      Cancelled: cancelledAppointments,
    };

    // Popular departments
    const departmentMap: Record<string, number> = {};
    appointments.forEach((a) => {
      const dept = a.department || 'General';
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    });
    const popularDepartments = Object.entries(departmentMap).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);

    // Appointments by month (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMap: Record<string, number> = {};
    const dayMap: Record<string, number> = {};

    appointments.forEach((a) => {
      const dateStr = a.appointmentDate || a.createdAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const mKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          monthMap[mKey] = (monthMap[mKey] || 0) + 1;

          const dayKey = d.toISOString().split('T')[0];
          dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
        }
      }
    });

    const appointmentsByMonth = Object.entries(monthMap).map(([month, count]) => ({
      month,
      count,
    }));

    const appointmentsByDay = Object.entries(dayMap)
      .slice(-14)
      .map(([day, count]) => ({
        day,
        count,
      }));

    // Recent appointments
    const recentAppointments = [...appointments]
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6);

    // Recent inquiries
    const recentInquiries = [...inquiries]
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return res.json({
      success: true,
      data: {
        summary: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
          cancelledAppointments,
          totalDoctors,
          activeDoctors,
          totalServices,
          newInquiries,
          totalInquiries: inquiries.length,
          totalConversations,
        },
        charts: {
          statusCounts,
          popularDepartments,
          appointmentsByMonth,
          appointmentsByDay,
        },
        recentAppointments,
        recentInquiries,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
