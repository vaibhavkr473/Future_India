# Face of Future India — AI for Innovation

> India's AI-powered startup revolution — a fast, accessible, SEO-ready landing page for the country's sovereign AI moment.

![Status](https://img.shields.io/badge/status-live-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made with](https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-orange)

---

## About

A single-page website showcasing India's AI ecosystem — from Sarvam AI's global benchmark breakthroughs to the FY 2026-27 sovereign AI tool stack. Built without frameworks, without build steps, and without bloat.

**Location:** 123 AI Street, Patna, Bihar, India

---

## Features

- 🎨 **Day / Night theme** — sliding sun-moon toggle with `localStorage` persistence and OS-preference detection
- 🧭 **Mega-menu navigation** — content hidden until clicked, driven by JS state + `#hash` deep-linking
- 📱 **Fully responsive** — mobile drawer, adaptive grids, fluid typography
- ⚡ **Zero dependencies** — no React, no Tailwind, no GSAP. Just HTML, CSS custom properties, and vanilla JS
- ✨ **Smooth animations** — `IntersectionObserver` reveals, animated counters, scroll progress bar, marquee tickers
- ♿ **Accessible** — ARIA roles, keyboard navigation, focus restore, `prefers-reduced-motion` respected
- 🔍 **SEO-optimized** — JSON-LD `Organization` schema, Open Graph + Twitter cards, geo meta tags, dynamic page titles
- 📬 **Live contact form** — Formspree integration with client + server validation, honeypot spam protection, offline `localStorage` backup
- 🌐 **Works offline** — no CDN required for core functionality

---

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | HTML5 (semantic, accessible) |
| Styling | CSS3 — custom properties, `color-mix()`, container queries |
| Behaviour | Vanilla JavaScript (ES2020+, no build step) |
| Forms | Formspree (AJAX submission) |
| Icons | Font Awesome 6 |
| Fonts | Sora + Inter (Google Fonts) |

---

## Project Structure

```
.
├── index.html              # Main page — semantic markup + SEO head
├── styles.css             # Design system + components
├── script.js              # Theme, panels, animations, form
├── logo.png               # Brand mark
├── favicon.ico            # Browser favicon
├── apple-touch-icon.png   # iOS home screen icon
├── og-image.png           # 1200×630 social share card
├── site.webmanifest       # PWA manifest
├── sitemap.xml            # SEO sitemap
└── robots.txt             # Crawler rules
```

---

## Getting Started

No build tools, no `npm install`. Just clone and open:

```bash
git clone https://github.com/<vaibhavkr473>/face-of-future-india.git
cd face-of-future-india
# Open index.html in any browser — that's it.
```

For a local server (recommended for Formspree testing):

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

## Configuration

**Contact form** — already wired to Formspree endpoint `f/xaenyyyq`. To use your own:

1. Create a free form at [formspree.io](https://formspree.io)
2. Replace the endpoint in both `index.html` (`action=`) and `script.js` (`FORM_ENDPOINT`)
3. Confirm the form via the email Formspree sends on first submission

**Theme** — all colours live in `:root` and `[data-theme="dark"]` in `styles.css`. Change once, updates everywhere.

---

## Performance

- ~0 blocking JS — all deferred
- No render-blocking frameworks
- `requestAnimationFrame`-throttled scroll listeners
- `passive: true` on all scroll events
- Lazy media loading via `IntersectionObserver`

---

## License

MIT — free to use, fork, and adapt. Attribution appreciated but not required.

---

## Credits

Designed and built by **Vaibhav Kumar**
[LinkedIn](https://www.linkedin.com/in/vaibhav-kumar-227475289) · [Instagram](https://www.instagram.com/vaibhav_razz_22/)
