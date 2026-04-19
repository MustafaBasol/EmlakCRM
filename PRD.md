# PRD.md
# Emlak CRM / Real Estate Management System
## Product Requirements Document (Phase 1 First)

## 1. Product Overview

This project is a **web-based real estate CRM and portfolio management system** for a brokerage office structure.

The target business model is:
- one broker / admin
- multiple field agents / consultants
- centralized portfolio management
- centralized customer tracking
- performance visibility
- secure role-based access

The product should be designed as a **reusable SaaS-like foundation**, even if the first deployment is for a single real estate office.

The first objective is to deliver a **usable MVP (Phase 1)**.  
Advanced field-verification and external communication flows belong to later phases.

---

## 2. Product Vision

The product supports a **transparent real estate operation** where:

- listings are centrally managed
- customers are tracked in one CRM
- agents work through a simple mobile-friendly interface
- managers can monitor activity and performance
- future operational modules (WhatsApp sharing, OTP showing verification, GPS validation) can be added cleanly

---

## 3. Product Goals

### Business Goals
- reduce operational chaos in portfolio and customer tracking
- centralize office knowledge
- increase accountability for agents
- enable measurable performance reporting
- create a system that can later be sold to other real estate offices

### Product Goals
- role-based multi-user system
- simple and fast listing and customer management
- strong auditability via activity logs
- manager-friendly dashboard
- mobile-friendly daily usage for field agents

---

## 4. Non-Goals for Phase 1

The following are **not required for initial MVP completion**:

- full WhatsApp Business API integration
- SMS provider integration
- OTP sending implementation
- automatic GPS proximity verification
- native mobile applications
- advanced PDF generation/export
- complex notification engine
- accounting / commission settlement system
- marketplace portal integrations

These may be prepared as future extension points only.

---

## 5. Target Users

### 5.1 Admin / Broker
Primary decision-maker and system owner.

Needs:
- see all listings
- see all customers
- track all agents
- monitor performance
- review recent actions
- assign work
- preserve control of sensitive data

### 5.2 Agent / Consultant
Field user who works on daily listings and customers.

Needs:
- fast access from mobile
- simple forms
- see only own data or assigned data
- update listings and customers quickly
- track own tasks
- report basic field activity

---

## 6. User Roles

### ADMIN
Can:
- manage users
- see all listings
- see all customers
- see all tasks
- see all activity logs
- view office-wide dashboard
- assign records
- access later export/report privileges

### AGENT
Can:
- log in securely
- view only own listings
- view only assigned customers
- view only own tasks
- create/update records based on permissions
- view own dashboard

Cannot:
- view all company-wide data
- manage users
- access admin-only reporting
- export sensitive bulk data

---

## 7. Core Product Scope by Phase

## Phase 1 (MVP)
Must include:

1. Authentication & role-based authorization
2. User management basics
3. Listing / portfolio management
4. Customer / CRM management
5. Task / reminder management
6. Activity logging
7. Admin and agent dashboard basics
8. Responsive UI for desktop + mobile browser usage

## Phase 2
Planned after MVP:
1. WhatsApp sharing module
2. map location assignment
3. advanced reporting
4. export permission workflows
5. basic showing workflow expansion

## Phase 3
Planned later:
1. OTP sending
2. GPS verification logic
3. digital showing confirmation flow
4. stronger field-operation controls
5. advanced notifications

---

## 8. Functional Requirements

## 8.1 Authentication & Access Control

### Requirements
- users can log in with email/username and password
- only authenticated users can access app routes
- role-based navigation must be visible
- backend authorization must enforce role limits
- session persistence should be supported

### Acceptance Criteria
- unauthenticated users are redirected to login
- agents cannot access admin-only pages
- admin can access all protected pages

---

## 8.2 User Management

### Requirements
- admin can create users
- each user has:
  - full name
  - email / username
  - role
  - active/inactive status
  - optional phone number
- admin can update user roles and status

### Acceptance Criteria
- admin can add an agent
- admin can deactivate a user
- deactivated users cannot log in

---

## 8.3 Listing / Portfolio Management

### Requirements
Each listing should support:

- title
- description
- property type
- price
- area size (m²)
- location text
- optional district / region
- optional parcel/island info
- listing status
- assigned agent
- photo records (initially basic image handling)
- timestamps
- created by / updated by

### Listing Status Examples
- DRAFT
- ACTIVE
- RESERVED
- SOLD
- ARCHIVED

### Functional Needs
- listing list view
- search by title or keyword
- filter by status / type / assigned agent
- create listing
- edit listing
- detail page
- mobile-friendly quick access

### Acceptance Criteria
- admin can see all listings
- agent can see only allowed listings
- listing can be created and edited without page-breaking issues
- filters return correct results

---

## 8.4 Customer / CRM Management

### Requirements
Each customer record should support:

- full name
- phone
- email (optional)
- customer category
- desired property type
- budget min/max
- target area / region
- notes
- assigned agent
- status
- timestamps

### Customer Status Examples
- NEW
- CONTACTED
- FOLLOW_UP
- VISIT_PLANNED
- NEGOTIATION
- CLOSED
- LOST

### Functional Needs
- customer list
- customer detail
- customer create/edit
- assignment to agent
- criteria/note storage
- basic search and filters

### Acceptance Criteria
- admin sees all customers
- agent sees only assigned customers
- admin can reassign customers
- required fields validate correctly

---

## 8.5 Task / Reminder Management

### Requirements
Tasks should support:
- title
- description
- due date
- assigned user
- priority
- status
- optional link to listing
- optional link to customer

### Task Status Examples
- TODO
- IN_PROGRESS
- DONE
- CANCELED

### Priority Examples
- LOW
- MEDIUM
- HIGH
- URGENT

### Functional Needs
- task creation
- task edit
- task assignment
- due date tracking
- task list filters
- “my tasks” view

### Acceptance Criteria
- admin can assign tasks to any agent
- agent can see own tasks
- due tasks appear in dashboard

---

## 8.6 Activity Logging

### Requirements
The system must automatically log important actions.

### Minimum Logged Events
- login
- user created/updated/deactivated
- listing created
- listing updated
- customer created
- customer updated
- task created
- task updated
- important status changes

### Log Structure
Each log entry should include:
- actor user id
- action key
- entity type
- entity id
- summary metadata
- timestamp

### Acceptance Criteria
- recent system activity appears for admin
- logs are queryable by time and type
- agent-sensitive boundaries are respected

---

## 8.7 Dashboard

### Admin Dashboard Must Show
- total listings
- active listings
- total customers
- new/follow-up customers
- open tasks
- recent activity
- simple per-agent counters (Phase 1 level)

### Agent Dashboard Must Show
- my listings
- my customers
- my open tasks
- upcoming tasks
- my recent actions

### Acceptance Criteria
- numbers match stored data
- admin and agent dashboards differ by role

---

## 8.8 Mobile-Friendly Usage

### Requirements
- responsive layout
- usable forms on phone screens
- readable tables/cards
- quick navigation for agents

### Acceptance Criteria
- key workflows work on mobile browser
- no blocked core workflow on typical phone widths

---

## 9. Future Functional Requirements (Not MVP)

These must be acknowledged in architecture but not fully built initially.

### 9.1 WhatsApp Sharing Module
- share listing summary
- include contact information
- support cleaner sales communication flow

### 9.2 Location Assignment
- assign coordinates to listing
- map view integration

### 9.3 Showing Workflow
- start showing process
- later connect with GPS validation
- later connect with OTP verification

### 9.4 Export Control
- restrict data export to admin
- future Excel/PDF export permissions

---

## 10. Data Model Requirements

The Phase 1 data model should at minimum support:

- User
- Listing
- ListingPhoto
- Customer
- Task
- ActivityLog

Optional but recommended:
- CustomerAssignment structure if needed
- ListingAssignment if separate from createdBy
- Showing (basic placeholder)
- Sale (basic placeholder)
- Region reference tables if useful later

---

## 11. Suggested Entity Definitions

## User
Fields:
- id
- fullName
- email
- passwordHash
- role
- phone
- isActive
- createdAt
- updatedAt

## Listing
Fields:
- id
- title
- description
- propertyType
- status
- price
- areaSize
- city
- district
- neighborhood
- addressText
- islandNo (ada)
- parcelNo
- latitude (optional, later used)
- longitude (optional, later used)
- assignedAgentId
- createdById
- updatedById
- createdAt
- updatedAt

## ListingPhoto
Fields:
- id
- listingId
- imageUrl
- sortOrder
- createdAt

## Customer
Fields:
- id
- fullName
- phone
- email
- category
- desiredPropertyType
- budgetMin
- budgetMax
- preferredCity
- preferredDistrict
- notes
- status
- assignedAgentId
- createdById
- updatedById
- createdAt
- updatedAt

## Task
Fields:
- id
- title
- description
- dueDate
- priority
- status
- assignedToId
- createdById
- listingId (nullable)
- customerId (nullable)
- createdAt
- updatedAt

## ActivityLog
Fields:
- id
- actorUserId
- actionType
- entityType
- entityId
- summary
- metadataJson
- createdAt

---

## 12. Security Requirements

- passwords must be securely hashed
- auth-protected routes only
- backend authorization checks mandatory
- no sensitive data should be accessible by client-side filtering only
- logs should not expose password or secure tokens
- inactive users cannot access system

---

## 13. UX Requirements

### Design Direction
- simple
- fast
- practical
- low-friction
- office-friendly
- field-friendly

### UI Principles
- avoid over-designed interface
- prioritize readability
- use clear forms
- keep action buttons obvious
- make lists filterable quickly
- provide mobile card/list layouts where needed

---

## 14. Technical Requirements

Preferred:
- Next.js + TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Zod validation

Other technical expectations:
- reusable components
- clean module structure
- service layer for critical actions
- server-side role checks
- migration discipline
- environment config clarity

---

## 15. Success Metrics for Phase 1

Phase 1 is successful if:

1. Admin can log in and manage system data
2. Agent can log in and work only within own scope
3. Listings can be created, edited, listed, filtered
4. Customers can be created, edited, assigned, tracked
5. Tasks can be managed
6. Activity logs are generated automatically
7. Dashboard shows meaningful operational summary
8. App is usable from both desktop and mobile browser

---

## 16. Out-of-Scope Clarifications

Not included in Phase 1 delivery unless explicitly requested:
- public property website
- customer-facing portal
- online payment system
- e-signature integration
- accounting/invoicing
- advanced AI matching engine
- advanced automation workflows
- multilingual interface unless later requested

---

## 17. Delivery Strategy

The correct build strategy is:

### Step 1
Foundation:
- app structure
- auth
- roles
- DB schema
- protected routes

### Step 2
Core modules:
- listings
- customers
- tasks
- logs

### Step 3
Operational UI:
- admin dashboard
- agent dashboard
- navigation
- filters
- responsive adjustments

### Step 4
Stabilization:
- validation
- seed/demo data
- bug fixing
- cleanup

---

## 18. Risks and Product Notes

### Main Risks
- scope creep
- building Phase 2/3 too early
- weak authorization
- messy data model
- oversized forms and slow UX

### Mitigation
- protect MVP scope
- build module by module
- keep extension points clean
- implement strict role checks
- prefer simple stable solutions first

---

## 19. Final Product Principle

This is not a generic admin dashboard.

It is a **real estate office operating system foundation**.

Build it in a way that:
- solves the first client’s real problem
- remains extendable for later clients
- supports future field verification modules
- stays simple enough for daily real-world use
