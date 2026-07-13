# Bank of Uganda — Innovation Management System (IMTS)

A front-end prototype for managing innovation ideas at the Bank of Uganda. Staff can submit ideas, innovation teams can review them, and administrators manage users and activity logs.

## Technology

- **HTML** — 18 plain HTML5 pages (no template engine)
- **CSS** — Single hand-written stylesheet (`css/styles.css`)
- **JavaScript** — Vanilla JS (ES5/ES6), IIFE modules, no frameworks
- **Icons** — [Lucide](https://lucide.dev/) loaded from CDN
- **Data** — 6 JSON files in `/data/` served via `fetch()`
- **State** — `localStorage` for login session and locally-submitted ideas
- **Build** — [Vite](https://vitejs.dev/) dev server and bundler

## Who Uses the System

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Staff** | `/pages/staff/` | Submit ideas, view own ideas, notifications, resources |
| **Innovation Team** | `/pages/innovation-team/` | Review ideas, manage categories, reports, permissions |
| **Administrator** | `/pages/admin/` | Manage users, view activity log |

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (ships with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/AmanyaPeter/Innovation-Management-System-IMTS-.git
cd Innovation-Management-System-IMTS-

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts at `http://localhost:5173`. Open this URL in your browser. Navigate to any page from there.

### Login

Use the login page (`http://localhost:5173/index.html`) and select a role:

| Role to Select | Username / Email |
|----------------|-----------------|
| Staff User | `brian@bou.or.ug` (or `brian`) |
| Innovation Team | `jane.mukasa@bou.or.ug` (or `jane`) |
| IT Administrator | `admin@bou.or.ug` (or `admin`) |

The password field is not validated — any non-empty value works.

## Commands

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Build for production into dist/
npm run preview   # Preview the production build locally
```

## Project Structure

```
/
├── index.html                 # Login page
├── forgot-password.html       # Password reset
├── change-password.html       # Change password
├── css/styles.css             # Single stylesheet (~31 KB)
├── js/                        # Page-specific JavaScript (15 files)
├── utils/                     # Reusable utilities (7 files)
├── services/                  # Data access layer (6 files)
├── data/                      # JSON data files (6 files)
└── pages/
    ├── staff/                 # Staff-facing pages (6 files)
    ├── admin/                 # Admin pages (3 files)
    └── innovation-team/       # Innovation team pages (6 files)
```

## Architecture

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  HTML    │────▶│  JS (js/) │────▶│ Services │────▶│ JSON     │
│  Pages   │     │  + Utils  │     │(fetch()) │     │ /data/   │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
                                               │
                                          (future)
                                               ▼
                                          REST API
                                        (ASP.NET Core)
```

Currently all data comes from static JSON files. The service layer (`/services/`) is designed to be swapped out for REST API calls when the backend is built.

## Each Page Loads (in order)

1. Lucide CDN (icons)
2. 6 Service modules (data access)
3. 7 Utility modules (toast, modal, table, search, sort, filter, pagination)
4. `auth.js` (login/session)
5. `app.js` (core: session timer, breadcrumb, stepper, toggles, logout)
6. Page-specific JS (e.g. `dashboards.js`, `my-ideas.js`)
7. `lucide.createIcons()` — renders all icons

## What Works

All 18 pages load and render. JSON data is fetched and displayed in tables, cards, and detail views. Search, sort, filter, pagination, modals, and toast notifications function across the application.

## What Is Placeholder

- Login password validation (mock — any non-empty password works)
- Export buttons (PDF, Excel, CSV — shows toast only)
- Chart placeholders (static images, no charting library)
- Password reset email (toast only, no backend)
- Categories/permissions/user actions are in-memory only (no persistence beyond page reload)

## Future

This frontend is designed to connect to an ASP.NET Core API Gateway with microservices. The Vite config includes a proxy placeholder (`/api` → `http://localhost:5000`). See `docs/API_PREPARATION.md` for endpoint mappings.
