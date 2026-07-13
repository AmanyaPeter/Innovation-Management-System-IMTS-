# Screen Inventory and Page-by-Page Analysis

This document provides a thorough analysis of all 18 HTML pages that constitute the Bank of Uganda Innovation Management System (IMTS) prototype.

---

## 1. Login Page (`index.html`)
- **Purpose**: Authenticates users and redirects them to their respective role-based dashboard.
- **User Role**: Public / All Roles.
- **Main Features**: Email input field, password visibility toggle, role dropdown selector, mock authentication module.
- **Files Used**: `index.html`, `js/auth.js`, `js/app.js`, `services/userService.js`.
- **Status**: Complete (Client-side validation, role routing).

## 2. Forgot Password Page (`forgot-password.html`)
- **Purpose**: Initiates password recovery process.
- **User Role**: Public / All Roles.
- **Main Features**: Email address verification, validation patterns, feedback toast trigger.
- **Files Used**: `forgot-password.html`, `js/app.js`, `utils/toast.js`.
- **Status**: Complete.

## 3. Change Password Page (`change-password.html`)
- **Purpose**: Allows users to set a new password.
- **User Role**: Authenticated Users.
- **Main Features**: New password fields, match validation, password length constraints, redirect handler.
- **Files Used**: `change-password.html`, `js/app.js`, `utils/toast.js`.
- **Status**: Complete.

---

## Staff Pages (`/pages/staff/`)

## 4. Staff Dashboard (`dashboard.html`)
- **Purpose**: Summarizes active ideas, status, and alerts for the logged-in staff member.
- **User Role**: Staff.
- **Main Features**: Dynamic statistics cards, recent submissions table, direct notifications feed.
- **Files Used**: `pages/staff/dashboard.html`, `js/dashboards.js`, `services/ideaService.js`, `services/notificationService.js`, `utils/table.js`.
- **Status**: Complete.

## 5. Submit Idea (`submit-idea.html`)
- **Purpose**: Multi-step wizard for proposing new ideas individually or as a team.
- **User Role**: Staff.
- **Main Features**: 4-step stepper, progress bar, team composition matrices, auto-draft saving and loading.
- **Files Used**: `pages/staff/submit-idea.html`, `js/submit-idea.js`, `js/app.js`, `utils/toast.js`, `utils/modal.js`.
- **Status**: Complete (validation, draft, and submit workflow fully working).

## 6. My Ideas (`my-ideas.html`)
- **Purpose**: Lists all proposals submitted by the logged-in user.
- **User Role**: Staff.
- **Main Features**: Interactive table with column sorting, live searching, status filtering, pagination, retraction/cancellation modals.
- **Files Used**: `pages/staff/my-ideas.html`, `js/my-ideas.js`, `utils/table.js`, `utils/pagination.js`, `utils/sort.js`, `utils/filter.js`.
- **Status**: Complete.

## 7. Idea Details (`idea-details.html`)
- **Purpose**: Deep detail view of a single idea.
- **User Role**: Staff.
- **Main Features**: Progress stages tracker, historic audit timeline, download attachments list, persistent comment board.
- **Files Used**: `pages/staff/idea-details.html`, `js/idea-details.js`, `services/ideaService.js`.
- **Status**: Complete.

## 8. Notifications Center (`notifications.html`)
- **Purpose**: Notification center for alerts and updates.
- **User Role**: Staff.
- **Main Features**: "All", "Unread", "Read" tabs, mark-as-read toggles, relative time formatting (e.g. "3 days ago").
- **Files Used**: `pages/staff/notifications.html`, `js/notifications.js`, `services/notificationService.js`.
- **Status**: Complete.

## 9. Resources Library (`resources.html`)
- **Purpose**: Resource card deck with download attachments.
- **User Role**: Staff.
- **Main Features**: Card grid representation, category filtering, instant resource searching.
- **Files Used**: `pages/staff/resources.html`, `js/resources.js`, `services/resourceService.js`.
- **Status**: Complete.

---

## Innovation Team Pages (`/pages/innovation-team/`)

## 10. Innovation Team Dashboard (`dashboard.html`)
- **Purpose**: Dashboard with SLA tracking and queue counts.
- **User Role**: Innovation Team.
- **Main Features**: Summary counts of process stages, review queue due dates, SLA deadline tracking tables.
- **Files Used**: `pages/innovation-team/dashboard.html`, `js/dashboards.js`, `services/ideaService.js`.
- **Status**: Complete.

## 11. Submitted Ideas (`submitted-ideas.html`)
- **Purpose**: Master view of all ideas submitted across the system.
- **User Role**: Innovation Team.
- **Main Features**: Cross-department filter, search filters by submitter or title, direct links to review pages.
- **Files Used**: `pages/innovation-team/submitted-ideas.html`, `js/submitted-ideas.js`, `services/ideaService.js`.
- **Status**: Complete.

## 12. Review Idea (`review-idea.html`)
- **Purpose**: Administrative review and status advancement interface.
- **User Role**: Innovation Team.
- **Main Features**: Interactive drop-downs for Status and Stage, review deadline setting, persistent comments, approval workflow checklist.
- **Files Used**: `pages/innovation-team/review-idea.html`, `js/review-idea.js`, `services/ideaService.js`.
- **Status**: Complete.

## 13. Categories CRUD (`categories.html`)
- **Purpose**: Configuration management for innovation categories.
- **User Role**: Innovation Team.
- **Main Features**: Add/Edit/Delete modals, category table, instant category status active/inactive toggles.
- **Files Used**: `pages/innovation-team/categories.html`, `js/categories.js`, `services/categoryService.js`.
- **Status**: Complete (Fully persistent using local storage).

## 14. Reports and Analytics (`reports.html`)
- **Purpose**: Custom reports builder with filters.
- **User Role**: Innovation Team.
- **Main Features**: Department/Category/Status multi-select, date-range bounds, aggregate KPI card values.
- **Files Used**: `pages/innovation-team/reports.html`, `js/reports.js`, `services/ideaService.js`.
- **Status**: Complete.

## 15. User Permissions (`permissions.html`)
- **Purpose**: Granular permissions configuration console.
- **User Role**: Innovation Team.
- **Main Features**: Searchable list, permission edit modal with custom checkboxes, instant user activation/disable buttons.
- **Files Used**: `pages/innovation-team/permissions.html`, `js/permissions.js`, `services/userService.js`.
- **Status**: Complete (Fully persistent using local storage).

---

## Admin Pages (`/pages/admin/`)

## 16. Admin Dashboard (`dashboard.html`)
- **Purpose**: Administrative system dashboard.
- **User Role**: IT Administrator.
- **Main Features**: User account summary cards (Total, Active, Locked), real-time "Recent Activities" metric calculation, recent logins audit trail.
- **Files Used**: `pages/admin/dashboard.html`, `js/dashboards.js`, `services/userService.js`, `services/activityService.js`.
- **Status**: Complete.

## 17. User Management (`users.html`)
- **Purpose**: IT user account lock/unlock and password recovery administration.
- **User Role**: IT Administrator.
- **Main Features**: User list table, instant lock/unlock status toggles, administrative password reset dispatch.
- **Files Used**: `pages/admin/users.html`, `js/users.js`, `services/userService.js`.
- **Status**: Complete (Fully persistent using local storage).

## 18. Activity Log Audit (`activity-log.html`)
- **Purpose**: Master audit trail logs.
- **User Role**: IT Administrator.
- **Main Features**: Filter by module type, search logs, export CSV simulation.
- **Files Used**: `pages/admin/activity-log.html`, `js/activity-log.js`, `services/activityService.js`.
- **Status**: Complete.
