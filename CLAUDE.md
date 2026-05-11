# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing website for **Finca Del Mar**, a beachfront event venue in Puerto Rico. Hosted on Cloudflare Pages with a companion Cloudflare Worker for contact form handling.

## Commands

```bash
# Install dependencies (wrangler only)
npm install

# Deploy static site to Cloudflare Pages
npm run deploy:pages

# Deploy the contact form Cloudflare Worker
npm run deploy:worker
```

Deployment requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables (or Cloudflare dashboard login). CI/CD via GitHub Actions runs `deploy:pages` on push to `main`.

## Architecture

This is a **no-build static site** — no bundler, no framework, no compilation step. The deploy artifact is the repo root itself.

| File | Purpose |
|------|---------|
| `index.html` | Single-page site with all sections (Hero, About, Features, Gallery, Contact) |
| `assets/css/style.css` | All styles; CSS custom properties for theming at `:root` |
| `assets/js/script.js` | Vanilla JS IIFE: navigation, scroll effects, lightbox, form handling, animations |
| `cloudflare-worker.js` | Cloudflare Worker that receives POST `/contact`, validates, and sends email via MailChannels |
| `wrangler-pages.toml` | Wrangler config for Pages deployment (site name: `finca`) |
| `wrangler.toml` | Wrangler config for Worker deployment; routes `finca.pr/api/contact` |
| `_headers` | Cloudflare Pages HTTP response headers (security headers + cache rules) |
| `_redirects` | Cloudflare Pages redirect rules |

## Contact Form Flow

The form in `index.html` submits via `script.js`. Currently it falls back to a `mailto:` link — the Worker at `finca.pr/api/contact` is deployed separately and intended to replace this. To wire them together, update `submitContactForm()` in `script.js` to `fetch('https://finca.pr/api/contact', { method: 'POST', body: formData })` instead of using the `mailtoLink` fallback.

The Worker uses the MailChannels API (`api.mailchannels.net/tx/v1/send`) to deliver email to `info@finca.pr`. Alternative transports (Mailgun, SendGrid) are documented in `cloudflare-worker.js` comments.

## CSS Theming

Brand colors are CSS custom properties in `assets/css/style.css`:

```css
:root {
    --primary-color: #0066cc;
    --secondary-color: #00a86b;
    --accent-color: #ffd700;
}
```

Responsive breakpoints: 768px (tablet) and 480px (mobile).

## Live Site

Production URL: `https://finca.pr`
