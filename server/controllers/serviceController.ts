import type { Request, Response } from 'express';
import { ServiceModel } from '../models/index.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllServices(req: Request, res: Response) {
  try {
    const { activeOnly, department } = req.query;
    let filter: any = {};
    if (activeOnly !== 'false') {
      filter.active = true;
    }
    if (department && department !== 'All') {
      filter.department = department;
    }

    const services = await ServiceModel.find(filter);
    return res.json({ success: true, count: services.length, data: services });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getServiceBySlugOrId(req: Request, res: Response) {
  try {
    const { identifier } = req.params;
    let service = await ServiceModel.findOne({ slug: identifier });
    if (!service) {
      service = await ServiceModel.findById(identifier);
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, data: service });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const { name, slug, description, icon, image, department, active = true } = req.body;
    if (!name || !description || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and department are required.',
      });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);
    const existing = await ServiceModel.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A service with this slug/name already exists.',
      });
    }

    const created = await ServiceModel.create({
      name,
      slug: finalSlug,
      description,
      icon: icon || 'Activity',
      image: image || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      department,
      active: active !== false,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = slugify(req.body.name);
    }
    const updated = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const deleted = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
