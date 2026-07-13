# IMTS System Architecture

The Bank of Uganda — Innovation Management System (IMTS) frontend prototype is architected as an optimized, multi-page web application using pure Vanilla JavaScript, clean semantic HTML5, and customized CSS custom properties. It uses standard browser-native capabilities without relying on heavy single-page application (SPA) frameworks, making it light, lightning fast, and straightforward to maintain or host.

## Folder Structure

```
/
├── index.html                 # Main landing / Login screen
├── forgot-password.html       # Email password reset
├── change-password.html       # Account password change
├── css/
│   └── styles.css             # Main stylesheet (~31 KB) used across all pages
├── js/                        # Page-specific controllers and workflow logic
├── utils/                     # Reusable UI component modules
├── services/                  # Data service layer (fetching JSON and caching/merging)
├── data/                      # Static JSON collections serving as the mock database
└── pages/                     # Role-scoped subdirectories
    ├── staff/                 # Staff dashboard and submission screens
    ├── innovation-team/       # Review queue, permissions, categories, reports
    └── admin/                 # Admin console, user locks, activity audit log
```

### Module Responsibilities

| Directory | Type | Design Pattern | Responsibility |
|-----------|------|----------------|----------------|
| `/services` | Data Access | Immediately Invoked Function Expression (IIFE) | Abstracts fetch operations, merges mock datasets with `localStorage` overrides, and serves as an API Gateway proxy wrapper. |
| `/utils` | Components | Procedural / Functional IIFE | Handles state-independent UI actions (rendering tables, building toast alerts, pagination, client-side sorting/filtering). |
| `/js` | Controllers | Self-Executing Closures | Captures page events, handles form validation, triggers services, and invokes utilities. |
| `/data` | Mock DB | Raw JSON Arrays | Provides initial baseline dataset representing users, categories, notification feeds, resources, and ideas. |

---

## Technology Stack

- **Build Tool**: Vite (v6.x) - provides a high-performance HMR dev server and bundler.
- **Languages**: HTML5, Vanilla JavaScript ES5/ES6.
- **Styling**: Vanilla CSS with custom property definitions (CSS variables) for modern theme handling, layout configurations, and component badges.
- **Icons**: Lucide Icons loaded dynamically via high-speed CDN (`unpkg.com/lucide@latest`).
- **Data Layer**: Native `window.fetch()` API fetching mock JSON datasets dynamically.
- **State Management**: Session state (`bou_current_user`), drafts (`bou_idea_draft`), and state overrides (`bou_ideas`, `bou_categories`, `bou_users`) stored as serialized objects in browser `localStorage`.
