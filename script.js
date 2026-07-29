/* ============================================================
   HEALING NINJAS — script.js

   STEP 4: Render listing cards from data.

   This file reads the `services` array defined in data.js,
   clones the <template> in index.html once per service, fills
   in the blanks, and puts the result on the page.

   No search or filtering yet. That comes next.
   ============================================================ */


/* ------------------------------------------------------------
   4.1  GRAB THE ELEMENTS WE NEED

   Do this once, at the top, instead of searching the document
   every time we need them. Searching the DOM is the slow part
   of front-end work — finding an element once and reusing the
   reference is the single easiest performance habit.
   ------------------------------------------------------------ */

const listingsContainer = document.getElementById("listings");
const listingTemplate   = document.getElementById("listing-template");
const resultCount       = document.getElementById("result-count");


/* ------------------------------------------------------------
   4.2  LABEL MAPS

   Our data stores machine-friendly values: "no-id", "mental-health".
   Humans need to read "No ID required" and "Mental Health".

   Keeping these as separate lookup objects means the data stays
   short and consistent for filtering, while the display text can
   change without touching a single service record.
   ------------------------------------------------------------ */

const ACCESS_LABELS = {
  "reentry":      "Welcomes people with a record",
  "no-id":        "No ID or status required",
  "lgbtq":        "LGBTQ+ affirming",
  "trans":        "Trans & nonbinary affirming",
  "confidential": "Not reported to parole/probation",
  "wheelchair":   "Wheelchair accessible",
  "youth":        "Youth-focused (under 24)",
  "childcare":    "Childcare available"
};

const PAYMENT_LABELS = {
  "no-cost":    "No cost to you",
  "medicaid":   "Takes Medicaid",
  "insurance":  "Takes insurance",
  "uninsured":  "No insurance needed"
};

const CATEGORY_LABELS = {
  "mental-health":   "Mental Health",
  "physical-health": "Physical Health",
  "food":            "Food & Nutrition",
  "movement":        "Movement & Fitness",
  "recovery":        "Recovery Support",
  "community":       "Community & Healing"
};

const SERVES_LABELS = {
  "all-genders":     "All genders",
  "women":           "Women & femmes",
  "men":             "Men",
  "trans-nonbinary": "Trans & nonbinary"
};


/* ------------------------------------------------------------
   4.3  SMALL HELPERS

   Each does one job. Small named functions are easier to test
   and easier to explain than one long function with everything
   crammed inside it.
   ------------------------------------------------------------ */

/* Turn "2026-07-28" into "July 28, 2026".

   We split the string by hand rather than using new Date().
   Reason: new Date("2026-07-28") is interpreted as midnight UTC,
   so in New York it can display as the day BEFORE. Splitting the
   string avoids time zones entirely. This is a real bug that
   catches people constantly. */
function formatDate(isoDate) {
  const MONTHS = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

  const parts = isoDate.split("-");        // ["2026", "07", "28"]
  const year  = parts[0];
  const month = MONTHS[Number(parts[1]) - 1];   // "07" -> index 6 -> "July"
  const day   = Number(parts[2]);               // "28" -> 28, drops the leading zero

  return `${month} ${day}, ${year}`;
}

/* Strip everything that isn't a digit, so "718-555-0142" becomes
   "7185550142" for a tel: link. */
function phoneToDigits(phone) {
  return phone.replace(/\D/g, "");
}

/* Build a badge <li> and add it to a list. */
function addBadge(list, text, badgeType) {
  const li = document.createElement("li");
  li.className = `badge badge--${badgeType}`;
  li.textContent = text;
  list.appendChild(li);
}


/* ------------------------------------------------------------
   4.4  BUILD ONE CARD

   Takes one service object, returns a finished DOM element.

   Notice this function doesn't touch the page. It just makes a
   card and hands it back. Keeping "build a thing" separate from
   "put the thing on the page" is what makes the next steps easy.
   ------------------------------------------------------------ */

function buildCard(service) {

  /* cloneNode(true) copies the template AND everything inside it.
     Passing false would copy only the outer element and give us
     an empty shell. */
  const card = listingTemplate.content.cloneNode(true);

  /* --- Image ---
     Optional. If there's no image, remove the <img> entirely
     rather than leaving an empty src, which renders as a broken
     icon in most browsers. */
  const img = card.querySelector(".listing-img");
  if (service.image) {
    img.src = service.image;
    img.alt = service.imageAlt || "";
  } else {
    img.remove();
  }

  /* --- Name ---
     .textContent, never .innerHTML. textContent treats the value
     as plain text. If a provider's name contained something that
     looked like HTML, innerHTML would run it; textContent just
     prints it. Same reasoning as using <template> in the first
     place. */
  card.querySelector(".listing-name").textContent = service.name;

  /* --- Meta line: category, borough, who it serves --- */
  const metaParts = [
    CATEGORY_LABELS[service.category],
    service.borough,
    SERVES_LABELS[service.serves]
  ];
  card.querySelector(".listing-meta").textContent = metaParts.join(" · ");

  /* --- Description --- */
  card.querySelector(".listing-description").textContent = service.description;

  /* --- Badges ---
     Cost first (most urgent question), then payment, then access.
     Access badges get their own type so they can be styled as the
     signature element. */
  const badgeList = card.querySelector(".listing-badges");

  addBadge(badgeList, service.cost, "cost");

  /* Optional chaining (?.) and || [] both guard against the field
     being missing. Remember Entry 2 in data.js leaves keys out
     entirely — this is what stops that from throwing an error. */
  (service.payment || []).forEach(function (code) {
    addBadge(badgeList, PAYMENT_LABELS[code] || code, "payment");
  });

  (service.access || []).forEach(function (code) {
    addBadge(badgeList, ACCESS_LABELS[code] || code, "access");
  });

  /* --- Address and hours --- */
  card.querySelector(".listing-address").textContent = service.address;
  card.querySelector(".listing-hours").textContent   = service.hours;

  /* --- Contact links ---
     Each starts with the `hidden` attribute in the template. We
     remove `hidden` only when the data exists, so a missing
     website means no button rather than a dead one. */
  const phoneLink = card.querySelector(".listing-phone");
  if (service.phone) {
    phoneLink.href = `tel:${phoneToDigits(service.phone)}`;
    phoneLink.textContent = `Call ${service.phone}`;
    phoneLink.hidden = false;
  }

  const directionsLink = card.querySelector(".listing-directions");
  if (service.address) {
    /* encodeURIComponent turns spaces and commas into characters
       that are legal inside a URL. Without it, an address with a
       space produces a broken link. */
    directionsLink.href =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`;
    directionsLink.hidden = false;
  }

  const websiteLink = card.querySelector(".listing-website");
  if (service.website) {
    websiteLink.href = service.website;
    websiteLink.hidden = false;
  }

  /* --- Reviews --- */
  const reviewList = card.querySelector(".listing-reviews");
  (service.reviews || []).forEach(function (review) {
    const li = document.createElement("li");
    li.className = "review";

    const quote = document.createElement("p");
    quote.className = "review-text";
    quote.textContent = review.text;

    const source = document.createElement("p");
    source.className = "review-source";
    source.textContent = `— ${review.source}`;

    li.appendChild(quote);
    li.appendChild(source);
    reviewList.appendChild(li);
  });

  /* --- Verification --- */
  const dateEl = card.querySelector(".verification-date");
  dateEl.dateTime    = service.lastVerified;        // machine-readable
  dateEl.textContent = formatDate(service.lastVerified);  // human-readable
  card.querySelector(".verification-source").textContent = service.verifiedBy;

  return card;
}


/* ------------------------------------------------------------
   4.5  RENDER A LIST OF SERVICES

   Takes an array, empties the container, and fills it.

   It takes the array as an ARGUMENT rather than reading the
   global `services` directly. That single choice is what makes
   filtering trivial later — we'll just call
   renderListings(filteredResults) and this function won't need
   to change at all.
   ------------------------------------------------------------ */

function renderListings(list) {

  /* Empty the container. Setting innerHTML to "" is the fastest
     way to clear it, and it's safe here because we're writing an
     empty string, not user data. */
  listingsContainer.innerHTML = "";

  /* --- Empty state ---
     An empty screen should tell you what to do next, not just sit
     there blank. */
  if (list.length === 0) {
    resultCount.textContent = "No services match what you're looking for.";
    return;   // stop here — nothing left to build
  }

  /* A DocumentFragment is a lightweight container that lives in
     memory, not on the page. We build every card into it first,
     then attach it once.

     Why: every time you add something directly to the page, the
     browser recalculates layout. Twenty services means twenty
     recalculations. Using a fragment makes it one. */
  const fragment = document.createDocumentFragment();

  list.forEach(function (service) {
    fragment.appendChild(buildCard(service));
  });

  listingsContainer.appendChild(fragment);

  /* --- Result count ---
     Say "1 service" not "1 services". Small thing; sloppy grammar
     in an interface reads as sloppy everywhere else. */
  const word = list.length === 1 ? "service" : "services";
  resultCount.textContent = `Showing ${list.length} ${word}`;
}


/* ------------------------------------------------------------
   4.6  (superseded by section 5.5 — see the bottom of this file)
   ------------------------------------------------------------ */


/* ============================================================
   STEP 5: SEARCH

   Typing in the search box narrows the list as you type.

   The structure below is deliberately bigger than search alone
   needs. Every filter you add next — borough, cost, access —
   plugs into it without changing anything that already works.
   ============================================================ */


/* ------------------------------------------------------------
   5.1  STATE

   One object holding everything the user has currently chosen.
   Right now it's just the search text. Filters will add keys
   to it.

   Why one object instead of loose variables: when you want to
   know "what is the user looking at right now," there's exactly
   one place to look. And "clear all filters" becomes resetting
   one object instead of remembering to reset six variables.
   ------------------------------------------------------------ */

const state = {
  search: "",

  /* "all" is the neutral value meaning "don't filter on this."
     Using a real string rather than null or "" keeps the button
     comparison simple — the All button literally has
     data-value="all", so state and markup speak the same
     language. */
  borough: "all",
  cost: "all",
  payment: "all",
  serves: "all",

  /* access is an ARRAY, not a string, because these stack. A
     user can need "no ID required" AND "trans affirming" AND
     "childcare" at the same time. Empty array means no access
     filter is active. */
  access: []
};


/* ------------------------------------------------------------
   5.2  ONE MATCH FUNCTION PER FILTER

   Each takes a service and answers a yes/no question about it.
   Small, single-purpose, independently testable.

   Adding a filter later means writing one more of these — not
   editing the ones that already work.
   ------------------------------------------------------------ */

function matchesSearch(service) {

  /* No search text means everything passes. Getting this
     backwards is the classic filter bug: an empty search box
     matching nothing instead of everything. */
  if (state.search === "") {
    return true;
  }

  /* Glue the searchable fields into one string. Searching name
     alone is too narrow — someone typing "Bronx" or "walk-in"
     should find something. */
  const haystack = [
    service.name,
    service.description,
    service.borough,
    service.address
  ].join(" ").toLowerCase();

  /* .includes() asks "does this string contain that string."
     Both sides are lowercased, so "BRONX", "bronx", and "Bronx"
     all match. Case-sensitivity here would look like a bug to
     every user who capitalizes. */
  return haystack.includes(state.search);
}


/* ------------------------------------------------------------
   5.3  DECIDE WHAT'S VISIBLE

   .filter() walks the array and keeps only the items where the
   function returns true. It returns a NEW array and leaves the
   original untouched.

   That matters: `services` always holds all your data. We never
   delete from it, so there's nothing to restore when the user
   clears the search. Deriving a new list instead of mutating
   the source is one of the most useful habits in this whole
   project.
   ------------------------------------------------------------ */

function getVisibleServices() {
  return services.filter(function (service) {
    /* && means EVERY condition must be true. A service has to
       survive all of them to appear. Adding a filter later means
       adding one more && here — nothing above this line changes. */
    return matchesSearch(service)
        && matchesBorough(service)
        && matchesCost(service)
        && matchesPayment(service)
        && matchesServes(service)
        && matchesAccess(service);
  });
}


/* ------------------------------------------------------------
   5.4  UPDATE

   The single path from "state changed" to "screen changed."

   Every future control — every filter button, the clear button,
   the category cards — will do the same two things: change
   `state`, then call update(). None of them will touch the DOM
   directly. That's what keeps the app from drifting into a mess
   of controls that each redraw the page their own way.
   ------------------------------------------------------------ */

function update() {
  renderListings(getVisibleServices());
}


/* ------------------------------------------------------------
   5.5  LISTEN FOR TYPING

   "input" fires on every change to the field — typing, pasting,
   and clicking the little x to clear it.

   Use "input" rather than "keyup": keyup misses pasting with the
   mouse and misses the clear button, so the list would go stale
   without the user doing anything obviously wrong.
   ------------------------------------------------------------ */

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function (event) {

  /* .trim() removes leading and trailing spaces so a stray
     space doesn't wipe out the results. Lowercased here, once,
     rather than on every comparison inside the loop. */
  state.search = event.target.value.trim().toLowerCase();

  update();
});


/* ============================================================
   STEP 6: BOROUGH AND COST FILTERS

   Both are single-select: picking Queens replaces Bronx rather
   than adding to it. One pattern, used twice.
   ============================================================ */


/* ------------------------------------------------------------
   6.1  WHICH FILTERS WORK THIS WAY

   Listing the names in an array instead of hardcoding them in
   two places means adding a third single-select filter later is
   a one-word change.
   ------------------------------------------------------------ */

const SINGLE_SELECT_FILTERS = ["borough", "cost", "payment", "serves"];

/* Access is the only group where clicking a second button adds
   to your selection instead of replacing it. */
const MULTI_SELECT_FILTERS = ["access"];


/* ------------------------------------------------------------
   6.2  MATCH FUNCTIONS

   Same shape as matchesSearch: take a service, answer yes or no.
   ------------------------------------------------------------ */

function matchesBorough(service) {
  if (state.borough === "all") {
    return true;
  }
  return service.borough === state.borough;
}

function matchesCost(service) {
  if (state.cost === "all") {
    return true;
  }
  return service.cost === state.cost;
}


/* ------------------------------------------------------------
   6.3  SHOW WHICH BUTTONS ARE ON

   Sets aria-pressed on every filter button to match state.

   We set the ACCESSIBILITY attribute, and the CSS styles that
   attribute — look for [aria-pressed="true"] in style.css. So
   there is exactly one source of truth: what a screen reader
   announces and what a sighted user sees can never disagree,
   because they read the same thing.

   Doing it this way instead of toggling a CSS class is the
   detail worth mentioning in an interview.
   ------------------------------------------------------------ */

function updateButtonStates() {

  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(function (button) {

    /* dataset is how JavaScript reads data-* attributes.
       data-filter="borough" becomes button.dataset.filter.
       Note the naming: data-value -> dataset.value. */
    const filterName = button.dataset.filter;
    const value      = button.dataset.value;

    if (SINGLE_SELECT_FILTERS.includes(filterName)) {
      /* One value can be active, so compare directly. */
      const isOn = state[filterName] === value;
      button.setAttribute("aria-pressed", isOn ? "true" : "false");
    }

    if (MULTI_SELECT_FILTERS.includes(filterName)) {
      /* Several can be active, so ask whether this one is in
         the list rather than whether it equals the list. */
      const isOn = state[filterName].includes(value);
      button.setAttribute("aria-pressed", isOn ? "true" : "false");
    }
  });
}


/* ------------------------------------------------------------
   6.4  ONE LISTENER FOR ALL THE BUTTONS

   This is called EVENT DELEGATION, and it's worth understanding
   properly.

   The naive approach attaches a listener to each button. With
   five filter groups that's about thirty listeners, and any
   button added later silently does nothing until you remember
   to wire it up.

   Instead we listen on the container. Clicks on the buttons
   inside it bubble up to the container, and we work out which
   button was clicked from the event. One listener, and new
   buttons work automatically.
   ------------------------------------------------------------ */

const filtersContainer = document.querySelector(".filters");

filtersContainer.addEventListener("click", function (event) {

  /* .closest() walks UP from whatever was actually clicked
     until it finds a matching element. If the click landed on
     text inside the button, this still finds the button. */
  const button = event.target.closest(".filter-btn");

  /* The click might have hit padding or the legend rather than
     a button. Bail out early — a guard clause like this is
     cleaner than wrapping everything below in an if. */
  if (!button) {
    return;
  }

  const filterName = button.dataset.filter;
  const value      = button.dataset.value;

  if (SINGLE_SELECT_FILTERS.includes(filterName)) {
    /* Bracket notation: state["borough"] is the same as
       state.borough, except the key can be a variable. That is
       what lets one handler serve every single-select group. */
    state[filterName] = value;
  }

  if (MULTI_SELECT_FILTERS.includes(filterName)) {
    /* Clicking a multi-select button TOGGLES it: on if it was
       off, off if it was on. */
    const selected = state[filterName];
    const position = selected.indexOf(value);

    if (position === -1) {
      /* indexOf returns -1 when the value isn't in the array,
         so -1 means "not currently selected" -> turn it on. */
      selected.push(value);
    } else {
      /* splice(position, 1) removes 1 item starting at that
         position. This is how you remove from an array by
         value rather than by rebuilding it. */
      selected.splice(position, 1);
    }
  }

  updateButtonStates();
  update();
});


/* ============================================================
   STEP 7: PAYMENT, SERVES, AND ACCESS FILTERS

   Three filters, three different matching problems.
   ============================================================ */


/* ------------------------------------------------------------
   7.1  SERVES — the free one

   Identical to borough and cost: compare one string to one
   string. Adding it cost exactly one word — "serves" in the
   SINGLE_SELECT_FILTERS array above — plus this function.

   That's the structure from step 5 paying off. Nothing that
   already worked had to be touched.
   ------------------------------------------------------------ */

function matchesServes(service) {
  if (state.serves === "all") {
    return true;
  }
  return service.serves === state.serves;
}


/* ------------------------------------------------------------
   7.2  PAYMENT — one value against an array

   The UI is single-select: the user picks ONE payment option.
   But the DATA is an array, because one clinic can take
   Medicaid and insurance and also see uninsured patients.

   So this isn't `===`. We ask whether the service's array
   CONTAINS the one value the user picked.
   ------------------------------------------------------------ */

function matchesPayment(service) {
  if (state.payment === "all") {
    return true;
  }

  /* || [] guards the case where a listing has no payment field
     at all. Without it, calling .includes() on undefined throws
     and kills the whole render. */
  const servicePayment = service.payment || [];

  return servicePayment.includes(state.payment);
}


/* ------------------------------------------------------------
   7.3  ACCESS — array against array, with AND

   This is the hardest one, and it's the one that matters most.

   The user can select several access needs at once. A service
   should only appear if it satisfies EVERY one of them.

   .every() returns true only when the test passes for all items.
   Its sibling .some() returns true if ANY item passes.

   Choosing .every() over .some() here is a safety decision, not
   a style one. If someone selects "No ID required" AND "Trans
   affirming", .some() would show places that are only one of
   the two — sending an undocumented trans person to a clinic
   that will ask for ID. The filter has to mean AND.
   ------------------------------------------------------------ */

function matchesAccess(service) {

  /* Nothing selected means no access filtering. */
  if (state.access.length === 0) {
    return true;
  }

  const serviceAccess = service.access || [];

  /* Read this as: "for every access need the user selected, does
     this service have it?" */
  return state.access.every(function (needed) {
    return serviceAccess.includes(needed);
  });
}


/* ------------------------------------------------------------
   6.5  START

   Run once on load. updateButtonStates() runs too, so the "All"
   buttons show as active before anyone clicks anything.

   `services` comes from data.js, which is why that script tag
   has to come first in index.html.
   ------------------------------------------------------------ */

updateButtonStates();
update();
