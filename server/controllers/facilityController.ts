import type { Request, Response } from 'express';
import { FacilityModel, GalleryModel } from '../models/index.js';

// --- Facilities ---
export async function getAllFacilities(req: Request, res: Response) {
  try {
    const { activeOnly, category } = req.query;
    let filter: any = {};
    if (activeOnly !== 'false') filter.active = true;
    if (category && category !== 'All') filter.category = category;

    const facilities = await FacilityModel.find(filter);
    facilities.sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: facilities.length, data: facilities });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createFacility(req: Request, res: Response) {
  try {
    const { title, description, image, category, active = true, order = 0 } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required.',
      });
    }

    const created = await FacilityModel.create({
      title,
      description,
      image: image || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      category,
      active: active !== false,
      order: Number(order) || 0,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateFacility(req: Request, res: Response) {
  try {
    const updated = await FacilityModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteFacility(req: Request, res: Response) {
  try {
    const deleted = await FacilityModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    return res.json({ success: true, message: 'Facility deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- Gallery ---
export async function getAllGallery(req: Request, res: Response) {
  try {
    const { activeOnly, category } = req.query;
    let filter: any = {};
    if (activeOnly !== 'false') filter.active = true;
    if (category && category !== 'All') filter.category = category;

    const gallery = await GalleryModel.find(filter);
    gallery.sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: gallery.length, data: gallery });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createGalleryItem(req: Request, res: Response) {
  try {
    const { title, description = '', image, category = 'General', active = true, order = 0 } = req.body;
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required.' });
    }

    const created = await GalleryModel.create({
      title,
      description,
      image,
      category,
      active: active !== false,
      order: Number(order) || 0,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateGalleryItem(req: Request, res: Response) {
  try {
    const updated = await GalleryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteGalleryItem(req: Request, res: Response) {
  try {
    const deleted = await GalleryModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    return res.json({ success: true, message: 'Gallery photo deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
