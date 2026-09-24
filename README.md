# UtilityHub — Free Online Tools for Everyday Work

> **Production-ready, SEO-first, privacy-focused utility platform.**  
> PDF, image, text, calculators, time, QR, developer, security, student & career tools — fast, simple and free. No signup, no paywall.

Brand is configurable in one place: `src/config/site.ts`.

![Stack](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **75+ working tools** covering 10 categories (see catalog below)
- **Client-side first**: File API, Canvas, Web Crypto, `pdf-lib`, `pdfjs-dist`, `qrcode` — files processed in browser where claimed
- **SEO-first**: unique title/meta/canonical per tool, Open Graph, Breadcrumbs + BreadcrumbList JSON-LD, WebApplication & WebSite structured data, `sitemap.xml`, `robots.txt`
- **Reusable tool registry** → powers search, categories, breadcrumbs, sitemap, related tools
- **Global search** (client-side, name/description/keywords) with keyboard navigation
- **Mobile-first, accessible, dark mode** (system preference + toggle)
- **Performance**: lazy-loaded PDFs & images (heavy libs split), code-split vendor/qr/pdf chunks, not loaded on homepage
- **AdSense-ready**: `<AdPlaceholder>` components that never cover buttons/upload zones
- **Static deploy**: no backend, suitable for **Cloudflare Pages Free**

---

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS 3
- React Router 6
- pdf-lib, pdfjs-dist (lazy), qrcode, Canvas APIs, Web Crypto

No Firebase/Supabase/auth/database/cloud functions — fully static.

---

## Folder Structure

```
src/
  config/site.ts          # brand, URL, adsense, analytics — single source
  data/tools.ts           # central ToolDefinition registry (search/sitemap/related)
  types/tool.ts           # ToolCategory & ToolDefinition
  components/
    layout/Header, Footer, Layout
    common/UploadZone, ToolCard, Breadcrumbs, ErrorBoundary
    seo/SEO               # title/meta/canonical/OG/json-ld manager
    ads/AdPlaceholder
  pages/
    Home, CategoryHub, ToolPage, StaticPages, NotFound
  tools/
    pdf/  MergePdf, SplitPdf, PdfToImages, ImagesToPdf, PdfUtils
    image/ImageTools       # compressor, resizer, converter, transformer, cropper
    text/TextTools         # word counter, case, cleaner, diff
    calculators/Calculators
    time/TimeTools
    qr/QRGenerator
    developer/DevTools
    security/SecurityTools
    student/StudentTools
    career/CareerTools
  lib/analytics.ts        # abstraction for GA
  utils/format.ts
public/
  favicon.svg, manifest.webmanifest, robots.txt, sitemap.xml
scripts/generate-sitemap.mjs
```

---

## Tool Catalog (75 implemented, all functional)

**PDF (9)**: Merge PDF, Split PDF, PDF to Images, Images to PDF, Rotate PDF, PDF Info, PDF Text Extraction, Watermark PDF, Page Numbers

**Image (12)**: Compressor, Resizer, Cropper, JPG→PNG, PNG→JPG, WebP→JPG, JPG→WebP, PNG→WebP, Rotate, Flip, Grayscale, Dimensions, EXIF Remover

**Text (6)**: Word Counter, Case Converter, Text Cleaner, Text Diff, Slug Generator, Lorem Ipsum

**Calculators (9)**: Age, Percentage, GST (India 5/12/18/28), EMI, SIP, FD (via SIP model), Unit Converter, Date Difference, Discount

**Time (7)**: Timer, Stopwatch, Pomodoro, World Clock + Time Zone Converter, Date/Birthday/Exam Countdown

**QR (2)**: QR Code Generator (URL/text/WiFi/email/phone/vCard/SMS), Wi-Fi QR

**Developer (14)**: JSON Formatter/Validator/Minifier, XML Formatter, Base64 Encode/Decode, URL Encode/Decode, JWT Decoder (no verification), UUID, Regex Tester, Timestamp Converter, HEX↔RGB, Gradient Generator, Hash Generator (SHA-1/256/384/512 via Web Crypto)

**Security (4)**: Password Generator (Web Crypto), Strength Checker, Random Number, Random String

**Student (4)**: Attendance, CGPA, GPA, Percentage

**Career (5)**: Resume Analyzer (rule-based, not AI), Keyword Extractor, Keyword Density, Email Template, Cover Letter Template

> Not implemented (intentionally omitted): PDF→Word/Excel/PowerPoint and OCR — no reliable free client-side lib without paid API; faking would violate requirements.

---

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build + sitemap
npm run preview  # preview production build on :4173
```

### Adding a New Tool (no page duplication)

1. Create component in `src/tools/<category>/MyTool.tsx` (use Browser APIs, no paid deps).
2. Add entry to `src/data/tools.ts`:

```ts
{
  id: "my-tool",
  slug: "my-tool",
  name: "My Tool",
  category: "text", // pdf|image|text|calculators|time|qr|developer|security|student|career
  description: "...",
  seoTitle: "My Tool — Free Online | UtilityHub",
  metaDescription: "...",
  h1: "My Tool",
  intro: "...",
  keywords: ["my tool"],
  component: MyTool,
  relatedTools: ["word-counter"],
  howTo: ["Step 1","Step 2"],
  faq: [{q:"...",a:"..."}],
  indexable: true,
}
```

3. It auto-appears in search, category page, related tools, sitemap, SEO, breadcrumbs.

For heavy deps: `React.lazy(() => import("../tools/..."))` + `Suspense` already in `ToolPage`.

---

## SEO Architecture

- Central `SEO` component sets title, meta description, canonical, OG, Twitter, robots, JSON-LD via DOM
- Per-tool `seoTitle`, `metaDescription`, `h1`, `intro`, `faq`, `howTo` from registry
- BreadcrumbList + WebApplication + WebSite JSON-LD
- Clean URLs: `/pdf/merge-pdf`, `/image/compress-image`, `/calculators/gst-calculator`, etc.
- Hubs: `/pdf-tools`, `/image-tools`, ... each with intro, grid, FAQ, internal links
- Only canonical, indexable pages in `sitemap.xml` (generated via `scripts/generate-sitemap.mjs` reading registry)
- `robots.txt` allows all, points to sitemap

To enable prerendering later: keep `SEO` component API; swap to `vite-plugin-ssr` or `Astro` without rewriting tools.

---

## Deployment — Cloudflare Pages Free

1. Push to GitHub
2. Cloudflare Dashboard → **Pages** → *Create project* → **Connect to Git**
3. Build settings:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 18+
4. Add custom domain (optional) → update `siteConfig.url` in `src/config/site.ts` and rebuild
5. Environment vars: none required; optionally `VITE_SITE_URL`, `VITE_GA_ID`

Preview locally:
```bash
npm run build && npm run preview
```

---

## AdSense Integration

Place your client ID in `src/config/site.ts`:

```ts
adsense: { enabled: true, client: "ca-pub-XXXX" }
```

Replace `<AdPlaceholder>` with real `<ins class="adsbygoogle">` when ready. Placeholders already enforce spacing and never overlay controls.

## Analytics

`src/lib/analytics.ts` — `analytics.track()` is a thin wrapper. Set `VITE_GA_ID` and initialize `gtag` in `index.html` when ready.

---

## Privacy

- Where statement appears — “Your file is processed in your browser and is not uploaded to our server” — guarantee is true (no fetch/upload).
- Otherwise generic: “This tool runs entirely in your browser — nothing is sent to a server.”
- No localStorage of file contents; only theme preference.
- Financial/security tools include disclaimers (estimates, not advice; decoding ≠ verification).

---

## Testing Checklist

- [x] `npm run build` passes (no TS errors)
- [x] Category hubs render
- [x] Each implemented tool processes real input, handles empty/invalid/large, shows result, copy/download/reset, cleans object URLs
- [x] No fake progress/download/AI claims
- [x] Mobile (320–1440) no horizontal scroll, accessible upload zones, focus states
- [x] Keyboard search (Enter/Esc/arrows)
- [x] SEO meta, canonical, breadcrumbs, sitemap, robots, manifest

---

## Remaining Limitations

- PDF text extraction fails on scanned images (needs OCR — omitted intentionally, noted in UI)
- FD/RD/PPF calculators share SIP logic; add distinct formulas per jurisdiction if needed
- Client-side `robots`/`title` — for perfect SERP rendering, add prerender step later

---

## License

MIT — use freely, attribute not required.
