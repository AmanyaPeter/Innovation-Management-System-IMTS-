# Project Audit — Innovation Management System (IMTS)

## Folder Structure

```
/
├── index.html                  # Login page (inline CSS, no external stylesheet)
├── forgot-password.html        # Password reset form
├── change-password.html        # Password change form
├── boulogo.ico                 # Bank of Uganda favicon / brand logo
├── master.md                   # This master prompt document
├── prompt6.md                  # Phase 6–20 roadmap (legacy)
├── individualsubm.txt          # Spec for individual submission form
├── teamsubm.txt                # Spec for team submission form
│
├── css/
│   └── styles.css              # Single stylesheet (~31 KB) — all pages except index.html
│
├── js/
│   ├── app.js                  # Core: session timer, breadcrumb, stepper, toggles, login handlers
│   ├── auth.js                 # AuthSystem module (login/logout/session in localStorage)
│   ├── dashboards.js           # Role-aware dashboard (staff / innovation-team / admin)
│   ├── submit-idea.js          # Multi-step idea submission form
│   ├── my-ideas.js             # User's own ideas table with CRUD actions
│   ├── idea-details.js         # Full idea detail view, comments, timeline
│   ├── review-idea.js          # Innovation team review workflow
│   ├── submitted-ideas.js      # Team view of all submitted ideas
│   ├── categories.js           # Category management (CRUD)
│   ├── reports.js              # Reports with filters and live stats
│   ├── permissions.js          # User permissions management
│   ├── users.js                # Admin user management
│   ├── notifications.js        # Notification center with tabs
│   ├── resources.js            # Resources library card grid
│   └── activity-log.js         # Activity log with search and date filter
│
├── utils/
│   ├── toast.js                # Toast notifications (success/error/warning/info)
│   ├── modal.js                # Reusable confirm/info modal dialog
│   ├── table.js                # Generic table renderer
│   ├── search.js               # Debounced multi-field search
│   ├── sort.js                 # Column sorting with arrow indicators
│   ├── filter.js               # Multi-key data filtering
│   └── pagination.js           # Paginated data with prev/next/ellipsis
│
├── services/
│   ├── ideaService.js           # Fetch ideas from JSON
│   ├── userService.js           # Fetch users, authenticate
│   ├── notificationService.js   # Fetch notifications
│   ├── resourceService.js       # Fetch resources
│   ├── categoryService.js       # Fetch categories
│   └── activityService.js       # Fetch activity logs
│
├── data/
│   ├── ideas.json               # 10 sample ideas
│   ├── users.json               # 10 sample users
│   ├── notifications.json       # 8 sample notifications
│   ├── resources.json           # 6 sample resources
│   ├── categories.json          # 7 sample categories
│   └── activities.json          # 20 sample activity entries
│
└── pages/
    ├── staff/
    │   ├── dashboard.html       # Staff landing page
    │   ├── submit-idea.html     # Multi-step idea submission
    │   ├── my-ideas.html        # User's idea list
    │   ├── idea-details.html    # Single idea detail
    │   ├── notifications.html   # Notification center
    │   └── resources.html       # Resources library
    │
    ├── admin/
    │   ├── dashboard.html       # Admin landing page
    │   ├── users.html           # User management
    │   └── activity-log.html    # System activity log
    │
    └── innovation-team/
        ├── dashboard.html       # Team landing page
        ├── submitted-ideas.html # All submitted ideas
        ├── review-idea.html     # Review workflow
        ├── categories.html      # Category management
        ├── reports.html         # Reports and analytics
        └── permissions.html     # User permissions
```

### Folder Explanation

| Folder | Purpose |
|--------|---------|
| `css/` | Single stylesheet used by all pages except index.html (which has inline CSS) |
| `js/` | Page-specific controllers and core application logic |
| `utils/` | Reusable, framework-independent utility modules (toast, modal, table, search, sort, filter, pagination) |
| `services/` | Data access layer — currently fetches JSON files; designed to swap to REST API calls |
| `data/` | Static JSON data files that simulate a database |
| `pages/staff/` | Staff-facing pages (submit ideas, view own ideas, notifications, resources) |
| `pages/admin/` | Administrator-facing pages (user management, activity log) |
| `pages/innovation-team/` | Innovation team pages (review, categories, reports, permissions) |

---

## Existing Pages

### Root Pages (no sidebar)

| File | Purpose | Navigation Entry | Status |
|------|---------|-----------------|--------|
| `index.html` | Login page with username/password and role selector | — | Complete |
| `forgot-password.html` | Email-based password reset | Link from login page | Complete |
| `change-password.html` | Change password form | — | Complete |

### Staff Pages

| File | Purpose | Navigation Entry | Status |
|------|---------|-----------------|--------|
| `pages/staff/dashboard.html` | Staff landing: summary cards, recent submissions, notifications | Sidebar: Dashboard | Complete |
| `pages/staff/submit-idea.html` | Multi-step idea submission with individual/team toggle | Sidebar: Submit Idea | Complete |
| `pages/staff/my-ideas.html` | Table of user's own ideas with CRUD actions | Sidebar: My Ideas | Complete |
| `pages/staff/idea-details.html` | Full idea detail: description, comments, timeline, progress | Link from My Ideas | Complete |
| `pages/staff/notifications.html` | Notification list with All/Unread/Read tabs | Sidebar: Notifications | Complete |
| `pages/staff/resources.html` | Resource library card grid with search and category filter | Sidebar: Resources | Complete |

### Admin Pages

| File | Purpose | Navigation Entry | Status |
|------|---------|-----------------|--------|
| `pages/admin/dashboard.html` | Admin landing: total/active/locked users, recent activity | Sidebar: Dashboard | Complete |
| `pages/admin/users.html` | User management table with lock/unlock/reset actions | Sidebar: Users | Complete |
| `pages/admin/activity-log.html` | Activity log with search, date filter, CSV export | Sidebar: Activity Log | Complete |

### Innovation Team Pages

| File | Purpose | Navigation Entry | Status |
|------|---------|-----------------|--------|
| `pages/innovation-team/dashboard.html` | Team landing: submission stats, review queue, SLA deadlines | Sidebar: Dashboard | Complete |
| `pages/innovation-team/submitted-ideas.html` | All submitted ideas with filters and review links | Sidebar: Submitted Ideas | Complete |
| `pages/innovation-team/review-idea.html` | Detailed idea review with approve/reject/comment | Link from Submitted Ideas | Complete |
| `pages/innovation-team/categories.html` | Category CRUD table | Sidebar: Categories | Complete |
| `pages/innovation-team/reports.html` | Report filters, summary cards, exportable data table | Sidebar: Reports | Complete |
| `pages/innovation-team/permissions.html` | User permissions with edit/activate/disable | Sidebar: Permissions | Complete |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **HTML** | Plain HTML5 (18 pages, no template engine) |
| **CSS** | Single hand-written stylesheet (~31 KB) |
| **JavaScript** | Vanilla ES5/ES6 (IIFE modules, no frameworks) |
| **Icons** | Lucide (loaded from CDN: `https://unpkg.com/lucide@latest`) |
| **Data** | Static JSON files in `/data/` served via `fetch()` |
| **State** | `localStorage` for drafts, login session, and locally-submitted ideas |
| **Build** | None — pure static files served directly |

## Key Observations

1. **No build tool.** The project is a flat static site. All 15+ scripts are loaded via `<script>` tags on every page, creating redundant HTTP requests.
2. **index.html is inconsistent.** It uses inline `<style>` CSS instead of linking to `css/styles.css` like every other page.
3. **All paths resolve correctly.** Every script and style reference across all 18 HTML pages points to an existing file.
4. **CDN dependency.** Lucide icons require internet access at runtime.
5. **No backend.** All data comes from JSON files. The service layer (IIFE pattern) is designed to be swapped for REST API calls.
6. **localStorage used for two purposes:** storing the logged-in user session (`bou_current_user`) and persisting locally-submitted ideas (`bou_ideas`).
