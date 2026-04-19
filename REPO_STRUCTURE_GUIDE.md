# REPO_STRUCTURE_GUIDE.md
# Emlak CRM / Real Estate Management System
## Recommended Repository Structure

This document defines the recommended repository structure for the project.
The goal is to keep the codebase modular, readable, and safe for phased implementation.

If the repository already contains a valid structure, adapt intelligently instead of rewriting everything unnecessarily.

---

## 1. Recommended Top-Level Structure

```text
/
├─ app/
├─ components/
├─ lib/
├─ prisma/
├─ public/
├─ styles/
├─ docs/
├─ scripts/
├─ types/
├─ middleware.ts
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ README.md
├─ AGENT_MASTER_PLAN.md
├─ AGENT_START_PROMPT.md
├─ PRD.md
├─ DATABASE_SCHEMA_DRAFT.md
├─ SPRINT_PLAN.md
└─ IMPLEMENTATION_CHECKLIST.md
```

---

## 2. App Directory Structure (Next.js App Router)

```text
app/
├─ (auth)/
│  ├─ login/
│  │  └─ page.tsx
│  └─ layout.tsx
│
├─ (dashboard)/
│  ├─ layout.tsx
│  ├─ page.tsx
│  │
│  ├─ listings/
│  │  ├─ page.tsx
│  │  ├─ new/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ edit/
│  │        └─ page.tsx
│  │
│  ├─ customers/
│  │  ├─ page.tsx
│  │  ├─ new/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ edit/
│  │        └─ page.tsx
│  │
│  ├─ tasks/
│  │  ├─ page.tsx
│  │  ├─ new/
│  │  │  └─ page.tsx
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ edit/
│  │        └─ page.tsx
│  │
│  ├─ activity/
│  │  └─ page.tsx
│  │
│  ├─ users/
│  │  └─ page.tsx
│  │
│  └─ settings/
│     └─ page.tsx
│
├─ api/
│  ├─ auth/
│  ├─ listings/
│  ├─ customers/
│  ├─ tasks/
│  ├─ activity/
│  └─ users/
│
├─ globals.css
├─ layout.tsx
└─ page.tsx
```

---

## 3. Components Structure

```text
components/
├─ ui/
├─ layout/
├─ auth/
├─ listings/
├─ customers/
├─ tasks/
├─ dashboard/
├─ activity/
└─ shared/
```

### Suggested Component Breakdown

## components/ui/
Generic reusable UI components:
- button
- input
- select
- textarea
- dialog
- table
- badge
- card
- tabs
- dropdown
- sheet / drawer
- toast

## components/layout/
App layout components:
- sidebar
- mobile-nav
- topbar
- breadcrumb
- page-header
- role-aware navigation

## components/auth/
- login form
- auth wrappers
- session status elements

## components/listings/
- listing form
- listing filters
- listing table
- listing card
- listing detail sections
- listing status badge

## components/customers/
- customer form
- customer filters
- customer table
- customer card
- customer detail sections
- customer status badge

## components/tasks/
- task form
- task filters
- task list
- task card
- due-date indicators
- priority badge

## components/dashboard/
- metric cards
- recent activity widget
- open tasks widget
- per-agent summary cards

## components/activity/
- activity list
- activity item
- action labels

## components/shared/
- empty state
- loading state
- error state
- confirm dialog
- search input
- pagination shell (optional later)

---

## 4. Lib Structure

```text
lib/
├─ auth/
├─ db/
├─ permissions/
├─ validations/
├─ services/
├─ queries/
├─ utils/
└─ constants/
```

### Suggested Purpose

## lib/auth/
- auth config
- session helpers
- current user helpers

## lib/db/
- prisma client
- DB helper wrappers

## lib/permissions/
- role checks
- access policies
- guard helper functions

## lib/validations/
Zod schemas for:
- login
- user
- listing
- customer
- task

## lib/services/
Business logic:
- listing service
- customer service
- task service
- activity log service
- dashboard service

## lib/queries/
Read-oriented logic:
- dashboard aggregates
- filtered list queries
- admin/agent scoped queries

## lib/utils/
- date helpers
- formatting
- classnames
- parsing helpers

## lib/constants/
- enums mapping helpers
- navigation items
- dashboard labels

---

## 5. Prisma Structure

```text
prisma/
├─ schema.prisma
├─ migrations/
└─ seed.ts
```

### Notes
- Keep schema aligned with DATABASE_SCHEMA_DRAFT.md
- Use small migrations
- Seed demo users and records early

---

## 6. Types Structure

```text
types/
├─ auth.ts
├─ listing.ts
├─ customer.ts
├─ task.ts
├─ activity.ts
└─ dashboard.ts
```

### Notes
- use shared type definitions for DTOs/view models where useful
- do not duplicate Prisma types unnecessarily
- prefer derived types when possible

---

## 7. Scripts Structure

```text
scripts/
├─ seed-demo.ts
├─ reset-demo.ts
└─ health-check.ts
```

Optional, but useful for:
- demo prep
- local testing
- environment validation

---

## 8. Docs Structure

```text
docs/
├─ architecture.md
├─ auth-rules.md
├─ module-notes.md
└─ deployment-notes.md
```

Do not over-document early, but add focused docs if implementation becomes large.

---

## 9. Route Protection Recommendation

Recommended pattern:
- protect dashboard routes in middleware and/or server layout checks
- perform strict role checks inside server actions / route handlers / services
- never rely only on hidden buttons in UI

---

## 10. Data Access Pattern Recommendation

Prefer:
- forms/actions -> service layer -> DB
- dashboard/widgets -> query layer -> DB

This keeps write logic and read logic cleaner.

Example:
- `lib/services/listings/create-listing.ts`
- `lib/queries/dashboard/get-admin-dashboard.ts`

---

## 11. Suggested Service-Level Files

```text
lib/services/
├─ users/
│  ├─ create-user.ts
│  ├─ update-user.ts
│  └─ deactivate-user.ts
├─ listings/
│  ├─ create-listing.ts
│  ├─ update-listing.ts
│  └─ assign-listing.ts
├─ customers/
│  ├─ create-customer.ts
│  ├─ update-customer.ts
│  └─ assign-customer.ts
├─ tasks/
│  ├─ create-task.ts
│  ├─ update-task.ts
│  └─ change-task-status.ts
└─ activity/
   └─ log-activity.ts
```

---

## 12. Suggested Query-Level Files

```text
lib/queries/
├─ dashboard/
│  ├─ get-admin-dashboard.ts
│  └─ get-agent-dashboard.ts
├─ listings/
│  ├─ get-listings.ts
│  └─ get-listing-by-id.ts
├─ customers/
│  ├─ get-customers.ts
│  └─ get-customer-by-id.ts
├─ tasks/
│  ├─ get-tasks.ts
│  └─ get-task-by-id.ts
└─ activity/
   └─ get-recent-activity.ts
```

---

## 13. Recommended MVP Navigation

Admin:
- Dashboard
- Listings
- Customers
- Tasks
- Activity
- Users

Agent:
- Dashboard
- My Listings
- My Customers
- My Tasks

Keep navigation minimal and practical.

---

## 14. Naming Principles

- Use English names in code
- Use explicit names
- Avoid abbreviations unless standard
- Prefer `assignedAgentId` over unclear variants
- Prefer `activityLogs` over short ambiguous names

---

## 15. Final Recommendation

If the repository starts empty, build using this structure.
If the repository already exists, align to this structure gradually without destructive rewrites.

The goal is:
- easy agent collaboration
- clean module ownership
- scalable Phase 1 foundation
- low-friction Phase 2 expansion
