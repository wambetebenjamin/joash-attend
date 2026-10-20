# Step 1 audit, Joash Attend

This audit was printed before any application code was written. The uploaded
archive `dnx-v1.0.0.zip` was extracted to `template/` and every path, including
hidden files and nested asset folders, was listed.

## 1. Full file tree of the uploaded zip (121 files)

```
template/.eslintrc.cjs
template/.gitignore
template/.prettierignore
template/.prettierrc.cjs
template/README.md
template/eslint.config.js
template/index.html
template/package-lock.json
template/package.json
template/public/dnx.ico
template/src/App.tsx
template/src/assets/images/avatars/avatar1.png
template/src/assets/images/avatars/avatar2.png
template/src/assets/images/avatars/avatar3.png
template/src/assets/images/avatars/avatar4.png
template/src/assets/images/avatars/avatar5.png
template/src/assets/images/avatars/avatar6.png
template/src/assets/images/avatars/avatar7.png
template/src/assets/images/avatars/avatar8.png
template/src/assets/images/help-center.png
template/src/assets/images/logo.png
template/src/assets/images/thumbs/thumb1.png
template/src/assets/images/thumbs/thumb2.png
template/src/assets/images/thumbs/thumb3.png
template/src/assets/images/thumbs/thumb4.png
template/src/assets/images/thumbs/thumb5.png
template/src/assets/images/thumbs/thumb6.png
template/src/assets/images/thumbs/thumb7.png
template/src/assets/images/thumbs/thumb8.png
template/src/components/base/IconifyIcon.tsx
template/src/components/base/Image.tsx
template/src/components/base/ReactEchart.tsx
template/src/components/base/ReactSwiper.tsx
template/src/components/common/DataGridFooter.tsx
template/src/components/common/Footer.tsx
template/src/components/common/SliderWrapper.tsx
template/src/components/hooks/userResizeObserver.ts
template/src/components/loader/PageLoader.tsx
template/src/components/loader/Splash.tsx
template/src/components/sections/dashboard/TaskToday.tsx
template/src/components/sections/dashboard/WeekCalendar.tsx
template/src/components/sections/dashboard/activity/Activity.tsx
template/src/components/sections/dashboard/activity/ActivityChart.tsx
template/src/components/sections/dashboard/monthly-mentors/MentorCard.tsx
template/src/components/sections/dashboard/monthly-mentors/MonthlyMentors.tsx
template/src/components/sections/dashboard/running-task/RunningTask.tsx
template/src/components/sections/dashboard/running-task/RunningTaskChart.tsx
template/src/components/sections/dashboard/task-overview/ActionMenu.tsx
template/src/components/sections/dashboard/task-overview/TaskOverview.tsx
template/src/components/sections/dashboard/task-overview/TaskOverviewTable.tsx
template/src/components/sections/dashboard/upcoming-task/TaskCard.tsx
template/src/components/sections/dashboard/upcoming-task/UpcomingTask.tsx
template/src/data/images.ts
template/src/data/mentors.ts
template/src/data/taskOverview.ts
template/src/data/tasks.ts
template/src/layouts/auth-layout/index.tsx
template/src/layouts/main-layout/index.tsx
template/src/layouts/main-layout/sidebar/DrawerItems.tsx
template/src/layouts/main-layout/sidebar/Sidebar.tsx
template/src/layouts/main-layout/sidebar/list-items/CollapseListItem.tsx
template/src/layouts/main-layout/sidebar/list-items/ListItem.tsx
template/src/layouts/main-layout/topbar/LanguageSelect.tsx
template/src/layouts/main-layout/topbar/ProfileMenu.tsx
template/src/layouts/main-layout/topbar/Topbar.tsx
template/src/main.tsx
template/src/pages/Dashboard.tsx
template/src/pages/Error404.tsx
template/src/pages/authentication/Signin.tsx
template/src/pages/authentication/Signup.tsx
template/src/routes/paths.ts
template/src/routes/router.tsx
template/src/routes/sitemap.ts
template/src/theme/colors.ts
template/src/theme/components/button/Button.tsx
template/src/theme/components/button/ButtonBase.tsx
template/src/theme/components/button/IconButton.tsx
template/src/theme/components/button/Toolbar.tsx
template/src/theme/components/card/Card.tsx
template/src/theme/components/card/CardActions.tsx
template/src/theme/components/card/CardContent.tsx
template/src/theme/components/card/CardHeader.tsx
template/src/theme/components/card/CardMedia.tsx
template/src/theme/components/data-display/Avatar.tsx
template/src/theme/components/data-display/AvatarGroup.tsx
template/src/theme/components/data-display/Badge.tsx
template/src/theme/components/data-display/Chip.tsx
template/src/theme/components/data-display/Divider.tsx
template/src/theme/components/data-grid/DataGrid.tsx
template/src/theme/components/input/Checkbox.tsx
template/src/theme/components/input/FilledInput.tsx
template/src/theme/components/input/FormControlLabel.tsx
template/src/theme/components/input/InputAdornment.tsx
template/src/theme/components/input/InputBase.tsx
template/src/theme/components/input/OutlinedInput.tsx
template/src/theme/components/input/Select.tsx
template/src/theme/components/input/Slider.tsx
template/src/theme/components/layout/Stack.tsx
template/src/theme/components/list/Collapse.tsx
template/src/theme/components/list/List.tsx
template/src/theme/components/list/ListItemButton.tsx
template/src/theme/components/list/ListItemIcon.tsx
template/src/theme/components/list/ListItemText.tsx
template/src/theme/components/list/MenuItem.tsx
template/src/theme/components/navigation/Drawer.tsx
template/src/theme/components/navigation/Link.tsx
template/src/theme/components/pagination/PaginationItem.tsx
template/src/theme/components/surface/Paper.tsx
template/src/theme/components/utils/CssBaseline.tsx
template/src/theme/palette.ts
template/src/theme/shadows.ts
template/src/theme/styles/echart.ts
template/src/theme/styles/scrollbar.ts
template/src/theme/styles/simplebar.ts
template/src/theme/theme.ts
template/src/theme/typography.ts
template/src/types/custom.d.ts
template/tsconfig.app.json
template/tsconfig.json
template/tsconfig.node.json
template/vite.config.ts
```

## 2. Confirmations requested in Step 1

### CSS custom properties
The zip ships **no CSS custom properties**. There are no `.css`, `.scss`,
`.sass` or `.less` files anywhere in the archive. The previous template themed
everything through MUI `createTheme` (`src/theme/theme.ts`), the palette in
`src/theme/palette.ts`, `src/theme/colors.ts`, `src/theme/typography.ts`,
`src/theme/shadows.ts` and the `styleOverrides` in `src/theme/components/**`.

Because the rebuild must use Tailwind v4, PostCSS and a global stylesheet, the
template colour and typography tokens were reproduced verbatim as CSS custom
properties in `src/app/globals.css`:

```
:root {
  --color-primary: #546fff;
  --color-primary-100: #dce4ff;
  --color-primary-200: #bac8ff;
  --color-primary-600: #3d53db;
  --color-primary-700: #2a3bb7;
  --color-ink: #141522;
  --color-ink-700: #2c2c38;
  --color-ink-500: #54577a;
  --color-muted: #8e92bc;
  --color-hairline: #ebedf7;
  --color-surface: #ffffff;
  --color-canvas: #fcfcfc;
  --color-canvas-muted: #f6f7fc;
  --color-neutral-100: #dfe1f3;
  --color-neutral-200: #c2c6e8;
  --color-success: #2e8b57;
  --color-success-soft: #d5e8dd;
  --color-success-ink: #20613d;
  --color-danger: #ff4d5e;
  --color-danger-soft: #ffdfe2;
  --color-danger-ink: #b33642;
  --color-warning: #ffb054;
  --color-warning-soft: #ffffcc;
  --color-warning-ink: #b37b3b;
  --color-sky-soft: #dcf3ff;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  ...
}
```

Every value maps back to `src/theme/colors.ts`, for example `blue[500]`
`#546FFF` becomes `--color-primary`, `gray[100]` `#DFE1F3` becomes
`--color-neutral-100`, `green[500]` `#2E8B57` becomes `--color-success`,
`red[500]` `#FF4D5E` becomes `--color-danger`, `yellow[500]` `#FFB054` becomes
`--color-warning` and `white[100]` `#FFFFFF` becomes `--color-surface`.

### @font-face rules
There are **no @font-face rules in the zip**. The template loads its typeface
from Google Fonts in `index.html`, lines 8 to 15:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
  rel="stylesheet"
/>
```

`src/theme/typography.ts` sets `fontFamily: ['Plus Jakarta Sans', 'sans-serif'].join(',')`.
The rebuild reproduces the **same** family, weights (200 to 800, plus italics)
and the same preconnect plus stylesheet links, verbatim, in
`src/app/layout.tsx`. No font was swapped, and no system font stack was
introduced. `--font-sans` carries the identical `'Plus Jakarta Sans', sans-serif`
stack.

### Existing API route file names
The zip contains **no API routes**. It is a client only Vite SPA with no server
runtime, no `api/` folder and no route handlers. The API surface requested in
Step 8 was created new under `src/app/api/**`.

### Existing environment variable names
The zip contains **no environment variables**, no `.env`, `.env.example` or
`.env.local`, and no `process.env` reference. All names in Step 9 are new and
documented in `.env.example`.

### Loading screen
Present as two components:
- `src/components/loader/Splash.tsx` (MUI `CircularProgress` in a centred stack,
  used as the router suspense fallback)
- `src/components/loader/PageLoader.tsx` (MUI `LinearProgress`, used for nested
  route suspense)

Both were reproduced: the full page Splash becomes the fingerprint preloader in
`src/components/system/LoadingScreen.tsx`, where an SVG fingerprint outline draws
from the centre outward, a percentage counter counts to 100, the screen closes at
three seconds, a Skip button appears after one second, and `role="status"` plus a
plain percentage are used under `prefers-reduced-motion`. The nested
`PageLoader` behaviour is preserved by Next.js route streaming.

### Cookie consent
Absent. There is no consent banner, modal, `localStorage` key or cookie copy
anywhere in the zip. The banner and preferences modal were built from scratch in
`src/components/system/CookieConsent.tsx`, using the exact `localStorage` key
`joash_attend_consent`, with Necessary locked, Functional, Analytics and
Marketing toggles, and Kenya Data Protection Act 2019 wording.

### CAPTCHA provider
Absent. No reCAPTCHA, hCaptcha or Turnstile script, key or dependency exists in
the zip. Google reCAPTCHA v3 was added invisibly on the demo request form, the
contact form, sign in, sign up and the staff leave request, with server side
verification in `src/lib/recaptcha.ts` and the endpoint
`POST /api/recaptcha/verify`. The secret stays server side only, and a v2
challenge step is offered when a score falls below 0.5.

### Legal pages
`/legal/privacy-policy`, `/legal/terms` and `/legal/cookie-policy` are all
**absent** from the zip. All three were created, sharing the
`src/components/site/LegalPage.tsx` layout.

### 404 and 500
- 404: present as `src/pages/Error404.tsx` (MUI, headline "Page Not Found",
  "Go Back Home" button). Reproduced with the required copy in
  `src/app/not-found.tsx`: a Fingerprint icon, the line
  "This record does not exist." and a "Back to Dashboard" button.
- 500: **absent**. There was no error page, no `ErrorBoundary` and no `500`
  route. Created as `src/app/error.tsx`, `src/app/global-error.tsx` and the
  addressable `src/app/500/page.tsx`, all with Try Again and the WhatsApp number
  +254112272061.

## 3. Additional facts established before coding

| Item | Finding |
| --- | --- |
| Framework in zip | Vite 7, React 19, react-router 7, MUI 7, ECharts 6, TypeScript, gh-pages deploy |
| Build scripts | `dev`: vite, `build`: `tsc -b && vite build`, `deploy`: gh-pages |
| Base path | `base: '/dnx'` in `vite.config.ts`, router `basename: '/dnx'` |
| Theme source | `createTheme` with the custom `neutral` and `transparent` palette keys |
| Charts in zip | ECharts via `src/components/base/ReactEchart.tsx` and `src/theme/styles/echart.ts` |
| Images in zip | 8 local avatar PNGs, 8 thumb PNGs, a logo and a help centre illustration |
| Layout | `MainLayout` with a 252px `Drawer` sidebar and a 90px topbar |
| Auth | Two presentational screens only (`Signin.tsx`, `Signup.tsx`), no provider, no session |
| Pages | Dashboard, Signin, Signup, Error404 |

## 4. What happened next

The product was rebuilt as a Next.js 16.4.2 App Router project on top of these
tokens. No template file was renamed or deleted: the untouched archive and its
full extraction remain at `dnx-v1.0.0.zip` and `template/`. Nothing in the
extracted template was edited. All new work lives in `src/`, `public/`, the
Next.js config files and the project metadata.

See `README.md` for the route map, environment variables, demo accounts and the
build verification results.
