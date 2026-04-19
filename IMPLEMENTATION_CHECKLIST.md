# IMPLEMENTATION_CHECKLIST.md
# Emlak CRM / Real Estate Management System
## Implementation Checklist

Use this checklist during implementation to avoid scope drift and missing fundamentals.

---

## 1. Foundation
- [ ] Repo inspected and current stack summarized
- [ ] Environment variables documented
- [ ] Database configured
- [ ] Prisma initialized or aligned
- [ ] Base app structure is clean and modular

---

## 2. Auth & Roles
- [ ] User model created
- [ ] Password hashing works
- [ ] Login page implemented
- [ ] Session/auth flow works
- [ ] Protected routes implemented
- [ ] ADMIN role defined
- [ ] AGENT role defined
- [ ] Inactive users blocked from login
- [ ] Server-side authorization enforced

---

## 3. Listings Module
- [ ] Listing model created
- [ ] Listing status enum created
- [ ] Property type enum created
- [ ] Listing list page implemented
- [ ] Listing create form implemented
- [ ] Listing edit form implemented
- [ ] Listing detail page implemented
- [ ] Listing filters implemented
- [ ] Agent assignment supported
- [ ] Listing validation added

---

## 4. Listing Photos
- [ ] ListingPhoto model created
- [ ] Image URL or upload-compatible structure prepared
- [ ] Photo ordering supported minimally
- [ ] Listing detail page renders photos

---

## 5. CRM / Customers Module
- [ ] Customer model created
- [ ] Customer status enum created
- [ ] Customer category enum created
- [ ] Customer list page implemented
- [ ] Customer create form implemented
- [ ] Customer edit form implemented
- [ ] Customer detail page implemented
- [ ] Customer assignment supported
- [ ] Customer filters/search implemented
- [ ] Customer validation added

---

## 6. Tasks Module
- [ ] Task model created
- [ ] Task status enum created
- [ ] Task priority enum created
- [ ] Task list page implemented
- [ ] Task create form implemented
- [ ] Task edit form implemented
- [ ] Task assignment works
- [ ] Due date support added
- [ ] Listing-linked tasks supported
- [ ] Customer-linked tasks supported

---

## 7. Activity Logs
- [ ] ActivityLog model created
- [ ] Log service/helper created
- [ ] Login event logged
- [ ] Listing create/update logged
- [ ] Customer create/update logged
- [ ] Task create/update logged
- [ ] Recent activity query implemented
- [ ] Admin can see recent logs

---

## 8. Dashboard
- [ ] Admin dashboard created
- [ ] Agent dashboard created
- [ ] Total listings metric shown
- [ ] Total customers metric shown
- [ ] Open tasks metric shown
- [ ] Recent activity shown
- [ ] Agent-scoped metrics shown correctly
- [ ] Admin-scoped metrics shown correctly

---

## 9. Responsive UX
- [ ] Core pages usable on mobile width
- [ ] Navigation works on small screens
- [ ] Forms usable on mobile
- [ ] Tables/cards degrade gracefully
- [ ] Primary actions visible without confusion

---

## 10. Data Access Rules
- [ ] Agent sees only own listings
- [ ] Agent sees only assigned customers
- [ ] Agent sees only own tasks
- [ ] Admin sees all records
- [ ] No sensitive access depends only on frontend logic

---

## 11. Validation & Stability
- [ ] Zod or equivalent validation added
- [ ] Required fields enforced
- [ ] Numeric fields validated
- [ ] Error states handled cleanly
- [ ] Empty states handled
- [ ] No broken routes
- [ ] No silent auth failures

---

## 12. Demo Readiness
- [ ] Seed data script prepared
- [ ] Admin demo user prepared
- [ ] Agent demo user prepared
- [ ] README setup steps updated
- [ ] .env.example prepared
- [ ] Core flows tested end-to-end

---

## 13. Deferred Features (Do Not Pull In Early)
- [ ] WhatsApp API not started too early
- [ ] OTP flow deferred
- [ ] GPS verification deferred
- [ ] export engine deferred
- [ ] advanced analytics deferred
- [ ] native mobile app deferred

---

## 14. Final MVP Check
- [ ] Admin login works
- [ ] Agent login works
- [ ] Listing CRUD works
- [ ] Customer CRUD works
- [ ] Task CRUD works
- [ ] Activity logs work
- [ ] Dashboard works
- [ ] Mobile browser usage is acceptable
- [ ] Project is stable enough for first client demo
