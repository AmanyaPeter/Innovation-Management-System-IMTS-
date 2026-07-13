# What Works

## Fully Working

These features work end-to-end with real data flow:

- **Login flow** — role selection, authentication check (mock password), redirect to dashboard, session in localStorage
- **Role-based dashboards** — Staff, Innovation Team, and Admin dashboards each show relevant summary cards and tables populated from JSON
- **Submit Idea** — 4-step form with individual/team toggle, validation on step 1, draft save/load via localStorage
- **My Ideas table** — loads from service + localStorage, displays with search/sort/filter/pagination, action buttons wired
- **Idea Details** — loads idea by URL param, renders full details + comments + progress tracker + timeline + attachments
- **Notification Center** — loads from service, All/Unread/Read tabs, click to mark as read, time-ago formatting
- **Resources Library** — loads from service, renders as card grid, search + category filter
- **Submitted Ideas (Team)** — loads all ideas + localStorage, multi-filter (status/category/department/date), review links
- **Review Idea** — loads idea by URL param, status/stage dropdowns, comment submit, approval workflow renderer
- **Categories CRUD** — loads from service, add/edit/delete via modal, in-memory updates
- **Reports** — loads ideas, summary cards update with filtered data, detailed report table
- **Permissions** — loads users from service, search, edit permissions modal, activate/disable toggle
- **User Management** — loads users from service, search, lock/unlock/reset password
- **Activity Log** — loads activities from service, search, date filter, export toast
- **Forgot Password** — basic form with validation, toast feedback
- **Change Password** — form with password match validation, toast + redirect
- **Session timeout** — 30-min timer with 5-min warning bar, "Stay Signed In" extends session
- **Breadcrumb** — auto-generated from URL path, contextual for each page
- **Logout** — confirmation modal, clears auth state, redirects to login
- **Toast notifications** — success/error/warning/info types, auto-dismiss 3.5s
- **Modal dialogs** — confirm/info types, overlay click to close, button show/hide
- **Search** — debounced (200ms), case-insensitive, multi-field
- **Sort** — column click toggles asc/desc, arrow indicators, date/alphanumeric compare
- **Filter** — multi-key with `<select>` elements
- **Pagination** — 10 per page, prev/next, page numbers with ellipsis, "Showing X–Y of Z"
- **Stepper** — multi-step form navigation with active/completed states
- **Password show/hide toggle** — on login page
- **Notification bell** — redirects to notifications page
- **Sidebar active state** — highlights current page

## Partially Working

| Feature | What's Missing |
|---------|---------------|
| **Export buttons** (PDF, Excel, CSV) | Shows toast only — no actual file generation |
| **Charts/visualizations** | Static placeholder images in reports page |
| **Password reset email** | Shows toast only — no email backend |
| **Remember me** | Checkbox exists but no persistence logic |
| **File upload** | Click triggers file picker but no upload/save |
| **Create User** | Shows toast only — no form/modal |

## Placeholder

| Feature | Status |
|---------|--------|
| Chart visualizations | Static `<div>` placeholders |
| Export to PDF/Excel/CSV | Toast stub only |
| Password reset email | Toast stub only |
| File upload persistence | Upload area exists, no storage |
| Comment persistence | Comments render but new comments not saved to JSON |

## Missing (Not Implemented)

| Feature | Notes |
|---------|-------|
| Real password validation | Any non-empty password accepted |
| API backend | All data is static JSON |
| User registration | No self-registration flow |
| Email notifications | No SMTP integration |
| Audit trail backend | Activities are static JSON only |
| Multi-language support | English only |
| Dark mode | Not implemented |
