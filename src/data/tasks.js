import { sources as s } from "@/data/sources";
const t = (id, stage, title, description, src, priority = "suggested") => ({ id, stage, title, description, priority, source: src });
export const tasks = [
  t("before-1", "Before arrival", "Read the induction page", "Review the official induction information and schedule.", s.induction),
  t("before-2", "Before arrival", "Check what to bring", "Compare your packing list with the official list.", s.bring),
  t("report-1", "Reporting", "Review the reporting process", "Understand the official reporting steps and documents.", s.reporting),
  t("stay-1", "Accommodation", "Read residence information", "Learn about accommodation options and policies.", s.residence),
  t("ums-1", "UMS setup", "Learn about UMS", "Read the official UMS overview. Never share your password with any third-party site.", s.ums),
  t("acad-1", "Academics", "Find the academic calendar", "Locate the calendar for your programme.", s.calendar),
  t("lib-1", "Library", "Explore library services", "See what the university libraries offer.", s.libraries, "optional"),
  t("dine-1", "Daily needs", "Look up dining and shopping", "Find food and daily-necessity options.", s.dining, "optional"),
  t("safe-1", "Safety", "Save safety and anti-ragging contacts", "Note official safety, health and anti-ragging resources.", s.antiragging, "important"),
  t("life-1", "Student life", "Browse LPU Happenings", "See what events are listed publicly.", s.happenings, "optional"),
];
