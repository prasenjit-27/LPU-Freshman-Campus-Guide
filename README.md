# Lovely Professional University (LPU) — Freshman Campus Guide

> **Live Deployment:** [https://lpu-campus-guide.vercel.app/](https://lpu-campus-guide.vercel.app/)

A comprehensive, production-grade, neo-brutalist web companion engineered for freshmen navigating Lovely Professional University's 600+ acre campus. Built with Next.js 14 (App Router), Tailwind CSS, MongoDB, NextAuth.js, Brevo Email API, and MapLibre GL JS.

---

## Table of Contents
- [Overview](#overview)
- [Live Demo & Credentials](#live-demo--credentials)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Authentication & Access Control](#authentication--access-control)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Deployment Guide (Vercel)](#deployment-guide-vercel)
- [Admin Management](#admin-management)
- [Security & Best Practices](#security--best-practices)

---

## Overview

Starting at a mega-campus like Lovely Professional University can be overwhelming for new students. The **LPU Freshman Campus Guide** provides an end-to-end digital onboarding portal featuring:
- Interactive campus mapping across 600+ acres.
- Step-by-step checklist for the first 15 days on campus with progress tracking.
- Verified academic, hostel, mess, healthcare, and security directory.
- Official institutional resource hub (UMS, Induction Portal, Anti-Ragging Cell, Hospital, Security).
- Student onboarding progress monitoring for university administrators.

---

## Live Demo & Credentials

- **Live URL:** [https://lpu-campus-guide.vercel.app/](https://lpu-campus-guide.vercel.app/)
- **Admin Portal:** [https://lpu-campus-guide.vercel.app/admin](https://lpu-campus-guide.vercel.app/admin)

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `coding.prasenjit@gmail.com` | `Temp@123` | Full access to `/admin` User Management & Progress Monitor |
| **Student** | Any self-registered email | Set during signup | Student Dashboard, Map, Onboarding Tasks, Profile |

---

## Key Features

### 1. Neo-Brutalist UI System
- High-contrast visual hierarchy with sharp black borders (`border-2`, `border-4`), bold shadows (`shadow-neo`, `shadow-neo-xl`), and crisp slate-gray background (`bg-slate-100`).
- Responsive mobile menu drawer and accessible typography.

### 2. Dual Experience (Visitor vs. Authenticated Student)
- **Public Visitor:** Landing page highlighting essentials, FAQs, directory snippets, and verified source citations.
- **Authenticated Student:** Direct access to interactive checklist tasks, real-time progress calculations (`x / 15 Tasks Completed`), campus map, and personal profile settings.

### 3. Interactive Campus Map
- Powered by **MapLibre GL JS** and OpenStreetMap tiles.
- Clean 2D cartography centered on LPU grounds with pan/zoom navigation, compass, and bounding restrictions to keep users focused on campus.
- **Zero API keys required** — no Google Maps quota or billing limitations.

### 4. Admin Management & Progress Portal (`/admin`)
- Accessible only by users with the `admin` role (non-admins receive an automatic `403 Forbidden`).
- **Student Metrics**: Live counter of all registered students.
- **Progress Tracking**: Numeric display of each student's task completion (e.g. `2 / 15 Tasks Completed`).
- **User Moderation**: 1-click **Block User** / **Unblock User** action. Blocked users are immediately rejected by middleware and login handlers.
- Filtered table excluding admin accounts to keep the focus strictly on student onboarding.

### 5. Email Verification & Password Recovery (Brevo API)
- Real 6-digit OTP verification on student registration using Brevo Transactional Email API.
- Forgot Password flow with time-expiring reset tokens delivered via email.
- In-place password update under `/settings` with current password validation.

---

## Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14.2 (App Router)** | Server Components, Client Components, Dynamic API Routes |
| **Styling** | **Tailwind CSS** | Custom neo-brutalist theme, responsive layouts |
| **Database** | **MongoDB (Atlas)** | Official Node.js native driver (`mongodb` v6) with connection caching |
| **Authentication** | **NextAuth.js v4** | JWT strategy, bcryptjs password hashing, custom authorization |
| **Validation** | **Zod** | Strict schema validation for auth, profile, and admin requests |
| **Email Service** | **Brevo (Sendinblue)** | Transactional email delivery for OTP and password recovery |
| **Mapping Engine** | **MapLibre GL JS** | Interactive client-side vector/raster map canvas |
| **Icons** | **Lucide React** | Clean, accessible iconography |

---

## Project Directory Structure

```text
├── public/
│   └── lpu-logo.png               # Official LPU brand asset
├── scripts/
│   ├── make-admin.mjs             # CLI utility to elevate accounts to admin
│   └── seed.mjs                   # Seed initial content sources
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx
│   │   │   ├── signup/page.jsx
│   │   │   └── forgot-password/page.jsx
│   │   ├── admin/page.jsx         # Admin User Management & Progress
│   │   ├── api/
│   │   │   ├── admin/users/route.js
│   │   │   ├── auth/              # [...nextauth], change-password, forgot, reset, otp
│   │   │   ├── profile/route.js
│   │   │   └── progress/route.js
│   │   ├── campus-map/page.jsx    # Campus map route
│   │   ├── settings/page.jsx      # Profile & password management
│   │   ├── layout.jsx             # Global navbar, footer, metadata
│   │   └── page.jsx               # Landing / Dashboard controller
│   ├── components/
│   │   ├── AdminUserManager.jsx   # Admin table & action controllers
│   │   ├── AuthForm.jsx           # Login & registration forms
│   │   ├── MapView.jsx            # MapLibre map component
│   │   ├── Nav.jsx                # Responsive navbar & reliable sign-out
│   │   ├── ProfileForm.jsx        # Account & password reset form
│   │   ├── PublicLanding.jsx      # Public presentation view
│   │   ├── StudentDashboard.jsx   # Authenticated student view
│   │   └── TaskList.jsx           # Task checklist component
│   ├── data/
│   │   ├── campusLocations.js     # Campus coordinates & facility points
│   │   ├── faqsData.js            # Frequently asked questions
│   │   ├── guides.js & guidesData.js
│   │   ├── sources.js             # Verified university URLs
│   │   └── tasks.js               # 15 onboarding task definitions
│   ├── lib/
│   │   ├── auth.js                # NextAuth options & JWT callbacks
│   │   ├── brevo.js               # Transactional email dispatcher
│   │   ├── mongodb.js             # Cached MongoDB client connection
│   │   ├── rate.js                # Memory rate limiter for auth endpoints
│   │   └── validation.js          # Zod validation schemas
│   └── middleware.js              # Route guard enforcing authentication & blocked checks
├── .env.example                   # Template for environment configuration
├── .gitignore                     # Git ignore rules for credentials & builds
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind design tokens & shadow utilities
└── package.json                   # Dependencies and npm scripts
```

---

## Authentication & Access Control

1. **Password Hashing:** Passwords are encrypted with `bcryptjs` (salt rounds: 12) before persistence in MongoDB.
2. **Session Model:** Uses stateless, encrypted JWT cookies (`maxAge: 7 days`).
3. **Route Protection (`middleware.js`):**
   - Intercepts requests to `/campus-map`, `/freshmen-guide`, `/academics`, `/hostel`, `/dining`, `/services`, `/events`, `/buddy`, `/settings`, and `/dashboard`.
   - Redirects unauthenticated users to `/login` with an automatic `callbackUrl` query parameter.
   - Immediately terminates sessions if an account status is set to `deactivated`.
4. **Reliable Sign-Out:** Uses `signOut({ redirect: false })` combined with an explicit window reload to completely bust App Router caches and ensure cookies are purged across any deployment domain.

---

## Environment Configuration

Create a `.env.local` file in the project root (reference: `.env.example`):

```env
# MongoDB Connection (Local or Atlas SRV)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lpu_freshman

# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-32-byte-base64-secret
NEXTAUTH_URL=http://localhost:3000

# Brevo (Sendinblue) Transactional Emails
BREVO_API_KEY=xkeysib-your-brevo-api-key
BREVO_SENDER_EMAIL=coding.prasenjit@gmail.com
BREVO_SENDER_NAME=LPU Freshman Guide
```

---

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/LPU-Freshman-Campus-Guide.git
   cd LPU-Freshman-Campus-Guide
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Update variables in .env.local
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run production build test:**
   ```bash
   npm run build
   ```

---

## Deployment Guide (Vercel)

1. **Push your code to GitHub / GitLab.**
2. **Import project into Vercel.**
3. **Add Environment Variables in Vercel Project Settings:**
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to `https://lpu-campus-guide.vercel.app`)
   - `BREVO_API_KEY`
   - `BREVO_SENDER_EMAIL`
   - `BREVO_SENDER_NAME`
4. **Deploy:** Vercel will automatically build the Next.js App Router project and deploy it to edge CDN nodes.

---

## Admin Management

To grant administrator permissions to any registered user, run:

```bash
node --env-file=.env.local scripts/make-admin.mjs student@example.com
```

Once granted:
- The user gains access to [/admin](https://lpu-campus-guide.vercel.app/admin).
- Admins can view all students, inspect their onboarding progress, and toggle account access with a single click.

---

## Security & Best Practices

- **Zero API Quota Leaks:** No commercial map tokens exposed in client bundles.
- **Strict Rate Limiting:** In-memory rate limiting on authentication routes (`/api/auth/*`) to prevent credential stuffing and OTP spam.
- **Input Sanitization:** All payload inputs validated with Zod before database queries.
- **Secure Credentials:** `.env*` files are strictly excluded via `.gitignore` to prevent secret leakage.

---

## License

This project is created as an independent, educational student guide and companion for Lovely Professional University freshmen.
