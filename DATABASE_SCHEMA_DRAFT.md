# DATABASE_SCHEMA_DRAFT.md
# Emlak CRM / Real Estate Management System
## Database Schema Draft (Phase 1 First)

This document defines the **initial database design direction** for the project.
It is intentionally optimized for **Phase 1 / MVP** while leaving room for Phase 2 and Phase 3 expansion.

Preferred ORM target: **Prisma**
Preferred database: **PostgreSQL**

---

## 1. Design Principles

1. Keep Phase 1 schema simple and stable
2. Use enums for controlled business states
3. Track ownership and assignment clearly
4. Support strict authorization boundaries
5. Keep extension points ready for later modules
6. Prefer explicit fields over premature normalization

---

## 2. Core Enums

## UserRole
- ADMIN
- AGENT

## ListingStatus
- DRAFT
- ACTIVE
- RESERVED
- SOLD
- ARCHIVED

## PropertyType
- LAND
- APARTMENT
- HOUSE
- VILLA
- COMMERCIAL
- OFFICE
- SHOP
- FARM
- OTHER

## CustomerCategory
- BUYER
- SELLER
- INVESTOR
- TENANT
- LANDLORD
- OTHER

## CustomerStatus
- NEW
- CONTACTED
- FOLLOW_UP
- VISIT_PLANNED
- NEGOTIATION
- CLOSED
- LOST

## TaskStatus
- TODO
- IN_PROGRESS
- DONE
- CANCELED

## TaskPriority
- LOW
- MEDIUM
- HIGH
- URGENT

## ActivityEntityType
- USER
- LISTING
- CUSTOMER
- TASK
- SHOWING
- SALE
- SYSTEM

## ActivityActionType
Suggested examples:
- LOGIN
- USER_CREATED
- USER_UPDATED
- USER_DEACTIVATED
- LISTING_CREATED
- LISTING_UPDATED
- LISTING_STATUS_CHANGED
- CUSTOMER_CREATED
- CUSTOMER_UPDATED
- CUSTOMER_STATUS_CHANGED
- TASK_CREATED
- TASK_UPDATED
- TASK_STATUS_CHANGED
- SHOWING_CREATED
- SHOWING_UPDATED

## ShowingStatus
Phase 1 placeholder:
- PLANNED
- STARTED
- COMPLETED
- CANCELED
- VERIFIED

---

## 3. Core Tables

## 3.1 users

Purpose:
Stores admin and agent accounts.

Recommended fields:
- id (uuid / cuid)
- full_name
- email (unique)
- password_hash
- role
- phone (nullable)
- is_active (boolean, default true)
- last_login_at (nullable)
- created_at
- updated_at

Relationships:
- one user can be assigned many listings
- one user can be assigned many customers
- one user can create many tasks
- one user can be assigned many tasks
- one user can generate many activity logs

Notes:
- only ADMIN can manage users
- soft deactivation preferred via is_active

---

## 3.2 listings

Purpose:
Main portfolio/property records.

Recommended fields:
- id
- title
- description (text)
- property_type
- status
- price (decimal)
- area_size_m2 (decimal/float nullable)
- room_count (nullable)
- bathroom_count (nullable)
- building_age (nullable)
- city (nullable)
- district (nullable)
- neighborhood (nullable)
- address_text (nullable)
- island_no / ada_no (nullable)
- parcel_no (nullable)
- latitude (nullable)
- longitude (nullable)
- assigned_agent_id (nullable, FK -> users.id)
- created_by_id (FK -> users.id)
- updated_by_id (nullable, FK -> users.id)
- created_at
- updated_at

Relationships:
- one listing has many listing_photos
- one listing may be linked to many tasks
- one listing may be linked to many showings later
- one listing may be linked to sales later

Notes:
- assigned_agent_id determines ownership visibility for AGENT role
- ADMIN can see all listings
- price should use decimal type, not integer string

Suggested indexes:
- status
- property_type
- assigned_agent_id
- city
- district
- price

---

## 3.3 listing_photos

Purpose:
Stores image references for listings.

Recommended fields:
- id
- listing_id (FK -> listings.id)
- image_url
- sort_order (default 0)
- created_at

Notes:
- actual file storage can be local/dev or cloud storage later
- Phase 1 can keep it simple with URL-based image records

Suggested indexes:
- listing_id
- sort_order

---

## 3.4 customers

Purpose:
Central CRM records for buyer/seller leads and prospects.

Recommended fields:
- id
- full_name
- phone
- email (nullable)
- category
- desired_property_type (nullable)
- budget_min (nullable)
- budget_max (nullable)
- preferred_city (nullable)
- preferred_district (nullable)
- notes (text nullable)
- status
- assigned_agent_id (nullable, FK -> users.id)
- created_by_id (FK -> users.id)
- updated_by_id (nullable, FK -> users.id)
- created_at
- updated_at

Relationships:
- one customer may have many tasks
- one customer may have many showings later
- one customer may later be connected to sales

Notes:
- AGENT visibility should follow assigned_agent_id
- admin can reassign customer ownership
- notes can be plain text in Phase 1

Suggested indexes:
- status
- category
- assigned_agent_id
- phone
- preferred_city
- preferred_district

---

## 3.5 tasks

Purpose:
Internal reminders and work items.

Recommended fields:
- id
- title
- description (nullable)
- due_date (nullable)
- priority
- status
- assigned_to_id (FK -> users.id)
- created_by_id (FK -> users.id)
- listing_id (nullable, FK -> listings.id)
- customer_id (nullable, FK -> customers.id)
- created_at
- updated_at

Relationships:
- task belongs to assigned user
- task may be related to one listing
- task may be related to one customer

Notes:
- either listing_id or customer_id can be null
- both may be null for generic office tasks
- tasks should be easy to filter by assignee and due date

Suggested indexes:
- assigned_to_id
- status
- due_date
- priority
- listing_id
- customer_id

---

## 3.6 activity_logs

Purpose:
Central audit and operational trace table.

Recommended fields:
- id
- actor_user_id (nullable FK -> users.id for system actions)
- action_type
- entity_type
- entity_id (string or nullable FK-style reference token)
- summary (short text)
- metadata_json (json nullable)
- created_at

Notes:
- keep entity_id generic string if multiple entity types are logged
- metadata_json can store small before/after summaries when useful
- do not store sensitive credentials

Suggested indexes:
- actor_user_id
- action_type
- entity_type
- created_at

---

## 4. Recommended Phase 1 Optional Tables

## 4.1 showings
Purpose:
Future-friendly placeholder for property showing records.

Recommended fields:
- id
- listing_id (FK)
- customer_id (FK nullable)
- agent_id (FK -> users.id)
- status
- started_at (nullable)
- completed_at (nullable)
- verification_code (nullable, future OTP use)
- verification_channel (nullable)
- gps_latitude (nullable)
- gps_longitude (nullable)
- notes (nullable)
- created_at
- updated_at

Why include now:
- optional, but useful if you want smoother Phase 2 transition
- can remain unused in UI during early MVP

---

## 4.2 sales
Purpose:
Simple future reporting hook for closed deals.

Recommended fields:
- id
- listing_id (FK)
- customer_id (nullable FK)
- agent_id (FK -> users.id)
- sale_price
- sale_date
- notes (nullable)
- created_at
- updated_at

Why include now:
- optional
- useful later for performance reporting

---

## 5. Ownership and Authorization Logic

## ADMIN
Can query:
- all users
- all listings
- all customers
- all tasks
- all activity logs

## AGENT
Can query:
- listings where assigned_agent_id = current user id
- customers where assigned_agent_id = current user id
- tasks where assigned_to_id = current user id
- own activity where needed
- limited dashboard aggregates based on own scope

Important:
Authorization must be enforced in server-side query logic, not only in frontend filtering.

---

## 6. Suggested Prisma Model Order

If using Prisma, define models in this rough order:
1. enums
2. User
3. Listing
4. ListingPhoto
5. Customer
6. Task
7. ActivityLog
8. Showing (optional)
9. Sale (optional)

This keeps relationships easier to reason about.

---

## 7. Example Prisma-Oriented Shape (Conceptual, not final code)

User
- id
- fullName
- email
- passwordHash
- role
- phone?
- isActive
- lastLoginAt?
- createdAt
- updatedAt

Listing
- id
- title
- description
- propertyType
- status
- price
- areaSizeM2?
- roomCount?
- bathroomCount?
- buildingAge?
- city?
- district?
- neighborhood?
- addressText?
- adaNo?
- parcelNo?
- latitude?
- longitude?
- assignedAgentId?
- createdById
- updatedById?
- createdAt
- updatedAt

Customer
- id
- fullName
- phone
- email?
- category
- desiredPropertyType?
- budgetMin?
- budgetMax?
- preferredCity?
- preferredDistrict?
- notes?
- status
- assignedAgentId?
- createdById
- updatedById?
- createdAt
- updatedAt

Task
- id
- title
- description?
- dueDate?
- priority
- status
- assignedToId
- createdById
- listingId?
- customerId?
- createdAt
- updatedAt

ActivityLog
- id
- actorUserId?
- actionType
- entityType
- entityId?
- summary
- metadataJson?
- createdAt

---

## 8. Validation Rules

## Users
- email unique and valid
- password hashed before persistence
- role required
- inactive users cannot authenticate

## Listings
- title required
- property type required
- status required
- price must be numeric and non-negative

## Customers
- full name required
- phone required
- status required
- category required

## Tasks
- title required
- status required
- priority required
- assigned_to_id required

---

## 9. Reporting Fields Needed for Dashboard

The schema should support easy calculation of:
- total listings
- active listings
- sold listings
- total customers
- customers by status
- tasks by status
- overdue tasks
- listings per agent
- customers per agent
- tasks per agent
- recent activities

This means timestamps and assignment fields are critical.

---

## 10. Migration Strategy

Use small intentional migrations:
1. initial auth/user schema
2. listings
3. customers
4. tasks
5. activity logs
6. optional future tables

Avoid large chaotic migration bundles.

---

## 11. Seed Data Strategy

Recommended seed data:
- 1 admin user
- 2 agent users
- 8-12 demo listings
- 10-15 demo customers
- 10 demo tasks
- a small set of activity logs

This helps demo and testing immediately.

---

## 12. Future Extensions Supported by This Schema

This draft is designed to support later addition of:
- WhatsApp share history
- GPS verification results
- OTP verification events
- export logs
- customer-listing matching tables
- sales commissions
- branch/office support
- public listing pages
- multilingual interface metadata

---

## 13. Final Recommendation

For implementation:
- start with User, Listing, Customer, Task, ActivityLog
- keep Showing optional but planned
- delay overly detailed normalization until real usage justifies it

The first goal is a stable operational schema, not a perfect enterprise schema.
