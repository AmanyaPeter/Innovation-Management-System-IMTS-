# TODO — Remaining Work

## High Priority

| # | Problem | Why | Suggested Fix | Files | Effort |
|---|---------|-----|---------------|-------|--------|
| 1 | `index.html` uses inline CSS instead of linking to `css/styles.css` | Inconsistent with all other pages; duplicates styles | Add `<link rel="stylesheet" href="css/styles.css">` to `index.html` (remove duplicate inline styles) | `index.html`, `css/styles.css` | 15 min |
| 2 | No actual backend — all data is static JSON | System cannot persist real submissions, reviews, or user changes | Build ASP.NET Core API Gateway + microservices (see `API_PREPARATION.md`) | — | Weeks |
| 3 | New comments not persisted to JSON | Comments typed in review/detail pages disappear on reload | Replace in-memory comment save with API call or localStorage persistence | `js/idea-details.js`, `js/review-idea.js` | 1 hour |

## Medium Priority

| # | Problem | Why | Suggested Fix | Files | Effort |
|---|---------|-----|---------------|-------|--------|
| 4 | Category/user/permission changes are in-memory only | Page reload resets all changes | Connect to backend API or use localStorage for interim persistence | `js/categories.js`, `js/users.js`, `js/permissions.js` | 2 hours |
| 5 | Export buttons (PDF, Excel, CSV) do nothing | Reports page has no export functionality | Implement CSV export in-browser using data table content; PDF/Excel via backend | `js/reports.js` | 3 hours |
| 6 | Chart placeholders on reports page | "Chart Placeholder" text divs instead of actual charts | Integrate a charting library (Chart.js, ApexCharts) and populate from filtered data | `pages/innovation-team/reports.html`, `js/reports.js` | 4 hours |
| 7 | File upload not functional | Click opens file picker but nothing happens | Store file metadata + base64 in localStorage (MVP), or upload to API | `js/submit-idea.js`, `pages/staff/submit-idea.html` | 2 hours |
| 8 | Idea edit from My Ideas re-opens submit form but doesn't pre-populate | Users cannot edit existing ideas | Pass idea ID to submit page, load and populate form fields | `js/submit-idea.js`, `js/my-ideas.js` | 3 hours |

## Low Priority

| # | Problem | Why | Suggested Fix | Files | Effort |
|---|---------|-----|---------------|-------|--------|
| 9 | "Remember me" checkbox does nothing | No localStorage persistence of credentials | Store username in localStorage and pre-fill on page load | `index.html`, `js/app.js` | 30 min |
| 10 | Password reset email is a toast only | No SMTP or email service integration | Implement via backend; frontend is ready | `forgot-password.html`, `js/app.js` | Done (frontend) |
| 11 | `profile.html` pages referenced in sidebar nav point to `#` | Profile page not implemented | Create profile page(s) for each role | `pages/staff/*`, `pages/admin/*`, `pages/innovation-team/*` | 2 hours |
| 12 | All 15+ scripts loaded on every page (no code splitting) | Redundant HTTP requests, larger page weight | Lazy-load page-specific scripts; Vite code splitting for services/utils | `vite.config.js`, all HTML files | 4 hours |
| 13 | No loading/error states for JSON fetch | UI shows empty/undefined before data loads | Add loading spinners and error state handlers in service consumers | All `/js/*.js` files | 3 hours |
| 14 | `app.js` is 20 KB with mix of concerns | Hard to maintain | Split into: `session.js`, `breadcrumb.js`, `navigation.js`, `forms.js`, `legacy-events.js` | `js/app.js` | 2 hours |
| 15 | No unit tests | Cannot automate regression testing | Add Vitest or Jest; write tests for services and utilities | All files | 1 day+ |
