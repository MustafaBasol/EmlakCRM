# AGENT_BOOTSTRAP_COMMAND.md
# Single-Prompt Bootstrap Command for the Agent

Use the following message as the **first working instruction** for the agent after the repository is opened.

---

## Copy/Paste Command

Read these files first and follow them in order of priority:

1. `AGENT_MASTER_PLAN.md`
2. `AGENT_START_PROMPT.md`
3. `PRD.md`
4. `DATABASE_SCHEMA_DRAFT.md`
5. `SPRINT_PLAN.md`
6. `IMPLEMENTATION_CHECKLIST.md`
7. `REPO_STRUCTURE_GUIDE.md`

Then do the following in order:

### Phase A — Inspect and plan
- Inspect the repository structure, dependencies, and current stack
- Determine whether the repo already contains usable foundations for Next.js, Prisma, auth, and UI
- Summarize the current state in a concise implementation note
- State what will be kept, what will be added, and what the first milestone will contain

### Phase B — Establish the foundation
- Create or align the project structure according to `REPO_STRUCTURE_GUIDE.md`
- Set up or verify environment/config files
- Set up PostgreSQL + Prisma foundation
- Align the schema with `DATABASE_SCHEMA_DRAFT.md`
- Create seed-ready user roles and initial models

### Phase C — Build the MVP in the correct order
Implement only Phase 1 / MVP first, in this order:
1. authentication and role-based authorization
2. protected layout and role-based navigation
3. listings module
4. customers / CRM module
5. tasks module
6. activity logging
7. admin and agent dashboards
8. seed/demo readiness
9. responsive UX cleanup

### Phase D — Quality rules
- Enforce authorization on the backend
- Use clean TypeScript
- Use modular folders/services/queries
- Keep the app runnable after each milestone
- Do not start OTP, WhatsApp API, SMS, GPS verification, advanced exports, or native mobile app yet

### Phase E — Expected output
Work incrementally and after each major milestone provide:
- what was completed
- what files were added/changed
- what remains next
- any blockers or assumptions

Your first practical objective is:

> Deliver a stable Phase 1 foundation with working authentication, admin/agent roles, listings CRUD, customers CRUD, tasks CRUD, activity logs, and a simple role-based dashboard.

If the repository is empty or incomplete, create the missing foundation cleanly instead of waiting.

---

## Shorter Version

Read the project docs first, then inspect the repo, then implement the Phase 1 MVP in this order: auth → roles → protected layout → listings → customers → tasks → activity logs → dashboard → demo data. Keep code modular, enforce backend permissions, and do not build OTP/WhatsApp/GPS features yet.
