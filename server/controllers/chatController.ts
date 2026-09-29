import type { Request, Response } from 'express';
import { ChatConversationModel, AppointmentModel } from '../models/index.js';
import { AIService } from '../services/aiService.js';

function generateConversationId(): string {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, conversationId, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const activeConvId = conversationId || generateConversationId();
    const activeSessionId = sessionId || 'sess_' + Math.random().toString(36).substring(2, 9);

    let conversation = await ChatConversationModel.findOne({ conversationId: activeConvId });
    if (!conversation) {
      conversation = await ChatConversationModel.create({
        conversationId: activeConvId,
        sessionId: activeSessionId,
        messages: [],
      });
    }

    const history = (conversation.messages || []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Process through AIService
    const result = await AIService.processMessage(message, history);

    const now = new Date().toISOString();
    const updatedMessages = [
      ...(conversation.messages || []),
      { role: 'user' as const, content: message, timestamp: now },
      { role: 'assistant' as const, content: result.reply, timestamp: new Date().toISOString() },
    ];

    await ChatConversationModel.findByIdAndUpdate(conversation._id!, {
      messages: updatedMessages,
    });

    return res.json({
      success: true,
      reply: result.reply,
      conversationId: activeConvId,
      sessionId: activeSessionId,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function bookAppointmentViaChat(req: Request, res: Response) {
  try {
    const {
      patientName,
      phone,
      doctor,
      department = 'General Medicine',
      appointmentDate,
      appointmentTime = '10:00 AM',
      age = 30,
      gender = 'Other',
      reason = 'Consultation requested via Jharna Care Assistant',
    } = req.body;

    if (!patientName || !phone || !doctor || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, phone number, doctor name, and date are required.',
      });
    }

    const year = new Date().getFullYear();
    const appointmentId = `JCH-${year}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment = await AppointmentModel.create({
      appointmentId,
      patientName: patientName.trim(),
      phone: phone.trim(),
      email: '',
      age: Number(age) || 30,
      gender,
      doctor: doctor.trim(),
      department: department.trim(),
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
      message: 'Booked via Jharna Care Assistant Chatbot',
      status: 'Pending',
      notes: 'Initiated through interactive AI chat',
    });

    return res.status(201).json({
      success: true,
      message: `Appointment request ${appointmentId} has been registered! Our hospital reception will call to confirm.`,
      appointmentId,
      data: newAppointment,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getConversations(req: Request, res: Response) {
  try {
    const conversations = await ChatConversationModel.find();
    conversations.sort(
      (a: any, b: any) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );

    const summaries = conversations.map((c: any) => ({
      _id: c._id,
      conversationId: c.conversationId,
      messageCount: c.messages ? c.messages.length : 0,
      lastMessage: c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].content : '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return res.json({ success: true, count: summaries.length, data: summaries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getConversationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let conversation = await ChatConversationModel.findOne({ conversationId: id });
    if (!conversation) {
      conversation = await ChatConversationModel.findById(id);
    }
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    return res.json({ success: true, data: conversation });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getChatAnalytics(req: Request, res: Response) {
  try {
    const conversations = await ChatConversationModel.find();
    const totalConversations = conversations.length;
    let totalMessages = 0;
    const recentQueries: { query: string; timestamp: string }[] = [];

    conversations.forEach((c: any) => {
      if (c.messages) {
        totalMessages += c.messages.length;
        c.messages.forEach((m: any) => {
          if (m.role === 'user') {
            recentQueries.push({
              query: m.content,
              timestamp: m.timestamp || c.createdAt,
            });
          }
        });
      }
    });

    recentQueries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return res.json({
      success: true,
      data: {
        totalConversations,
        totalMessages,
        recentQueries: recentQueries.slice(0, 15),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
