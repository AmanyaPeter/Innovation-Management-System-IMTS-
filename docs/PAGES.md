# Pages Documentation

## Root Pages (no sidebar)

### Login (`index.html`)

| Property | Value |
|----------|-------|
| **Actor** | All users (Staff, Innovation Team, Administrator) |
| **Purpose** | Authenticate users and redirect to role-specific dashboard |
| **Inputs** | Username/email, password, role selector |
| **Outputs** | Redirects to role dashboard on success |
| **Buttons** | Log in, Forgot password? link, Remember me checkbox |
| **Navigation** | → `forgot-password.html` |
| **Status** | Mock authentication. Any non-empty password accepted. Stores user in `localStorage` via `AuthSystem`. |
| **Future API** | `POST /api/auth/login` |

### Forgot Password (`forgot-password.html`)

| Property | Value |
|----------|-------|
| **Actor** | All users |
| **Purpose** | Request password reset email |
| **Inputs** | Email address |
| **Outputs** | Toast confirmation (no email sent) |
| **Buttons** | Send Reset Link, ← Back to Login |
| **Navigation** | → `index.html` |
| **Status** | Placeholder — shows toast only |
| **Future API** | `POST /api/auth/forgot-password` |

### Change Password (`change-password.html`)

| Property | Value |
|----------|-------|
| **Actor** | All authenticated users |
| **Purpose** | Change current password |
| **Inputs** | Current password, new password, confirm new password |
| **Outputs** | Toast confirmation + redirect to login |
| **Buttons** | Change Password, ← Back to Login |
| **Navigation** | → `index.html` |
| **Status** | Validates password match; no backend call |
| **Future API** | `POST /api/auth/change-password` |

---

## Staff Pages (`/pages/staff/`)

### Staff Dashboard (`dashboard.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | Landing page with summary of user's ideas and recent activity |
| **Inputs** | Loads ideas JSON, notifications JSON |
| **Outputs** | 4 summary cards (Total Submitted, Under Review, Approved, Completed), recent submissions table, recent notifications panel |
| **Buttons** | Quick Action → Submit Idea |
| **Navigation** | Sidebar: Dashboard, Submit Idea, My Ideas, Notifications, Resources, Profile |
| **Status** | Fully working. Cards populated from JSON via `dashboards.js`. |
| **Future API** | `GET /api/dashboard/staff`, `GET /api/ideas/mine`, `GET /api/notifications` |

### Submit Idea (`submit-idea.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | Multi-step form (4 steps) to submit an innovation idea |
| **Inputs** | Step 1: Individual/Team details. Step 2: Idea title, summary, description. Step 3: Strategic alignment, SDGs. Step 4: Benefits, risks, implementation timeline. |
| **Outputs** | Saved to `localStorage` (`bou_ideas`) + toast notification |
| **Buttons** | Next, Previous, Save Draft, Submit Idea |
| **Navigation** | Sidebar; Next/Prev stepper |
| **Status** | Fully working. Validates step 1 (individual/team fields). Draft saved to localStorage. |
| **Future API** | `POST /api/ideas` |

### My Ideas (`my-ideas.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | Table of user's submitted ideas with CRUD actions |
| **Inputs** | Loads ideas from service + localStorage |
| **Outputs** | Table with search, filter, sort, pagination. Action buttons per row. |
| **Buttons** | View → `idea-details.html`, Edit → `submit-idea.html`, Retract (confirm modal), Cancel (confirm modal) |
| **Navigation** | Sidebar |
| **Status** | Fully working. Uses `SearchSystem`, `SortSystem`, `FilterSystem`, `PaginationSystem`. |
| **Future API** | `GET /api/ideas/mine`, `PUT /api/ideas/{id}`, `DELETE /api/ideas/{id}` |

### Idea Details (`idea-details.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | View full details of a single idea |
| **Inputs** | Loads idea by `?id=` URL parameter |
| **Outputs** | Title, description, problem statement, solution, attachments, comments, progress tracker, timeline |
| **Buttons** | Comment submit, ← Back to My Ideas |
| **Navigation** | → from My Ideas |
| **Status** | Fully working. Reads `?id=` from URL. Renders comments, approval workflow, progress tracker with stages. |
| **Future API** | `GET /api/ideas/{id}`, `POST /api/ideas/{id}/comments` |

### Notifications (`notifications.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | View notification list with read/unread filtering |
| **Inputs** | Loads from NotificationService |
| **Outputs** | Notification items grouped by tabs (All/Unread/Read) |
| **Buttons** | Click notification to mark as read |
| **Navigation** | Sidebar |
| **Status** | Fully working. Tabs filter by read status. Click marks as read. Time-ago formatting. |
| **Future API** | `GET /api/notifications`, `PUT /api/notifications/{id}/read` |

### Resources (`resources.html`)

| Property | Value |
|----------|-------|
| **Actor** | Staff User |
| **Purpose** | Browse resources library |
| **Inputs** | Loads from ResourceService |
| **Outputs** | Card grid with title, description, upload date, file size |
| **Buttons** | View, Download (both show toast only) |
| **Navigation** | Sidebar |
| **Status** | Fully working. Cards populated from JSON. Search + category filter. |
| **Future API** | `GET /api/resources`, `GET /api/resources/{id}/download` |

---

## Innovation Team Pages (`/pages/innovation-team/`)

### Team Dashboard (`dashboard.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team (Manager, Officer) |
| **Purpose** | Overview of all submissions and review queue |
| **Inputs** | Loads ideas JSON |
| **Outputs** | 5 summary cards (Total Submitted, Pending Reviews, Concept Development, Experimentation, Deployment), recent submissions table, review queue, SLA deadlines |
| **Buttons** | Review Idea → `review-idea.html` |
| **Navigation** | Sidebar: Dashboard, Submitted Ideas, Categories, Resources, Reports, Permissions |
| **Status** | Fully working. Cards populated from JSON. |
| **Future API** | `GET /api/dashboard/innovation-team`, `GET /api/reviews/pending` |

### Submitted Ideas (`submitted-ideas.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team |
| **Purpose** | Browse all submitted ideas with filters |
| **Inputs** | Loads ideas from service + localStorage |
| **Outputs** | Table with search, status/category/department/date filters |
| **Buttons** | View Review → `review-idea.html?id=N` |
| **Navigation** | Sidebar |
| **Status** | Fully working. Multi-filter rendering. |
| **Future API** | `GET /api/ideas` |

### Review Idea (`review-idea.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team |
| **Purpose** | Review an idea: change status/stage, comment, approve/reject |
| **Inputs** | Loads idea by `?id=` URL parameter |
| **Outputs** | Full idea detail, comments, approval workflow, review controls |
| **Buttons** | Save Review, Notify Submitter, Submit Comment, ← Back to Submitted Ideas |
| **Navigation** | → from Submitted Ideas |
| **Status** | Fully working. Stage/status dropdowns, comment thread, workflow renderer. |
| **Future API** | `GET /api/ideas/{id}`, `PUT /api/ideas/{id}/review`, `POST /api/ideas/{id}/comments`, `POST /api/ideas/{id}/notify` |

### Categories (`categories.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team |
| **Purpose** | Manage innovation categories (CRUD) |
| **Inputs** | Loads from CategoryService |
| **Outputs** | Table with Name, Description, Created Date, Status, Actions |
| **Buttons** | Add Category, Edit, Delete (all via modal confirm) |
| **Navigation** | Sidebar |
| **Status** | Fully working. In-memory CRUD. Add/Edit/Delete via modal. |
| **Future API** | `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}` |

### Reports (`reports.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team |
| **Purpose** | Generate reports with filtered data |
| **Inputs** | Date range, department, category, status filters |
| **Outputs** | Summary cards (Total, Approved, Under Review, Declined), filtered data table |
| **Buttons** | Generate Report, Export PDF/Excel/CSV (toast only) |
| **Navigation** | Sidebar |
| **Status** | Fully working filters and stats. Chart placeholders (static). Export buttons show toast only. |
| **Future API** | `GET /api/reports/ideas`, `GET /api/reports/export?format=pdf` |

### Permissions (`permissions.html`)

| Property | Value |
|----------|-------|
| **Actor** | Innovation Team |
| **Purpose** | View and manage user permissions |
| **Inputs** | Loads from UserService |
| **Outputs** | Table with Name, Email, Department, Role, Permissions, Actions |
| **Buttons** | Edit Permissions (modal), Activate/Disable (modal confirm) |
| **Navigation** | Sidebar |
| **Status** | Fully working. User search. Activate/disable toggles in-memory. |
| **Future API** | `GET /api/users`, `PUT /api/users/{id}/permissions`, `PUT /api/users/{id}/status` |

---

## Admin Pages (`/pages/admin/`)

### Admin Dashboard (`dashboard.html`)

| Property | Value |
|----------|-------|
| **Actor** | IT Administrator |
| **Purpose** | System overview with user and activity stats |
| **Inputs** | Loads users JSON, activities JSON |
| **Outputs** | 4 cards (Total Users, Active, Locked, Recent Activities), last login activity table |
| **Buttons** | — |
| **Navigation** | Sidebar: Dashboard, Users, Activity Log, Profile |
| **Status** | Fully working. Cards and table populated from JSON. |
| **Future API** | `GET /api/dashboard/admin`, `GET /api/users`, `GET /api/activities` |

### User Management (`users.html`)

| Property | Value |
|----------|-------|
| **Actor** | IT Administrator |
| **Purpose** | Manage user accounts |
| **Inputs** | Loads from UserService |
| **Outputs** | Table with Name, Email, Department, Role, Status, Actions |
| **Buttons** | Create User (toast), Reset Password (modal), Lock/Unlock Account (modal) |
| **Navigation** | Sidebar |
| **Status** | Fully working. Search filters. Lock/unlock toggles in-memory. Reset sends toast. |
| **Future API** | `GET /api/users`, `POST /api/users`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`, `POST /api/users/{id}/reset-password` |

### Activity Log (`activity-log.html`)

| Property | Value |
|----------|-------|
| **Actor** | IT Administrator |
| **Purpose** | View system-wide activity log |
| **Inputs** | Loads from ActivityService |
| **Outputs** | Table with Date/Time, User, Action, Module, IP, Status |
| **Buttons** | Search, Date filter, Export CSV (toast) |
| **Navigation** | Sidebar |
| **Status** | Fully working. Search by user/action/module. Date filter. |
| **Future API** | `GET /api/activities`, `GET /api/activities/export?format=csv` |
