# Bank of Uganda — Innovation Management System (IMTS)

Welcome to the Bank of Uganda Innovation Management System (IMTS) — a high-performance frontend prototype engineered to administer and track corporate innovation submissions.

Currently, the application operates as an interactive mock-database frontend that preserves session state, new submissions, category edits, administrative permission modifications, lock logs, and timeline progress inside localized services synchronized with browser `localStorage`. It is structured to seamlessly transition to an enterprise microservices backend behind an API Gateway with no structural updates required in the UI controller layers.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (ships with Node.js)

### Installation and Setup
```bash
# 1. Clone and enter the repository
git clone https://github.com/AmanyaPeter/Innovation-Management-System-IMTS-.git
cd Innovation-Management-System-IMTS-

# 2. Install dependencies (Vite bundler)
npm install

# 3. Spin up the local development server (with Hot Module Replacement)
npm run dev
```
The server will start at `http://localhost:5173/`. Open this link in your browser to run the application.

### Credentials (Authentication Selector)
Use the interactive selectors on the Login Page (`index.html`) or enter the following default emails (with any non-empty password):
* **Staff User**: `brian@bou.or.ug` (or username `brian`)
* **Innovation Team Manager**: `jane.mukasa@bou.or.ug` (or username `jane`)
* **IT Administrator**: `admin@bou.or.ug` (or username `admin`)

---

## 🛠️ Frontend Technology Stack

```
Frontend Stack

Build Tool:
Vite (v6.x)

Language & Module Standard:
ES5/ES6 Javascript with script-order dependency loading (IIFE module structure)

Styling:
Custom Vanilla CSS utilizing custom property definitions (CSS variables) for modern theme scaling

Data Handling:
Native Fetch API querying localized /data/*.json collections merged with localStorage state overrides

State Management:
Serialized objects in localStorage (session: `bou_current_user`, ideas list: `bou_ideas`, draft: `bou_idea_draft`, categories: `bou_categories`, users: `bou_users`)

External Dependencies:
Lucide Icons loaded dynamically via high-speed CDN (unpkg.com/lucide@latest)
```

---

## 🏛️ Frontend Architecture

The Bank of Uganda IMTS prototype is built on an isolated, layered architecture designed to keep visual presentations (HTML views) completely decoupled from the data access services:

```
┌─────────────────────────────────────────────────────────────┐
│                     HTML Pages (18 files)                   │
│  index.html │ forgot-password.html │ change-password.html   │
│  pages/staff/{dashboard,submit-idea,my-ideas,...}           │
│  pages/admin/{dashboard,users,activity-log}                  │
│  pages/innovation-team/{dashboard,submitted-ideas,...}       │
└───────────────┬─────────────────────────────────────────────┘
                │ <script> tags loaded in order
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Core Layer                              │
│  auth.js ──► AuthSystem (login/logout/session)              │
│  app.js  ──► Session timeout bar, stepper, toggles, logout  │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Utility Layer (utils/)                     │
│  toast.js  ──► ToastSystem (success/error/warning/info)     │
│  modal.js  ──► ModalSystem (confirm/info dialogs)           │
│  table.js  ──► TableSystem.renderTable()                    │
│  search.js ──► SearchSystem (debounced multi-field)         │
│  sort.js   ──► SortSystem (column sort with arrows)         │
│  filter.js ──► FilterSystem (multi-key select filtering)    │
│  pagination ► PaginationSystem (10/page, prev/next)         │
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
│  ideaService.js         ──► fetch('/data/ideas.json')       │
│  userService.js         ──► fetch('/data/users.json')       │
│  notificationService.js ──► fetch('/data/notifications.json')│
│  resourceService.js     ──► fetch('/data/resources.json')   │
│  categoryService.js     ──► fetch('/data/categories.json')  │
│  activityService.js     ──► fetch('/data/activities.json')  │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer (data/)                      │
│  ideas.json │ users.json │ notifications.json              │
│  resources.json │ categories.json │ activities.json         │
└─────────────────────────────────────────────────────────────┘
```

For a comprehensive explanation of how modules communicate, visit [IMTS System Architecture](docs/ARCHITECTURE.md) and [Application Data Flow](docs/DATA_FLOW.md).

---

## 📂 Page Inventory and Controllers

The system comprises **18 functional screens** customized for their respective business roles:

* **Authentication & Recovery (3 screens)**: Login (`index.html`), Forgot Password (`forgot-password.html`), Change Password (`change-password.html`).
* **Staff Member Portal (6 screens)**: Dashboard, Submit Idea (Wizard), My Ideas (CRUD), Idea Details, Notifications, Resources.
* **Innovation Team Management (6 screens)**: Review Dashboard, Submitted Ideas, Idea Review Console, Categories CRUD, Permissions Console, Reports Dashboard.
* **IT Administration Console (3 screens)**: Admin Dashboard (featuring dynamic Recent Activity counts), User Lock/Unlock Administration, System Activity Logs.

For detailed analysis of selectors, validation rules, and script links of each page, visit [Screen Inventory and Page-by-Page Analysis](docs/PAGE_DOCUMENTATION.md).

---

## 📊 Mock Data Architecture

All datasets originate as local static files containing mock data structured precisely to imitate standard SQL/NoSQL schema collections:

- `ideas.json`: Stores baseline submissions including stage tracking, attachments metadata, timelines, and nested comment nodes. (Future replacement: `GET /api/ideas`).
- `users.json`: Stores security accounts, online states, and permission arrays. (Future replacement: `GET /api/users`).
- `categories.json`: Categories database. (Future replacement: `GET /api/categories`).
- `activities.json`: Admin Audit trails. (Future replacement: `GET /api/activities`).
- `notifications.json`: User notification inbox items. (Future replacement: `GET /api/notifications`).
- `resources.json`: Shared operational guides. (Future replacement: `GET /api/resources`).

For file layouts, field definitions, and equivalent database constraints, visit [Microservices API Endpoint Mapping](docs/API_MAPPING.md).

---

## 🔁 User Workflows

```
  STAFF WORKFLOW
  Login (Staff selector) ──► Dashboard ──► Submit Idea (4-step Wizard) ──► My Ideas (retract/cancel) ──► Details & Comments

  INNOVATION TEAM WORKFLOW
  Login (Team selector) ──► Dashboard (SLA alerts) ──► Submitted Ideas ──► Review Console ──► Save Review (Saves status/timeline)

  IT ADMINISTRATOR WORKFLOW
  Login (Admin selector) ──► Dashboard (Activity metrics) ──► User Management (locks/resets) ──► Audit Logs (search/filters)
```

---

## 📈 System Status Dashboard

| Feature Component | Status | Notes |
|-------------------|--------|-------|
| **Mock Authentication Routing** | ✔ Complete | Decoupled session logic, routes correctly by role |
| **Interactive Dashboards** | ✔ Complete | Updates summary stats dynamically from mock services |
| **Idea Submission Wizard** | ✔ Complete | Multi-step navigation, validations, draft saves |
| **My Ideas & Review Lists** | ✔ Complete | Searching, debounced column sorting, multiple select filters |
| **Stage & SLA Status Tracking** | ✔ Complete | Timelines and progress stages update instantly on review save |
| **Commenting Board** | ✔ Complete | Posting comments persists updates directly in storage |
| **Category Configuration** | ✔ Complete | CRUD table adds, modifies, and deletes with storage persistence |
| **Permissions Administration** | ✔ Complete | Checkbox configuration per-user, locks and unlocks save permanently |
| **Export Formats (PDF/Excel)** | 🚧 Partial | Frontend UI buttons wired, triggers informative user toast |

---

## 🌐 Future Backend Decoupling Architecture

The Bank of Uganda IMTS prototype has been explicitly planned to connect directly to an enterprise ASP.NET Core API Gateway that acts as a secure proxy to decoupled back-end microservices:

```
                       Frontend (Port 5173)
                                │
                                ▼
                       API Gateway (Reverse Proxy)
                                │
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Auth Service │         │ Idea Service │         │ Report Serv. │
└──────────────┘         └──────────────┘         └──────────────┘
```

- **API Gateway Pattern**: The frontend only communicates with `/api/*`. The underlying microservice IP addresses and internal port configurations are entirely hidden.
- **Microservices Responsibilities**: Auth & AD integration handles authentication and issues JWT tokens. Ideas & Workflow service manages proposals, attachments, status state machines, and comments. Reporting, Resources, and Notification services manage heavy generation workloads, resource binaries, and email/system queues.

For proxy configurations and microservice setup instructions, visit [Backend Microservices Integration Plan](docs/BACKEND_INTEGRATION.md) and [IMTS Development and Handover Guide](docs/DEVELOPMENT_GUIDE.md).
