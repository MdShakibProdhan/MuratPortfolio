# Consultancy Website — Full Build Specification

> **Purpose of this file:** This is a complete, self-contained spec you can hand to an AI coding agent (Antigravity, Gemini, etc.) to generate a static one-page website (SPA-style, single `index.html`, scroll-based sections) using **HTML5 + CSS3 + Bootstrap 5**. No backend, no build tools, no frameworks beyond Bootstrap. Every section below tells the agent exactly what to build.

> **Important note before you start:** The reference design you found on Dribbble belongs to a real financial company (their logo, exact copy, and exact stock photography are their property). This spec recreates the **layout patterns, structure, and visual system** — which is standard practice when using a template as inspiration — but uses **placeholder brand name, placeholder copy, and placeholder image slots** instead of the original company's assets. Before you publish, swap in: your own logo, your own business name, your own copy, and your own licensed/royalty-free images (e.g., from Unsplash, Pexels) or your own photos. Do not reuse the exact photos or wording from the original site.

---

## 1. Project Overview

- **Type:** Single-page static website (SPA-style — one `index.html`, sections linked via anchor scroll, no page reloads)
- **Industry:** Consultancy (personal/professional services — replace `[CONSULTANCY_NAME]` and `[YOUR NAME]` placeholders throughout with real content later)
- **Stack:** HTML5, CSS3, Bootstrap 5.3 (via CDN), vanilla JavaScript (only for the small interactions: mobile nav toggle, carousel/slider, smooth scroll)
- **No React, no build step, no npm.** Just static files.
- **Browser support:** latest Chrome, Safari, Firefox, Edge. Mobile-first responsive.

### 1.1 File Structure

```
/project-root
│
├── index.html
├── /assets
│   ├── /css
│   │   └── style.css
│   ├── /js
│   │   └── main.js
│   ├── /images
│   │   ├── hero-bg.jpg
│   │   ├── hero-portrait.jpg
│   │   ├── pillar-1.jpg
│   │   ├── pillar-2.jpg
│   │   ├── pillar-3.jpg
│   │   ├── pillar-4.jpg
│   │   ├── product-1.jpg
│   │   ├── product-2.jpg
│   │   ├── product-3.jpg
│   │   ├── product-4.jpg
│   │   ├── advisor-1.jpg
│   │   ├── advisor-2.jpg
│   │   └── logo.svg
│   └── /fonts (optional, only if using self-hosted fonts)
└── README.md
```

---

## 2. Design Tokens (Design System)

Define these as CSS custom properties (`:root`) at the top of `style.css`, and use them everywhere instead of hardcoded values.

```css
:root {
  /* Colors */
  --color-bg-light: #F7F7F6;        /* main page background, very light warm grey */
  --color-white: #FFFFFF;
  --color-dark-navy: #0B2B28;       /* primary dark teal-navy — buttons, header/footer band, dark sections */
  --color-dark-navy-hover: #123B36; /* slightly lighter navy for hover states */
  --color-accent-teal: #2FBF9F;     /* bright teal-green accent — used ONLY on highlighted headline words and small accents */
  --color-text-primary: #17211F;    /* near-black body/heading text */
  --color-text-secondary: #6B7570;  /* muted grey for supporting/paragraph text */
  --color-border: #E3E3E0;          /* hairline dividers */

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --fs-h1: clamp(2.25rem, 4vw, 3.5rem);   /* hero heading */
  --fs-h2: clamp(1.75rem, 3vw, 2.5rem);   /* section headings */
  --fs-h3: 1.375rem;                       /* pillar/card headings */
  --fs-body: 1rem;
  --fs-small: 0.875rem;
  --fs-label: 0.75rem;                     /* small uppercase-ish labels like "PILLAR 1" — DO NOT actually set text-transform:uppercase, keep sentence case per content below */

  /* Spacing */
  --space-section-y: 6rem;   /* vertical padding between major sections, 4rem on mobile */
  --space-section-y-mobile: 3rem;
  --container-max: 1200px;

  /* Radius & Shadow */
  --radius-sm: 4px;
  --radius-md: 8px;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.06);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-med: 0.35s ease;
}
```

**Font:** Use **Inter** (Google Fonts) as the single typeface for the whole site — one family for both headings and body, varying only by weight (400 body / 500 medium / 600–700 headings). Load via:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Color usage rule (important, follow exactly):**
- Body background: `--color-bg-light`
- Headings & body text: `--color-text-primary` for headings, `--color-text-secondary` for paragraphs
- The accent teal (`--color-accent-teal`) is used **sparingly**: only on 1–2 words inside the hero headline, small icon accents, and link hover underlines. Never as a full background.
- `--color-dark-navy` is used for: the "Become a Client" primary button, the products/CTA dark band section, and a 4–6px decorative top/bottom border on the page (`body { border-top: 6px solid var(--color-dark-navy); border-bottom: 6px solid var(--color-dark-navy); }`).

---

## 3. Global Layout Rules

- Max content width: `1200px`, centered, with `1.5rem` side padding on mobile.
- Use Bootstrap's grid (`container`, `row`, `col-*`) for structure, but override Bootstrap's default colors/fonts with the tokens above — do not leave Bootstrap's default blue/font visible anywhere.
- Every major section = `<section>` tag with a unique `id` for anchor navigation, and generous vertical padding (`var(--space-section-y)`).
- Rounded corners: none-to-minimal. This design uses **sharp, clean edges** (`border-radius: 0` or max `4px`) — NOT the generic rounded-card SaaS look. Buttons can have a very small radius (4px) or be fully square.
- Dividers between sections: thin 1px hairline (`--color-border`), full width, where noted below.

---

## 4. Section-by-Section Breakdown

### 4.1 Navbar (sticky, fixed on scroll)

**Structure (left → right):**
1. Logo (text-based placeholder is fine: `[CONSULTANCY_NAME]` in two lines, small mark/icon to the left of the text — e.g., a simple geometric monogram)
2. Center nav links (Bootstrap `navbar-nav`, horizontally centered on desktop): `Services`, `About`, `Insights` (replace with your real sections — these map to `INVEST`, `ABOUT US`, `PRESS RELEASES` in the reference, renamed for a consultancy context)
   - `Services` and `About` should be dropdown-capable (Bootstrap dropdown component) even if you only fill one item for now
3. Right side: `Sign In →` as a plain text link with a small arrow icon, followed by a solid dark-navy button: `Become a Client` (or `Book a Consultation` for your context)

**Behavior:**
- White/light background, becomes sticky with a subtle box-shadow after scrolling past ~50px (small JS scroll listener toggling a `.scrolled` class)
- Collapses into a Bootstrap `navbar-toggler` hamburger menu below 992px width
- Height: ~72px desktop, ~60px mobile

### 4.2 Hero Section (`#hero`)

Two acceptable layout variants were seen in the reference — **build Variant A as the primary/default hero**, and optionally implement Variant B as an alternate section right below it if you want extra visual richness.

**Variant A — full-bleed dark hero (first thing visitors see):**
- Full-width, ~85–90vh height section with a large background photo (dark overlay gradient from `rgba(11,43,40,0.85)` at the bottom-left to `rgba(11,43,40,0.4)` at top-right, so text stays readable)
- Background image: architectural/city or workspace photo (placeholder: `hero-bg.jpg`)
- Left-aligned content block, vertically centered-low (sits in lower-third of the hero):
  - H1 headline, two lines, large serif-free bold type: e.g. *"Where Expertise meets Execution"* — **one or two words highlighted in `--color-accent-teal`**, rest in white
  - One paragraph of supporting text (max ~2 lines, `--color-text-secondary`-equivalent but light, e.g. `rgba(255,255,255,0.75)`): describes what the consultancy does in one sentence
  - Two CTAs side by side: a solid white button (`Become a Client` → dark text) and a plain text link with arrow (`Get personal advice →`)
- Bottom strip inside the hero, full width, small caps-free labels split left/right: left = a small tag like `PROFESSIONAL ADVISORY SERVICES`, right = `SCROLL TO EXPLORE` (with a subtle animated down-chevron)

**Variant B — light hero with side-by-side imagery (optional secondary intro block):**
- White/light background section directly below Variant A (or replacing it if you prefer only one hero)
- Large centered two-line headline (H1/H2 size): black text, with the key phrase in `--color-accent-teal`, e.g. *"Where High-Level meets High-Touch"* style pattern — i.e., **two contrasting qualities joined by "meets"**, one word colored
- Below headline: a thin horizontal divider line, full width
- Two-column row: left column = short paragraph + primary button (`Become a Client`); right column = empty/decorative or a supporting stat
- Below that: a two-image row (large photo left ~55% width, smaller photo right ~45% width) that visually leads into the Pillars section

### 4.3 "Pillars" / Value Propositions Section (4 repeating blocks)

This is the core visual pattern of the reference design — **build this as a reusable component repeated 4 times**, alternating image position left/right each time (zig-zag layout).

**Per-pillar structure:**
- Two-column row (Bootstrap `row`, `col-lg-6 col-lg-6`), full-bleed images (images touch the section edges, no container padding around them)
- One column: a large image (representing the "story"/video-style shot — can be a static photo standing in for a video, add a centered play-button icon overlay if you want it to look video-like)
- Other column: a smaller image on top + text block below it, OR text block only depending on space — follow this content pattern:
  - Small label: `Pillar 1`, `Pillar 2`, `Pillar 3`, `Pillar 4` (sentence case, small font, muted color, NOT all-caps per the writing guidance — light letter-spacing is fine instead of caps)
  - `<h3>` heading (bold, ~22–24px)
  - 1–3 short sentences of description, muted grey text

**Alternate left/right on each row** (row 1: big image left, text right — row 2: text left, big image right — etc.) so the page has visual rhythm.

**Content placeholders for a consultancy (rename these to match your actual services):**

| # | Label | Heading | Description |
|---|-------|---------|-------------|
| 1 | Pillar 1 | Streamlined Onboarding | Get started in minutes with a simple, guided intake process. Clear next steps from the very first call. |
| 2 | Pillar 2 | Flexible Engagement Models | Work with us hourly, on retainer, or per-project — flexibility that fits how your business actually operates. |
| 3 | Pillar 3 | Hands-On Expert Guidance | Direct access to a senior consultant with 15+ years of industry experience, not a junior account manager. |
| 4 | Pillar 4 | Confidential & Secure Process | Your data and business information are handled under strict confidentiality agreements and secure file-sharing. |

Each row's background alternates subtly: white → `--color-bg-light` → white → `--color-bg-light`, OR keep all white with a 1px divider between rows — pick one and stay consistent.

### 4.4 Products / Services Showcase (dark band with carousel)

- Full-width section with **dark navy background** (`--color-dark-navy`), generous padding top/bottom
- Inside it, a **white/light card panel** (not full-bleed — inset with margin, like a "floating panel") containing:
  - Small breadcrumb-style label top-left: `[Consultancy Name] / Services`
  - Large heading (left-aligned, ~2 lines): *"Explore tailored solutions for your business"*
  - Short paragraph to the left below the heading, ~3 lines, describing the range of services
  - A solid dark button top-right of this panel: `Explore all services →`
  - Below: a **horizontally scrollable card row** (implement as a Bootstrap carousel OR a simple flex row with `overflow-x: auto` + snap scrolling — simplest for a static build is CSS scroll-snap, no JS carousel library needed)
    - Each card: full-bleed photo background, dark gradient overlay at the bottom, white bold text overlaid at the bottom of the image (title + one-line description), small arrow icon top-right of each card
    - 3–4 cards visible/partially visible, with small pagination arrow buttons (prev/next) bottom-left of the row
  - Example card content (replace with real services):
    1. "Strategy & Growth Advisory" — "Actionable roadmaps to scale sustainably."
    2. "Financial & Operational Planning" — "Bring structure and clarity to your numbers."
    3. "Market Entry Consulting" — "Navigate new markets with confidence."
    4. "Ongoing Retainer Support" — "Continuous guidance as your business evolves."

### 4.5 About / Trust Section (optional but recommended — implied by "ABOUT US" nav item)

- Simple two-column section: photo of you (portrait, professional) on one side, bio + credentials + a couple of trust stats (years of experience, clients served, etc.) on the other
- Include a small pull-quote style testimonial if you have one, styled with a thin left border in the accent teal color

### 4.6 Footer

- Dark navy background matching the button/CTA color
- Multi-column layout: Column 1 = logo + one-line tagline; Column 2 = nav links repeated; Column 3 = contact info (email, phone, location); Column 4 = social links (icon only)
- Bottom bar: copyright line + tiny legal links (Privacy Policy, Terms), separated from the columns above by a hairline divider (`rgba(255,255,255,0.1)`)

---

## 5. Components Detail

### 5.1 Buttons
- **Primary button** (`.btn-primary-custom`): solid `--color-dark-navy` background, white text, `padding: 0.75rem 1.75rem`, `border-radius: 4px`, no border, `font-weight: 600`. On hover: background → `--color-dark-navy-hover`, subtle `transform: translateY(-1px)`.
- **Secondary/white button** (used on dark hero): white background, dark navy text, same padding/radius. Hover: background → `--color-bg-light`.
- **Text link with arrow** (`.link-arrow`): no background, `--color-text-primary` (or white on dark backgrounds), underline appears on hover, small arrow (→) that shifts 3px right on hover (CSS `transition: transform`).

### 5.2 Cards (product/service cards)
- No drop shadow by default (avoid the generic "SaaS card" look) — rely on the image + overlay text instead
- `border-radius: 4px` on the image container, overflow hidden
- On hover: slight zoom on the background image (`transform: scale(1.03)`, `transition: 0.4s`) — this is the ONE hover motion effect to use consistently across all cards

### 5.3 Navbar dropdown
- Standard Bootstrap dropdown, but restyle: remove default shadow/border-radius excess, use a clean 1px border in `--color-border`, `border-radius: 4px`, small drop shadow (`--shadow-card`)

### 5.4 Scroll behavior
- Smooth scroll for all anchor links (`html { scroll-behavior: smooth; }` or JS equivalent for older browsers)
- Navbar links scroll to their matching section `id`

---

## 6. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| ≥1200px (desktop) | Full multi-column layouts as described above |
| 992–1199px | Same layout, slightly reduced spacing/font sizes |
| 768–991px (tablet) | Navbar collapses to hamburger; pillar rows stack to single column (image on top, text below); product cards show 2 at a time |
| <768px (mobile) | Everything single column; hero text shrinks to `clamp` minimum; hero height reduces to ~70vh; product cards show 1 at a time with scroll-snap; footer columns stack vertically |

---

## 7. Interactions / JavaScript (`main.js`) — keep minimal

1. Navbar `scrolled` class toggle on scroll (adds shadow + slightly reduces navbar height)
2. Bootstrap's built-in JS bundle handles the navbar collapse and dropdowns — just include the CDN script, no custom code needed for that
3. Product card row: pure CSS `scroll-snap-type: x mandatory` + `overflow-x: auto` — optional small JS for the prev/next arrow buttons to call `.scrollBy({left: 320, behavior: 'smooth'})`
4. Optional: simple `IntersectionObserver` to fade in the Pillars sections once when they enter viewport (ONE subtle effect only, not on every element — per design guidance, avoid scattering fade-in-on-scroll on every single item)

---

## 8. Accessibility Checklist

- All images have descriptive `alt` text
- Color contrast: white text on the dark navy background passes WCAG AA (`#0B2B28` is dark enough — verify with a contrast checker)
- Visible focus states on all buttons/links (`:focus-visible { outline: 2px solid var(--color-accent-teal); outline-offset: 2px; }`)
- Respect `prefers-reduced-motion`: wrap hover/scroll animations in a media query so they're disabled for users who request reduced motion
- Semantic HTML: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy (only one `<h1>` on the page, in the hero)

---

## 9. Placeholder Content Checklist (fill these in before publishing)

- [ ] Replace `[CONSULTANCY_NAME]` everywhere with your real business name
- [ ] Replace hero headline, subheading, and CTA copy with your own value proposition
- [ ] Replace all 4 Pillar headings/descriptions with your actual service differentiators
- [ ] Replace the 4 product/service cards with your real service offerings
- [ ] Replace `hero-bg.jpg`, `hero-portrait.jpg`, `pillar-*.jpg`, `product-*.jpg` with your own licensed photos (Unsplash/Pexels are free-to-use and safe legally)
- [ ] Replace the logo placeholder with your real logo (SVG preferred)
- [ ] Fill in real contact details and social links in the footer
- [ ] Add real `<title>` and `<meta name="description">` tags for SEO

---

## 10. Instructions for the AI Coding Agent (Antigravity / Gemini)

When implementing this spec:
1. Build `index.html` with the full section order: Navbar → Hero (Variant A, optionally + Variant B) → Pillars (×4, alternating) → Products/Services dark band → About → Footer
2. Use Bootstrap 5.3 via CDN for grid/components; write ALL custom visual styling in `style.css` using the design tokens in Section 2 — do not rely on Bootstrap's default theme colors
3. Use real semantic placeholder copy from Sections 4.2–4.6 above, not "Lorem ipsum"
4. Use placeholder `<img>` tags pointing to `/assets/images/...` with correct `alt` text, so images can be swapped in later without touching the HTML structure
5. Keep everything in 3 files only: `index.html`, `assets/css/style.css`, `assets/js/main.js`
6. Test responsiveness at 375px, 768px, 1200px widths before considering it done
