# Feature Documentation

| # | Feature | Page(s) | Status | JSON Source | Future API |
|---|---------|---------|--------|-------------|------------|
| 1 | Login / Authentication | `index.html` | Mock (any password) | `users.json` | `POST /api/auth/login` |
| 2 | Role-based dashboard | 3 dashboards | Working | `ideas.json`, `users.json`, `activities.json` | `GET /api/dashboard/{role}` |
| 3 | Submit idea (multi-step) | `submit-idea.html` | Working | localStorage | `POST /api/ideas` |
| 4 | Individual/team toggle | `submit-idea.html` | Working | — | `POST /api/ideas` |
| 5 | Save draft | `submit-idea.html` | Working | localStorage | — |
| 6 | My Ideas table | `my-ideas.html` | Working | `ideas.json` + localStorage | `GET /api/ideas/mine` |
| 7 | Idea search | `my-ideas.html`, `submitted-ideas.html` | Working | — | — |
| 8 | Idea sorting | `my-ideas.html` | Working | — | — |
| 9 | Idea filtering | `my-ideas.html`, `submitted-ideas.html` | Working | — | — |
| 10 | Pagination | `my-ideas.html` | Working | — | — |
| 11 | Idea details view | `idea-details.html` | Working | `ideas.json` | `GET /api/ideas/{id}` |
| 12 | Comments thread | `idea-details.html`, `review-idea.html` | Working | `ideas.json` (embedded) | `GET/POST /api/ideas/{id}/comments` |
| 13 | Progress tracker | `idea-details.html` | Working | `ideas.json` (stage field) | — |
| 14 | Timeline | `idea-details.html` | Working | `ideas.json` (timeline array) | `GET /api/ideas/{id}/timeline` |
| 15 | Notification center | `notifications.html` | Working | `notifications.json` | `GET /api/notifications` |
| 16 | Mark notification as read | `notifications.html` | Working | — | `PUT /api/notifications/{id}/read` |
| 17 | Resources library | `resources.html` | Working | `resources.json` | `GET /api/resources` |
| 18 | Resource search | `resources.html` | Working | — | — |
| 19 | Review idea workflow | `review-idea.html` | Working | `ideas.json` | `PUT /api/ideas/{id}/review` |
| 20 | Stage/status change | `review-idea.html` | Working | — | `PUT /api/ideas/{id}` |
| 21 | Approval workflow | `review-idea.html` | Working | `ideas.json` (embedded) | `GET /api/ideas/{id}/workflow` |
| 22 | Category management (CRUD) | `categories.html` | Working | `categories.json` | `GET/POST/PUT/DELETE /api/categories` |
| 23 | Reports with filters | `reports.html` | Working | `ideas.json` | `GET /api/reports/ideas` |
| 24 | Export buttons | `reports.html` | Placeholder | — | `GET /api/reports/export` |
| 25 | Chart placeholders | `reports.html` | Placeholder | — | — |
| 26 | User management | `users.html` | Working | `users.json` | `GET/POST/PUT/DELETE /api/users` |
| 27 | Lock/unlock account | `users.html` | Working | `users.json` | `PUT /api/users/{id}/status` |
| 28 | Reset password | `users.html` | Placeholder | — | `POST /api/users/{id}/reset-password` |
| 29 | Permissions management | `permissions.html` | Working | `users.json` | `PUT /api/users/{id}/permissions` |
| 30 | Activity log | `activity-log.html` | Working | `activities.json` | `GET /api/activities` |
| 31 | Forgot password | `forgot-password.html` | Placeholder | — | `POST /api/auth/forgot-password` |
| 32 | Change password | `change-password.html` | Working | — | `POST /api/auth/change-password` |
| 33 | Password toggle (show/hide) | `index.html` | Working | — | — |
| 34 | Remember me | `index.html` | Placeholder | — | — |
| 35 | Session timeout | All internal pages | Working | — | — |
| 36 | Breadcrumb navigation | All internal pages | Working | — | — |
| 37 | Logout with confirmation | All internal pages | Working | — | `POST /api/auth/logout` |
| 38 | Toast notifications | All pages | Working | — | — |
| 39 | Modal dialogs | Various pages | Working | — | — |
| 40 | Search (debounced) | Various pages | Working | — | — |
| 41 | Column sorting | Various pages | Working | — | — |
| 42 | Multi-key filtering | Various pages | Working | — | — |

**Summary:** 42 features identified. 37 working. 5 placeholders.
