const B = "https://www.lpu.in";
const mk = (name, url) => ({ sourceName: name, sourceUrl: url, sourceType: "official", verificationStatus: "unverified", lastVerifiedAt: null });
export const sources = {
  induction: mk("Freshmen Induction", `${B}/events/freshmeninduction/freshmen-induction.php`),
  reporting: mk("Reporting process", `${B}/events/freshmeninduction/reporting-process.php`),
  bring: mk("What to bring", `${B}/events/freshmeninduction/what-to-bring.php`),
  schedule: mk("Induction schedule", `${B}/events/freshmeninduction/minute-to-minute-schedule.php`),
  ums: mk("UMS", "https://ums.lpu.in/lpuums/"),
  calendar: mk("Academic calendars", `${B}/academics/calendar-regular-programmes.php/`),
  libraries: mk("Libraries", `${B}/academics/libraries.php`),
  residence: mk("Residence", `${B}/student-services/residence.php/`),
  dining: mk("Shopping and dining", `${B}/student-services/shopping-dining.php`),
  transport: mk("Transport", `${B}/student-services/transport.php`),
  security: mk("Campus security", `${B}/student-services/security.php`),
  healthcare: mk("Healthcare", `${B}/student-services/healthcare.php/`),
  antiragging: mk("Anti-ragging", `${B}/anti-ragging.php`),
  contact: mk("Contact us", `${B}/contact-us/contact-us.php/`),
  happenings: mk("LPU Happenings", "https://happenings.lpu.in/"),
};
