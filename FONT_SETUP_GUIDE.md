# FONT_SETUP_GUIDE.md
# Emlak CRM / Font Setup Guide

This file explains exactly how to set up the typography system for the refreshed UI.

Use this together with:
- `DESIGN_TOKENS.md`
- `UI_REFRESH_BRIEF.md`

---

## 1. Required Font

Use:
- **Inter**

Do not mix multiple primary fonts in the product UI.

---

## 2. Next.js App Router Setup

If using Next.js App Router, use `next/font/google`.

Example:

```tsx
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

Then apply it in the root layout:

```tsx
<html lang="tr" className={inter.variable}>
  <body className="font-sans">
    {children}
  </body>
</html>
```

---

## 3. Tailwind Mapping

Set `font-sans` to use the Inter variable.

Example direction:

```ts
fontFamily: {
  sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
}
```

This ensures all shared UI defaults to Inter.

---

## 4. Typography Rules

### Page title
Use for main page headings:
- size: 32px
- weight: 700
- color: `#0F172A`
- tracking: slight negative tracking allowed

### Section title
Use for module/panel titles:
- size: 24px
- weight: 600
- color: `#0F172A`

### KPI values
Use for dashboard summary metrics:
- size: 36px
- weight: 700
- color: `#0F172A`

### Card titles / labels
- size: 13–14px
- weight: 600
- color: `#64748B`
- optional uppercase only when visually subtle and consistent

### Helper / meta text
- size: 12–14px
- weight: 400–500
- color: `#64748B` or `#94A3B8`

### Sidebar labels
- size: 14px
- weight: 500
- avoid heavy bold appearance
- prioritize readability and rhythm

---

## 5. What to Fix in Current UI

The current UI likely feels old-fashioned because:
- headings are too heavy
- sidebar text is not balanced
- KPI text hierarchy is weak
- supporting text lacks contrast discipline

This refresh must correct that.

---

## 6. Strict Typography Rules

Do not:
- use serif-like heading appearance
- use Times-like rendering
- mix random font weights
- let helper text compete with main text
- let card titles be too dark and loud

Do:
- keep type clean and modern
- create obvious hierarchy
- use muted text intentionally
- keep KPI numbers strong
- make subtitles calmer and lighter

---

## 7. Suggested Utility Classes

Suggested style direction:

### Page heading
- `text-3xl md:text-4xl font-bold tracking-tight text-slate-900`

### Section heading
- `text-xl md:text-2xl font-semibold text-slate-900`

### KPI value
- `text-3xl md:text-4xl font-bold text-slate-900`

### Card label
- `text-sm font-semibold text-slate-500`

### Helper text
- `text-sm text-slate-500`

### Meta text
- `text-xs text-slate-400`

### Sidebar label
- `text-sm font-medium`

---

## 8. Final Rule

Typography should be one of the main upgrades in the UI refresh.

If the font system is corrected properly, the app will immediately feel:
- more modern
- more intentional
- more premium
- more SaaS-like

Typography is not a minor detail here — it is one of the main visual fixes.
