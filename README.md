# Joash Attend

**Every clock-in. Counted and clear.**

Biometric attendance management for Kenyan schools, businesses and organisations.
Joash Attend turns fingerprint and face ID clock-ins into a live attendance
picture, then produces payroll ready reports from the same dashboard. Device
synchronisation is simulated through a documented API with realistic payloads, so
the whole workflow can be evaluated without hardware or a vendor SDK.

- Admin workspace: `/admin/dashboard`
- Staff and student portal: `/member/dashboard`
- Public read only preview: `/demo`
- WhatsApp: +254 112 272 061

---

## 1. Provenance: this is a build on top, not a redesign

The uploaded template (`dnx-v1.0.0.zip`, a Vite + React + MUI + ECharts admin
theme) is preserved untouched in two places:

| Artefact | Purpose |
| --- | --- |
| `dnx-v1.0.0.zip` | The original archive, unmodified |
| `template/` | Full extraction, all 121 files, unmodified |

Nothing in the template was renamed, deleted, re-skinned or re-themed. The audit
that was printed before coding, including the full file tree and every requested
confirmation, is in [`AUDIT.md`](./AUDIT.md).

The rebuild keeps and reuses the template's visual DNA:

- **Palette** (from `src/theme/colors.ts` and `src/theme/palette.ts`):
  primary `#546FFF`, ink `#141522`, hairline `#EBEDF7`, canvas `#FCFCFC`,
  success `#2E8B57`, warning `#FFB054`, danger `#FF4D5E`, neutral `#DFE1F3`.
  Reproduction as CSS custom properties lives in `src/app/globals.css`; chart
  colours are mirrored in `src/lib/theme.ts`.
- **Typeface** (from `index.html` and `src/theme/typography.ts`):
  Plus Jakarta Sans, weights 200 to 800 with italics, loaded from the same Google
  Fonts URL in `src/app/layout.tsx`. No font was swapped.
- **Surfaces and rhythm** (from the theme's `styleOverrides`): white cards,
  hairline borders, soft shadows, 20px card radius, pill buttons, a 252px sidebar
  and a 90px topbar.

Design language: structured, data dense, trustworthy. No dark theme for the
product surfaces, no gold, no chrome, no metallic gradients, and no decorative
diamonds, stars or sparkle icons anywhere.

---

## 2. Stack

Runtime dependencies are pinned exactly, with no carets or tildes, in
`package.json`.

| Package | Version |
| --- | --- |
| next | 16.4.2 |
| react / react-dom | 19.2.0 / 19.2.0 |
| typescript | 5.8.3 |
| @types/node / @types/react / @types/react-dom | 24.0.10 / 19.1.6 / 19.1.6 |
| tailwindcss / postcss / autoprefixer | 4.1.10 / 8.5.30 / 10.4.21 |
| next-auth | 5.0.0-beta.32 |
| framer-motion | 12.18.0 |
| lucide-react | 0.523.0 |
| @vercel/kv / @vercel/blob | 3.0.0 / 2.8.2 |
| nodemailer | 10.1.7 |
| react-hook-form / zod | 7.57.0 / 3.25.67 |
| recharts / zustand | 2.15.3 / 5.0.6 |
| gsap / lenis | 3.12.7 / 1.3.4 |
| qrcode / jspdf / html2canvas | 1.5.4 / 4.2.1 / 1.4.1 |
| @vercel/analytics / @vercel/speed-insights | 1.5.0 / 1.2.0 |

Engines `node >= 24`, `.nvmrc` set to `24`.

### Security driven version notes

Step 19 blocks the build on any critical or high advisory. Four pins were raised
above the version list because the listed versions fail that gate. Every other
version matches the brief exactly.

| Package | Brief | Installed | Reason |
| --- | --- | --- | --- |
| next-auth | 5.0.0-beta.28 | 5.0.0-beta.32 | beta.28 pulls `@auth/core` 0.41.2, which has a critical homoglyph email advisory; fixed in beta.32 (`@auth/core` 0.41.3) |
| jspdf | 3.0.1 | 4.2.1 | 3.0.1 is flagged critical (DoS); 4.2.1 is the first clean release |
| nodemailer | 6.10.1 | 10.1.7 | 6.10.1 carries high severity CRLF and parser advisories; 10.1.7 is clean and keeps the same `createTransport` and `sendMail` API |
| @vercel/blob | 0.29.4 | 2.8.2 | 0.29.4 is not published on npm, and 0.x to 2.x is flagged moderate; 2.8.2 is the current release |
| @types/nodemailer | 6.4.17 | removed | nodemailer 10 ships its own type definitions |

`overrides` keeps the four required pins (`postcss`, `sharp`, `sprintf-js`) and
adds two transitive pins that keep framer-motion 12.18.0 working on npm today:

```json
"overrides": {
  "postcss": "8.5.30",
  "sharp": "0.35.5",
  "sprintf-js": "1.1.3",
  "motion-dom": "12.17.3",
  "motion-utils": "12.12.1"
}
```

Without those two, npm resolves `motion-dom` 12.43.x, whose exports no longer
match framer-motion 12.18.0 and break the build.

---

## 3. Running the project

```bash
nvm use            # 24
npm ci             # .npmrc sets legacy-peer-deps for the next-auth beta peer graph
npm run dev        # http://localhost:3000
npm run build      # next build
npm start          # production server
npm run typecheck  # tsc --noEmit
```

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@joashattend.co.ke` | `attendance2026` |
| Staff member | `staff@joashattend.co.ke` | `attendance2026` |

The sign in page has one click buttons that fill each account. New sign ups always
receive the `member` role, in line with the brief.

### Environment

Copy `.env.example` to `.env.local`. Everything is optional for local review:
without keys the app degrades gracefully.

| Variable | Behaviour when unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Falls back to `https://joashattend.co.ke` for canonical URLs, sitemap and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Falls back to `254112272061` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Widget is not loaded; server verification reports `simulated: true` |
| `RECAPTCHA_SECRET_KEY` | Verification is simulated with a passing score; never exposed to the client |
| `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` | Optional. Renders the v2 challenge when a v3 score is below 0.5 |
| `NEXTAUTH_SECRET` | Uses a development fallback. Set this in production |
| `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google provider is only registered when the client pair is present |
| `PEXELS_API_KEY` | Images are stored locally in `public/images/`, so no runtime Pexels call is made |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Repository falls back to an in process store |
| `BLOB_READ_WRITE_TOKEN` | Logo upload falls back to an inline data URL |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Mail is logged and reported as simulated |
| `ORG_NAME`, `WORK_START_TIME`, `WORK_END_TIME`, `LATE_GRACE_MINUTES` | Defaults: Joash Attend Academy, 08:00, 17:00, 10 minutes |

---

## 4. Pages

| Route | Access | What it does |
| --- | --- | --- |
| `/` | Public | Marketing landing page: hero, four step explainer, eight feature cards, five use cases, three plans with a monthly and annual toggle, three testimonials, demo request CTA, footer |
| `/demo` | Public | Read only admin dashboard for "Joash Attend Demo Organisation, 80 staff, 3 departments", clearly labelled demo data, sign up CTA |
| `/admin/dashboard` | Admin session | KPI cards, 30 second live feed, bar, line, pie and area charts, department table, absenteeism alerts with reminders, PDF and CSV export |
| `/admin/staff` | Admin session | Searchable directory with department, status and location filters, add and edit modals, deactivate action, pagination |
| `/admin/staff/[id]` | Admin session | Calendar of the last 45 days, clock-in and clock-out log, monthly summary, leave history, individual PDF |
| `/admin/leaves` | Admin session | Pending requests with approve and reject, approved leave calendar, decisions persisted to KV |
| `/admin/devices` | Admin session | Mock device registry, online and offline status, add device modal, Sync now with a payload preview |
| `/admin/reports` | Admin session | Date range, department and five report types, recharts preview, PDF and CSV download |
| `/admin/settings` | Admin session | Organisation name, logo upload, working hours, grace period, leave types, email toggles, payroll format |
| `/member/dashboard` | Staff session | Personal KPIs, attendance calendar, leave request form with reCAPTCHA, leave history, recent clock-ins |
| `/auth/signin`, `/auth/signup` | Public | Credentials and Google sign in, reCAPTCHA v3, member default role |
| `/legal/privacy-policy` | Public | Kenya Data Protection Act 2019 aligned privacy policy |
| `/legal/terms` | Public | Terms of service |
| `/legal/cookie-policy` | Public | Cookie and local storage policy |
| `/404` (`not-found`) | Public | Fingerprint icon, "This record does not exist.", Back to Dashboard |
| `/500` plus `error.tsx` | Public | Try Again and WhatsApp +254112272061 |
| `/sitemap.xml`, `/robots.txt` | Public | Generated from `NEXT_PUBLIC_SITE_URL`, admin and member routes disallowed |

## 5. API routes

All handlers are App Router route handlers under `src/app/api`.

| Endpoint | Methods | Role |
| --- | --- | --- |
| `/api/attendance/today` | GET (optional `date`, `department`) | admin |
| `/api/attendance/live` | GET (`since` cursor, mock poll) | admin |
| `/api/attendance/history` | GET (`staffId`, `from`, `to`, `department`) | admin, member (self only) |
| `/api/attendance/stats` | GET | admin |
| `/api/attendance/report` | GET (`from`, `to`, `department`, `type`, `staffId`) | admin |
| `/api/attendance/remind` | POST (`staffId`) | admin |
| `/api/staff` | GET (search, filters), POST (zod) | admin |
| `/api/staff/[id]` | GET, PUT (zod), DELETE | admin |
| `/api/leaves/request` | POST (zod, reCAPTCHA) | member, admin |
| `/api/leaves/review` | PUT (`leaveId`, `decision`) | admin |
| `/api/devices` | GET, POST (zod) | admin |
| `/api/devices/sync` | POST (mock sync result) | admin |
| `/api/contact` | POST (zod, reCAPTCHA, nodemailer) | public |
| `/api/recaptcha/verify` | POST (`token`, `action`) | public |
| `/api/settings` | GET, PUT (zod) | GET public, PUT admin |
| `/api/settings/logo` | POST (multipart, Vercel Blob) | admin |
| `/api/auth/register` | POST (zod, reCAPTCHA) | public |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth |

Guards return `401` when no session exists and `403` when the role is wrong.

---

## 6. Mock data and simulation

- `src/lib/mock.ts` builds 80 staff across Academics (42), Administration (20)
  and Operations (18), with deterministic pseudo random attendance for every
  working day, so every chart, table and KPI agrees with the others.
- Device sync is simulated. `POST /api/devices/sync` returns pulled records, a
  latency, verification methods and per device timestamps, and the devices page
  prints the payload shape.
- The live feed polls `/api/attendance/live` every 30 seconds and appends new
  events; new entries slide in with Framer Motion.
- Mail (reminders, contact, leave notifications) goes through nodemailer and is
  clearly reported as `simulated: true` when SMTP is missing.
- Writes (devices, leaves, staff, settings) persist through `src/lib/storage.ts`,
  which uses `@vercel/kv` when `KV_REST_API_URL` and `KV_REST_API_TOKEN` exist
  and an in process store otherwise.

---

## 7. Experience details

**Cookie consent.** Fixed full width banner, Accept All and Manage Preferences,
a modal with Necessary locked plus Functional, Analytics and Marketing toggles,
stored under `joash_attend_consent`, with floating actions lifting clear of the
banner.

**Loading screen.** SVG fingerprint drawn from the centre outward with a
percentage counter, capped at three seconds, Skip after one second, `role="status"`,
and plain percentage text under `prefers-reduced-motion`. Shown once per session.

**Voice tour.** Fixed bottom left, 56 by 56, 24px from the edges, `z-index 9998`.
Uses `SpeechSynthesisUtterance` with `rate 0.95`, `pitch 1.1` and `lang en-KE`.
Volume2 while active, VolumeX when muted, a pulsing ring while speaking, the
tooltip "Hear what this site is about", the accessible name
"Site voice tour, click to mute", and a "Replay tour" label afterwards. It only
starts after the first scroll, pointer or key interaction.

**WhatsApp.** Fixed bottom right, 56 by 56, 24px from the edges, `z-index 9998`,
`#25D366`, prefilled with "Hello Joash Attend, I would like to set up a biometric
attendance system for my organisation."

**Animations (nine).**
1. Lenis smooth scroll on the marketing pages.
2. GSAP count up on every KPI card.
3. Recharts draw on mount for all four chart types.
4. Framer Motion slide in for new live feed entries.
5. CSS transition on attendance calendar day cells.
6. Staff directory row hover highlight.
7. Framer Motion stagger on the department table and alert list.
8. WhatsApp entrance pop and pulse keyframes.
9. Framer Motion reveal on the demo dashboard.

**Forms and verification.** reCAPTCHA v3 runs invisibly on the demo and contact
forms, sign in, sign up, the member leave request, and the admin staff and device
forms, each verified server side with a matching action name. Scores below 0.5
surface a v2 challenge step when a v2 site key is configured.

**Staff avatars.** Staff and student rows use generated initials avatars rather
than stock portraits. The template's bundled avatars are photographs of people
who are not East African, and using stock faces for 80 fictional Kenyan staff
would misrepresent real people.

**Accessibility and safety.** Semantic tables with scoped headers, labelled forms,
visible focus rings, `aria-live` on the live feed, `role="status"` on the loader,
`aria-pressed` on toggles, reduced motion support, and role checked API handlers.
Security headers in `vercel.json`: frame denial, nosniff, strict referrer policy,
HSTS preload and a closed permissions policy.

---

## 8. Verification results

| Check | Result |
| --- | --- |
| `npm ci` | Passes from the committed `package-lock.json` |
| `npx tsc --noEmit` | Passes, zero errors |
| `npx next build` | Passes, 39 routes compiled |
| `npm audit --audit-level=high` | `found 0 vulnerabilities` (zero critical, zero high) |

Re-run them with:

```bash
npm ci && npx tsc --noEmit && npx next build && npm audit --audit-level=high
```

---

## 9. Project layout

```
src/
  app/
    api/                 route handlers listed above
    admin/               admin workspace (layout guard, seven pages)
    member/              staff portal (layout guard, dashboard)
    auth/                sign in and sign up
    demo/                public interactive demo
    legal/               privacy, terms, cookies
    layout.tsx           fonts, metadata, global chrome
    not-found.tsx        404
    error.tsx            500 boundary
    global-error.tsx     root failure
    500/                 addressable server error page
    globals.css          design tokens and the full stylesheet
  components/
    auth/ charts/ dashboard/ marketing/ site/ system/ ui/
  lib/                   auth, guard, mock data, repository, storage, mail,
                         recaptcha, export, date helpers, theme tokens
  types/                 domain types and next-auth augmentation
public/images/           Pexels photography plus image-credits.md
template/                untouched extraction of the uploaded zip
AUDIT.md                 Step 1 audit, printed before any code was written
```

Image credits, with file name, Pexels URL, photographer and license confirmation,
are in [`public/images/image-credits.md`](./public/images/image-credits.md).
