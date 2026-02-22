# Full SEO Audit Report: bisericaava.ro

**Date:** 2026-02-22
**Business Type:** Religious Organization (Romanian Baptist Church)
**Location:** Strada Tineretului 2, Targoviste, Romania
**Stack:** React 17 SPA (Create React App), HashRouter, Vercel hosting

---

## Executive Summary

### Overall SEO Health Score: 28/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Technical SEO | 20/100 | 25% | 5.0 |
| Content Quality | 55/100 | 25% | 13.8 |
| On-Page SEO | 15/100 | 20% | 3.0 |
| Schema / Structured Data | 0/100 | 10% | 0.0 |
| Performance (CWV) | 40/100 | 10% | 4.0 |
| Images | 50/100 | 5% | 2.5 |
| AI Search Readiness | 5/100 | 5% | 0.3 |
| **Total** | | **100%** | **28.6** |

### Top 5 Critical Issues

1. **HashRouter makes all pages invisible to search engines** — Google sees the entire site as a single page. The 3 routes (`/`, `/despre-noi`, `/departamente`) are hash-based and cannot be indexed individually.
2. **Zero structured data (Schema.org)** — No JSON-LD, Microdata, or RDFa markup. Search engines have no machine-readable context about what this site is.
3. **No sitemap.xml** — Missing entirely, and cannot be created properly until HashRouter is replaced.
4. **Missing `<!DOCTYPE html>` and `<html lang="ro">`** — The HTML file starts with `<head>` directly. This can trigger quirks mode and prevents language detection.
5. **No canonical tags, no Open Graph, no meta per page** — Single generic `<title>` and `<meta description>` for all 3 pages.

### Top 5 Quick Wins

1. Add `<!DOCTYPE html>` and `<html lang="ro">` (5 min)
2. Remove unused Nivo Lightbox CSS files (5 min)
3. Consolidate 3 Google Fonts requests into 1 URL with `display=swap` (15 min)
4. Add `defer` to jQuery and Bootstrap `<script>` tags (5 min)
5. Add `width`/`height` attributes to all `<img>` elements (30 min)

---

## 1. Technical SEO (Score: 20/100)

### 1.1 Crawlability — CRITICAL FAILURE

**HashRouter blocks all crawling of subpages.**

The application uses `HashRouter` from `react-router-dom` (configured in `src/App.jsx:2`):

```jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
```

This produces URLs like:
- `https://bisericaava.ro/#/`
- `https://bisericaava.ro/#/despre-noi`
- `https://bisericaava.ro/#/departamente`

**Impact:** URL fragments (everything after `#`) are never sent to the server. Google treats all three URLs as `https://bisericaava.ro/`. The site effectively has only 1 indexable page.

**Fix:** Migrate to `BrowserRouter`:
```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
```

This also requires:
- A `vercel.json` rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- Updating `"homepage": "."` in `package.json` to `"homepage": "https://bisericaava.ro"` or removing it

### 1.2 robots.txt — PARTIAL

**File:** `public/robots.txt`
```
User-agent: *
Disallow:
```

- Crawling is allowed for all user agents — PASS
- No `Sitemap:` directive — FAIL
- No specific rules for AI crawlers (GPTBot, ClaudeBot, etc.) — INFO

### 1.3 Indexability

| Check | Status |
|-------|--------|
| `<meta name="robots">` | Not present (default: index, follow) — OK |
| `X-Robots-Tag` header | Not configured — OK (Vercel default) |
| Canonical tag | **MISSING** — Should add `<link rel="canonical">` |
| `noindex` pages | None found — OK |

### 1.4 Security

| Check | Status |
|-------|--------|
| HTTPS | PASS — Vercel provides automatic HTTPS |
| HSTS header | Likely present (Vercel default) |
| `Content-Security-Policy` | Not configured in project |
| `X-Frame-Options` | Not configured in project |
| `X-Content-Type-Options` | Not configured in project |

**Note:** No `_headers` file or `vercel.json` headers configuration found. Security headers should be added.

### 1.5 URL Structure

| Issue | Severity |
|-------|----------|
| Hash-based URLs (`#/`) | CRITICAL |
| No clean URL paths | CRITICAL |
| No breadcrumb navigation | MEDIUM |

### 1.6 Mobile Optimization

| Check | Status |
|-------|--------|
| Viewport meta tag | PASS — `<meta name="viewport" content="width=device-width, initial-scale=1">` |
| Responsive CSS | PASS — Media queries at 768px and 576px breakpoints |
| Touch targets | PASS — Buttons and links appear adequately sized |

### 1.7 Missing `<!DOCTYPE html>` and `<html>` Tag

**File:** `public/index.html` starts directly with `<head>` — there is no `<!DOCTYPE html>` declaration and no `<html lang="ro">` wrapping tag. This can trigger quirks mode rendering in browsers and prevents search engines from detecting the page language.

---

## 2. Content Quality (Score: 55/100)

### 2.1 E-E-A-T Assessment

| Signal | Status | Notes |
|--------|--------|-------|
| **Experience** | WEAK | No testimonials, no personal stories, no event photos with descriptions |
| **Expertise** | MODERATE | Detailed Baptist theology and beliefs on the about page |
| **Authoritativeness** | WEAK | No external citations, no denomination affiliation links, no pastor profiles |
| **Trustworthiness** | MODERATE | Physical address, phone, email, IBAN for donations (shows transparency) |

### 2.2 Content Depth by Page

| Page | Word Count (est.) | Assessment |
|------|-------------------|------------|
| Home (`/`) | ~200 words | THIN — Mostly section headers with brief summaries |
| About (`/#/despre-noi`) | ~400 words | ADEQUATE — Church history, Baptist principles, 9 belief statements |
| Departments (`/#/departamente`) | ~350 words | ADEQUATE — 6 departments with 50-80 words each |

**Total site content:** ~950 words across 3 pages. For a church website, this is on the low end but acceptable if supplemented with structured data and regular updates.

### 2.3 Heading Structure

**Home page:**
- `<h1>` "Bine ati venit!" — Present but generic
- Multiple `<h2>` for sections — OK
- `<h3>` for department names — OK

**Issues:**
- The `<h1>` says "Welcome" which has no keyword value for "biserica" (church) or location
- Subpages use `<h1>` appropriately

### 2.4 Content Issues

| Issue | Severity |
|-------|----------|
| `dangerouslySetInnerHTML` used for content rendering (`utils.js`) | MEDIUM — XSS risk if content source changes |
| No blog or news section for fresh content signals | LOW |
| All content in Romanian (appropriate for audience) | OK |
| Generic page title "Biserica AVA" shared across all pages | HIGH |

### 2.5 Readability

- Font size: 15px body text — Adequate
- Line height: 24px — Good
- Max content width: 800px on article pages — Good
- Font families: Open Sans, Lato, Raleway — Highly readable

### 2.6 AI Citation Readiness — VERY LOW (5/100)

| Check | Status |
|-------|--------|
| Structured data for AI parsing | FAIL — None |
| Clear, citable paragraphs | PARTIAL — About page has decent structure |
| FAQ-style content | FAIL — None |
| `llms.txt` file | FAIL — Missing |
| AI crawler access (GPTBot, ClaudeBot) | PASS — robots.txt allows all |

---

## 3. On-Page SEO (Score: 15/100)

### 3.1 Title Tags

| Page | Current Title | Issue |
|------|--------------|-------|
| All pages | "Biserica AVA" | Same title for all 3 pages — CRITICAL |

**Recommended titles:**
- Home: "Biserica Crestina Baptista AVA | Targoviste"
- About: "Despre Noi — Biserica Baptista AVA Targoviste"
- Departments: "Departamente — Biserica AVA Targoviste"

### 3.2 Meta Descriptions

| Page | Current | Issue |
|------|---------|-------|
| All pages | "O comunitate de oameni nascuti din nou" | Same description for all — HIGH |

**Recommended descriptions:**
- Home: "Biserica Crestina Baptista AVA din Targoviste. Program: Duminica 10:00, Miercuri 19:00. O comunitate de oameni nascuti din nou."
- About: "Istoria si credinta Bisericii Baptiste AVA din Targoviste. Principiile noastre biblice si cele 5 Sola ale Reformei."
- Departments: "Departamentele Bisericii AVA: Binefaceri, AVA Kids, VIVERE tineret, Consiliere biblica, Grupe de casa, Predicarea."

### 3.3 Missing Meta Tags

| Tag | Status |
|-----|--------|
| `<link rel="canonical">` | MISSING |
| Open Graph (`og:title`, `og:description`, `og:image`) | MISSING |
| Twitter Card | MISSING |
| `<meta name="geo.region">` | MISSING |
| `<meta name="geo.placename">` | MISSING |

### 3.4 Internal Linking

- Navigation has 5 links: Acasa, Despre noi, Departamente, Doneaza, Contact
- Hash anchors on homepage for sections (#about, #departamente, #maps, #contact)
- No contextual internal links within page content
- No breadcrumb navigation

---

## 4. Schema / Structured Data (Score: 0/100)

**No structured data found.** Zero JSON-LD, Microdata, or RDFa markup anywhere in the project.

### Recommended Schema Types

| Priority | Type | Purpose |
|----------|------|---------|
| Critical | `Church` (PlaceOfWorship) | Primary entity identity |
| Critical | `Organization` | Contact, social profiles |
| High | `WebSite` | Site-level metadata |
| High | `Event` (recurring) | Weekly services: Sun 10:00, Wed 19:00 |
| Medium | `BreadcrumbList` | Navigation structure |

### Recommended Implementation

Add to `<head>` of `public/index.html`:

**Church + Organization:**
```json
{
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Biserica Crestina Baptista AVA",
  "alternateName": "Biserica AVA",
  "description": "O comunitate de oameni nascuti din nou",
  "url": "https://bisericaava.ro",
  "telephone": "+40785541595",
  "email": "avachurch19@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Strada Tineretului 2",
    "addressLocality": "Targoviste",
    "addressRegion": "Dambovita",
    "addressCountry": "RO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 44.92639,
    "longitude": 25.44564
  },
  "sameAs": [
    "https://www.facebook.com/BisericaAva",
    "https://www.youtube.com/@bisericaava"
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday",
      "opens": "19:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:00",
      "closes": "12:00"
    }
  ],
  "isAccessibleForFree": true,
  "publicAccess": true
}
```

**WebSite:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Biserica AVA",
  "url": "https://bisericaava.ro",
  "inLanguage": "ro"
}
```

---

## 5. Performance / Core Web Vitals (Score: 40/100)

### 5.1 Estimated Metrics

| Metric | Mobile (est.) | Desktop (est.) | Target |
|--------|--------------|----------------|--------|
| **LCP** | 2.0-3.5s | 1.0-2.0s | < 2.5s |
| **INP** | 100-200ms | 50-100ms | < 200ms |
| **CLS** | 0.15-0.30 | 0.10-0.20 | < 0.1 |
| **FCP** | 2.0-3.5s | 1.0-2.0s | < 1.8s |
| **TTFB** | 50-150ms | 50-150ms | < 800ms |

**Estimated Lighthouse Score:** 45-60 (mobile), 75-85 (desktop)

### 5.2 Render-Blocking Resources (CRITICAL)

**7 render-blocking CSS files** in `<head>` (`public/index.html:26-50`):
1. `css/bootstrap.css` (~143KB)
2. `fonts/font-awesome/css/font-awesome.css` (~30KB)
3. `css/style.css`
4. `css/nivo-lightbox/nivo-lightbox.css` — **UNUSED, delete**
5. `css/nivo-lightbox/default.css` — **UNUSED, delete**
6. Three separate Google Fonts requests — **consolidate into 1**

**2 render-blocking JS files** in `<body>` (`public/index.html:58-59`):
1. `js/jquery.1.11.1.js` (~95KB) — **NOT USED by React, remove**
2. `js/bootstrap.js` (~68KB) — **Only used for mobile nav toggle, replace with React**

### 5.3 CLS Sources

| Source | File | Fix |
|--------|------|-----|
| About image lacks `width`/`height` | `src/components/about.jsx:10` | Add explicit dimensions |
| Gallery images use pixel dimensions that don't match render size | `src/components/gallery.jsx:53-65` | Use `aspect-ratio` CSS |
| ImportantMessage banner changes header height | `src/components/warning.jsx` | Reserve space with min-height |
| Department card images are CSS `background-image` (not lazy-loadable) | `src/components/departments.jsx:20` | Switch to `<img>` elements |

### 5.4 What's Working Well

- Hero image is preloaded with `fetchPriority="high"` — GOOD
- All images converted to WebP — GOOD
- Gallery uses `loading="lazy"` — GOOD
- Google Maps iframe uses `loading="lazy"` — GOOD
- Stripe script loaded `async` — GOOD
- Vercel provides excellent TTFB — GOOD

### 5.5 Estimated Resource Breakdown

| Resource | Size (est.) |
|----------|-------------|
| HTML shell | ~2KB |
| CSS (render-blocking) | ~180KB |
| JS (blocking: jQuery + Bootstrap) | ~163KB |
| JS (React bundle) | ~200-300KB |
| Google Fonts | ~80-120KB |
| Hero image (splash.webp) | ~50-200KB |
| Gallery images (9x WebP) | ~500KB-2MB |
| Department images (6x WebP) | ~300KB-1MB |
| Third-party (Stripe) | ~50-100KB |
| **Total** | **~1.5-3.5MB** |

---

## 6. Images (Score: 50/100)

### 6.1 Image Format

| Check | Status |
|-------|--------|
| WebP format used | PASS — All images converted to .webp |
| AVIF available | FAIL — No next-gen fallback |
| Responsive `srcset` | FAIL — No responsive image sizes |

### 6.2 Alt Text

| Image | Alt Text | Issue |
|-------|----------|-------|
| Hero (`splash.webp`) | `alt=""` | FAIL — Empty alt for main visual |
| About (`despre.webp`) | `alt=""` | FAIL — Empty alt |
| Gallery images | `alt` from data or `""` | PARTIAL — Some may be empty |
| Department images | `alt={name}` | PASS — Uses department name |

### 6.3 Lazy Loading

| Image | Lazy | Notes |
|-------|------|-------|
| Hero (splash.webp) | No — `fetchPriority="high"` | CORRECT — LCP element |
| About (despre.webp) | Yes — `loading="lazy"` | PASS |
| Gallery images | Yes — `loading="lazy"` | PASS |
| Department card images | No — CSS `background-image` | FAIL — Cannot lazy load |

### 6.4 Image Dimensions

| Image | `width`/`height` attrs | Impact |
|-------|----------------------|--------|
| Hero | None (CSS positioned) | Minor CLS risk |
| About | **MISSING** | CLS when loading |
| Gallery | Inline style pixels | Partial (not standard attrs) |
| Department | N/A (CSS background) | No CLS (fixed container) |

---

## 7. AI Search Readiness (Score: 5/100)

| Check | Status |
|-------|--------|
| AI crawler access | PASS — robots.txt allows all |
| `llms.txt` file | MISSING |
| Schema.org structured data | MISSING |
| Citable paragraph structure | WEAK |
| Brand mention signals | WEAK — Only social links |
| Content authority signals | WEAK — No citations, no credentials |
| FAQ content | MISSING |

---

## Summary of All Issues

| # | Issue | Severity | Category | Effort |
|---|-------|----------|----------|--------|
| 1 | HashRouter prevents page indexing | CRITICAL | Technical | 2-4 hours |
| 2 | No structured data (JSON-LD) | CRITICAL | Schema | 1 hour |
| 3 | No sitemap.xml | CRITICAL | Technical | 15 min (after #1) |
| 4 | Missing `<!DOCTYPE html>` and `<html lang="ro">` | CRITICAL | Technical | 5 min |
| 5 | Same `<title>` for all pages | HIGH | On-Page | 1 hour |
| 6 | Same `<meta description>` for all pages | HIGH | On-Page | 30 min |
| 7 | No canonical tag | HIGH | Technical | 5 min |
| 8 | No Open Graph meta tags | HIGH | On-Page | 15 min |
| 9 | 7 render-blocking CSS files | HIGH | Performance | 30 min |
| 10 | jQuery + Bootstrap JS loaded (unused by React) | HIGH | Performance | 30 min |
| 11 | Empty alt text on hero and about images | HIGH | Images | 10 min |
| 12 | CLS from images without dimensions | HIGH | Performance | 30 min |
| 13 | No per-page meta tags (need react-helmet) | MEDIUM | On-Page | 1 hour |
| 14 | Unused Nivo Lightbox CSS loaded | MEDIUM | Performance | 5 min |
| 15 | 3 separate Google Fonts requests (no `display=swap`) | MEDIUM | Performance | 15 min |
| 16 | Department images use CSS `background-image` | MEDIUM | Images/Perf | 45 min |
| 17 | No code splitting (React.lazy) | MEDIUM | Performance | 30 min |
| 18 | Stripe JS loaded on every page | MEDIUM | Performance | 30 min |
| 19 | No security headers configured | MEDIUM | Technical | 30 min |
| 20 | No breadcrumb navigation | MEDIUM | On-Page | 1 hour |
| 21 | No `Sitemap:` directive in robots.txt | MEDIUM | Technical | 5 min (after #3) |
| 22 | Font Awesome loaded for 6 icons | LOW | Performance | 1 hour |
| 23 | No responsive `srcset` images | LOW | Images | 2 hours |
| 24 | No `llms.txt` file | LOW | AI Search | 15 min |
| 25 | No blog/news section | LOW | Content | 4+ hours |
| 26 | CSS variable typo: `---heading-color` (triple dash) | LOW | Technical | 5 min |

---

## 8. Visual & UX Audit — Additional Code Bugs Found

The visual audit uncovered several **code-level bugs** beyond SEO:

### 8.1 CRITICAL Bugs

| # | Bug | File | Fix |
|---|-----|------|-----|
| 27 | `target="blank_"` instead of `target="_blank"` — links open in same named window, not new tab | `navigation.jsx:68`, `contact.jsx:57,62` | Change to `target="_blank"` |
| 28 | `class=` instead of `className=` in JSX — React warning | `navigation.jsx:68` | Change to `className=` |
| 29 | `width: 111%` on `#features` at `max-width: 400px` — causes horizontal scroll on small phones | `App.css:5` | Remove or set to `100%` |

### 8.2 MODERATE Bugs

| # | Bug | File | Fix |
|---|-----|------|-----|
| 30 | `getYear()` is deprecated + "All rights **reversed**" typo | `contact.jsx:75` | Use `getFullYear()` and fix to "reserved" |
| 31 | Gallery hover `transform: scale(1.5)` is too aggressive — overlaps adjacent images | `gallery.css:8-10` | Reduce to `scale(1.1)` or `scale(1.2)` |
| 32 | Mobile donate CTA hidden behind hamburger menu — no prominent CTA above the fold on mobile | `header.jsx` | Add floating donate button or hero CTA |
| 33 | Single-column grid for mobile departments is commented out — cards stay 2-column at 375px | `services.css:96` | Uncomment `grid-template-columns: 1fr` |
| 34 | Missing `rel="noopener noreferrer"` on external links | `navigation.jsx`, `contact.jsx` | Add to all `target="_blank"` links |
| 35 | Gallery images all have empty `alt` text | `gallery.jsx` | Add descriptive alt text to photo data |

### 8.3 Visual Hierarchy Assessment

**Strengths:**
- Clean black-and-white design with strong contrast
- Logical content flow: Hero → About → Departments → Gallery → Maps → Contact
- Consistent section styling with alternating backgrounds
- Good typography choices (Open Sans, Raleway, Lato)

**Weaknesses:**
- No prominent CTA in the hero section (the original button is commented out in `header.jsx:25`)
- Mobile users must open hamburger menu to find the donate button
- H1 "Bine ati venit!" is generic — no church name or location keywords
