import { z } from "zod";

const url = z.string().url();
const src = {
  sourceName: z.string().trim().min(2).max(120),
  sourceUrl: url,
  verificationStatus: z.enum(["verified", "needs_review", "unverified"]).default("needs_review"),
};

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});

export const profileSchema = z.object({
  programme: z.string().trim().max(100).default(""),
  school: z.string().trim().max(100).default(""),
  year: z.string().trim().max(20).default(""),
  accommodation: z.enum(["", "hostel", "off-campus", "day-scholar"]).default(""),
  interests: z.string().trim().max(200).default(""),
});

// Admin User Management Validation Schemas
export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["student", "admin"]).optional(),
  status: z.enum(["active", "deactivated"]).optional(),
  newPassword: z.string().min(8).max(100).optional(),
});

export const adminUserQuerySchema = z.object({
  q: z.string().max(80).default(""),
  role: z.enum(["all", "student", "admin"]).default("all"),
  status: z.enum(["all", "active", "deactivated"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
});

// Existing content schemas kept intact to preserve working legacy/seed collections
export const adminSchemas = {
  locations: {
    collection: "campusLocations",
    schema: z.object({
      name: z.string().trim().min(2).max(120),
      category: z.string().trim().min(2).max(40),
      description: z.string().trim().max(500).default(""),
      lat: z.coerce.number().min(-90).max(90),
      lng: z.coerce.number().min(-180).max(180),
      ...src,
    }),
  },
  announcements: {
    collection: "announcements",
    schema: z.object({
      title: z.string().trim().min(2).max(150),
      summary: z.string().trim().max(300).default(""),
      content: z.string().trim().max(5000).default(""),
      category: z.string().trim().max(40).default("general"),
      pinned: z.coerce.boolean().default(false),
      expiresAt: z.coerce.date().optional(),
      ...src,
    }),
  },
  events: {
    collection: "events",
    schema: z.object({
      name: z.string().trim().min(2).max(150),
      description: z.string().trim().max(2000).default(""),
      startsAt: z.coerce.date(),
      endsAt: z.coerce.date().optional(),
      venue: z.string().trim().max(150).default(""),
      category: z.string().trim().max(40).default("general"),
      registrationUrl: url.optional(),
      ...src,
    }),
  },
  faqs: {
    collection: "faqs",
    schema: z.object({
      question: z.string().trim().min(3).max(200),
      answer: z.string().trim().min(3).max(3000),
      category: z.string().trim().max(40).default("general"),
      ...src,
    }),
  },
};
