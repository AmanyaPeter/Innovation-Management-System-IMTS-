Frontend Implementation Roadmap (Phase 6+)
Context
You are working on an existing Bank of Uganda Innovation Management System frontend.
The UI has already been designed.
Your job is not to redesign the application.
Do not modify layouts, colors, spacing, typography, navigation structure, or CSS unless absolutely
necessary.
Instead, implement the missing frontend functionality while preparing the application for future backend
integration.
Use:
HTML
CSS
Vanilla JavaScript (ES6 Modules)
JSON mock data
localStorage only where temporary state is required
Keep the code modular and maintainable.
The frontend must eventually allow replacing JSON files with REST API calls without requiring changes to the
UI layer.
Before Every Phase
Before starting any phase:
Inspect the current project.
Determine whether the previous phase has already been completed.
If completed:
Continue to the next phase.
If incomplete:
Finish the missing work.
•
•
•
•
•
1.
2.
3.
4.
5.
6.
1
Refactor where necessary.
Continue only after verification.
At the beginning of every phase provide:
✔ Completed
⚠ Missing
 Fixed during this phase
Phase 6 — Search Functionality
Verify
Check whether:
Search inputs exist.
Search events are wired.
Tables update dynamically.
Search is not hardcoded.
If missing, implement them.
Implement
Create reusable search functionality.
Requirements:
Live search while typing
Case insensitive
Search multiple fields
Debounce typing
No page refresh
Support:
Ideas
Users
Notifications
Resources
Categories
Create:
7.
8.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
2
utils/search.js
The search utility should be reusable by every page.
Phase 7 — Sorting
Verify
Check whether sorting exists.
Verify:
Column sorting
Ascending
Descending
Date sorting
Alphabetical sorting
If not, implement.
Implement
Create reusable sorting utility.
utils/sort.js
Support:
Ideas
Title
Date
Status
Stage
Users
Name
Department
Role
•
•
•
•
•
•
•
•
•
•
•
•
3
Resources
Name
Category
Reports
Date
Department
Clicking a table header should toggle:
Ascending
↓
Descending
↓
Default
Phase 8 — Filtering
Verify
Check:
Filter dropdowns
Multiple filters
Combined filtering
If incomplete:
Finish them.
Implement
Create:
utils/filter.js
•
•
•
•
•
•
•
4
Support:
Ideas
Status
Stage
Department
Category
Date
Users
Department
Role
Status
Resources
Category
Filters must work together.
Example:
Department = ICT
AND
Status = Approved
AND
Category = Technology
Phase 9 — Pagination
Verify
Determine whether tables already support pagination.
If not:
Implement.
•
•
•
•
•
•
•
•
•
5
Requirements
Default:
10 rows
Controls:
Previous
Next
Page numbers
Display:
Showing 1–10 of 124
Pagination must integrate with:
Search
Sorting
Filtering
Create:
utils/pagination.js
Phase 10 — Dashboard Data Binding
Verify
Check for hardcoded numbers.
Remove them.
Implement
Read JSON data.
Calculate:
•
•
•
•
•
•
6
Staff Dashboard
Submitted
Approved
Under Review
Completed
Innovation Team Dashboard
Pending Reviews
Active Reviews
Closed Ideas
Admin Dashboard
Users
Locked Accounts
Activity
Populate:
Tables
Cards
Notifications
Phase 11 — Submit Idea Workflow
Verify
Check:
Validation
Save Draft
Submit
Cancel
Implement
Submission process.
Validate.
Create new object.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
7
Store temporarily.
Display toast.
Redirect.
Support:
Save Draft
↓
Resume Draft
↓
Submit
↓
Confirmation
Phase 12 — Individual vs Team Logic
Verify
Check whether selecting:
Individual
or
Team
changes the form.
If not:
Implement.
Requirements
8
Individual
Show:
Age
Gender
Rank
Station
Hide:
Team matrices.
Team
Show:
Team ranks
Team ages
Team genders
Team stations
Clear hidden values when switching.
Validate according to mode.
Phase 13 — My Ideas
Verify
Check:
View
Edit
Cancel
Retract
If placeholders exist:
Replace them.
•
•
•
•
•
•
•
•
9
Implement
Load logged-in user's ideas.
Filtering.
Searching.
Sorting.
Pagination.
Buttons.
View
↓
Idea Details
Edit
↓
Submission Form
Retract
↓
Confirmation
↓
Status update
Cancel
↓
Confirmation
↓
Status update
10
Phase 14 — Idea Details
Verify
Check URL parameter loading.
If missing:
Implement.
Display:
Title
Description
Problem
Solution
Attachments
Timeline
Status
Comments
History
Allow comments.
Update timeline.
Phase 15 — Innovation Team Review
Verify
Check:
11
Status update.
Stage update.
Comments.
If incomplete:
Finish.
Implement
Review workspace.
Support:
Approve
Reject
Request Information
Move Stage
Notify Submitter
Update history.
Phase 16 — Resources Library
Verify
Check:
Cards.
Downloads.
Search.
Filtering.
12
Implement
Read resources.json.
Display cards.
Support:
Search
Download
Preview
Category filter
Phase 17 — Notifications
Verify
Check:
Read/unread.
Links.
Filters.
Implement
Notification center.
Support:
Mark Read
Mark All Read
Filter
Open Related Page
13
Persist changes.
Phase 18 — User Management
Verify
Check:
Search.
CRUD.
Dialogs.
Implement
Users page.
Support:
Create
Edit
Lock
Unlock
Reset Password
Delete
Use reusable dialogs.
Phase 19 — Reports
Verify
Check:
14
Filtering.
Export.
Charts.
Implement
Generate reports.
Support exports:
CSV
Excel-compatible CSV
PDF placeholder
Display summaries.
Phase 20 — Authentication Simulation
Verify
Check whether authentication is already mocked.
If not:
Implement.
Requirements
users.json
Login
Role selection
Permissions
localStorage session
15
Redirect
Staff
↓
Staff Dashboard
Innovation Team
↓
Innovation Dashboard
Admin
↓
Admin Dashboard
Structure everything so replacing this with JWT authentication later requires minimal changes.
Final Verification Phase
Perform a complete audit.
Check every page.
Verify:
✔ Navigation works
✔ Buttons work
✔ Dialogs work
✔ Tables render correctly
✔ Search works
✔ Sorting works
✔ Filtering works
16
✔ Pagination works
✔ JSON loading works
✔ Forms validate
✔ No hardcoded demo data remains
✔ JavaScript is modular
✔ No duplicated logic exists
Finally, produce a report containing:
Completed functionality.
Remaining issues.
Suggested refactoring.
Backend API endpoints required for each page.
Recommended next steps for integrating the ASP.NET Core API Gateway and Authentication Service.
1.
2.
3.
4.
5.
17