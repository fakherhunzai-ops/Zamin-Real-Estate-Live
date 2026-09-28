# Zamin Real Estate & Consultants

## 1. Project Description
A professional multi-page real estate website for **Zamin Real Estate & Consultants**, operating across Gilgit-Baltistan, Pakistan (Hunza, Skardu, Gilgit, Chilas, Nagar, Ghizer). The site positions the business as the region's most trusted property agency, generating leads through contact forms, property listing requests, and newsletter signups.

**Target users:** Property buyers, sellers, tenants, landlords, and tourism-driven investors in Gilgit-Baltistan and the wider Pakistani diaspora.

**Core value:** Expert local knowledge + transparent commission (2.5%–3% sales, one month's rent for rentals) + a clean, trustworthy, conversion-focused experience.

**Design system:** Deep forest-green primary + white/off-white backgrounds, with a brighter emerald accent as the second colour direction. Gold has been retired across the site at the client's request — all accents now read green. Serif (Playfair Display) headings paired with Manrope body/navigation.

## 2. Page Structure
- `/` — Homepage (hero, search, stats, featured properties, services, why choose us, testimonials, CTA)
- `/properties-for-sale` — Properties for Sale (filterable listing grid) ✅
- `/properties-for-rent` — Properties for Rent (filterable listing grid) ✅
- `/property/:id` — Property Details (gallery, specs, map, sticky enquiry card) ✅
- `/sell-your-property` — Sell / Rent Your Property (valuation + submission form) ✅
- `/services` — Services (buying, selling, renting, valuation, legal, investment) ✅
- `/about` — About Us (story, mission, team, community, badges) ✅
- `/faq` — FAQ (commission, coverage, listing, valuation, documents) ✅
- `/contact` — Contact (form, address, map, WhatsApp, hours) ✅
- `/valuation` — Property Valuation (free valuation request form) ✅
- `/blog` — Blog / Resources (searchable, category-filtered article grid) ✅
- `/blog/:slug` — Article detail (body, reading progress, jump-to-section TOC, share, sticky consult card, adaptive related tools, related articles) ✅
- `/tools` — Tools hub (all free calculators in one place) ✅
- `/tools/mortgage-calculator` — Mortgage & EMI calculator (yearly schedule + printable summary) ✅
- `/tools/rental-yield-calculator` — Rental Yield calculator (gross/net yield + printable summary) ✅
- `/tools/stamp-duty-calculator` — Stamp Duty & Transfer Cost estimator (printable summary) ✅
- `/shortlist` — Saved Properties (visitor shortlist + email/print PDF-ready summary) ✅

## 3. Core Features
- [x] Homepage hero with Gilgit-Baltistan landscape + search bar (location, type, price, bedrooms)
- [x] Quick stats bar + featured properties grid (5 cards)
- [x] Services overview (Buy / Sell / Rent) + Why Choose Us + testimonials carousel
- [x] "List Your Property" CTA + footer (link columns, contact details, social icons)
- [x] Filterable properties-for-sale listing (location, type, price, bedrooms, area, grid/list toggle, Load More, mobile filter drawer)
- [x] Filterable properties-for-rent listing (monthly rent pricing, tenant inquiry)
- [x] Property details page (image gallery, specs, features, details table, map, similar properties, sticky enquiry card with Call / WhatsApp / Schedule Viewing)
- [x] Sell/rent property submission form with validation, loading and success/error states
- [x] Services detail page (7 service sections + "Speak With a Property Consultant" CTA)
- [x] About page (brand story, mission/vision, why Zamin, areas served, team, "Talk to Our Team" CTA)
- [x] FAQ page (search + category tabs + accordion, Schema.org FAQPage)
- [x] Contact page (form, Google Maps, tap-friendly Call / Email / WhatsApp)
- [x] Property valuation page (free valuation request form)
- [x] Standardized dark forest-green primary CTA (navy→forest green) across hero, listing and property pages
- [x] Global mobile-only sticky Call / WhatsApp bar for one-tap contact (collapsible + remembered, with restore button)
- [x] Click-to-call phone number badge in the desktop header (always-visible number)
- [x] Blog / Resources page (search, category tabs, featured article, article detail page with related articles + BlogPosting SEO)
- [x] Reading progress bar + jump-to-section table of contents on articles
- [x] "Get property alerts" signup band (reuses the newsletter form) on blog + listing pages
- [x] Free tools: Mortgage/EMI calculator, Rental Yield calculator, Stamp Duty & Transfer Cost estimator
- [x] Tools hub page (`/tools`) + reusable "More free property tools" section linking all calculators
- [x] Print / Save-as-PDF branded summary on every calculator (for taking to the bank)
- [x] Side-by-side "what if" scenario comparison on every calculator (two loans / two properties / two prices at once)
- [x] "Email me this summary" on every calculator (auto-sends via backend + Resend when configured, otherwise opens the visitor's mail app)
- [x] Tools hub linked from the footer columns (kept in place of a top-nav entry to match the reference)
- [x] Blog article sidebar "Related tools" block that auto-suggests calculators on finance-related articles
- [x] Site phone & WhatsApp set to +92 355 509 9430 (calls + WhatsApp)
- [x] Office location & map set to Sultanabad, Danyore Gilgit, Gilgit Baltistan
- [x] Business info email set to baqircustoms369@gmail.com
- [x] Navbar + footer redesigned to match the client's reference (transparent logo, light-green call pill, filled WhatsApp circle, dark "List Your Property" button; footer link columns + social icons)
- [x] Fixed light-on-dark button visibility across the bottom CTA and hero banners
- [x] Automatic email notification to Zamin on every property enquiry (so no lead is missed)
- [x] "Save this report" on every calculator (stores the visitor's last inputs on their device to reopen later)
- [x] Property shortlist / favourites with a live navbar count and an email + print PDF-ready summary page
- [x] Side-by-side comparison table for shortlisted properties (beds, baths, area in sq ft, price per sq ft, with a best-value highlight)
- [x] "Share this shortlist on WhatsApp" one-tap share with a pre-filled summary message
- [x] Remembered search filters with a "welcome back" prompt to re-check new matching listings (and how many are new)

## 4. Data Model Design
No persistent database is required for the current scope. Property listings, testimonials, and blog posts are served from static mock data (`src/mocks/`). All lead-capture forms use the built-in Form feature (contact, listing, tenant inquiry, agent inquiry, property alerts, newsletter).

Visitor-only helpers (the property shortlist, each calculator's "saved report", and the remembered search filters) are stored on the visitor's own device via `localStorage` — no server round-trip, no account required.

_If dynamic property management or a CMS becomes a requirement later, a database can be added._

## 5. Backend / Third-party Integration Plan
- Backend: **SaaS Supabase** connected (Auth, Database, Storage, Edge Functions available)
- Edge Functions: `send-report-email` deployed — sends calculator summaries and enquiry notification emails
- Email: **Resend** — `RESEND_API_KEY` and `RESEND_FROM_DOMAIN` must be added in the Supabase Dashboard; until then the email buttons fall back to opening the visitor's own mail app
- Database: not required yet — property listings, testimonials and blog posts are static mock data
- Forms: **Built-in Form** (all lead forms)
- WhatsApp: direct chat link (no integration required)
- Maps: Google Maps embed iframe
- Payments / Shopify / Stripe: not needed for this site

## 6. Development Phase Plan

### Phase 1: Foundation + Homepage
- Goal: Set up the design system (colors, fonts), shared navigation/footer, and a complete, polished homepage.
- Deliverable: Homepage with hero, search, stats, featured properties, services, why-choose-us, testimonials, CTA, and footer newsletter.

### Phase 2: Property Listings (Sale + Rent)
- Goal: Build filterable listing pages with property cards, grid/list toggle, pagination, and inquiry forms.

### Phase 3: Sell/List Your Property
- Goal: Build the seller/landlord page with step-by-step process, valuation form, and commission transparency.

### Phase 4: Services + About + FAQ
- Goal: Build the three content pages.

### Phase 5: Contact + Blog
- Goal: Build the contact page (form + map + WhatsApp) and the blog/resources page.
- Status: Complete — Contact, Blog listing and Blog article detail pages are all live.

### Phase 6: Free Tools & Resources
- Goal: Give buyers and investors free planning tools, all linked together, with printable summaries.
- Deliverable: Tools hub, three calculators (mortgage/EMI, rental yield, stamp duty & transfer cost), printable PDF-style summaries, an "email me this summary" option, side-by-side scenario comparison, and an adaptive "Related tools" block in the blog sidebar.
- Status: Complete — all planned tool routes are built; the Tools hub is linked from the footer and every tool cross-links the others.

### Phase 7: Brand Alignment, Leads & Visitor Tools
- Goal: Match the client's navbar/footer reference, ensure no enquiry is missed, and give visitors sticky planning helpers.
- Deliverable: Navbar + footer rebuilt to the reference, CTA visibility fix, automatic enquiry email notification, "Save this report" on calculators, and a property shortlist with an email/print summary page.
- Status: Complete.

### Phase 8: Comparison & Returning-Visitor Tools
- Goal: Help visitors compare shortlisted homes and pick up where they left off.
- Deliverable: Shortlist comparison table (beds, baths, area, price per sq ft), WhatsApp shortlist sharing, and remembered search filters with a re-check prompt for new matching listings.
- Status: Complete.

## ZAMIN Stays — Short-Term Rental & Managed Hosting Division

**Business concept:** Zamin now runs two divisions — **Real Estate** (buy / sell / long-term rent) and **ZAMIN Stays** (short-term rentals, villas, cabins, apartments, homestays, guest houses and managed properties) across Gilgit-Baltistan (Hunza, Gojal, Skardu, Naltar, Ghizer).

**Stack note:** This project is a Vite + React SPA with **Supabase** (Auth, Database, Storage, Edge Functions) — *not* Next.js / NestJS / Prisma. ZAMIN Stays is built natively on that stack; there is no second backend.

**Host models:** `LISTED` (owner-operated, ZAMIN provides listing/search/bookings/platform) and `MANAGED` (ZAMIN runs the full short-term operation). Commission and fees stay configurable — never hardcoded.

### Database (Supabase / PostgreSQL)
- `stay_destinations` — 5 destinations (hunza, gojal, skardu, naltar, ghizer)
- `stay_areas` — 21 sub-areas (Karimabad, Passu, Shangrila, …)
- `stay_categories` — 16 stay types (Villa, Cabin, Homestay, Workation, …)
- `stay_amenities` — 15 amenities + `stay_amenity_links` (relational, not free text)
- `stays` — full model: slug, title, summary, description, category, `management_type`, destination/area, address, lat/lng, guest_capacity, bedrooms/beds/bathrooms, base_nightly_rate, currency, cleaning_fee, service_fee_percent, check-in/out, cancellation, house rules, host details, `status` (DRAFT/PENDING/VERIFIED/PUBLISHED/PAUSED/ARCHIVED), `verified`, `featured`, `verified_at`
- `stay_images` — multi-image with cover flag + ordering + alt text
- `admin_users` + `is_admin()` — RLS admin gate
- `bookings` — reservation engine (reference, guest, dates, nights, subtotal/cleaning/service/discount/total, status PENDING→…, source)
- `stay_availability_blocks` — admin/host blocked & maintenance ranges
- `stay_rate_rules` — date-range / weekend / seasonal / peak nightly overrides
- `stay_settings` — configurable default service fee + long-stay discount (never hardcoded)
- `hosts` — host profile / allow-list (email, name, phone, status) — matched to `stays.host_email`
- `stay_reviews` — guest reviews per completed stay (rating, comment, status PUBLISHED/HIDDEN/FLAGGED, optional booking link)
- `cleaning_tasks` — tracked housekeeping tasks (assigned cleaner, status TO_DO/ASSIGNED/IN_PROGRESS/COMPLETED/ISSUE, scheduled date, notes)
- `maintenance_issues` — tracked maintenance (title, priority LOW→URGENT, assigned-to, cost, status OPEN/IN_PROGRESS/RESOLVED, resolved_at)
- Host helpers: `current_email()`, `is_host()`, `host_owns_stay()` — drive host RLS on stays/bookings/blocks
- Server functions: `stay_is_available()`, `quote_stay()` (authoritative pricing), `create_booking()` (row-locks the stay + re-checks availability → prevents double-booking), `stay_calendar()`, `submit_host_stay()` (creates a **PENDING** stay from host onboarding, never auto-published), `booking_by_reference()` (safe, confirmation-level booking lookup by reference), `submit_stay_review()` (SECURITY DEFINER guest review submission keyed by booking reference — validates the stay is completed and blocks duplicates)
- Storage: public `stay-images` bucket with admin-only write policies
- RLS: public reads only **published** stays (and their images/amenities/blocks) + active reference data; write access restricted to `is_admin()`. `stay_settings` is publicly readable (drives pricing) and admin-writable.

### Frontend routes (added)
- `/stays` — ZAMIN Stays landing (hero + date/guest search, featured stays, destinations, stay-type browser with backend filtering, why book, hosting, final CTA)
- `/stays/host` — Become a Host
- `/stays/host/apply` — Host onboarding form (host details, property, capacity, amenities, ownership note) → submits a PENDING stay for review
- `/stays/managed-hosting` — Managed Hosting
- `/stays/:slug` — resolver: destination page (areas + filtered stays) **or** individual stay detail (gallery, specs, amenities, rules, host, map, availability calendar, server-priced booking card + reservation form, similar stays)
- `/booking` and `/booking/:reference` — printable/shareable guest booking confirmation: looks up the booking by reference, shows stay/dates/guests/price breakdown + status, with Print/Save-as-PDF (`.print-area`), WhatsApp share, and copy-link
- Navbar: new **Stay** item (All Stays + 5 destinations + host + managed hosting)
- Footer: dedicated **ZAMIN Stays** column (all 5 destinations + host + apply + managed hosting + host login + view booking)
- **Host portal** (separate auth from admin): `/host/login` (sign in / create account, gated by `is_host()`), `/host/dashboard` (listings, upcoming check-ins, earnings snapshot, occupancy), `/host/stays` (their listings + edit panel + publish/pause), `/host/calendar` (their bookings + block dates). Hosts see only stays/bookings that match their email — enforced by RLS.
- **Reviews**: public guest review form on `/booking/:reference` (after checkout), published reviews shown on the stay detail page, and an admin moderation queue (`/admin/reviews`) with view / hide / flag / restore plus an "awaiting review" list.
- **Operations (tracked)**: `/admin/operations/cleaning` (assign cleaners, statuses, create tasks, auto-suggest turnovers from completed bookings) and `/admin/operations/maintenance` (log issues with priority, assigned-to, cost, status + resolve flow).
- Admin panel (full operational shell): collapsible **grouped sidebar** (Dashboard · Real Estate · ZAMIN Stays · Operations · CMS · system) + **topbar** with global search (stays/bookings/guests), notification center, quick-add menu, profile menu and environment indicator; mobile drawer replaces sidebar below `lg`.
- Admin screens: `/admin/login`, `/admin/stays-dashboard` (overview metrics, operational alerts, upcoming check-ins/outs, pending verification, recent bookings), `/admin/stays` (search + destination/management/status filters, sort, bulk verify/publish/pause/archive/delete, pagination, empty/loading skeletons), `/admin/stays/new` (step-rail), `/admin/stays/:id` (tabbed detail — Overview / Bookings / Calendar / Pricing / Reviews / Operations / Financials / Activity), `/admin/stays/:id/edit`, `/admin/stays/pending` (verification checklist + approve/request-changes/reject), `/admin/bookings` + `/admin/bookings/:id` (split booking detail + lifecycle actions), `/admin/calendar` (month/week, block dates, legend), `/admin/pricing` (base rate + rate rules + bulk date-range + guest/host/ZAMIN preview), `/admin/hosts`, `/admin/guests`, `/admin/payments`, `/admin/payouts`, `/admin/reviews`, `/admin/operations/cleaning`, `/admin/operations/maintenance`, `/admin/content/stays-homepage`, `/admin/content/destinations`, `/admin/content/stay-categories`, `/admin/content/faqs`, `/admin/content/policies`, `/admin/properties` (real-estate listings), `/admin/enquiries`, `/admin/valuations`, `/admin/agents`, `/admin/users`, `/admin/media`, `/admin/stays-analytics`, `/admin/settings` (tabbed General/Booking/Pricing/Payments/Notifications/Policies/Support)
- Reusable admin UI kit (`src/pages/admin/components/AdminUI.tsx`): stat cards, tone badges (stay/booking/management/verified), tabs + segmented controls, pagination, empty/error/loading states, toast provider, confirm dialog.
- `stay_settings` extended (currency, default commission, default cleaning fee, min notice / max advance, default check-in/out, cancellation policy, support email/phone/WhatsApp, notification toggles as `jsonb`); `stay_destinations` gained `seo_title` / `seo_description`.

### Status / remaining
- Status: **Public experience + full operational admin panel + booking engine + settings + host onboarding + guest confirmations complete** (no fake inventory — real stays only, entered via admin or approved host submissions).
- Done: Supabase Auth admin login (email allow-list via `is_admin()`), guarded `/admin` shell with grouped collapsible sidebar + search/notifications/quick-add topbar, full stays CRUD with image uploads to Supabase Storage, verify/publish/feature workflow, tabbed stay detail, pending-verification workflow, rate-rule + blocked-date management, server-side pricing quote driven by `stay_settings`, availability calendar with month/week views, real PENDING bookings with double-booking prevention, admin bookings pipeline + booking detail, host/guest directories, payments + payouts views, tabbed platform settings, CMS for destinations / stay categories / stays homepage, stays analytics, and a real-estate properties view.
- Done (this phase): **host portal** with its own auth (`/host/*`, scoped by email + RLS), **reviews module** (`stay_reviews` table + guest submission + public display + admin view/hide/flag/restore moderation) and **tracked operations** (`cleaning_tasks` + `maintenance_issues` with cleaner assignment, statuses and maintenance cost/priority).
- Later phases: guest accounts + "my bookings" persistence, live payment provider + automated payouts, channel-integration readiness (Airbnb/Booking.com via approved APIs only).
- Notifications: booking-confirmation and review emails are not wired yet — records are created server-side and surfaced in the admin panel and public confirmation page; email can be added later via the existing Resend/edge-function setup.