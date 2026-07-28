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
   4.6  START

   Run once when the file loads. `services` comes from data.js,
   which is why that script tag has to come first in index.html.
   ------------------------------------------------------------ */

renderListings(services);
