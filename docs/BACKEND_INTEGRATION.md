# Backend Microservices Integration Plan

The Bank of Uganda Innovation Management System (IMTS) frontend is engineered to integrate cleanly with a modern, decoupled microservices backend architecture through an API Gateway.

## Architecture Topology

```
┌──────────────────────────────────────────────────┐
│              Vite Frontend Server                │
└────────────────────────┬─────────────────────────┘
                         │
                         ▼ (Single URI Route: /api/*)
┌──────────────────────────────────────────────────┐
│                 API Gateway                      │
│               (Reverse Proxy)                    │
└────────────────────────┬─────────────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth Service │  │ Idea Service │  │ Report Serv. │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Backend Services Overview

### 1. API Gateway (The Entry Point)
- **Role**: Serves as the single public exposure endpoint.
- **Responsibilities**: Route aggregation, rate limiting, request validation, and SSL termination.
- **Microservices Routing**:
  - `/api/auth/*` → Redirects to Auth Service.
  - `/api/ideas/*` → Redirects to Ideas Service.
  - `/api/categories/*` → Redirects to Core Settings Service.
  - `/api/activities/*` → Redirects to Audit Service.

### 2. Authentication & Directory Service
- **Role**: Enterprise identity control.
- **Responsibilities**:
  - Direct integration with **Microsoft Active Directory (AD)**.
  - Generates secure cryptographic **JWT Tokens**.
  - Encapsulates role mapping (`staff`, `innovation-team`, `admin`).

### 3. Innovation Service
- **Role**: Idea state management and content storage.
- **Responsibilities**:
  - CRUD on proposals.
  - High-performance, isolated binary attachment file uploads (e.g. S3 or local BLOB storage).
  - Keeps track of comments, alignment metrics, and timeline state changes.

### 4. Workflow Service
- **Role**: Orchestrates stage transitions and approval actions.
- **Responsibilities**:
  - Implements state transition flow checks (e.g. ensuring an idea can only move to "Concept Development" after an Initial Review).
  - Triggers task queues and counts review SLAs.

### 5. Reporting Service
- **Role**: Analytics and business reports generator.
- **Responsibilities**:
  - Compiles filtered exports (CSV, PDF, Excel).
  - Populates charts and dashboards data.

---

## Security Integration Flow (JWT Authentication)

1. The user logs in on `index.html`.
2. The UI sends a payload with the username and password to `/api/auth/login`.
3. The API Gateway forwards this to the Auth Service, which validates credentials against Active Directory.
4. If successful, the Auth Service responds with user details and a secure **JSON Web Token (JWT)**.
5. The frontend saves this details object and JWT token inside `localStorage` under `bou_current_user`.
6. For all subsequent fetches, the frontend extracts the JWT token from `localStorage` and appends it to the headers:
   `Authorization: Bearer <TOKEN>`
7. The API Gateway decrypts and verifies the token signatures before proxying to the back-end microservices.
