import type { Request, Response } from 'express';
import { DiagnosticTestModel, TestOrderModel } from '../models/index.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `JCH-DIAG-${year}-${randomNum}`;
}

export async function getAllDiagnosticTests(req: Request, res: Response) {
  try {
    const { category, search, isPackage, isPopular, activeOnly, sortBy } = req.query;

    let filter: any = {};
    if (activeOnly !== 'false') {
      filter.active = true;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (isPackage === 'true') {
      filter.isPackage = true;
    }
    if (isPopular === 'true') {
      filter.isPopular = true;
    }

    let tests = await DiagnosticTestModel.find(filter);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      tests = tests.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.sampleType && t.sampleType.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      tests.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price_desc') {
      tests.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'popular') {
      tests.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else {
      tests.sort((a, b) => (b.isPackage ? 1 : 0) - (a.isPackage ? 1 : 0));
    }

    return res.json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDiagnosticTestByIdOrSlug(req: Request, res: Response) {
  try {
    const { identifier } = req.params;
    let test = await DiagnosticTestModel.findOne({ slug: identifier });
    if (!test) {
      test = await DiagnosticTestModel.findOne({ code: identifier.toUpperCase() });
    }
    if (!test) {
      test = await DiagnosticTestModel.findById(identifier);
    }

    if (!test) {
      return res.status(404).json({ success: false, message: 'Diagnostic test not found' });
    }

    return res.json({ success: true, data: test });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createDiagnosticTest(req: Request, res: Response) {
  try {
    const {
      name,
      code,
      slug,
      category,
      price,
      discountPrice,
      sampleType,
      fastingRequired = false,
      fastingHours = 0,
      turnaroundTime,
      parametersCount = 1,
      description,
      preparationNotes = '',
      isPopular = false,
      isPackage = false,
      packageTests = [],
      active = true,
    } = req.body;

    if (!name || !category || price === undefined || !sampleType || !turnaroundTime || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price, sample type, turnaround time, and description are required.',
      });
    }

    const testSlug = slug ? slugify(slug) : slugify(name);
    const testCode = code ? code.toUpperCase() : 'JCH-' + Math.floor(100 + Math.random() * 900);

    const existing = await DiagnosticTestModel.findOne({ code: testCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A test with this code already exists.',
      });
    }

    const created = await DiagnosticTestModel.create({
      name,
      code: testCode,
      slug: testSlug,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      sampleType,
      fastingRequired: Boolean(fastingRequired),
      fastingHours: Number(fastingHours) || 0,
      turnaroundTime,
      parametersCount: Number(parametersCount) || 1,
      description,
      preparationNotes,
      isPopular: Boolean(isPopular),
      isPackage: Boolean(isPackage),
      packageTests: Array.isArray(packageTests) ? packageTests : [],
      active: active !== false,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateDiagnosticTest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = await DiagnosticTestModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Diagnostic test not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteDiagnosticTest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await DiagnosticTestModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Diagnostic test not found' });
    }
    return res.json({ success: true, message: 'Diagnostic test removed successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- Test Order Operations (E-Commerce Checkout) ---
export async function createTestOrder(req: Request, res: Response) {
  try {
    const {
      patientName,
      phone,
      email = '',
      age,
      gender,
      collectionType = 'Hospital Visit',
      address = '',
      preferredDate,
      preferredTimeSlot = 'Morning (08:00 AM - 11:30 AM)',
      items = [],
      paymentMethod = 'Cash on Collection / Counter',
    } = req.body;

    if (!patientName || !phone || !age || !gender || !preferredDate || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Patient Name, Phone, Age, Gender, Date, and selected tests).',
      });
    }

    if (collectionType === 'Home Sample Collection' && !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide home delivery/sample pickup address in Jashore.',
      });
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0), 0);
    // Home collection is 100 BDT or free if order >= 2000 BDT
    const collectionFee = collectionType === 'Home Sample Collection' ? (subtotal >= 2000 ? 0 : 100) : 0;
    const totalAmount = subtotal + collectionFee;
    const orderId = generateOrderId();

    const order = await TestOrderModel.create({
      orderId,
      patientName: patientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: Number(age),
      gender,
      collectionType,
      address: address.trim(),
      preferredDate,
      preferredTimeSlot,
      items: items.map((it: any) => ({
        testId: it.testId || it._id,
        name: it.name,
        code: it.code || 'TEST',
        price: Number(it.price),
      })),
      subtotal,
      collectionFee,
      totalAmount,
      status: 'Pending',
      paymentMethod,
      paymentStatus: 'Unpaid',
      reportNotes: '',
    });

    return res.status(201).json({
      success: true,
      message: 'Your diagnostic test booking has been confirmed!',
      orderId,
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllTestOrders(req: Request, res: Response) {
  try {
    const { search, status, collectionType } = req.query;
    let orders = await TestOrderModel.find();

    if (status && status !== 'All') {
      orders = orders.filter((o) => o.status === status);
    }
    if (collectionType && collectionType !== 'All') {
      orders = orders.filter((o) => o.collectionType === collectionType);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.patientName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
      );
    }

    orders.sort(
      (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getTestOrderByIdOrTracking(req: Request, res: Response) {
  try {
    const { identifier } = req.params;
    let order = await TestOrderModel.findOne({ orderId: identifier.toUpperCase().trim() });
    if (!order) {
      order = await TestOrderModel.findById(identifier);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Test booking order not found.' });
    }

    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateTestOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, paymentStatus, reportNotes } = req.body;

    const payload: any = {};
    if (status) payload.status = status;
    if (paymentStatus) payload.paymentStatus = paymentStatus;
    if (reportNotes !== undefined) payload.reportNotes = reportNotes;

    const updated = await TestOrderModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      message: `Diagnostic order status updated to ${status || updated.status}`,
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteTestOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await TestOrderModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, message: 'Test order record deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
