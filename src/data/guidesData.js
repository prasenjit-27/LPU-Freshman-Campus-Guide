import { sources as s } from "@/data/sources";

export const guidesData = {
  academics: {
    title: "Academics & UMS Mastery",
    subtitle: "Complete in-depth handbook for classes, attendance, exams, and UMS navigation.",
    badge: "Academics",
    sections: [
      {
        id: "ums-system",
        title: "University Management System (UMS) Navigation",
        desc: "Everything you need to handle on UMS without confusion.",
        details: [
          {
            label: "First-Time Login",
            text: "Access the portal at ums.lpu.in/lpuums or download LPU Touch. Your Registration Number (8 digits) is your username. Enter your temporary password given on the admission slip, and configure your permanent password with 2-factor recovery."
          },
          {
            label: "Time Table & Room Numbers",
            text: "Check 'My Time Table' to find your lecture timings, course code (e.g., CSE101), faculty name, and specific block & room number (e.g., 34-402 means Block 34, 4th floor, Room 402)."
          },
          {
            label: "Attendance Monitoring (Strict 75% Rule)",
            text: "LPU enforces mandatory minimum 75% aggregate attendance per course. Falling below 75% debars you from taking the End Term Examination. View real-time course attendance percentages on the UMS dashboard after each lecture."
          },
          {
            label: "RMS (Relationship Management System)",
            text: "RMS is the centralized student grievance and request desk. Submit queries about mark corrections, fee disputes, course changes, or hostel maintenance. Every ticket has an escalation timer tracked by university administration."
          }
        ]
      },
      {
        id: "calendar-exams",
        title: "Academic Calendars, Marks & Grading Structure",
        desc: "Understanding terms, continuous assessment (CA), and grading policy.",
        details: [
          {
            label: "Term Milestones",
            text: "Autumn Term runs from August through December; Spring Term runs from January through May. Practical and laboratory evaluations are scheduled prior to theoretical end-term examinations."
          },
          {
            label: "Evaluation Breakdown",
            text: "Course evaluation is composed of Continuous Assessment (CA) (20%-30%), Mid-Term Examination (MTE) (20%-25%), and End-Term Examination (ETE) (50%). CAs include online LMS quizzes, laboratory performance, home assignments, and class participation."
          },
          {
            label: "Relative Grading & CGPA",
            text: "LPU follows a 10-point relative grading scale. Grades (O, A+, A, B+, B, C, D, E, F) are awarded based on bell-curve distribution across the cohort."
          }
        ]
      },
      {
        id: "libraries-study",
        title: "Central Library (Block 38) & Study Facilities",
        desc: "Over 1.5 million print volumes and world-class digital academic repositories.",
        details: [
          {
            label: "Borrowing Privileges",
            text: "Your student ID acts as an RFID library card. Undergraduates can issue up to 4 books for 14 days, renewable online via UMS if no reservation hold is placed."
          },
          {
            label: "Digital Journals & Subscriptions",
            text: "Full digital access to IEEE Xplore, ScienceDirect, ACM Digital Library, Springer, and JSTOR is free for students connected to the campus Wi-Fi network or through off-campus proxy credentials."
          },
          {
            label: "Late-Night Reading Rooms",
            text: "Dedicated quiet study rooms and discussion pods are open late into the night during mid-term and end-term examination phases."
          }
        ]
      }
    ],
    sources: [s.ums, s.calendar, s.libraries]
  },

  hostel: {
    title: "Hostel & Residential Complete Guide",
    subtitle: "In-depth guide to room facilities, in-out timings, leave passes, laundry, and warden support.",
    badge: "Residential Life",
    sections: [
      {
        id: "hostel-rules",
        title: "Hostel Entry, Curfew & Biometric Attendance",
        desc: "Safe, secure living standards across Boys Hostels (BH 1-8) and Girls Hostels (GH 1-6).",
        details: [
          {
            label: "Curfew & In-Times",
            text: "Campus outer gates close at 8:00 PM. Hostel turnstile gates require biometric or RFID card check-in by 8:30 PM (or as specified in seasonal circulars). Entering late results in automated alerts to guardians."
          },
          {
            label: "Room Amenities",
            text: "Each resident is provided an individual bed, mattress space, study desk, ergonomic chair, and lockable wardrobe almirah. Keep your own personal padlock and duplicate keys."
          },
          {
            label: "Electricity, Coolers & ACs",
            text: "Air-conditioned rooms operate on automated seasonal timing cycles. Coolers must be approved and registered during summer. High-wattage cooking appliances (induction stoves, immersion rods) are strictly prohibited."
          }
        ]
      },
      {
        id: "leave-system",
        title: "Leave Pass Protocol (Day Outing vs Home Leave)",
        desc: "How to apply for leaves without hassle on your UMS app.",
        details: [
          {
            label: "Day Outing Pass",
            text: "Need to visit Phagwara or Jalandhar for shopping? Apply on UMS Touch app before 5:00 PM. Pass approves automatically for eligible students; scan your barcode at campus exit turnstiles and return before campus curfew."
          },
          {
            label: "Night Out / Home Leave",
            text: "Apply 24 to 48 hours prior to travel. An automated parent verification call/SMS/OTP confirmation is required before the hostel warden grants electronic clearance."
          }
        ]
      },
      {
        id: "amenities-services",
        title: "Laundry, Housekeeping & Water Quality",
        desc: "Essential day-to-day facilities located within every hostel complex.",
        details: [
          {
            label: "Laundromat Services",
            text: "Commercial automated washers and iron presses are active inside hostel complexes. Drop off your laundry bag and collect clean, folded clothes in 24-48 hours."
          },
          {
            label: "Purified Water & Hygiene",
            text: "Multi-stage RO water treatment plants and cooling dispensers are active on every residential floor, tested regularly by university environmental safety teams."
          }
        ]
      }
    ],
    sources: [s.residence, s.reporting, s.bring]
  },

  dining: {
    title: "Campus Dining, Mess & Commercial Hub",
    subtitle: "Complete schedule of residential dining messes, food courts, Uni-Mall shopping, and groceries.",
    badge: "Food & Shopping",
    sections: [
      {
        id: "mess-schedule",
        title: "Residential Mess Timings & Meal Plans",
        desc: "Nutritious four-meal daily plans prepared in ISO-certified hygienic kitchens.",
        details: [
          {
            label: "Breakfast (07:30 AM – 09:30 AM)",
            text: "Poha, parathas, idli/sambar, eggs, bread-butter-jam, milk, tea, and seasonal fruit."
          },
          {
            label: "Lunch (12:00 PM – 02:30 PM)",
            text: "Seasonal vegetables, lentils (dal), rice/jeera rice, fresh chapatis, curd/raita, and fresh salads."
          },
          {
            label: "Evening Refreshments (05:00 PM – 06:15 PM)",
            text: "Hot samosas, tea, coffee, biscuits, patties, or sweet snacks after classes."
          },
          {
            label: "Dinner (07:30 PM – 09:45 PM)",
            text: "Paneer/chicken dishes, mixed veg, seasonal curries, dal makhani, warm rotis, and weekly special desserts (kheer, gulab jamun, ice cream)."
          }
        ]
      },
      {
        id: "unimall-food",
        title: "Uni-Mall Food Court & Retail Center",
        desc: "The heartbeat of campus social life and retail.",
        details: [
          {
            label: "Food Brands & Outlets",
            text: "Features popular food chains: Domino's Pizza, Subway, Cafe Coffee Day, Baskin Robbins, along with North Indian, South Indian, Chinese, and Continental food kiosks."
          },
          {
            label: "Departmental Stores & Stationery",
            text: "Buy groceries, toiletries, notebooks, lab coats, drafters, engineering tools, and personal care products on the lower floors."
          },
          {
            label: "Banking & Electronics",
            text: "On-campus ATMs (SBI, PNB), SIM card counters, laptop and mobile repair shops, and barber shops / beauty salons."
          }
        ]
      },
      {
        id: "campus-cafes",
        title: "Kiosks & Quick Eateries Near Academic Blocks",
        desc: "Grab a bite in between lectures without heading back to the hostel.",
        details: [
          {
            label: "Block 13 & 34 Food Courts",
            text: "Centrally positioned between engineering and computer science blocks; ideal for quick tea, rolls, sandwiches, and fresh juices."
          },
          {
            label: "Block 38 & Library Cafe",
            text: "Quiet coffee spots and bakery snacks next to the central reading halls."
          }
        ]
      }
    ],
    sources: [s.dining, s.transport]
  },

  "student-life": {
    title: "Campus Student Life, Clubs & Sports",
    subtitle: "Over 100+ active student clubs, cultural fests, Olympic-tier sports complexes, and medical care.",
    badge: "Student Life",
    sections: [
      {
        id: "clubs-chapters",
        title: "Student Organizations & Technical Chapters",
        desc: "Enhance your skills, build projects, and lead campus communities.",
        details: [
          {
            label: "Technical Clubs",
            text: "Join Google Developer Student Club (GDSC), ACM Student Chapter, Microsoft Learn Student Ambassadors, and the LPU Robotics & Autonomous Vehicle Research Group."
          },
          {
            label: "Arts & Cultural Societies",
            text: "Audition for Natraj (theatrical society), dance squads, musical bands, debating leagues, and the university photography and filmmaking team."
          },
          {
            label: "Community & Social Impact",
            text: "National Service Scheme (NSS), Youth Red Cross, and animal welfare initiatives active throughout the academic year."
          }
        ]
      },
      {
        id: "sports-arena",
        title: "Olympic-Standard Sports Complexes",
        desc: "State-of-the-art sports facilities that produce national and Olympic champions.",
        details: [
          {
            label: "Shanti Devi Mittal Indoor Sports Complex",
            text: "All-weather Olympic-sized swimming pool, diving boards, 8 wooden badminton courts, squash arenas, table tennis courts, and high-performance gymnasiums."
          },
          {
            label: "Outdoor Sports Grounds",
            text: "Full-sized synthetic turf football grounds, floodlit basketball and volleyball courts, cricket training nets, and 400m synthetic running track."
          }
        ]
      },
      {
        id: "healthcare-wellness",
        title: "Uni-Hospital (Medical Centre - Block 30)",
        desc: "24/7 dedicated medical clinic, pharmacy, and ambulance service.",
        details: [
          {
            label: "Resident Doctors & Triage",
            text: "General physicians and emergency nursing staff available 24 hours a day with dedicated observation beds."
          },
          {
            label: "Emergency Ambulances",
            text: "Fully equipped emergency response ambulances stationed at Uni-Hospital ready for immediate hospital transit if advanced care is required."
          }
        ]
      }
    ],
    sources: [s.happenings, s.libraries, s.healthcare]
  }
};
