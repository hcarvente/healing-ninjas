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
