# Jharna Clinic & Hospital — Jashore, Bangladesh
### Production-Ready Full-Stack MERN Healthcare Portal & Hospital Management System

Google Maps Location Reference: [https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac](https://maps.app.goo.gl/k6xdYuB2rmTVfh7c8?g_st=ac)

---

## 🏥 Overview

Jharna Clinic & Hospital is a comprehensive healthcare web application and hospital management portal built with the **MERN** stack (MongoDB, Express.js, React.js, and Node.js). It provides a patient-facing medical portal alongside a dedicated SaaS-grade hospital administrative console.

### Key Capabilities
- **Public Patient Portal**:
  - High-performance, mobile-first design with medical teal/cyan healthcare styling.
  - Interactive doctor directory with credentials, visiting hours, and specialty filters.
  - Service and department guides (Maternal health, general surgery, pediatric care, diagnostic pathology).
  - Online appointment booking generating unique tracking codes (e.g. `JCH-2026-XXXXXX`).
  - Google Maps integration and direct GPS directions to Jashore clinic premises.
  - Patient & attendant admission/visiting hours guide.
- **Jharna Care Assistant (AI Chatbot)**:
  - Powered by Gemini / configurable AI service via backend proxy.
  - Dynamically queries active doctors, clinic departments, and FAQs directly from the database.
  - Interactive appointment booking assistant right inside the chat window.
  - **Strict Medical Safety Guardrails**: Refuses clinical diagnoses and drug prescriptions; escalates acute symptoms immediately to the 24/7 hospital emergency helpline.
- **Dedicated Admin Management Panel** (`/admin`):
  - Completely isolated from public styling with dark slate SaaS ergonomics.
  - Secure JWT authentication with HTTP-only cookies and bcrypt password hashing.
  - Real-time operations dashboard with KPI counters and monthly/department trend charts.
  - Appointment Management: Search, status updates (Pending, Confirmed, Completed, Cancelled, Rejected), schedule revisions.
  - Doctor Directory CRUD: Visiting schedules, photo updates, active toggles.
  - Services & Facilities CRUD: Image management and category classification.
  - Patient Records: Aggregated patient profiles with appointment histories.
  - Inquiries & Feedback Inbox: Contact form inquiries with status tracking.
  - Hospital Settings: Real-time configuration of hospital name, phone numbers, emergency hotline, Google Maps link, and opening hours that instantly propagate across the public portal without code changes.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js REST API with centralized error handling.
- **Database**: MongoDB with Mongoose schemas & indexes, plus a zero-crash persistent store for dev/testing.
- **AI Engine**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with dynamic context grounding.
- **Security**: JWT tokens, bcryptjs hashing, HTTP-only cookies, CORS, and role-based route guards.

---

## 📋 Requirements

- **Node.js**: `v20.x` or later
- **npm**: `v9.x` or later
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI (optional; automatic fallback store provided for sandbox environments)

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd jharna-clinic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your configuration:
   ```env
   # MongoDB Connection
   MONGO_URI="mongodb://localhost:27017/jharna_clinic"

   # JWT Secret Key
   JWT_SECRET="jharna_clinic_super_secret_jwt_key_2026"

   # Server Port & URLs
   PORT=3000
   APP_URL="http://localhost:3000"
   CLIENT_URL="http://localhost:3000"

   # Gemini AI API Configuration
   GEMINI_API_KEY="your-gemini-api-key"
   AI_API_KEY="your-gemini-api-key"
   AI_MODEL="gemini-3.8-flash"

   # Initial Administrator Account
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="change-this-password"
   ```

4. **Seed Database with Sample Hospital Data**:
   Populates the database with realistic sample doctors, departments, facilities, FAQs, and the initial administrator account:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🔑 Administrator Access

- **Admin Login Route**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@example.com`
- **Default Password**: `change-this-password` *(or configured via `ADMIN_PASSWORD`)*
- *Tip: The login screen contains an "Autofill Default Admin Credentials" button for testing.*
- The administrator can change their password anytime via the sidebar user menu or upon initial login.

---

## 🏥 Hospital Configuration

Hospital administrators do **not** need to modify source code to update hospital contact information, opening hours, or emergency hotlines:
1. Navigate to `/admin/settings`.
2. Edit **Emergency Phone**, **General Phone**, **Google Maps URL**, **Opening Hours**, or **Address**.
3. Click **Save & Publish Hospital Information**.
4. All public website sections (hero banner, header, footer, location cards, and AI chatbot knowledge) update dynamically!

---

## 📦 Production Build & Deployment

1. **Build frontend assets**:
   ```bash
   npm run build
   ```
2. **Start the production server**:
   ```bash
   npm start
   ```
   Express serves the built client from `/dist` and powers all `/api/*` endpoints on port 3000.

---

## 🔒 Patient Privacy & Medical Disclaimer

Jharna Clinic & Hospital adheres to patient privacy principles:
- Only necessary contact and medical reason details are gathered for appointment bookings.
- The online assistant and portal are informational and scheduling utilities.
- For all acute medical conditions or emergencies, patients must immediately contact emergency medical services or proceed to the physical hospital triage in Jashore.
