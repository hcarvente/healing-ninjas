# AI Prompt History

A record of how I used AI tools while planning and building Healing Ninjas — what I asked, what came back, and what I decided to do with it.

I'm documenting this because the interesting part isn't that I used AI. It's where I took the suggestion, where I overruled it, and where I had to supply context the tool didn't have and couldn't have guessed.

**Tools used:** Claude (Anthropic)

---

## Session 1 — Scoping the Idea

**Date:** July 28, 2026

**What I asked:**
I described the project requirements and my initial idea — an all-inclusive wellness application, "the Yelp of wellness" — and asked for help with the README, project plan, and MVP feature list.

**What came back:**
Pushback on the scope. The argument was that "all-inclusive" is too broad for a first project, and that a tightly defined problem shows better judgment than an ambitious one. The suggestion was to narrow to a specific population and need, and move the broader vision into future features.

**What I did:**
Took it. Narrowed to young people and formerly incarcerated people across the five boroughs, with the MVP covering free and low-cost services. This is closer to the work I actually do, which means I can speak to the problem credibly and I know where to find real listings.

**Note:**
The narrowing made the app easier to build *and* stronger as an argument. I'd assumed a bigger idea would be more compelling. It isn't.

---

## Session 2 — HTML Structure

**Date:** July 28, 2026

**What I asked:**
Build the homepage, but one piece at a time, explaining why each choice was made so I could defend it in an interview. I said I was shaky on CSS.

**What came back:**
HTML only — no CSS, no JavaScript — with the reasoning that structure should exist before styling. Five specific decisions were explained: category cards as `<button>` rather than `<div>` for keyboard and screen reader access, `data-` attributes on every interactive element as the bridge to JavaScript, an intentionally empty listings container, `<fieldset>`/`<legend>` for filter grouping, and a visually hidden label on the search input.

**What I did:**
Used it as written. The `data-` attribute pattern was the piece I hadn't seen before, and it's the one I'd lead with if asked about the architecture.

**Note:**
The accessibility choices weren't add-ons. Given who this app is for, building it keyboard-navigable from the first line is part of the point, not a checkbox.

---

## Session 3 — Reviews and Insurance

**Date:** July 28, 2026

**What I asked:**
I realized I hadn't specified two things I wanted: user reviews and insurance coverage information. I asked whether that was too much for an MVP.

**What came back:**
Split into three. Insurance is cheap — one field and one filter, do it. Reviews should be *displayed* but not *collected*, because with no backend there's nowhere to store a submitted review; it would vanish on refresh or live only in one person's browser, which is a fake feature. Provider self-service profiles need accounts and a database, so they're long-term.

**What I did:**
Took all three. Added a Payment filter group. Reviews ship as part of the service data. Provider profiles moved to future features.

**Note:**
The best thing I got here was a way to *describe* the limitation: displaying reviews is a front-end problem I solved, accepting them is a persistence problem I scoped out deliberately. That's a better answer than pretending the feature exists.

The other thing worth recording: adding both features required almost no HTML change, because listing cards are built from data rather than hardcoded. That was the first time the earlier architecture decision paid off visibly.

---

## Session 4 — Access and Inclusion Flags

**Date:** July 28, 2026

**What I asked:**
I wanted listings to specify not just whether they're open to people with records, but whether they're safe for people who are undocumented and for the LGBTQ+ community, including gender-specific options. I asked what else I should consider.

**What came back:**
A structural distinction I hadn't made: "who is welcome" and "who a program serves" are different questions. Welcome traits stack — someone can need reentry-friendly *and* no-ID *and* trans-affirming at once. Program population is exclusive. Collapsing them into one filter list means a trans woman looking for a women's program can't express that search.

Two additions I hadn't thought of: confidentiality from parole and probation supervision, and childcare availability.

Also a caution — these labels are safety claims, not metadata. A listing that says "no ID required" and is wrong sends an undocumented person into a room they weren't ready for.

**What I did:**
Split the filters into two groups. Added all eight welcome flags and four program-population values. Added a footer line stating that labels reflect what providers told us.

**Note:**
The confidentiality flag is the one I'd defend hardest. For someone on parole, whether a program reports back to their officer is often the whole decision. Nobody's directory says it.

This is also the session where the data model choices got interesting — `access` is an array filtered with AND, `serves` is a string filtered with equality. Different shapes because they're different questions.

---

## Session 5 — Images

**Date:** July 28, 2026

**What I asked:**
What needed to be added to the HTML to support photos of locations and services.

**What came back:**
Listing photos needed no structural change — again — but three things were worth adding: images on the category cards, and a `<template>` element holding the listing card blueprint.

The `<template>` approach replaced the plan to build HTML strings in JavaScript. Reasons given: card markup stays in the markup file where I can edit it, and cloning a template with `.textContent` can't execute anything a provider typed into a description, which `innerHTML` can.

Attribute reasoning: `loading="lazy"` so images below the fold don't download until scrolled to, `width`/`height` to reserve space and stop the page jumping as images arrive, and empty `alt=""` on category images because the button already has a text label and announcing the photo would be noise.

**What I did:**
All of it. Also took the two cautions: don't pull photos from Google Images since the repo is public and licensing matters, and photograph buildings rather than people — nobody should be identifiable as attending a recovery meeting because they appeared in a listing photo.

**Note:**
`<template>` was new to me. The XSS reasoning is the part I want to remember, because it's a real answer to a real question and not just a style preference.

---

## Session 6 — Contact and Verification

**Date:** July 28, 2026

**What I asked:**
Whether contact information and verification details needed anything added to the HTML.

**What came back:**
Yes to both. Contact should be real links — `tel:` dials on tap, a maps link opens directions — rather than plain text, since users are on phones. The links start with the `hidden` attribute and JavaScript reveals them only when the data exists, so a missing website means no button instead of a dead one. `rel="noopener noreferrer"` on external links. A `<time datetime="">` element for the verification date so it's machine-readable while the visible text can read however I want.

Also a `mailto:` report link — a working feedback loop with zero backend.

**What I did:**
Added all of it, plus `lastVerified` and `verifiedBy` to the data model.

**Note:**
The advice to make verification a headline feature rather than a footnote was right, and I moved it up in the README. Every directory serving this population fails the same way — listings rot and nobody knows which ones. A visible date costs one field and answers the exact problem I open the README with.

---

## Session 7 — Naming

**Date:** July 28, 2026

**What I asked:**
Change the project name from "Rooted" to "Healing Ninjas."

**What came back:**
Done across four files — HTML, README, prompt history, and the clone instructions.

**What I did:**
Kept it. This is my call and I want a name that sounds like the people it's for.

**Note:**
Worth recording that the rename touched four files and zero logic. That's because the CSS classes describe what an element *is* (`site-title`, `listing-name`) rather than what the project is *called*. Small thing, but it's the difference between a rename taking five minutes and taking an afternoon.

---

## Session 8 — Desktop First

**Date:** July 28, 2026

**What I asked:**
I wanted the site working on desktop first, then phone. A reviewer will open this on a laptop.

**What came back:**
Mild pushback with a reason — desktop-first CSS tends to accumulate `max-width` media queries that undo earlier rules — but the recommendation was accepted, with the approach adjusted so the base layout adapts on its own.

**What I did:**
Held my ground on this one. My demo happens on a laptop.

**Note:**
The compromise turned out to matter more than the disagreement. Because the grids use `repeat(auto-fit, minmax(...))`, they reflow from four columns to one with no media queries at all. I got the desktop-first build I asked for and the phone layout came free. Worth knowing that "desktop first vs mobile first" was less important than picking a layout technique that doesn't care.

---

## Session 9 — CSS Layout

**Date:** July 28, 2026

**What I asked:**
Layout CSS, still one piece at a time, still explaining the reasoning.

**What came back:**
Structure and spacing only — no color or type — so I could see the skeleton hold before adding personality.

The rule I need to know cold:
```css
grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
```
Columns at least 260px wide, leftover space shared evenly, as many columns as fit.

General principle offered: Grid when you want structure and uniformity, Flexbox when you want flow and items are different sizes. Cards use Grid, filter buttons use Flexbox.

Two details I'd have missed: `aspect-ratio` with `object-fit: cover` forces every photo into the same shape so one tall image can't break the grid, and `margin-top: auto` on the verification footer pins it to the bottom so cards in a row line up regardless of description length.

**What I did:**
Used it as written and resized my browser to watch the columns collapse. Seeing it happen is what made it stick.

---

## Session 10 — README and Git Setup

**Date:** July 28, 2026

**What I asked:**
Update the README with everything decided, and give me a step-by-step plan for GitHub — creating the repo, pushing from my computer, and testing incrementally.

**What came back:**
A rewritten README including a "Design Decisions Worth Explaining" section, and a Git guide written for zero prior experience with a verification step after every command.

The most useful advice: deploy to GitHub Pages on day one while the site is half-built, because a deployment problem found on day one is annoying and the same problem found on day three is fatal. Also that GitHub won't accept a password from the command line and needs an access token instead — a failure the error message doesn't explain clearly.

**What I did:**
Doing the GitHub setup before writing more code.

---

## Session 11 — Data Collection Spreadsheet

**Date:** July 28, 2026

**What I asked:**
An Excel sheet for collecting service information, so I could gather data away from the code.

**What came back:**
A three-tab workbook. Every controlled field is a dropdown rather than a text box, specifically to prevent the typo problem — the filters compare strings letter for letter, so "free" would never match "Free" and nothing would error. The listing would just silently never appear.

The multi-value fields got split into separate Yes/No columns instead of one comma-separated cell, since spreadsheets handle lists inside cells badly and separate columns convert cleanly into the arrays my data file needs.

Two things I hadn't asked for that I'm glad are there: every dropdown includes "Unverified" as a valid answer, and the instructions tab tracks coverage by borough and category so I can see gaps while there's still time to fix them.

**What I did:**
Using it as my intake form. Transfer a row into `data.js` once the Status column reads READY.

**Note:**
The dropdowns are the useful part. They solve a bug at the point of entry rather than making me debug it later.

---

## Session 12 — The Render Function

**Date:** July 28, 2026

**What I asked:**
Write `script.js`. This was the step that turned a styled page into an application.

**What came back:**
Only the render function — no search or filters yet — with one design decision flagged as the hinge for everything after it:

```javascript
renderListings(services);
```

`renderListings` takes the list as an argument rather than reading the global `services` array directly. That means adding filtering later doesn't touch the function at all; you just pass it a different list.

Same principle one level down: `buildCard()` makes a card and returns it without touching the page. `renderListings()` decides what goes where. One job each.

Other things explained: `cloneNode(true)` copies a template and its contents (passing `false` gives an empty shell), `.textContent` instead of `.innerHTML` so a provider's text can never execute, and a `DocumentFragment` so twenty cards cause one layout recalculation instead of twenty.

**What I did:**
Used it. Tested by running `renderListings([])` in the console to confirm the empty state, and `renderListings([services[0]])` to confirm one card.

**Note:**
The date handling is the detail I want to remember. `new Date("2026-07-28")` is read as midnight UTC, so in New York it can display the day *before*. Splitting the string by hand avoids time zones completely. I would never have found that on my own — I'd have assumed my data was wrong.

---

## Session 13 — Search

**Date:** July 28, 2026

**What I asked:**
Add keyword search.

**What came back:**
More structure than search alone needed, deliberately. A single `state` object holding what the user has chosen, one `matchesX()` function per filter, and one `update()` function as the only path from "state changed" to "screen changed."

The pitch was that every control after this — filter buttons, category cards, clear-all — would follow the same path and none would touch the DOM directly.

Two specifics: `.filter()` returns a new array and leaves the original alone, so `services` always holds everything and there's nothing to restore when a search is cleared. And `addEventListener("input", ...)` rather than `"keyup"`, because keyup misses pasting with a mouse and misses the field's clear button.

**What I did:**
Took the larger structure even though it was more than I asked for.

**Note:**
Also flagged: an empty search box has to match *everything*, and getting that backwards makes the page blank on load. That's apparently the classic version of this bug.

---

## Session 14 — Borough and Cost Filters

**Date:** July 28, 2026

**What I asked:**
Wire up the filter buttons.

**What came back:**
Event delegation. One listener on the filters container instead of roughly thirty on individual buttons. Clicks bubble up and `event.target.closest(".filter-btn")` works out which button was hit — which also means buttons added later work automatically.

`state[filterName] = value` using bracket notation is what lets a single handler serve every filter group, since the key can be a variable.

And the payoff for the `data-` attributes I put in the HTML on the first day: the JavaScript doesn't hardcode a single borough name. The vocabulary lives in the markup.

**What I did:**
Used it as written.

**Note:**
The accessibility piece is the part I'd bring up in an interview. `updateButtonStates()` sets `aria-pressed`, and the CSS styles `[aria-pressed="true"]`. One attribute drives both what a screen reader announces and what a sighted user sees, so they cannot fall out of sync. Toggling a CSS class instead would leave two things to keep in agreement.

---

## Session 15 — Payment, Serves, and Access Filters

**Date:** July 28, 2026

**What I asked:**
The harder filters — payment matches against an array, access needs multiple selections at once.

**What came back:**
Three different matching problems.

`serves` was free. Adding the word "serves" to one array plus a four-line function. Nothing that already worked was touched — which was the whole argument for the structure two sessions earlier, demonstrated rather than asserted.

`payment` is single-select in the UI but an array in the data, since one clinic can take Medicaid and insurance and also see uninsured patients. So it's `.includes()`, not `===`.

`access` is array against array using `.every()`, which returns true only when the test passes for all items.

**What I did:**
All of it.

**Note:**
The `.every()` versus `.some()` explanation is the single best thing I got in this whole build. `.some()` would mean OR — selecting "no ID required" and "trans affirming" would return places that are only one of the two, sending an undocumented trans person to a clinic that will ask for ID. `.every()` means AND. That's a safety decision expressed as a choice between two array methods, and being able to explain *why* matters more than the three lines of code.

---

## Session 16 — Category Cards, Clear All, Empty State

**Date:** July 28, 2026

**What I asked:**
Wire up the last two dead controls.

**What came back:**
Both were short, which was the point. Clear-all is seven obvious lines because everything lives in one `state` object.

But one line in it isn't about state at all:

```javascript
searchInput.value = "";   // the DOM, not the state
```

`state.search` and the input's actual value are two different things. Clear one and forget the other, and the box still shows text while the app believes the search is empty.

Also: category cards toggle, so tapping the wrong one can be undone by tapping again. And `matchMedia` to check `prefers-reduced-motion` before smooth-scrolling, because the CSS media query can't reach a scroll triggered by JavaScript.

**What I did:**
Used it. My MVP logic is complete as of this step.

**Note:**
"What's on screen disagreeing with what the app believes" was described as one of the most common front-end bugs, and the reason frameworks like React exist. That reframed something for me — I'd assumed frameworks were about convenience.

---

## Session 17 — Phone Layout

**Date:** July 28, 2026

**What I asked:**
Continue to the next step.

**What came back:**
The responsive pass, reordered ahead of photos and real listings since those depend on my phone calls rather than on code.

Three fixes:

Touch targets raised to a 44px minimum, from Apple's guidelines and WCAG 2.5.8. Deliberately placed *outside* the media query, because a mouse user with a tremor benefits too.

The iOS zoom bug — Safari on iPhone automatically zooms the whole page in when you tap a text input whose font-size is under 16px, and the zoom doesn't undo itself. One line fixes it. It is invisible on a desktop browser.

The eight access toggles were stacking into a tall column and pushing results below the fold, so each filter group now scrolls sideways on narrow screens.

One breakpoint, at 40rem, chosen because that's where the layout actually breaks rather than because it matches a device.

**What I did:**
Took it. Testing on my actual phone through GitHub Pages, since simulators don't reproduce the iOS zoom behaviour.

**Note:**
The iOS zoom thing is the clearest example in this whole log of something I could not have found by testing on my laptop. I'd have shipped it.

---

## Session 18 — Services Without a Fixed Address

**Date:** July 30, 2026

**What I asked:**
I realized my borough filter assumed every organization has a physical space. Some of the groups I want to list have remote staff and host gatherings at partner organizations' sites. I asked what to do about it.

**What came back:**
That this was the same problem as the inclusion filters — two questions wearing one label. "Which borough" is really asking "can I get to this," which splits into whether there's a physical place at all and, if so, where.

Three changes: `borough` now accepts a string or an array, a `Citywide` value that matches every borough filter, and a `format` field for display only.

The reasoning on Citywide is the part I'd repeat: a remote service is reachable from every borough, so filtering it out when someone picks Staten Island would hide exactly the services that have no geography.

**What I did:**
All of it. Also updated my data collection spreadsheet, which surfaced a consequence I hadn't thought about — address could no longer be a required field, because remote services don't have one. Phone became required instead.

**Note:**
This one came from me, not the tool. I knew these organizations existed because I work with them. The fix was also backwards compatible — the code normalizes whatever shape it gets, so my existing entries kept working without edits. That's a migration strategy rather than a rewrite, and I didn't know that was a thing you could do.

---

## Session 19 — Category Illustrations

**Date:** July 30, 2026

**What I asked:**
The category cards looked like boring boxes. I wanted images.

**What came back:**
Six original SVG illustrations rather than stock photography, with the argument that stock "wellness" imagery is almost universally pastel and affluent-looking, which is the wrong register for this project — and that original artwork avoids licensing questions on a public repo entirely.

Each SVG is drawn in white at varying opacity on a transparent background, so the colour comes from CSS. One visual system, six distinct cards, under 1KB each.

**What I did:**
Used them. They look intentional, which the coloured boxes didn't.

**Note:**
The CSS uses attribute selectors — `[data-category="food"]` — to tint each card. Those are the same `data-` attributes my JavaScript reads for filtering. That's the third separate job those attributes have done.

---

## Session 20 — The Image That Wouldn't Load

**Date:** July 30, 2026

**What I asked:**
My first real listing's photo showed only alt text.

**What came back:**
Three wrong guesses before we got it. Suggestions in order: a filename case mismatch, then a HEIC file renamed rather than converted, then a WebP renamed rather than converted.

The second and third were partly right — I *had* downloaded a `.webp` from the organization's website and simply renamed it `.jpg`, which changes the label and not the bytes. But that wasn't why it failed.

It only got solved when I was asked to stop describing the symptom and paste actual output — `ls`, `file`, and `grep "image" data.js`. One line of that showed it immediately:

```javascript
image: "all-kings.webp",     // missing the folder
```

Paths are written from where `index.html` sits, not from where the image sits.

**What I did:**
Fixed the path. Also cleaned up a leftover `.jpeg` that Git was still tracking — `git add` on a folder stages deletions, not just additions.

**Note:**
The browser Console had the exact 404 the entire time, with the full path it was asking for. Reading it first would have taken one minute instead of four rounds. That's the lesson I actually want to keep: when something visual doesn't work, open Console before changing any files.

Also worth recording that I found my project wasn't where I thought it was. Every `cd ~/Desktop/healing-ninjas` had been failing silently in the background because it's in my home folder, not Desktop.

---

## Session 21 — The iPhone Overflow Bug

**Date:** July 30, 2026

**What I asked:**
A friend opened the live site on an iPhone and said it looked wonky when zoomed out, with filters cutting off.

**What came back:**
An admission that the horizontal-scrolling filter rows were a bad recommendation made earlier in this build. The reasoning had been that eight access toggles stacked into too tall a column on a phone. But iOS draws no scrollbar, so a row that scrolls sideways just looks like content that got cut off — which is exactly what my friend reported.

Reverted to wrapping. Then, when the page was *still* wider than the screen, a second cause: my listings grid used `minmax(320px, 1fr)`, and that 320px is a hard floor. On a narrower phone the column refuses to shrink and pushes past the viewport. Fixed with `minmax(min(320px, 100%), 1fr)`.

I also asked whether I could just stop people zooming out. The answer was no, and I shouldn't want to — iOS ignores `user-scalable=no` anyway, and disabling zoom is a well-known accessibility failure. For an app built for people who might be reading on a cracked screen in bad light, that would undercut the whole argument.

**What I did:**
Took the revert and both fixes.

**Note:**
This is the entry I'd point to if someone asks whether I just did what the AI told me. The horizontal scroll was a recommendation I accepted, and it was wrong. Testing on a real device found it in thirty seconds. The framing that stuck with me: *it optimized for a problem it imagined — filters being too tall — and created a real one, invisible content.*

Also learned that `overflow-x: hidden` silently creates a scroll container and breaks `position: sticky` further down the page, while `overflow-x: clip` doesn't.

---

## Session 22 — Sorting and Pagination

**Date:** July 30, 2026

**What I asked:**
New listings kept appending to the bottom. I was worried twenty services would be overwhelming.

**What came back:**
First, that twenty isn't a crisis and my filters already solve most of it — someone looking for free confidential mental health support in the Bronx gets two results, not twenty. A long unfiltered list is the "I haven't told you what I need yet" state, and being long is arguably correct there.

But one thing was worth fixing regardless: my listings rendered in whatever order I typed them into `data.js`, which isn't a decision, it's an accident. Sorting newest-verified-first is five lines and reinforces the argument the whole project rests on.

Then a "Show more" button showing eight at a time.

**What I did:**
Both. The refactor that came with it was the interesting part — every control now calls one `filtersChanged()` function instead of updating button states and re-rendering separately, because each of five handlers needed to reset the paging and I'd have forgotten one.

**Note:**
Two things I want to remember. `.sort()` mutates the array it's called on; `.filter()` returns a new one. So you copy with `[...matches]` before sorting or you permanently reorder your source data.

And because I stored dates as `YYYY-MM-DD`, alphabetical order *is* chronological order — no date parsing needed. That was a decision made on day one for a completely different reason, and it paid off here.

---

## Session 23 — Deciding What Not To Build

**Date:** July 30, 2026

**What I asked:**
Effectively, "should I add something to handle a long list?"

**What came back:**
Less than I asked for. Pagination, sorting by distance, and letting users choose a sort order were all pushed into future work as needing either a backend, geolocation, or more UI than the problem justifies at twenty listings.

**What I did:**
Took the smaller version.

**Note:**
Putting this in its own entry because it's a pattern across this whole build. The most useful responses consistently made the project *smaller*. Narrowing the scope on day one. Refusing to build a review form that wouldn't work. Talking me out of extra sort options. I came in assuming more features meant a better submission.

---

## Troubleshooting Log

Smaller things that cost me time. Recording them because the fixes are the part I'll actually reuse.

| What happened | What it was | Fix |
|---|---|---|
| Added `script.js`, page didn't change | Browser cache serving the old page | Hard refresh — `Cmd + Shift + R` |
| `.DS_Store` showing in `git status` | macOS Finder metadata, not project files | `.gitignore` |
| Terminal stuck showing `heredoc>` | Multi-line command still waiting for its closing marker | Type `EOF` on its own line |
| Couldn't download files | Preview opening instead of download | Copy the contents and paste into a new file |
| Image showed alt text only | Path in `data.js` was missing its folder; the file was a `.webp` renamed to `.jpg` | Match the path to where `index.html` sits; export to convert, never rename |
| `git status` said a file was deleted | Both `.jpg` and `.jpeg` had been committed | `git add` on the folder — it stages deletions too |
| Terminal stuck showing `dquote>` | Unclosed quote around a filename with a space | `Ctrl + C`, or drag the file in from Finder |
| Page wider than the screen on iPhone | Grid column with a hard 320px minimum | `minmax(min(320px, 100%), 1fr)` plus `min-width: 0` on grid children |
| `cd ~/Desktop/healing-ninjas` failed | Project is in my home folder, not Desktop | `pwd` tells you where you actually are |

The cache one is worth internalizing. My instinct was that my code was broken. It wasn't — the browser was showing me a saved copy. Whenever a change doesn't appear, hard refresh *before* debugging.

---

## Template for Future Entries

```markdown
## Session N — [Topic]

**Date:**

**What I asked:**

**What came back:**

**What I did:**

**Note:**
```

---

## How I Think About Using These Tools

I used AI the way I'd use a knowledgeable colleague who happens to be available at 11pm: to think out loud with, to get unstuck, and to have things explained. I did not use it as a substitute for understanding my own code. Where I accepted generated code, I made sure I could explain what each part does — that was the test I held myself to, because a project I can't explain isn't worth submitting.

Two patterns show up across these sessions that I want to name.

**The most valuable responses were the ones that told me no.** Narrowing the scope, refusing to build a review form that wouldn't work, splitting the inclusion filters into two axes. Those made the project smaller and better. If I'd only asked for code, I'd have gotten code, and it would have been worse.

**The context the tool couldn't have guessed was mine to supply.** That reviews and insurance mattered. That undocumented status, LGBTQ+ safety, and gender-specific programs needed to be visible. That the demo happens on a laptop. Every one of those came from knowing the people this is for. The tool structured what I brought — it didn't know what to bring.

There's a third thing I noticed only after reading this log back. The explanations that stuck were the ones tied to a consequence rather than to a convention. I remember `.every()` versus `.some()` because getting it wrong sends an undocumented person somewhere that will ask for ID. I remember the 16px input rule because Safari traps someone on a zoomed page they can't undo. I remember `aria-pressed` because two sources of truth eventually disagree. The rules I'd have forgotten are the ones that were only ever "best practice."

That's how I want to be able to talk about this project. Not as a list of features I implemented, but as a set of decisions with reasons behind them — most of which I can now defend, and a few of which I got wrong first.

**One more thing, added at the end of the build.** Somewhere in the middle of this log the tool gives me a recommendation that turns out to be wrong. It suggested horizontal-scrolling filter rows to save vertical space on a phone, I accepted it, and a friend testing on an actual iPhone found within thirty seconds that it made content invisible. We reverted it.

I'm leaving that in deliberately. A log where the AI is right every time isn't evidence that I understood anything — it's evidence that I typed what I was told. The sessions where I supplied context it couldn't have guessed, where I overruled it on the project name and on building desktop-first, and where its advice broke on contact with a real device, are the ones that show I was actually running this.

The tool was fast and it was often right. It was not the one deciding whether the thing worked.
