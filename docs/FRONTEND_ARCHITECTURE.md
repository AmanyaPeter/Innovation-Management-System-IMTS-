# Frontend Architecture

## Overview

This is a static multi-page frontend application. Each HTML page is a standalone document that loads a common set of scripts and a page-specific controller. Data flows from JSON files through service modules into utility components that render the UI.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     HTML Pages (18 files)                   │
│  index.html │ forgot-password.html │ change-password.html   │
│  pages/staff/{dashboard,submit-idea,my-ideas,...}           │
│  pages/admin/{dashboard,users,activity-log}                  │
│  pages/innovation-team/{dashboard,submitted-ideas,...}       │
└───────────────┬─────────────────────────────────────────────┘
                │ <script> tags (loaded in order)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Core Layer                              │
│  auth.js ──▶ AuthSystem (login/logout/session)              │
│  app.js  ──▶ Session timer, breadcrumb, stepper, toggles    │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Utility Layer (utils/)                     │
│  toast.js  ──▶ ToastSystem (success/error/warning/info)     │
│  modal.js  ──▶ ModalSystem (confirm/info dialogs)           │
│  table.js  ──▶ TableSystem.renderTable()                    │
│  search.js ──▶ SearchSystem (debounced multi-field)         │
│  sort.js   ──▶ SortSystem (column sort with arrows)         │
│  filter.js ──▶ FilterSystem (multi-key select filtering)    │
│  pagination ▶ PaginationSystem (10/page, prev/next)         │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│               Page-Specific Controllers (js/)               │
│  dashboards.js  │ submit-idea.js  │ my-ideas.js            │
│  idea-details.js│ notifications.js│ resources.js            │
│  review-idea.js │ submitted-ideas │ categories.js           │
│  reports.js     │ permissions.js  │ users.js                │
│  activity-log.js│                                        │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│               Data Access Layer (services/)                 │
│  ideaService.js         ──▶ fetch('/data/ideas.json')       │
│  userService.js         ──▶ fetch('/data/users.json')       │
│  notificationService.js ──▶ fetch('/data/notifications.json')│
│  resourceService.js     ──▶ fetch('/data/resources.json')   │
│  categoryService.js     ──▶ fetch('/data/categories.json')  │
│  activityService.js     ──▶ fetch('/data/activities.json')  │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer (data/)                      │
│  ideas.json │ users.json │ notifications.json              │
│  resources.json │ categories.json │ activities.json         │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action (click, submit)
       │
       ▼
Page Controller (js/*.js)
       │
       ├── reads/writes localStorage (drafts, session)
       │
       ├── calls Service.fetchData()
       │       │
       │       ▼
       │   Service (services/*.js)
       │       │
       │       ▼
       │   fetch('/data/*.json')  ───▶  JSON response
       │       │
       │       ▼
       │   Returns parsed JavaScript array
       │
       ├── transforms/filters data
       │       │
       │       ▼
       ├── calls Utility.render()
       │       │
       │       ▼
       │   Utility (search, sort, filter, paginate, table)
       │       │
       │       ▼
       │   DOM manipulation (innerHTML, event binding)
       │
       └── shows Toast / opens Modal (feedback)
```

## Script Load Order

Every page loads scripts in this exact order:

```
1. Lucide CDN          <head>    Icons library
2. 6 Service modules   <body>    Data access layer
3. 7 Utility modules   <body>    Reusable UI components
4. auth.js             <body>    Login/session management
5. app.js              <body>    Core app logic
6. Page-specific JS    <body>    Page controller
7. lucide.createIcons  <body>    Initialize all icons
```

## How `fetch()` Works

All services use the **IIFE (Immediately Invoked Function Expression)** pattern:

```js
var IdeaService = (function () {
  var BASE_URL = '/data/ideas.json';

  function getIdeas() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    });
  }

  return { getIdeas: getIdeas };
})();
```

- `BASE_URL` uses an **absolute path** starting with `/` (resolves to project root)
- Services return **Promises** — controllers use `.then()` to handle data
- Error handling is minimal (logs to console via uncaught promise)
- No HTTP interceptors, auth headers, or request/response transforms

## How Rendering Works

Page controllers handle rendering directly with DOM manipulation:

1. **Fetch data** from service
2. **Filter/search/sort** using utility modules
3. **Build HTML** with `document.createElement()` or `innerHTML`
4. **Bind events** with `addEventListener()`
5. **Create Lucide icons** with `lucide.createIcons()`

The `TableSystem.renderTable()` utility can handle generic table rendering if provided with column definitions, custom renders, and action button configs.

## How `localStorage` Is Used

| Key | Purpose | Set By | Used By |
|-----|---------|--------|---------|
| `bou_current_user` | Logged-in user object | `auth.js` → `AuthSystem.login()` | All pages (for session) |
| `bou_ideas` | Locally submitted ideas | `submit-idea.js` | `my-ideas.js`, `idea-details.js` |

## How JSON Will Become API Calls

Each service module currently calls `fetch('/data/*.json')`. To switch to a real API:

1. Change `BASE_URL` in each service to point to the real API endpoint
2. Add authentication headers (Bearer token from `AuthSystem.getCurrentUser()`)
3. Add request/response error handling
4. The rest of the application code **does not change** — all data flows through services

```js
// Future state
var BASE_URL = 'http://localhost:5000/api/ideas';

function getIdeas() {
  return fetch(BASE_URL, {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(function (res) {
    if (!res.ok) throw new Error('API error');
    return res.json();
  });
}
```

## Vite Build System

- **Dev server**: `npm run dev` → starts at `http://localhost:5173` with HMR
- **Production build**: `npm run build` → outputs to `dist/`
- **Multi-page app**: Configured with `appType: 'mpa'` and all 18 HTML pages as rollup inputs
- **API proxy**: `/api` requests proxied to `http://localhost:5000` (placeholder for future backend)
