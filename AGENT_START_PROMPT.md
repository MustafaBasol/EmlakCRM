# AGENT_START_PROMPT.md

You are the implementation agent for the **Emlak CRM / Real Estate Management System** project.

Your first priority is to **read and follow**:
- `AGENT_MASTER_PLAN.md`

Do not skip that file. Treat it as the source of truth for:
- product scope
- module order
- architecture decisions
- authorization rules
- MVP boundaries
- sprint priorities

---

## Core Mission

Build the project in a way that is:
- production-oriented
- modular
- readable
- easy to extend
- safe for multi-user role-based access
- optimized for **Phase 1 / MVP first**

Do **not** try to build every advanced feature at once.

The correct approach is:

1. Establish the project foundation
2. Build authentication and role system
3. Build Phase 1 core modules
4. Stabilize data model and dashboard basics
5. Leave Phase 2 and Phase 3 features behind clean interfaces/placeholders where useful

---

## Non-Negotiable Working Rules

### 1) Follow the master plan
If there is any ambiguity, prefer the rules in `AGENT_MASTER_PLAN.md`.

### 2) Phase 1 first
Focus only on the core MVP unless explicitly instructed otherwise.

### 3) Keep modules separated
Use a clean structure for:
- auth
- users
- listings / portfolios
- customers / CRM
- activity logs
- tasks / reminders
- dashboard / reporting

### 4) Build safely
Enforce authorization at backend level, not only in UI.

### 5) Avoid fake completeness
If a feature is not fully ready, create a clean TODO boundary instead of unstable implementation.

### 6) Keep the project runnable
At each meaningful milestone, the project should still run locally.

---

## Recommended Stack Direction

Unless the repository already dictates otherwise, use this direction:

- **Frontend:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS + component-based design
- **Backend:** Next.js server routes / server actions
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** NextAuth/Auth.js or equivalent credentials-based auth
- **Validation:** Zod
- **State/Form Handling:** React Hook Form where useful

If the repo already has a different but sensible stack, do not rewrite everything. Respect the existing direction and implement consistently.

---

## Initial Execution Order

### Step 1 — Inspect the repository
First inspect and summarize:
- current folder structure
- existing stack
- existing dependencies
- whether auth already exists
- whether database schema already exists
- whether UI foundation already exists

Then decide whether to:
- continue from current base
- or create the missing foundation

### Step 2 — Create/update core documentation if missing
If not already present, create/update:
- `README.md`
- `.env.example`
- `docs/architecture.md` (optional if useful)

But do not waste time over-documenting before implementation.

### Step 3 — Establish the base architecture
Ensure the codebase has clear folders/modules for:
- authentication
- authorization
- listings
- customers
- activity logs
- tasks
- dashboard

### Step 4 — Implement authentication and authorization first
Minimum roles:
- `ADMIN`
- `AGENT`

Requirements:
- secure login flow
- protected routes
- role-based navigation
- backend permission checks

### Step 5 — Implement Phase 1 data model
Prioritize entities defined in the master plan:
- User
- Listing
- ListingPhoto
- Customer
- CustomerPreference (if separated)
- Assignment relations where needed
- ActivityLog
- Task
- Showing (basic structure)
- Sale (basic structure if needed for reporting)

### Step 6 — Build Phase 1 user flows
Priority order:
1. Login
2. Dashboard shell
3. Listing list + create + detail + edit
4. Customer list + create + detail + edit
5. Assignment logic
6. Activity logging
7. Tasks/reminders
8. Basic reporting widgets

### Step 7 — Add seed/demo data if helpful
If useful for development/demo, provide a safe seed script.

---

## Phase 1 Delivery Target

The first real usable milestone should include:

### Authentication / Authorization
- login page
- protected application area
- admin and agent roles
- permission enforcement

### Listings
- listing table/list page
- create listing form
- edit listing form
- listing detail page
- status field
- basic search/filter

### Customers / CRM
- customer table/list page
- create customer form
- edit customer form
- customer detail page
- assigned agent logic
- notes / criteria fields

### Activity Logs
- auto-log important actions such as:
  - login
  - listing create/update
  - customer create/update
  - task create/update

### Tasks
- create task
- assign task
- due date
- status
- task list view

### Dashboard
For Admin:
- total listings
- total customers
- tasks due
- recent activity
- simple performance counters

For Agent:
- my listings
- my customers
- my tasks
- my recent actions

---

## Authorization Rules

### ADMIN
Can:
- see all listings
- see all customers
- see all tasks
- see all activity logs
- manage users
- access dashboard-wide reports
- export-related actions later

### AGENT
Can:
- see only own listings
- see only assigned customers
- see only own tasks
- create/update allowed records within assignment boundaries
- not access global admin data

All role checks must exist in server-side logic.

---

## Activity Logging Rules

Log at least:
- user login
- listing created
- listing updated
- customer created
- customer updated
- task created
- task updated
- important status changes

Each log should store:
- actor user
- action type
- entity type
- entity id
- timestamp
- optional metadata summary

---

## UI / UX Rules

The UI should be:
- fast
- clean
- mobile-friendly
- simple for field agents

Avoid visual complexity.
Prioritize:
- quick forms
- readable tables
- obvious actions
- clear role-based menus

---

## What NOT to build first

Do **not** start with:
- OTP integration
- WhatsApp API integration
- SMS providers
- GPS verification engine
- complex analytics
- PDF export workflows
- advanced notification infrastructure
- native mobile app

These come later.

You may leave extension points/placeholders for them.

---

## Code Quality Rules

- Use TypeScript strictly where possible
- Keep functions focused
- Avoid oversized files
- Use shared validation schemas
- Use reusable form components
- Prefer explicit naming
- Add comments only where they truly help
- Avoid dead code and speculative abstractions

---

## Database / Migration Discipline

- Keep Prisma schema clean
- Name models and enums clearly
- Generate migrations intentionally
- Avoid unnecessary schema churn
- If a field is uncertain, choose the simplest Phase 1-compatible version

---

## Expected First Output From Agent

Before writing large amounts of code, produce a concise implementation note in the repo or PR description covering:

1. What exists already
2. What will be kept
3. What will be created first
4. What Phase 1 milestone will contain

Then begin implementation.

---

## First Coding Objective

Your first coding objective is:

> Deliver the Phase 1 foundation with working authentication, role-based access, listing management, customer management, task management, activity logs, and a simple dashboard.

If something is missing in the repo, create it cleanly.
If something already exists, integrate with it instead of rebuilding unnecessarily.

---

## Output Discipline

Work incrementally.
After each significant milestone, ensure:
- app builds
- routes load
- auth works
- database is consistent

Do not pursue breadth before stability.

---

## If You Need a Practical Starting Sequence

Use this exact sequence:

1. Inspect repo and summarize current state
2. Set up or validate environment/config
3. Set up database + Prisma
4. Implement auth + roles
5. Implement protected layout/navigation
6. Implement listings module
7. Implement customers module
8. Implement tasks module
9. Implement activity log service
10. Implement dashboard widgets
11. Clean up UX and validation
12. Prepare demo-ready seed data

That is the correct start order.

---

## Final Reminder

This project should be built like a reusable vertical SaaS foundation for a real estate office, not like a quick disposable admin panel.

Start with a stable Phase 1.
