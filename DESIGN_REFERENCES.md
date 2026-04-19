# DESIGN_REFERENCES.md
# Emlak CRM / Real Estate Management System
## Design References and Reference Usage Rules

This document explains how reference repositories, screenshots, or design inspirations should be used by the agent.

The goal is not blind copying.
The goal is to build a **coherent, customized UI** for this project using the strongest ideas from available references.

---

## 1. Reference Usage Philosophy

When reference repos or UI examples are provided, use them as:

- inspiration
- structural guidance
- interaction guidance
- component direction

Do **not**:
- clone screens blindly
- copy branding
- create inconsistent mixed UI
- import visual ideas without adapting them to this CRM

The final result must feel like **one product**, not a collage of unrelated dashboards.

---

## 2. What References Are Good For

References can help with:

### Layout inspiration
- sidebar placement
- dashboard shell
- topbar structure
- page spacing
- mobile navigation approach

### Component inspiration
- cards
- filters
- tables
- status badges
- drawers
- forms
- tabs

### Workflow inspiration
- CRUD page structure
- detail/edit screen organization
- task panel layout
- recent activity feed

---

## 3. How to Use Multiple Reference Repos

If multiple repos are available, interpret them in categories.

### Example structure
- Repo A → layout and navigation reference
- Repo B → dashboard card style reference
- Repo C → table/filter interaction reference
- Repo D → form organization reference

Do not copy all design logic from all repos equally.
Choose the strongest pattern per area and unify them.

---

## 4. Priority Order When Using References

When evaluating a reference, prioritize:

1. usability
2. clarity
3. consistency
4. maintainability
5. visual polish

Visual style should never come before usability.

---

## 5. What the Final Product Should Resemble

The final UI should resemble:

- a clean modern SaaS dashboard
- a serious operational backoffice system
- a mobile-friendly business app
- a trustworthy real estate internal tool

Not:
- a crypto dashboard
- a fintech trading interface
- a flashy startup landing panel
- a social-media-style app

---

## 6. Reference Selection Rules

When a reference is provided, examine:

### Good signs
- clear sidebar
- readable tables
- good card spacing
- practical forms
- restrained color system
- good mobile responsiveness

### Bad signs
- overly decorative design
- weak table usability
- too much empty space
- flashy colors
- unclear navigation
- gimmicky UI behavior

Only borrow from strong references.

---

## 7. Mapping References to This Project

When adapting a reference, translate it into this CRM context.

Examples:
- a generic “projects” table may inspire the listings table
- a “clients” screen may inspire the customers page
- a “team dashboard” may inspire admin performance blocks
- a “tasks board” may inspire reminders/tasks area

But rename and restructure based on real estate workflows.

---

## 8. Real Estate Adaptation Rules

Even if a reference comes from another domain, adapt it to support:

- listing visibility
- customer tracking
- assignment clarity
- task follow-up
- status visibility
- role-based navigation

The product must not feel generic after adaptation.

---

## 9. Rules for Design Consistency

Across all borrowed ideas, keep these consistent:
- border radius
- card padding
- typography scale
- badge style
- button hierarchy
- table density
- icon style
- spacing rhythm

If different references conflict, unify toward a single design system.

---

## 10. Sidebar Guidance

If using a reference for sidebar behavior, prefer:
- clean icons + labels
- role-based item visibility
- collapsible behavior on smaller screens
- stable spacing
- active item clarity

Do not overcomplicate sidebar interactions.

---

## 11. Dashboard Guidance

If using a reference for dashboard design, prefer:
- a clean grid of meaningful metrics
- recent activity section
- open task area
- moderate information density
- no visual overload

Use references that make dashboards operational, not ornamental.

---

## 12. Table Guidance

If using a table reference, prefer:
- filters above table
- readable headers
- compact status badges
- row actions clearly placed
- good responsive fallback

Avoid tables that look stylish but become unusable in practice.

---

## 13. Form Guidance

If using a form reference, prefer:
- sectioned forms
- strong label alignment
- logical grouping
- visible save actions
- good validation messaging
- mobile friendliness

Large business forms should feel structured, not chaotic.

---

## 14. Mobile Guidance

If using mobile inspiration from any repo:
- retain action visibility
- reduce density carefully
- switch tables to cards when needed
- keep navigation simple
- ensure fast agent usage

Mobile use is essential for this project.

---

## 15. What to Do When References Conflict

If two references suggest different directions:
1. choose the more usable one
2. choose the more consistent one
3. choose the one more suitable for internal CRM workflows
4. keep the system visually calm and businesslike

---

## 16. If a Reference Repo Has Good Code but Weak Design

Use:
- code structure if useful
- component logic if strong

Do not inherit:
- weak spacing
- poor colors
- low-information UX
- awkward mobile behavior

---

## 17. If a Reference Repo Has Good Design but Weak Architecture

Use:
- layout inspiration
- component ideas
- visual rhythm

Do not inherit:
- poor organization
- mixed patterns
- inconsistent components
- unmaintainable code

---

## 18. Final Rule for the Agent

When references are available, synthesize them into:
- one layout language
- one component language
- one spacing system
- one interaction philosophy

The final result should look intentional and productized.

---

## 19. If Specific Reference Repositories Are Added Later

When concrete repos are added, document them in this format:

### Reference A
- source:
- use for:
- do not copy:
- notes:

### Reference B
- source:
- use for:
- do not copy:
- notes:

This makes the design direction much clearer for implementation agents.

---

## 20. Final Summary

References should help answer:
- how the product should feel
- how layout should be structured
- how tables/forms/dashboards should behave

But the final UI must still be:
- clean
- unified
- real-estate appropriate
- mobile-friendly
- practical
