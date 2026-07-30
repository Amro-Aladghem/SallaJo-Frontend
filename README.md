<div align="center">
  <img width="637" height="443" alt="Screenshot 2026-07-31 000334" src="https://github.com/user-attachments/assets/cf1cd687-3cc8-4427-8537-a489bfdd7697" />
  <br/><br/>
  <img width="254" height="443" alt="Screenshot 2026-07-31 000041" src="https://github.com/user-attachments/assets/b67bda2a-6b49-48af-ae61-58a5abdb09f6" />
</div>

<br/>

# سلة جو — Salla-Jo

**A full-featured Arabic marketplace platform connecting Jordanian sellers with customers.**  
Mobile-first, RTL-optimized web application built with React + TypeScript + .NET.

---

## Frontend Features

- **Seller Dashboard** — Multi-stage registration, store activation workflow, product/offer/discount management, stock tracking, and store design customization (colors, cover images, logo)
- **Customer Storefront** — Public store pages with product browsing, offer carousels, discount sections, full product details, and real-time stock visibility
- **Shopping Cart** — Daily-persisted cart with products, offers, quantity management, stock validation, and automatic quantity capping
- **Checkout** — Governorate-based delivery fee calculation, WhatsApp order summary generation, and negotiable delivery fallback
- **AI Prompts Management** — Sellers can manage AI-generated content prompts for their store
- **Admin Panel** — Store activation, subscription management, delivery configuration, activation code generation
- **Public Landing Page** — Arabic-first marketing site with iPhone mockup, feature showcases, and client store preview
- **Responsive RTL UI** — Full right-to-left support, Tajawal font, turquoise/tailored color schemes, mobile-first design
- **Store Customization** — 20+ color presets, CDN-hosted cover images, real-time design preview

## System Features

- **Multi-Role Auth** — Separate sign-in flows for sellers, customers, and admins with role-based access control (`userTypeId: 3`)
- **Seller Lifecycle** — Complete registration → activation → store setup → product publishing pipeline with stage persistence
- **Discount Engine** — Fixed-amount JOD discounts with toggle controls, applied directly to product prices
- **Offer System** — Time-limited offers with product grouping, independent pricing, and visibility toggles
- **Stock Management** — Real-time stock tracking, out-of-stock indicators for customers, administrative updates
- **Rate Limiting** — IP-based rate limiting with Cloudflare-aware `X-Forwarded-For` header detection across all public endpoints
- **Image Upload** — Single-click upload with automatic phone camera/gallery prompt, primary image assignment
- **CDN Integration** — Cover images hosted on CDN (`cdn.taskalyze.com`) for fast global delivery
- **Sitemap Generation** — Automatic `sitemap.xml` generation with static routes + dynamic store slugs
- **Session Persistence** — Browser session storage for auth state, cart, checkout data, and seller stage tracking
- **Admin Controls** — Activate stores, manage subscriptions, configure delivery fees, generate activation codes
- **WhatsApp Checkout** — Auto-generated numbered order summaries sent directly via WhatsApp
- **Error Handling** — Global exception middleware, 404 redirect interceptor (scoped to seller API), and user-friendly error/support pages
- **SEO Optimized** — Dynamic page titles, favicon, OG meta tags, `robots.txt`, and XML sitemap

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | .NET 9, ASP.NET Core Web API |
| Auth | JWT + Cookie-based authentication |
| Styling | Tailwind CSS, shadcn/ui components |
| Language | Arabic (RTL), number formatting |

---

## Quick Start

```bash
# Frontend
cd my-app
npm install
npm run dev


