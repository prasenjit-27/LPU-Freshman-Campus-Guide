import { sources as s } from "@/data/sources";
const g = (title, intro, items) => ({ title, intro, items });
export const guides = {
  academics: g("Academics and UMS", "How to use the official systems. This site never asks for your UMS credentials.", [
    ["UMS", "The official student services system. Read the overview before first login.", s.ums],
    ["Academic calendar", "Find the calendar that matches your programme and term.", s.calendar],
    ["Libraries", "Library facilities and services.", s.libraries]]),
  hostel: g("Hostel and residential guide", "Fees, rules and contacts change. Always confirm on the official page.", [
    ["Residential services", "Accommodation types, facilities and policies.", s.residence],
    ["Reporting and documents", "Check the reporting process for what to carry on arrival.", s.reporting],
    ["What to bring", "Official packing guidance.", s.bring]]),
  dining: g("Dining and daily necessities", "Food outlets and shopping on campus.", [
    ["Shopping and dining", "Official list of outlets and services.", s.dining],
    ["Transport", "Getting around and to the city.", s.transport]]),
  "student-life": g("Student life", "Events, communities and campus networks. Community advice is unofficial and labelled as such.", [
    ["LPU Happenings", "Public events and happenings.", s.happenings],
    ["Libraries and study spaces", "Quiet study resources.", s.libraries],
    ["Healthcare", "Student wellbeing and medical services.", s.healthcare]]),
};
