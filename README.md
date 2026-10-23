# LPU Freshman Guide (Unofficial Student Companion)

Next.js 14 (App Router, JavaScript only) + Tailwind CSS + MongoDB driver + NextAuth.js v4 (Credentials) + Zod + Lucide React.

---

## 1. Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   * `MONGODB_URI`: Your MongoDB instance or Atlas connection string.
   * `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`.
   * `NEXTAUTH_URL`: `http://localhost:3000` (or your production deployment domain).
   * `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Browser-restricted Google Maps API key (requires Maps JavaScript API and Directions API enabled). Graceful fallback is included if omitted.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 2. Authentication & User Roles

* **Visitors (Not Logged In)**:
  * Opening `/` renders the **Public Landing Dashboard** featuring guides, campus orientation, FAQs, announcements, and official university resource links.
  * Attempting to access protected student tools (`/campus-map`, `/freshmen-guide`, `/academics`, `/hostel`, `/dining`, `/services`, `/events`, `/settings`) safely redirects to `/login` with an automatic return `callbackUrl`.

* **Authenticated Students**:
  * Logging in redirects immediately to `/`, which displays the personalized **Student Dashboard** with onboarding progress, saved locations, academic links, and recent notices.

* **Administrators & Role Assignment**:
  * Admins manage users exclusively via `/admin` (non-admins receive a `403 Forbidden`).
  * Sign up normally via `/signup`.
  * Elevate your account securely via CLI:
    ```bash
    node --env-file=.env.local scripts/make-admin.mjs you@example.com
    ```
  * Public signups can never self-assign administrative permissions.

---

## 3. Admin User Management Directory (`/admin`)

The `/admin` portal is dedicated **strictly to user management**:
1. **User Directory**: Search by name/email, filter by role and status, view paginated results.
2. **Account Moderation**: Activate or deactivate student/admin accounts.
3. **Role Management**: Promote students to administrators or demote administrators (with lockout prevention).
4. **Password Reset**: Securely set temporary password credentials for users who lost access.
5. **Account Deletion**: Explicit confirmation modal that safely purges user progress, saved spots, and profile records.
6. **Audit Logging**: All admin modifications are recorded to the `auditLogs` collection with timestamps, actor IDs, and outcomes.

---

## 4. Google Maps API Configuration & Quotas

* Go to the [Google Cloud Console](https://console.cloud.google.com/).
* Enable **Maps JavaScript API** and **Directions API**.
* Create an API Key and set **Application restrictions** to **HTTP referrers (web sites)**:
  * `http://localhost:3000/*`
  * `https://your-production-domain.com/*`
* If the API key is not configured, the app provides a graceful directory view without breaking or crashing the interface.
