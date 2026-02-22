# SEO Action Plan: bisericaava.ro

**Generated:** 2026-02-22
**Current Score:** 28/100
**Target Score:** 75+/100

---

## Phase 1: Critical Fixes (Week 1) — Expected Impact: +25 points

### 1.1 Fix HTML Document Structure [5 min]
**File:** `public/index.html`

Add before the `<head>` tag:
```html
<!DOCTYPE html>
<html lang="ro">
```

Add before `</body>`:
```html
</html>
```

### 1.2 Migrate from HashRouter to BrowserRouter [2-4 hours]
**This is the single most impactful change for SEO.**

**Step 1:** Update `src/App.jsx` line 2:
```jsx
// Before:
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// After:
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
```

**Step 2:** Create `vercel.json` in project root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Step 3:** Update `package.json` line 4:
```json
// Before:
"homepage": "."
// After:
"homepage": "https://bisericaava.ro"
```

**Step 4:** Test all routes locally and deploy.

### 1.3 Add Structured Data (JSON-LD) [1 hour]
**File:** `public/index.html` — Add in `<head>` before `</head>`

Add Church, WebSite, and BreadcrumbList schema blocks as detailed in the FULL-AUDIT-REPORT.md Section 4.

### 1.4 Create sitemap.xml [15 min, after 1.2]
**File:** `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bisericaava.ro/</loc>
    <lastmod>2026-02-22</lastmod>
  </url>
  <url>
    <loc>https://bisericaava.ro/despre-noi</loc>
    <lastmod>2026-02-22</lastmod>
  </url>
  <url>
    <loc>https://bisericaava.ro/departamente</loc>
    <lastmod>2026-02-22</lastmod>
  </url>
</urlset>
```

### 1.5 Update robots.txt [5 min, after 1.4]
**File:** `public/robots.txt`
```
User-agent: *
Disallow:

Sitemap: https://bisericaava.ro/sitemap.xml
```

### 1.6 Add Canonical Tag [5 min]
**File:** `public/index.html` — Add in `<head>`:
```html
<link rel="canonical" href="https://bisericaava.ro" />
```

Note: After adding react-helmet, make this dynamic per page.

---

## Phase 2: High Priority (Week 2) — Expected Impact: +20 points

### 2.1 Add Per-Page Titles and Meta Descriptions [1 hour]
Install `react-helmet-async` and set unique `<title>` and `<meta description>` per route:

```bash
npm install react-helmet-async
```

| Route | Title | Description |
|-------|-------|-------------|
| `/` | Biserica Crestina Baptista AVA \| Targoviste | Biserica Crestina Baptista AVA din Targoviste. Program: Duminica 10:00, Miercuri 19:00. O comunitate de oameni nascuti din nou. |
| `/despre-noi` | Despre Noi — Biserica Baptista AVA Targoviste | Istoria si credinta Bisericii Baptiste AVA din Targoviste. Principiile noastre biblice si cele 5 Sola ale Reformei. |
| `/departamente` | Departamente — Biserica AVA Targoviste | Departamentele Bisericii AVA: Binefaceri, AVA Kids, VIVERE tineret, Consiliere biblica, Grupe de casa, Predicarea. |

### 2.2 Add Open Graph Meta Tags [15 min]
**File:** `public/index.html` — Add in `<head>`:
```html
<meta property="og:title" content="Biserica Crestina Baptista AVA" />
<meta property="og:description" content="O comunitate de oameni nascuti din nou. Targoviste, Romania." />
<meta property="og:image" content="https://bisericaava.ro/img/splash.webp" />
<meta property="og:url" content="https://bisericaava.ro" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="ro_RO" />
```

### 2.3 Fix Render-Blocking CSS [30 min]
**File:** `public/index.html`

**Remove unused CSS:**
```html
<!-- DELETE these two lines: -->
<link rel="stylesheet" type="text/css" href="css/nivo-lightbox/nivo-lightbox.css" />
<link rel="stylesheet" type="text/css" href="css/nivo-lightbox/default.css" />
```

**Consolidate Google Fonts into 1 request with display=swap:**
```html
<!-- DELETE these three lines: -->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800,900" rel="stylesheet" />

<!-- REPLACE with: -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Lato:wght@400;700&family=Raleway:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

**Update the preload tag too:**
```html
<!-- DELETE: -->
<link rel="preload" href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700,800,900" as="style" />
```

### 2.4 Remove Unused jQuery and Bootstrap JS [30 min]
**File:** `public/index.html`

```html
<!-- DELETE these two lines: -->
<script type="text/javascript" src="js/jquery.1.11.1.js"></script>
<script type="text/javascript" src="js/bootstrap.js"></script>
```

Replace the Bootstrap mobile nav toggle with a React state-based toggle in the Navigation component (~10 lines of code).

### 2.5 Fix Image Alt Text [10 min]
**File:** `src/components/header.jsx:8`
```jsx
// Before:
alt=""
// After:
alt="Biserica Crestina Baptista AVA Targoviste"
```

**File:** `src/components/about.jsx:10`
```jsx
// Before:
alt=""
// After:
alt="Despre Biserica AVA"
```

### 2.6 Fix CLS — Add Image Dimensions [30 min]
Add explicit `width` and `height` attributes to all `<img>` elements:

- `src/components/about.jsx` — Add `width` and `height` to despre.webp
- `src/components/gallery.jsx` — Add HTML `width`/`height` attributes alongside inline styles

---

## Phase 3: Medium Priority (Weeks 3-4) — Expected Impact: +10 points

### 3.1 Add Code Splitting [30 min]
**File:** `src/App.jsx`
```jsx
const Gallery = React.lazy(() => import("./components/gallery"));
const Maps = React.lazy(() => import("./components/maps"));
const Contact = React.lazy(() => import("./components/contact"));
```
Wrap with `<Suspense fallback={<div>Loading...</div>}>`.

### 3.2 Convert Department Card Images to `<img>` [45 min]
**File:** `src/components/departments.jsx`

Replace CSS `background-image` with `<img>` elements using `object-fit: cover` for the same visual effect. This enables `loading="lazy"` and browser preload scanning.

### 3.3 Lazy-load Stripe Script [30 min]
**File:** `src/components/donate.jsx`

Use IntersectionObserver to only load the Stripe script when the donate section scrolls into view.

### 3.4 Add Security Headers [30 min]
Create `vercel.json` (or update it) with:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 3.5 Fix CSS Variable Typo [5 min]
**File:** `public/css/reset.css` lines 24, 30, 35

```css
/* Before (triple dash — invalid): */
color: var(---heading-color);
/* After (double dash — correct): */
color: var(--heading-color);
```

---

## Phase 4: Low Priority (Backlog) — Expected Impact: +5 points

- Replace Font Awesome with inline SVGs for the 6 icons used (~40KB savings)
- Add responsive `srcset` images for different screen sizes
- Create `llms.txt` for AI search optimization
- Consider adding a blog/news section for fresh content signals
- Consider prerendering with `react-snap` for guaranteed HTML output to crawlers
- Add `<meta name="geo.region" content="RO-DB">` and `<meta name="geo.placename" content="Targoviste">`

---

## Expected Score After All Phases

| Phase | Estimated Score |
|-------|----------------|
| Current | 28/100 |
| After Phase 1 | ~53/100 |
| After Phase 2 | ~73/100 |
| After Phase 3 | ~83/100 |
| After Phase 4 | ~88/100 |

---

## Validation Checklist

After implementing changes, validate with:
1. [Google Search Console](https://search.google.com/search-console/) — Submit sitemap, check indexing
2. [Google Rich Results Test](https://search.google.com/test/rich-results) — Validate structured data
3. [PageSpeed Insights](https://pagespeed.web.dev/) — Measure Core Web Vitals
4. [Schema.org Validator](https://validator.schema.org/) — Validate JSON-LD
5. [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) — Verify mobile rendering
