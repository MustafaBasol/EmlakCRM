# DESIGN_BRIEF.md
# Emlak CRM / Real Estate Management System
## Design Brief

This document defines the visual and UX direction of the project.
It should be used together with:
- `AGENT_MASTER_PLAN.md`
- `PRD.md`
- `REPO_STRUCTURE_GUIDE.md`

The product should not look like a random generic admin panel.
It should feel like a **professional, modern, practical real estate operations system**.

---

## 1. Design Objective

The system must visually communicate:

- trust
- clarity
- speed
- operational control
- professional real estate office discipline

The UI should be modern, but not flashy.
It should feel more like a **serious business SaaS product** than a trendy startup landing page.

---

## 2. Core Design Principles

### 2.1 Simple before decorative
The interface must prioritize:
- readability
- fast action-taking
- low cognitive load
- predictable navigation

Do not overload screens with unnecessary visual decoration.

### 2.2 Practical for daily office use
This is a system people may use many times per day.
The design should support:
- quick scanning
- fast form entry
- efficient list navigation
- quick filtering
- easy task follow-up

### 2.3 Mobile-friendly for field agents
Agents may use the system from the field.
Therefore:
- mobile layouts must be truly usable
- action buttons must remain obvious
- cards should work well on small screens
- important data should not disappear on mobile

### 2.4 Premium but grounded
The panel should look polished and premium, but not luxurious or over-designed.
Think:
- “organized, trustworthy, modern office software”
Not:
- “experimental design showcase”

---

## 3. Visual Style Direction

### Desired feel
- clean
- confident
- modern
- structured
- operational
- trustworthy

### Avoid
- overly playful colors
- excessive gradients
- glassmorphism-heavy interfaces
- startup-neon aesthetics
- cluttered dashboards
- oversized whitespace that reduces information density too much

---

## 4. Recommended Visual Identity

## 4.1 Color Direction
Use a restrained professional palette.

### Base colors
- white / off-white background
- light gray section backgrounds
- slate / neutral borders
- dark gray / near-black text

### Primary accent
Preferred family:
- navy
- deep blue
- slate blue

This works well for:
- trust
- corporate feel
- real estate professionalism

### Semantic colors
Use standard restrained semantic colors:
- green for success / completed
- amber for pending / warning
- red for danger / canceled / urgent
- blue for active / informational

Do not overuse strong colors.

---

## 5. Typography Direction

Typography should feel:
- sharp
- readable
- slightly corporate
- modern

Use:
- clean sans-serif
- strong hierarchy for page titles
- medium-weight labels
- compact readable table text

Avoid:
- overly rounded, playful typography
- oversized hero-like headings inside the app

---

## 6. Layout Direction

## 6.1 Overall structure
Recommended base layout:
- left sidebar navigation on desktop
- top bar with page title / breadcrumbs / user menu
- content area with cards, tables, and forms

### Desktop
- sidebar always visible
- structured content width
- dashboard cards in balanced grid
- lists primarily table-based

### Mobile
- collapsible sidebar or drawer
- dashboard cards stacked vertically
- lists can switch to card-style or compact rows
- forms must remain comfortably tappable

---

## 7. Dashboard Design Direction

The dashboard should be:

- useful at a glance
- not overloaded
- operationally meaningful
- slightly premium visually

### Admin dashboard should include
- metric summary cards
- recent activity feed
- open task summary
- per-agent summary blocks
- listing/customer/task counters

### Agent dashboard should include
- my listings
- my customers
- my tasks
- my recent activity
- urgent/follow-up items

### Dashboard card style
Cards should be:
- clean
- medium radius
- subtle border or soft shadow
- consistent padding
- visually calm

Do not use overly colorful KPI cards everywhere.

---

## 8. Table and List Design Direction

Tables are important in this product.

### Desktop tables should support
- strong readability
- easy scanning
- compact but not cramped rows
- clear statuses via badges
- sticky actions where useful
- visible filters/search

### Mobile alternative
On mobile, where tables become too dense:
- convert important list views to cards or compact stacked rows
- keep actions obvious
- surface critical fields first

### Important rule
Do not build beautiful but unusable tables.

---

## 9. Form Design Direction

Forms are a critical workflow.

### Required qualities
- clear labels
- logical grouping
- sensible spacing
- easy validation messages
- strong save/cancel actions
- mobile-friendly inputs

### Recommended grouping examples
For listing forms:
- basic info
- pricing
- property details
- location
- assignment
- media

For customer forms:
- identity/contact
- category/status
- preferences
- notes
- assignment

Avoid giant unstructured single-column forms without grouping.

---

## 10. Badges, Status, and Signals

This app uses many statuses.

Status indication should rely on:
- readable badge labels
- restrained semantic color
- consistent placement

Examples:
- listing status badge
- customer status badge
- task priority badge
- task status badge

Badges must be:
- compact
- readable
- visually consistent

---

## 11. Navigation Rules

Navigation should be role-aware.

### Admin navigation
- Dashboard
- Listings
- Customers
- Tasks
- Activity
- Users

### Agent navigation
- Dashboard
- My Listings
- My Customers
- My Tasks

Avoid excessive menu depth.
Prefer clear and flat navigation.

---

## 12. Empty States and Error States

The UI must handle empty states gracefully.

For example:
- no listings yet
- no customers assigned
- no tasks due
- no recent activity

Empty states should:
- explain what is missing
- provide the next action
- avoid feeling broken

Errors should be:
- clear
- calm
- actionable

---

## 13. UX Priorities by Role

## Admin priorities
- visibility
- control
- oversight
- reporting
- assignment

## Agent priorities
- speed
- simplicity
- mobility
- quick updates
- easy task follow-up

The same screen does not always need to look identical for both roles.

---

## 14. Design Patterns to Prefer

Prefer:
- sidebar + topbar layout
- soft cards
- subtle borders
- meaningful sections
- filter bars above data lists
- sticky primary action buttons where helpful
- compact metrics and recent activity cards

---

## 15. Design Patterns to Avoid

Avoid:
- giant decorative hero sections inside the app
- excessively rounded childish UI
- too many colors competing on one screen
- crowded dashboards with 12+ widgets by default
- hidden critical actions
- modal-heavy workflows for everything
- form designs that require too much scrolling without grouping

---

## 16. Component Style Direction

### Buttons
- clear hierarchy: primary / secondary / ghost / danger
- primary actions should stand out
- destructive actions should be explicit

### Inputs
- simple
- strong contrast
- consistent sizing

### Cards
- subtle
- clean
- modest radius
- uniform spacing

### Modals / dialogs
- use only when truly useful
- do not hide major workflows behind too many dialogs

### Drawers / sheets
- useful for mobile filters or small actions
- not mandatory for every action

---

## 17. Information Density

This is not a marketing website.
The system should have **balanced information density**:
- not cramped
- not wasteful
- enough visible business data to be useful

Think:
- “professional internal software”
rather than
- “minimalist showcase page”

---

## 18. Real Estate-Specific UX Guidance

Even though this is a CRM/admin system, it serves real estate workflows.
Therefore the design should support:
- property status clarity
- customer follow-up clarity
- field use practicality
- quick portfolio scanning
- confidence when sharing the screen with clients or office staff

This means the product should feel organized and serious.

---

## 19. Final Design Summary

Build a UI that feels like:

- a modern B2B SaaS operations dashboard
- designed for a real estate office
- practical for desktop office use
- comfortable for mobile field use
- visually polished but not flashy
- trustworthy and clean

If there is uncertainty, prefer:
**clarity, structure, and usability over decoration.**
