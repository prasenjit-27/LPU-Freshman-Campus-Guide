import { z } from "zod";

const url = z.string().url();
const src = {
  sourceName: z.string().trim().min(2).max(120),
  sourceUrl: url,
  verificationStatus: z.enum(["verified", "needs_review", "unverified"]).default("needs_review"),
};

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }).max(80),
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(100),
  registrationNumber: z.string().trim().min(2, { message: "Registration number is required." }).max(30),
});

export const requestSignupOtpSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }).max(80),
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(100),
  registrationNumber: z.string().trim().min(2, { message: "Registration number is required." }).max(30),
});

export const verifySignupOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
  otp: z.string().trim().regex(/^\d{6}$/, { message: "OTP must be a 6-digit numeric code." }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, { message: "Invalid or expired reset token." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(100),
});

export const profileSchema = z.object({
  programme: z.string().trim().max(100).default(""),
  school: z.string().trim().max(100).default(""),
  year: z.string().trim().max(20).default(""),
  accommodation: z.enum(["", "hostel", "off-campus", "day-scholar"]).default(""),
  interests: z.string().trim().max(200).default(""),
  registrationNumber: z.string().trim().max(30).default(""),
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
      publishedAt: z.coerce.date().default(() => new Date()),
      ...src,
    }),
  },
  faqs: {
    collection: "faqs",
    schema: z.object({
      question: z.string().trim().min(5).max(200),
      answer: z.string().trim().min(5).max(4000),
      category: z.string().trim().min(2).max(40),
      ...src,
    }),
  },
  events: {
    collection: "events",
    schema: z.object({
      title: z.string().trim().min(2).max(150),
      description: z.string().trim().max(3000).default(""),
      location: z.string().trim().max(120).default(""),
      startsAt: z.coerce.date(),
      endsAt: z.coerce.date().optional(),
      category: z.string().trim().max(40).default("orientation"),
      ...src,
    }),
  },
};
