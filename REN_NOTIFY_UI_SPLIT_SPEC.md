# ReNotify v2 — Customer & Retailer/Admin UI Split (Specification)

## Objective
Refactor the existing ReNotify UI into **two clearly separated experiences**:

1. **Customer Side UI** — for end users who purchased products  
2. **Retailer/Admin Side UI** — for retailers or admins who upload and manage datasets

Both sides must use the **same underlying dataset**, but expose **different views, permissions, and flows**.

---

## Dataset (Source of Truth)

The application is powered by an uploaded dataset (Excel / CSV) with the following columns:

- customer_mobile
- consent_flag
- retailer_name
- invoice_id
- purchase_date
- product_category
- product_name
- brand
- model_number
- serial_number
- warranty_start
- warranty_end
- warranty_type
- amc_active
- amc_end_date
- next_service_due
- city
- pincode

This dataset acts as the **primary database** for both user and admin experiences.

---

## High-Level Architecture

### UI Separation
- `/admin/*` → Retailer / Admin UI
- `/app/*` → Customer UI
- Shared components, types, and utilities remain reusable

### Roles
- **Admin / Retailer**
  - Uploads datasets
  - Views aggregated data
  - Manages customers, products, warranties, and reminders

- **Customer**
  - Authenticates using mobile number present in dataset
  - Sees only their own records
  - Cannot modify core data

---

## Admin / Retailer Side UI (`/admin`)

### Authentication
- Simple admin authentication (email/password or mock auth for now)
- Role: `ADMIN`

---

### Admin Dashboard
Show aggregated insights from the uploaded dataset:
- Total customers
- Total products
- Active warranties
- Expiring warranties (30 / 60 / 90 days)
- AMC active vs inactive
- Upcoming service dues

Use KPI cards, charts, and tables.

---

### Dataset Upload Feature (Core Requirement)

#### Upload
- Upload Excel (.xlsx) or CSV file
- Validate required columns
- Parse rows into structured records

#### Post-Upload Behavior
- Persist dataset in app state / backend
- Populate admin dashboards automatically
- Make the same data available to customer-side login

#### Dataset Validation
- Required columns must exist
- customer_mobile is mandatory
- consent_flag must be respected (only consented users can log in)

---

### Admin Views
- **Customers**
  - Grouped by customer_mobile
  - Filters: city, consent_flag, warranty status

- **Products**
  - All products across customers
  - Filter by brand, category, warranty status

- **Warranties & AMC**
  - Timeline views
  - Expiry alerts
  - AMC status

- **Invoices**
  - Searchable by invoice_id
  - Grouped per retailer or customer

- **Alerts & Reminders**
  - Upcoming warranty expiry
  - AMC expiry
  - Next service due

---

## Customer Side UI (`/app`)

### Authentication (Mobile-Based)

#### Login Flow
- User enters mobile number
- System checks if mobile number exists in dataset
- consent_flag must be `YES`
- If valid → login success
- If not found → show informative error

> No OTP implementation required initially (can be mocked).

---

### Customer Dashboard

After login, show **ONLY rows matching customer_mobile**.

#### Dashboard Sections
- Overview cards:
  - Total products owned
  - Active warranties
  - AMC active products
  - Upcoming expiries

- Product List
  - Product name, brand, model
  - Warranty & AMC status
  - Expandable product cards

---

### Product Detail View
For each product:
- Product info
- Invoice details
- Warranty timeline (start → end)
- AMC status & end date
- Next service due date
- Visual status indicators (green / orange / red)

---

### Customer Alerts & Reminders
- Warranty expiring soon
- AMC ending soon
- Service due reminders
- Read-only (customer cannot change rules)

---

### Customer Restrictions
- Cannot edit:
  - Warranty dates
  - Invoice details
  - Product metadata
- Purely view + notification-based experience

---

## Shared Design & Component Rules

- Reuse existing components:
  - InfoCard
  - StatusBadge
  - TimelineBar
  - ProductCard
  - AlertCard
- Keep design system consistent across admin & customer
- Admin UI may show tables and bulk views
- Customer UI should stay simple and card-based

---

## Navigation

### Admin Navigation
- Dashboard
- Upload Dataset
- Customers
- Products
- Warranties & AMC
- Invoices
- Alerts
- Settings

### Customer Navigation
- Dashboard
- My Products
- Warranties & AMC
- Alerts
- Profile (read-only)

---

## Non-Goals (For Now)
- No payment integration
- No real OTP gateway
- No third-party retailer integrations
- No manual data editing from UI

---

## Success Criteria
- One dataset upload powers both UIs
- Admin sees all data
- Customer sees only their own data
- Mobile-number-based login works using dataset
- Clean separation of admin vs customer routes
