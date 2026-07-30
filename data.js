/* ============================================================
   HEALING NINJAS — data.js

   Every service listing lives here. This file holds DATA only —
   no logic, no functions. script.js reads from it.

   ⚠️  THE THREE ENTRIES BELOW ARE PLACEHOLDERS.
   Names are generic and phone numbers use the reserved 555
   prefix so they cannot be mistaken for real listings. Replace
   each one with a service you have verified by phone before
   this site goes anywhere near a real user.
   ============================================================ */


/* ------------------------------------------------------------
   THE SHAPE CONTRACT

   Every object below has the same keys in the same order. That
   consistency is not tidiness — it is what lets one render
   function handle every listing without special cases.

   Required on every entry:
     name, category, borough, cost, payment, access, serves,
     address, phone, hours, description, lastVerified, verifiedBy

   Optional (code must handle these being missing):
     website, image, imageAlt, insuranceNotes, languages, reviews

   Allowed values — these must match the data-value attributes
   in index.html exactly, or the filters will silently fail:

     category  mental-health | physical-health | food |
               movement | recovery | community

     borough   Bronx | Brooklyn | Manhattan | Queens |
               Staten Island

     cost      Free | Sliding Scale | Low-Cost

     payment   no-cost | medicaid | insurance | uninsured

     access    reentry | no-id | lgbtq | trans |
               confidential | wheelchair | youth | childcare

     serves    all-genders | women | men | trans-nonbinary
   ------------------------------------------------------------ */

const services = [

{
    name: "All Kings",                    // As they'd say it on the phone
    category: "community",                // mental-health | physical-health | food | movement | recovery | community
    borough: "Citywide",                 // Bronx | Brooklyn | Manhattan | Queens | Staten Island | Citywide
    format: "hybrid",         // in-person | roving | remote | hybrid

    cost: "Free",                    // Free | Sliding Scale | Low-Cost
    payment: ["no-cost"],                 // any of: "no-cost", "medicaid", "insurance", "uninsured"
    insuranceNotes: "No insurance required",

    access: ["reentry", "no-id", "lgbtq", "trans", "confidential", "wheelchair", "youth"],                  // ONLY what you verified. Empty is honest.
    serves: "men",       // all-genders | women | men | trans-nonbinary

    address: "",
    phone: "646-623-2501",
    hours: "Daily, 9am-5pm",
    website: "https://www.allkings.org/",
    languages: ["English"],
    description: "Peer-led healing spaces to support men's emotional well-being, leadership development, and the opportunity and tools to give back to their communities",             // Two sentences max. Plain language.

    image: "images/services/all-kings.webp",
    imageAlt: "People in a room circled up in chairs",

    reviews: [{ text: "The city quest was a life altering exprience.", source: "Past participant"}],

    lastVerified: "2026-07-30",
    verifiedBy: "Healing Ninjas CEO"               // e.g. "Verified via provider website, July 2026"
  },
{
    name: "Community Connections for Youth",                    // As they'd say it on the phone
    category: "community",                // mental-health | physical-health | food | movement | recovery | community
    borough: "Bronx",                 // Bronx | Brooklyn | Manhattan | Queens | Staten Island | Citywide
    format: "in-person",         // in-person | roving | remote | hybrid

    cost: "Free",                    // Free | Sliding Scale | Low-Cost
    payment: ["no-cost"],                 // any of: "no-cost", "medicaid", "insurance", "uninsured"
    insuranceNotes: "No insurance required",

    access: ["reentry", "no-id", "lgbtq", "trans", "confidential", "wheelchair", "youth"],                  // ONLY what you verified. Empty is honest.
    serves: "all-genders",       // all-genders | women | men | trans-nonbinary

    address: "369 East 149th Street, 7th Floor, Bronx, NY 10455",
    phone: "347-590-0940",
    hours: "Daily, 9am-5pm",
    website: "https://www.cc-fy.org/",
    languages: ["English, Spanish"],
    description: "Non-profit organization in the South Bronx dedicated to ending youth incarceration through direct support, advocacy, mentoring, training, and building partnerships.",             // Two sentences max. Plain language.

    image: "images/services/cc4y.webp",
    imageAlt: "People holding no kids in prison banners protesting",

    reviews: [],

    lastVerified: "2026-07-30",
    verifiedBy: "Healing Ninjas CEO"               // e.g. "Verified via provider website, July 2026"
  },

  /* ----------------------------------------------------------
     ENTRY 1 — the complete case.
     Has every optional field filled in. Use this one to check
     that the full card renders correctly.
     ---------------------------------------------------------- */
  {
    name: "SAMPLE — Grand Concourse Counseling Center",
    category: "mental-health",
    borough: "Bronx",

    cost: "Free",
    payment: ["no-cost", "medicaid", "uninsured"],
    insuranceNotes: "No insurance or ID required for a first visit.",

    access: ["reentry", "no-id", "lgbtq", "trans", "confidential", "wheelchair"],
    serves: "all-genders",

    address: "1000 Grand Concourse, Bronx, NY 10456",
    phone: "718-555-0142",
    hours: "Mon-Thu 9am-7pm, Fri 9am-5pm",
    website: "https://example.org/grand-concourse",
    languages: ["English", "Spanish"],
    description: "Walk-in counseling and ongoing therapy. No appointment needed for a first session. Does not report attendance to parole or probation.",

    image: "images/services/grand-concourse.jpg",
    imageAlt: "Ground-floor entrance with a ramp and a green awning",

    reviews: [
      { text: "Front desk treated me like a person, not a case number.", source: "Community member" },
      { text: "They never asked about my record. Not once.", source: "Community member" }
    ],

    lastVerified: "2026-07-28",
    verifiedBy: "Healing Ninjas volunteer"
  },


  /* ----------------------------------------------------------
     ENTRY 2 — the sparse case.
     No image, no website, no reviews, no insurance notes.
     This is the one that will break your render function if you
     assume every field exists. Keep it in the file permanently
     as a test.
     ---------------------------------------------------------- */
  {
    name: "SAMPLE — Bushwick Community Food Hub",
    category: "food",
    borough: "Brooklyn",

    cost: "Free",
    payment: ["no-cost"],

    access: ["no-id", "childcare"],
    serves: "all-genders",

    address: "200 Knickerbocker Ave, Brooklyn, NY 11237",
    phone: "718-555-0198",
    hours: "Tue & Sat 10am-2pm",
    description: "Grocery pantry and hot lunch. No documentation required. Kids welcome.",

    lastVerified: "2026-07-28",
    verifiedBy: "Healing Ninjas volunteer"
  },


  /* ----------------------------------------------------------
     ENTRY 3 — the different-filters case.
     Sliding scale rather than free, and a specific population
     rather than all genders. Use this to check that the cost
     and "serves" filters actually change the results.
     ---------------------------------------------------------- */
  {
    name: "SAMPLE — Rockaway Healing Circle",
    category: "community",
    borough: "Queens",

    cost: "Sliding Scale",
    payment: ["insurance", "uninsured"],
    insuranceNotes: "Pay what you can. Nobody is turned away.",

    access: ["reentry", "youth", "lgbtq"],
    serves: "women",

    address: "45-10 Beach Channel Dr, Queens, NY 11691",
    phone: "718-555-0176",
    hours: "Wed 6pm-8pm, Sun 11am-1pm",
    website: "https://example.org/rockaway-circle",
    languages: ["English"],
    description: "Peer-led healing circles for women and femmes, with a dedicated group for those under 24.",

    image: "images/services/rockaway-circle.jpg",
    imageAlt: "Community room with chairs arranged in a circle",

    reviews: [
      { text: "First place I went where nobody wanted my paperwork.", source: "Community member" }
    ],

    lastVerified: "2026-07-28",
    verifiedBy: "Healing Ninjas volunteer"
  }

];
