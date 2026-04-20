# DESIGN_TOKENS.md
# Emlak CRM / UI Design Tokens

This file defines the base visual tokens that should be used across the app.
Use these tokens consistently for dashboard, forms, tables, sidebar, cards, badges, and navigation.

---

## 1. Typography

### Preferred font
Use:
- **Inter**

Fallbacks:
- ui-sans-serif
- system-ui
- sans-serif

### Type scale
- `text-display`: 36px / 2.25rem / 700
- `text-page-title`: 32px / 2rem / 700
- `text-section-title`: 24px / 1.5rem / 600
- `text-card-title`: 14px / 0.875rem / 600
- `text-kpi`: 36px / 2.25rem / 700
- `text-body`: 14px / 0.875rem / 400
- `text-body-strong`: 14px / 0.875rem / 500
- `text-meta`: 12px / 0.75rem / 400
- `text-label`: 13px / 0.8125rem / 500

---

## 2. Core Colors

### Neutrals
- `--background`: `#F8FAFC`
- `--surface`: `#FFFFFF`
- `--surface-soft`: `#F1F5F9`
- `--border`: `#E2E8F0`
- `--text-primary`: `#0F172A`
- `--text-secondary`: `#64748B`
- `--text-muted`: `#94A3B8`

### Primary
- `--primary`: `#1D4ED8`
- `--primary-hover`: `#1E40AF`
- `--primary-soft`: `#DBEAFE`

### Sidebar
- `--sidebar-bg`: `#0F172A`
- `--sidebar-text`: `#CBD5E1`
- `--sidebar-text-muted`: `#94A3B8`
- `--sidebar-active-bg`: `#1E293B`
- `--sidebar-active-text`: `#FFFFFF`
- `--sidebar-border`: `rgba(255,255,255,0.06)`

### Semantic
- `--success`: `#16A34A`
- `--success-soft`: `#DCFCE7`
- `--warning`: `#D97706`
- `--warning-soft`: `#FEF3C7`
- `--danger`: `#DC2626`
- `--danger-soft`: `#FEE2E2`
- `--info`: `#2563EB`
- `--info-soft`: `#DBEAFE`

---

## 3. Radius

- `--radius-card`: `16px`
- `--radius-input`: `12px`
- `--radius-button`: `12px`
- `--radius-badge`: `9999px`

---

## 4. Shadows

Use soft shadows only.

- `--shadow-card`: `0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04)`
- `--shadow-dropdown`: `0 8px 24px rgba(15, 23, 42, 0.08)`
- `--shadow-focus`: `0 0 0 4px rgba(29, 78, 216, 0.12)`

Avoid heavy dark shadows.

---

## 5. Spacing

Use a consistent spacing scale:
- 4
- 8
- 12
- 16
- 20
- 24
- 32

Recommended usage:
- page section gap: 24–32
- card padding: 20–24
- grid gap: 20–24
- form field gap: 16
- sidebar item vertical rhythm: 8–12

---

## 6. Component Intent

### Cards
- white background
- subtle border
- soft radius
- soft shadow
- padding 20–24

### KPI cards
- small clean title
- large prominent number
- muted helper text
- small icon top-right

### Buttons
- primary: filled blue
- secondary: white with border
- ghost: low emphasis
- danger: red-toned only for destructive actions

### Inputs
- white surface
- subtle border
- soft radius
- blue focus ring
- strong text contrast

### Badges
- compact
- readable
- soft background with semantic color

---

## 7. Layout Guidance

### Dashboard
- max width container feel
- clear spacing between header, KPIs, and lower panels
- balanced 2-column lower section
- no stretched empty areas without design treatment

### Sidebar
- dark but refined
- generous spacing
- clear active state
- polished profile section at bottom

---

## 8. Implementation Guidance

If using Tailwind, map these values into:
- CSS variables in `globals.css`
- theme extension in `tailwind.config`
- shared utility classes for cards, headings, and muted text

These tokens should become the single source of truth for the refreshed UI.
