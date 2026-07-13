# JSON Data Documentation

## `data/ideas.json`

**Purpose:** Stores all innovation ideas submitted by staff.

**Relationships:** Each idea references a `category` (matches `categories.json` name), `submitterName` (matches `users.json` name).

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `title` | string | Idea title |
| `submitterName` | string | Name of the submitter |
| `department` | string | Submitter's department |
| `category` | string | Innovation category |
| `executiveSummary` | string | Brief summary |
| `problemOrOpportunity` | string | Problem being solved |
| `proposedSolution` | string | Proposed solution |
| `strategicObjective` | string | Strategic alignment |
| `sdgContribution` | string | SDG alignment |
| `expectedBenefits` | string | Expected benefits |
| `implementationTimeline` | string | Timeline description |
| `potentialRisks` | string | Risk assessment |
| `dateSubmitted` | string (ISO date) | Submission date |
| `status` | string | Current status (Submitted, Under Review, Approved, Declined) |
| `stage` | string | Current stage (Submitted, Concept, Experimentation, Deployment, Closed) |
| `reviewDeadline` | string (ISO date) | SLA deadline |
| `attachments` | array | File attachments with `name` and `type` |
| `comments` | array | Comment objects: `id`, `author`, `authorRole`, `text`, `timestamp` |
| `timeline` | array | Timeline entries: `date`, `event`, `user`, `status` |
| `approvalWorkflow` | array | Workflow steps: `step`, `assignedTo`, `status`, `dateCompleted` |

**Example:**
```json
{
  "id": 1,
  "title": "Digital Currency Wallet",
  "submitterName": "Brian Ssempijja",
  "department": "Information Technology",
  "category": "FinTech",
  "status": "Under Review",
  "stage": "Concept"
}
```

**Future database table:** `Ideas`

---

## `data/users.json`

**Purpose:** Stores all system users.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `name` | string | Full name |
| `email` | string | Email address (used as login username) |
| `department` | string | Department |
| `role` | string | Role description (e.g. "Staff", "Innovation Manager", "IT Admin") |
| `accountStatus` | string | "Active" or "Locked" |
| `onlineStatus` | string | "Online" or "Offline" |
| `lastLogin` | string (ISO datetime) | Last login timestamp |
| `permissions` | array | Permission strings (e.g. ["Submit Ideas", "View Resources"]) |
| `avatar` | string | Initials for avatar display |

**Future database table:** `Users`

---

## `data/notifications.json`

**Purpose:** Stores notifications displayed in the notification center.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `type` | string | Category (status, comment, approval, info, warning, announcement) |
| `title` | string | Notification title |
| `message` | string | Notification body |
| `timestamp` | string (ISO datetime) | When the notification occurred |
| `read` | boolean | Whether the user has seen it |

**Future database table:** `Notifications`

---

## `data/resources.json`

**Purpose:** Stores resources displayed in the resources library.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `title` | string | Resource title |
| `description` | string | Brief description |
| `category` | string | Category (Innovation Guidelines, Templates, Policies, Training Materials) |
| `fileSize` | string | Human-readable file size |
| `uploadedDate` | string | Upload date |
| `fileUrl` | string | Path to the actual file |

**Future database table:** `Resources`

---

## `data/categories.json`

**Purpose:** Stores innovation categories used in idea submission and filtering.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `name` | string | Category name |
| `description` | string | Category description |
| `createdDate` | string (ISO date) | When the category was created |
| `status` | string | "Active" or "Inactive" |

**Future database table:** `Categories`

---

## `data/activities.json`

**Purpose:** Stores system-wide activity log entries.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `dateTime` | string (ISO datetime) | When the action occurred |
| `user` | string | User who performed the action |
| `action` | string | Description of the action |
| `module` | string | System module (Idea Review, Authentication, Permissions, etc.) |
| `ipAddress` | string | IP address of the user |
| `status` | string | "Success", "Failed", or "Blocked" |

**Future database table:** `ActivityLogs`

---

## Relationship Diagram

```
Users ──┐
         ├── submits ──▶ Ideas ──▶ has ──▶ Comments
         │                     │
         │                     ├── has ──▶ Timeline
         │                     │
         │                     └── has ──▶ ApprovalWorkflow
         │
         ├── receives ──▶ Notifications
         │
         └── performs ──▶ Activities

Categories ── referenced by ──▶ Ideas.category
Resources (standalone)
```
