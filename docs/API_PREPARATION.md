# API Preparation — Backend Endpoint Mapping

Every page and data module maps to a set of RESTful endpoints for the future ASP.NET Core API Gateway.

## Authentication

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `index.html` (Login) | `users.json` (via `userService.authenticate()`) | `/api/auth/login` | POST |
| `forgot-password.html` | — | `/api/auth/forgot-password` | POST |
| `change-password.html` | — | `/api/auth/change-password` | POST |
| Logout | — | `/api/auth/logout` | POST |
| Session check | `localStorage` | `/api/auth/me` | GET |

## Ideas

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `submit-idea.html` | `localStorage` | `/api/ideas` | POST |
| `my-ideas.html` | `ideas.json` + localStorage | `/api/ideas/mine` | GET |
| `idea-details.html` | `ideas.json` | `/api/ideas/{id}` | GET |
| `my-ideas.html` (edit) | — | `/api/ideas/{id}` | PUT |
| `my-ideas.html` (retract) | — | `/api/ideas/{id}/status` | PUT (retract) |
| `submitted-ideas.html` | `ideas.json` + localStorage | `/api/ideas` | GET |
| `review-idea.html` | `ideas.json` | `/api/ideas/{id}/review` | PUT |
| Comments (submit) | — | `/api/ideas/{id}/comments` | POST |
| Comments (list) | `ideas.json` (embedded) | `/api/ideas/{id}/comments` | GET |
| Timeline | `ideas.json` (embedded) | `/api/ideas/{id}/timeline` | GET |
| Approval workflow | `ideas.json` (embedded) | `/api/ideas/{id}/workflow` | GET |
| Notify submitter | — | `/api/ideas/{id}/notify` | POST |

## Users

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `users.html` (list) | `users.json` | `/api/users` | GET |
| `users.html` (create) | — | `/api/users` | POST |
| `users.html` (edit) | — | `/api/users/{id}` | PUT |
| `users.html` (delete) | — | `/api/users/{id}` | DELETE |
| Lock/unlock account | — | `/api/users/{id}/status` | PUT |
| Reset password | — | `/api/users/{id}/reset-password` | POST |

## Permissions

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `permissions.html` | `users.json` (permissions field) | `/api/users/{id}/permissions` | GET, PUT |

## Notifications

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `notifications.html` | `notifications.json` | `/api/notifications` | GET |
| Mark as read | — | `/api/notifications/{id}/read` | PUT |

## Resources

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `resources.html` | `resources.json` | `/api/resources` | GET |
| View/Download | — | `/api/resources/{id}/download` | GET |

## Categories

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `categories.html` (list) | `categories.json` | `/api/categories` | GET |
| `categories.html` (add) | — | `/api/categories` | POST |
| `categories.html` (edit) | — | `/api/categories/{id}` | PUT |
| `categories.html` (delete) | — | `/api/categories/{id}` | DELETE |

## Reports

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `reports.html` | `ideas.json` | `/api/reports/ideas` | GET (with query params) |
| Export PDF | — | `/api/reports/export?format=pdf` | GET |
| Export Excel | — | `/api/reports/export?format=excel` | GET |
| Export CSV | — | `/api/reports/export?format=csv` | GET |

## Activity Log

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| `activity-log.html` | `activities.json` | `/api/activities` | GET |
| Export CSV | — | `/api/activities/export?format=csv` | GET |

## Dashboards

| Page | Current JSON | Future Endpoint(s) | Method(s) |
|------|-------------|-------------------|-----------|
| Staff Dashboard | `ideas.json`, `notifications.json` | `/api/dashboard/staff` | GET |
| Team Dashboard | `ideas.json` | `/api/dashboard/innovation-team` | GET |
| Admin Dashboard | `users.json`, `activities.json` | `/api/dashboard/admin` | GET |

## API Proxy (Vite Dev Server)

The Vite config already includes a placeholder proxy:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

With this in place, all `/api/*` requests from the frontend will be forwarded to the ASP.NET Core backend at `http://localhost:5000` during development.
