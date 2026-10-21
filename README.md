
# LPU Freshman Guide (unofficial)

Next.js 14 (App Router, JavaScript only) + Tailwind + MongoDB driver + NextAuth (credentials) + Zod.

## Setup
1. `npm install`
2. `cp .env.example .env.local` and fill `MONGODB_URI`, `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. `npm run dev`
4. Optional: `npm run seed` (sets source records; run with `node --env-file=.env.local scripts/seed.mjs`).
5. Sign up, then `node --env-file=.env.local scripts/make-admin.mjs you@example.com` to become admin. Add locations at `/admin`.

