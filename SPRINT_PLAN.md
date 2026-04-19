# SPRINT_PLAN.md
# Emlak CRM / Real Estate Management System
## Sprint Plan (Phase 1 MVP)

This document gives the implementation order the agent should follow.
It is designed to reduce rework and keep the app demoable as early as possible.

---

## Sprint 0 — Project Setup & Discovery

### Goal
Understand the current repo and establish the base.

### Tasks
- inspect repository structure
- identify existing stack and dependencies
- verify whether auth already exists
- verify whether database setup already exists
- decide whether to continue existing structure or create clean foundation
- create/update README and .env.example if necessary
- confirm coding conventions

### Deliverable
A short implementation note describing:
- current state
- chosen architecture direction
- first build milestone

---

## Sprint 1 — Foundation, Auth, Roles

### Goal
Create a secure application shell.

### Tasks
- database connection setup
- Prisma schema initialization or cleanup
- user model and migrations
- seed initial admin and agent users
- login page
- session handling
- protected routes/layout
- role-based navigation
- backend authorization guards/checks

### Deliverable
Working login + role-based protected app shell

### Exit Criteria
- app runs
- admin can log in
- agent can log in
- unauthorized routes are blocked

---

## Sprint 2 — Listing Module

### Goal
Implement the main portfolio management flow.

### Tasks
- listing schema/model
- listing list page
- listing create form
- listing edit form
- listing detail page
- status/type filtering
- assignment to agent
- basic image field structure or photo model integration
- activity logging for listing actions

### Deliverable
Usable listings module

### Exit Criteria
- admin can create/edit listings
- agent can see only allowed listings
- filters work
- logs are generated

---

## Sprint 3 — Customer / CRM Module

### Goal
Implement customer tracking.

### Tasks
- customer schema/model
- customer list page
- customer create form
- customer edit form
- customer detail page
- assignment to agent
- status/category fields
- note fields
- activity logging for customer actions

### Deliverable
Usable CRM module

### Exit Criteria
- admin can manage all customers
- agent sees only assigned customers
- customer data validates properly
- logs are generated

---

## Sprint 4 — Task Module

### Goal
Implement reminders and internal work tracking.

### Tasks
- task schema/model
- task list page
- create/edit task
- task assignment
- due date filtering
- listing-linked task support
- customer-linked task support
- activity logging for task actions

### Deliverable
Task/reminder workflow

### Exit Criteria
- admin can assign tasks
- agent sees own tasks
- due dates and status filters work
- logs are generated

---

## Sprint 5 — Activity Logs & Audit Visibility

### Goal
Surface auditability in the product.

### Tasks
- central activity log service/helpers
- recent activity widgets
- admin activity page or section
- scoped recent activity view for agent where appropriate
- clear event formatting

### Deliverable
Traceable operational activity layer

### Exit Criteria
- key actions appear in logs
- admin can inspect recent actions
- dashboard can consume log data

---

## Sprint 6 — Dashboard MVP

### Goal
Provide useful overview panels.

### Tasks
- admin dashboard counters
- agent dashboard counters
- recent activity section
- open task section
- summary cards for listings/customers/tasks
- basic per-agent counters for admin

### Deliverable
Role-based operational dashboard

### Exit Criteria
- data matches DB state
- admin and agent dashboards differ correctly
- mobile layout remains usable

---

## Sprint 7 — UX Cleanup, Validation, Demo Readiness

### Goal
Prepare the MVP for real demo/testing.

### Tasks
- clean forms and validation messages
- improve mobile responsiveness
- improve navigation consistency
- empty states
- seed demo data
- smoke test all core flows
- fix obvious bugs
- update README with run instructions

### Deliverable
Demo-ready Phase 1 MVP

### Exit Criteria
- app stable enough for presentation
- core flows work end-to-end
- demo data available
- setup instructions clear

---

## Deferred Backlog (Do Not Build Early)

Only after Phase 1 is stable:
- WhatsApp sharing
- map integration
- GPS verification
- OTP flow
- export permissions
- advanced reporting
- advanced notifications

---

## Recommended Review Discipline

After every sprint:
- run app locally
- verify auth/permissions
- verify database consistency
- verify no broken navigation
- verify activity logs still work

---

## Demo Sequence Suggestion

When MVP is ready, demo in this order:
1. login as admin
2. show admin dashboard
3. create/edit listing
4. create/edit customer
5. assign customer/agent relation
6. create task
7. show recent activity
8. login as agent
9. show scoped visibility
