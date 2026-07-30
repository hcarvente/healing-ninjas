# Healing Ninjas — Free & Low-Cost Wellness in All Five Boroughs

A searchable directory of free and low-cost wellness services in New York City, built for young people and people coming home from incarceration.

---

## The Problem

New York City has an enormous amount of free and low-cost wellness support — clinics, counseling, food programs, gyms, recovery groups, healing circles. What it does not have is one place to find them.

The information exists, but it is scattered across agency PDFs, out-of-date 311 listings, printed handouts, and the personal knowledge of individual caseworkers. If you are a young person leaving a court program, or someone coming home after incarceration, you are typically handed a photocopied list of referrals. Half the numbers are disconnected. Some of the programs closed years ago. Almost none of them tell you the things you actually need to know: does it cost money, will my insurance work, and will I be treated with dignity when I walk in?

I run a organization thats provides leadership development training for Latine, Afro-Latine, and Indigenous young leaders ages 18-25 in New York City, and I have watched this play out over the last 14 years of my career. The barrier is rarely that services don't exist. The barrier is that finding them requires knowing someone who already knows. That is a network problem, and networks are exactly what incarceration and system involvement take away from people.

There is a second problem underneath the first. Most existing resource directories are built *for* service providers rather than *for* the people being served. They use clinical language, they assume you have insurance, and they never say plainly whether a place is safe for someone with a record, someone who is undocumented, or someone who is trans.

## What This App Does

Healing Ninjas is a searchable, filterable directory of wellness services across the five boroughs. A user can:

- Browse six wellness categories, or search by keyword
- Filter by borough
- Filter by cost — free, sliding scale, or low-cost
- Filter by payment — takes Medicaid, takes insurance, or no insurance needed
- Filter by **who is welcome** — welcomes people with a record, no ID or immigration status required, LGBTQ+ affirming, trans and nonbinary affirming, not reported to parole or probation, wheelchair accessible, youth-focused, childcare available
- Filter by **who a program serves** — all genders, women and femmes, men, trans and nonbinary
- See photos, hours, address, and one-tap calling and directions
- Read what other people said about being there
- See when each listing was last verified, and report anything out of date

## Why It Matters

- **It reduces the cost of asking.** Someone can find what they need without disclosing their situation to a stranger first.
- **It answers the safety question up front.** Whether a place is welcoming to someone with a record, someone undocumented, or someone trans is stated on the card, not discovered at the front desk.
- **It stays honest about its own age.** Every listing shows when it was verified and by whom.
- **It centers dignity.** Listings are written the way you would explain them to a friend, not the way an agency describes itself in a grant report.

## Design Decisions Worth Explaining

**Two separate axes for inclusion.** "Who is welcome" and "who a program serves" look like the same question but aren't. A trans woman looking for a women's program needs to filter on both independently, so they are stored and filtered separately — one as a stackable array, one as a single value.

**Reviews are displayed, not collected.** With no backend there is nowhere to store a review someone writes. Building a review form that silently discarded submissions, or stored them only in one person's browser, would be a fake feature. Displaying community feedback is a front-end problem and it is solved; accepting submissions is a persistence problem and it is scoped to phase two.

**Verification is a first-class field, not a footnote.** Every directory serving this population fails the same way — the listings rot and nobody knows which ones. A visible verification date costs one field and directly answers the problem this project opens with.

**Access labels are claims, not metadata.** If a listing says "no ID required" and the front desk asks for ID, the app has sent an undocumented person into a room they weren't prepared for. Labels reflect what providers state, verified by phone where possible, and the footer says so.

## Project Plan

### How I'm Building It

The whole application is front-end: HTML for structure, CSS for layout and styling, and vanilla JavaScript for search and filtering. Service listings live in a JavaScript data file that the page reads on load and renders into cards. No backend, no database, no frameworks.

I chose this deliberately. It keeps the project small enough to finish and simple enough that I can explain every line, which matters more to me right now than building something impressive I don't fully understand.

### Build Sequence

| Phase | What I'm doing | Status |
|---|---|---|
| 1 | HTML structure — header, category cards, filters, card template | Done |
| 2 | CSS layout — responsive grid, spacing, card structure | Done |
| 3 | CSS visual styling — design tokens, type, button states | Done |
| 4 | Data file — structure plus three sample services | Done |
| 5 | JavaScript render — build cards from data using the template | Done |
| 6 | Live keyword search | Done |
| 7 | Filter logic — borough, cost, payment, access, serves | Done |
| 8 | Category cards, clear-all, empty states | Done |
| 9 | Responsive pass — touch targets, scrolling filters | Done |
| 10 | Replace samples with verified NYC services | Done |
| 11 | Add photos | Done |
| 12 | Final testing and deploy | Done |

### Data Structure

Each service is one object with this shape. Keeping it consistent is what makes the filtering logic simple:

```javascript
{
  name: "Example Wellness Center",
  category: "mental-health",
  borough: "Queens",

  cost: "Free",                          // Free | Sliding Scale | Low-Cost
  payment: ["no-cost", "uninsured"],     // array — a place can match several
  insuranceNotes: "No insurance or ID required",

  access: ["reentry", "no-id", "lgbtq"], // array — stackable, filtered with AND
  serves: "all-genders",                 // string — one value

  address: "123 Example Ave, Queens, NY 11101",
  phone: "718-555-0100",
  hours: "Mon-Fri, 9am-5pm",
  website: "https://example.org",
  languages: ["English", "Spanish"],
  description: "Walk-in counseling, no appointment needed.",

  image: "images/services/example.jpg",
  imageAlt: "Street-level entrance with a wheelchair ramp",

  reviews: [
    { text: "Front desk treated me like a person.", source: "Community member" }
  ],

  lastVerified: "2026-07-28",
  verifiedBy: "Healing Ninjas volunteer"
}
```

`payment` and `access` are arrays because those traits coexist — one clinic can be free *and* take Medicaid *and* require no ID. `serves` is a string because a program is designed for one population. Different shapes because they answer different questions, and that difference shows up directly in the filter code.

### Technical Choices

- **A `<template>` element for listing cards.** Card markup lives in the HTML file rather than as strings inside JavaScript. Cloning a template and setting `.textContent` also can't execute anything a provider typed into a description, which string-building with `innerHTML` can.
- **`data-` attributes on every filter button.** One click handler reads `data-filter` and `data-value` and serves all filter groups. Adding a new filter type is an HTML change, not a JavaScript change.
- **`repeat(auto-fit, minmax(260px, 1fr))` for the grids.** The layout reflows from four columns to one without a single media query.
- **A single `state` object as the source of truth.** Every control changes `state` and calls one `update()` function; none of them touch the DOM directly. Adding a filter means writing one more `matchesX()` function, not editing any that already work.
- **`.every()` rather than `.some()` for the access filter.** Selecting "no ID required" and "trans affirming" must return only services that are *both*. Using OR here would send an undocumented trans person to a clinic that asks for ID — this is a safety decision, not a style one.
- **`<button>` for interactive cards, never `<div>`.** Keyboard focus and screen reader semantics come free.

## Minimum Viable Product

These have to work for the project to be worth anything:

- [ ] 8–10 verified NYC services in the data file
- [ ] All listings render on page load from the template
- [ ] Live keyword search across name and description
- [ ] Filter by borough, cost, and payment
- [ ] Filter by access flags, stacking with AND
- [ ] Filter by who a program serves
- [ ] Category cards filter the results
- [ ] Clear-all-filters button
- [ ] Helpful message when a search returns nothing
- [ ] Photos with graceful handling when a listing has none
- [ ] One-tap call and directions links
- [ ] Verification date visible on every listing
- [ ] Works on desktop and on a phone
- [ ] Deployed and publicly accessible via GitHub Pages

## Features for Later

**Near term**
- Save favorites using browser localStorage
- Spanish language toggle
- "Open now" indicator based on the current time
- Expand to 40+ verified listings

**Once there's a backend**
- Community members can recommend new resources through the site
- Providers can create and edit their own profiles in real time
- Users can submit reviews, with moderation
- Verification workflow that flags listings older than six months

**Long term**
- Map view
- Eligibility filters (age, insurance status, ID requirements)
- Text-message interface for users without reliable data
- Partnerships with reentry organizations to keep listings current
- A version other cities could fork and populate with their own data

## What I Expect to Be Hard

- Combining multiple active filters without the logic becoming nested conditionals
- Handling the `access` array filter, which has to match *all* selected values rather than any
- Verifying the service data — this is phone calls, not code, and it's the part most likely to run long
- Sourcing photos that are properly licensed and don't identify anyone
- Resisting the urge to add features before the core ones work

## Tech Stack

- HTML5
- CSS3 (Flexbox and Grid)
- JavaScript (ES6, no frameworks or libraries)
- Git / GitHub
- GitHub Pages for deployment

## File Structure

```
healing-ninjas/
├── index.html
├── style.css
├── script.js
├── data.js
├── images/
│   ├── categories/
│   └── services/
├── README.md
└── AI_PROMPT_HISTORY.md
```

## Running It Locally

```bash
git clone https://github.com/YOUR-USERNAME/healing-ninjas.git
cd healing-ninjas
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. No build step, no dependencies.

## A Note on Where This Comes From

I am the executive director of a nonprofit serving New York City and a first-generation college graduate. I have spent my career on the referral side of this problem — being the person who knows which door to knock on, and watching how much depends on whether someone happens to have access to a person like me.

This project is an attempt to put a small piece of that knowledge somewhere it doesn't depend on me.

---

## AI Use

I used AI tools while planning and building this project. The full record of those exchanges is documented in [AI_PROMPT_HISTORY.md](./AI_PROMPT_HISTORY.md).
