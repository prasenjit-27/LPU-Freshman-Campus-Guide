# LPU Freshman Guide (unofficial)

Next.js 14 (App Router, JavaScript only) + Tailwind + MongoDB driver + NextAuth (credentials) + Zod.

## Setup
1. `npm install`
2. `cp .env.example .env.local` and fill `MONGODB_URI`, `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. `npm run dev`
4. Optional: `npm run seed` (sets source records; run with `node --env-file=.env.local scripts/seed.mjs`).
5. Sign up, then `node --env-file=.env.local scripts/make-admin.mjs you@example.com` to become admin. Add locations at `/admin`.

## Google Maps
Create a Cloud project, enable billing and the Maps JavaScript API, create a browser key restricted to your origins and that API, set a budget alert. Without a key, the map page shows the list only.

## Data
Official LPU URLs are listed in `src/data/sources.js`, all marked `unverified`: their contents were NOT inspected when this was generated. No coordinates, phone numbers, fees or hours are included. Verify each against the official page and add through `/admin`.

## Implemented
Public: home, campus map (markers, category filter, search, walking directions between two locations, Google Maps links, geolocation on request), directory search, announcements, events (upcoming/past, search), FAQs/help, academics, hostel, dining, student-life guides, safety, first-15-days guide.
Signed in: signup/login/logout, profile edit, dashboard, saved locations, per-user task progress.
Admin (role=admin): create/delete locations, announcements, events, FAQs, with audit log. Signup never grants admin.

## Tested
`npm install`, `next lint` (clean), `next build` (passes), production smoke test: public pages return 200, private pages redirect, APIs reject unauthenticated/invalid requests.
Not tested: anything needing a live MongoDB (signup, login, saved items, admin writes, progress persistence) or a Google Maps key (map rendering, directions).

## Known limitations
No LPU facts, coordinates, phone numbers, fees or hours are bundled; all source records are `unverified` until you check them. Guide pages link to official sources. Rate limiting is in-memory (per instance). No automated tests, no onboarding-task editor (tasks live in `src/data/tasks.js`), no buddy matching, no image uploads, no MongoDB schema 