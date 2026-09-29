import type { Request, Response } from 'express';
import { FAQModel, InquiryModel } from '../models/index.js';

// --- FAQs ---
export async function getAllFAQs(req: Request, res: Response) {
  try {
    const { activeOnly, category } = req.query;
    let filter: any = {};
    if (activeOnly !== 'false') filter.active = true;
    if (category && category !== 'All') filter.category = category;

    const faqs = await FAQModel.find(filter);
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: faqs.length, data: faqs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createFAQ(req: Request, res: Response) {
  try {
    const { question, answer, category = 'General', active = true, order = 0 } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const created = await FAQModel.create({
      question,
      answer,
      category,
      active: active !== false,
      order: Number(order) || 0,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateFAQ(req: Request, res: Response) {
  try {
    const updated = await FAQModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteFAQ(req: Request, res: Response) {
  try {
    const deleted = await FAQModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    return res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- Inquiries ---
export async function createInquiry(req: Request, res: Response) {
  try {
    const { name, phone, email = '', subject, message } = req.body;
    if (!name || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, subject, and message are required.',
      });
    }

    const created = await InquiryModel.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'New',
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your message has been sent to Jharna Clinic & Hospital.',
      data: created,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllInquiries(req: Request, res: Response) {
  try {
    const { status, search } = req.query;
    let inquiries = await InquiryModel.find();

    if (status && status !== 'All') {
      inquiries = inquiries.filter((i) => i.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      inquiries = inquiries.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q) ||
          i.subject.toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q)
      );
    }

    inquiries.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateInquiryStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!status || !['New', 'Read', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid inquiry status' });
    }

    const updated = await InquiryModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteInquiry(req: Request, res: Response) {
  try {
    const deleted = await InquiryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
