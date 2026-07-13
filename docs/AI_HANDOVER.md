# AI Handover Document

## Project Purpose

A front-end prototype for the Bank of Uganda Innovation Management System (IMTS). Staff submit innovation ideas, the Innovation Team reviews them, and Administrators manage users and monitor activity. Currently a static HTML/CSS/JS prototype with JSON data files, designed to be connected to an ASP.NET Core microservices backend.

## Quick Start

```bash
# Prerequisites: Node.js v18+
npm install
npm run dev       # → http://localhost:5173
```

Login with any role: Staff (`brian`), Innovation Team (`jane`), Administrator (`admin`). Password can be anything.

## Architecture (3 Layers)

```
HTML Pages → Page Controllers (js/) + Utilities (utils/)
    → Services (services/) → Data (data/*.json or future API)
```

### Layer 1: Presentation
- **18 HTML pages** in `/pages/` (staff, admin, innovation-team) + root (login, forgot/change password)
- **1 CSS file** (`css/styles.css`) — all styling
- **Lucide CDN** for icons

### Layer 2: Application Logic
- **15 page-specific JS** files in `/js/` — each controller handles one page
- **7 utility modules** in `/utils/` — reusable, framework-independent
- **`auth.js`** — login/session management via `localStorage`
- **`app.js`** — core: session timer, breadcrumb, logout, stepper, legacy event bindings

### Layer 3: Data Access
- **6 service modules** in `/services/` — IIFE pattern, `fetch()` JSON, return Promises
- **6 JSON files** in `/data/` — realistic sample data

## Script Load Order (same on every page)

```
Lucide CDN → 6 Services → 7 Utils → auth.js → app.js → Page-Specific JS
```

## Folder Structure

```
/                          # Project root
├── index.html             # Login page
├── forgot-password.html   # Password reset
├── change-password.html   # Change password
├── package.json           # Vite + scripts
├── vite.config.js         # MPA config + API proxy
├── css/styles.css         # Single stylesheet
├── js/                    # 15 page controllers + auth.js + app.js
├── utils/                 # 7 reusable UI utilities
├── services/              # 6 data access modules (IIFE)
├── data/                  # 6 JSON sample data files
├── pages/
│   ├── staff/             # 6 pages
│   ├── admin/             # 3 pages
│   └── innovation-team/   # 6 pages
└── docs/                  # Documentation (14 files)
```

## Coding Standards

All files use:
- **IIFE** (Immediately Invoked Function Expression) for module encapsulation
- **var** for variables (ES5-compatible)
- **function expressions** (not arrow functions) for callbacks
- Global namespacing: `IdeaService`, `ToastSystem`, `ModalSystem`, `SearchSystem`, `SortSystem`, `FilterSystem`, `PaginationSystem`, `AuthSystem`
- PascalCase for modules, camelCase for variables/functions
- No ES modules — scripts are global and loaded via `<script>` tags

## Current Progress

| Metric | Value |
|--------|-------|
| Total files | 56 |
| HTML pages | 18 (all fully wired) |
| Working features | 37 of 42 |
| Placeholder features | 5 (exports, charts, password email, create user, remember me) |
| Build tool | Vite (configured) |
| npm packages | 1 (vite) |

## Completed Features

All 18 pages have working page-specific JavaScript. Everything described in the original prompt6.md roadmap (phases 1–20) is implemented:
- ✅ Login with role selection
- ✅ 3 role-specific dashboards
- ✅ Multi-step idea submission with individual/team toggle
- ✅ My Ideas table with search/sort/filter/pagination
- ✅ Idea detail view with comments, timeline, progress tracker
- ✅ Notification center with read/unread tabs
- ✅ Resources library with card grid and search
- ✅ Innovation team review workflow (approve/reject/comment)
- ✅ Category management (CRUD)
- ✅ Reports with live stats and filters
- ✅ Permissions management
- ✅ User management (lock/unlock/reset)
- ✅ Activity log with search and date filter
- ✅ Session timeout, breadcrumb, modals, toasts
- ✅ Vite build system (MPA mode with all 18 pages)
- ✅ All service paths fixed (absolute URLs)

## Known Issues

1. **Service BASE_URL** was originally `../data/` (relative). This would resolve against the **page URL**, not the script location, causing 404s for subdirectory pages. **Fixed** — changed to absolute `/data/` paths in all 6 service files.
2. **index.html** uses inline `<style>` instead of linking to `css/styles.css` — cosmetic inconsistency.
3. **New comments, category edits, user changes** are in-memory only — lost on page refresh.
4. **app.js** at 20 KB has mixed concerns (session, breadcrumb, stepper, event bindings) — could be split.

## Next Recommended Tasks

1. **Backend integration** — Replace JSON fetch in services with real API calls. Use the proxy `http://localhost:5000` configured in `vite.config.js`.
2. **Add loading states** — Every page that fetches data needs a loading spinner and error state.
3. **Persist user edits** — Lock/unlock, category CRUD, permission changes should save to API.
4. **Implement exports** — CSV export can be done browser-side; PDF/Excel need backend.
5. **Add charts** — Integrate Chart.js or ApexCharts on the reports page.
6. **Code splitting** — Use Vite's dynamic import to lazy-load page-specific scripts.
7. **Tests** — Add Vitest for services and utilities.
8. **Profile pages** — Sidebar "Profile" links point to `#` — need implementation.
