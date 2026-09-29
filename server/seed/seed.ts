import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import {
  AdminModel,
  DoctorModel,
  ServiceModel,
  FacilityModel,
  GalleryModel,
  SettingsModel,
  FAQModel,
  AppointmentModel,
  InquiryModel,
  DiagnosticTestModel,
  TestOrderModel,
} from '../models/index.js';
import { getSeedData } from './seedData.js';

export async function runSeed(force = false) {
  try {
    await connectDB();
    const existingAdmins = await AdminModel.countDocuments();
    const existingTests = await DiagnosticTestModel.countDocuments();

    if (existingAdmins > 0 && existingTests > 0 && !force) {
      console.log('ℹ️ Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Seeding database with Jharna Clinic & Hospital demo data...');
    const seed = await getSeedData();

    // Clear existing if force
    if (force) {
      await AdminModel.deleteMany();
      await DoctorModel.deleteMany();
      await ServiceModel.deleteMany();
      await FacilityModel.deleteMany();
      await GalleryModel.deleteMany();
      await SettingsModel.deleteMany();
      await FAQModel.deleteMany();
      await AppointmentModel.deleteMany();
      await InquiryModel.deleteMany();
      await DiagnosticTestModel.deleteMany();
      await TestOrderModel.deleteMany();
    }

    if (existingAdmins === 0 || force) {
      await AdminModel.create(seed.admin);
      await SettingsModel.create(seed.hospitalSettings);
      await DoctorModel.insertMany(seed.doctors);
      await ServiceModel.insertMany(seed.services);
      await FacilityModel.insertMany(seed.facilities);
      await GalleryModel.insertMany(seed.gallery);
      await FAQModel.insertMany(seed.faqs);
      await AppointmentModel.insertMany(seed.appointments);
      await InquiryModel.insertMany(seed.inquiries);
    }

    if (existingTests === 0 || force) {
      await DiagnosticTestModel.insertMany(seed.diagnosticTests);
      await TestOrderModel.insertMany(seed.testOrders);
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`👤 Admin Account created: ${seed.admin.email}`);
    console.log('🧪 Diagnostic Tests & E-Commerce catalog loaded.');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
}

// Allow direct CLI execution: `npx tsx server/seed/seed.ts`
if (process.argv[1]?.includes('seed.ts')) {
  runSeed(true).then(() => {
    process.exit(0);
  });
}
