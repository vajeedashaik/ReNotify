# 🎨 ReNotify V2 – UI Design Master Prompt

## Role & Goal
You are a **senior product designer + frontend engineer** designing **ReNotify V2**, a modern, mobile-first web application for managing **customer purchases, warranties, and AMCs**.  
The UI must look **startup-grade, premium, clean, and visually impressive**, suitable for demos, investors, and real users.

---

## 🧭 Product Context
**ReNotify** helps businesses track customer purchase records and automatically manage:

- Warranties  
- AMC status  
- Service reminders  
- Customer reachability (consent)

The app will be frequently opened on **mobile browsers**, but must scale well to desktop.

---

## 🧱 Design Principles
- Mobile-first, responsive layout  
- Soft shadows, rounded cards, subtle gradients  
- Calm but professional color palette (teal / blue / indigo accents)  
- Clear hierarchy, minimal clutter  
- Icon-driven cards and sections  
- Smooth micro-interactions (hover, tap, transitions)  
- High data readability  

---

## 🗺️ Page & Section Breakdown

### 1️⃣ Landing / Home Dashboard
**Purpose:** Instant overview

**Components:**
- **Top App Bar**
  - ReNotify logo  
  - Profile / Settings icon  
- **KPI Cards** (horizontal scroll on mobile)
  - Total Customers  
  - Active Warranties  
  - Active AMCs  
  - Upcoming Services (next 30 days)  
- **Quick Actions Card**
  - Add Customer  
  - Upload Invoice  
  - View Reminders  
- **Recent Activity Feed**
  - “Warranty expiring soon”  
  - “AMC ending”  
  - “Service due today”  

---

### 2️⃣ Customers Page
**Purpose:** Manage customer identities

**Card/List View – Each customer card shows:**
- `customer_mobile` (highlighted)  
- `consent_flag` (badge: green **YES** / red **NO**)  
- `city` + `pincode`  
- Total products owned  
- CTA: **View Details**

**Filters:**
- Consent status  
- City  
- Warranty active / expired  
- AMC active / inactive  

---

### 3️⃣ Customer Detail Page
**Purpose:** Single customer deep-view

**Sections:**
- **Customer Header Card**
  - Mobile Number  
  - Consent Flag  
  - City + Pincode  

- **Products Owned** (expandable cards)  
  Each product card shows:
  - `product_name`  
  - `brand` + `model_number`  
  - `serial_number`  
  - `retailer_name`  
  - `invoice_id`  
  - `purchase_date`  

  CTA: **View Warranty & AMC**

---

### 4️⃣ Warranty & AMC Detail Page
**Purpose:** Lifecycle tracking

**Warranty Card**
- `warranty_type`  
- `warranty_start` → `warranty_end` (timeline bar)  
- Status badge (**Active / Expired**)  
- Days remaining indicator  

**AMC Card**
- `amc_active` (Yes / No)  
- `amc_end_date`  
- CTA: **Renew AMC**

**Service Reminder Card**
- `next_service_due`  
- Countdown badge  
- **Notify Customer** button (disabled if `consent_flag = NO`)

---

### 5️⃣ Invoices & Purchases Page
**Purpose:** Audit & traceability

**Table / Card Hybrid View – Each entry shows:**
- `invoice_id`  
- `retailer_name`  
- `purchase_date`  
- `product_category`  
- `product_name`  
- `brand`  

Tap → opens full invoice summary modal.

---

### 6️⃣ Alerts & Reminders Page
**Purpose:** Action center

**Grouped Sections:**
- Services Due Soon  
- Warranty Expiring  
- AMC Ending  

**Each alert card shows:**
- `customer_mobile`  
- `product_name`  
- Due date  
- `consent_flag` badge  
- Action button: **Notify / Snooze**

---

### 7️⃣ Settings Page
**Sections:**
- Notification Rules  
- Consent Handling Logic  
- City / Retailer Filters  
- Data Import / Export  

---

## 🎨 Visual Style Instructions
- Use cards everywhere (no raw tables)  
- Soft neumorphism or light glass-morphism  
- Color-coded badges:
  - **Green** → Active  
  - **Orange** → Expiring Soon  
  - **Red** → Expired  
- Icons for:
  - Warranty  
  - AMC  
  - Service  
  - Customer  
  - Invoice  

---

## 🧩 Tech & Output Expectations
- React / Next.js style component thinking  
- Tailwind-like spacing system  
- Reusable components:
  - `InfoCard`  
  - `StatusBadge`  
  - `TimelineBar`  
  - `ActionButton`  
- Include empty states & loading skeletons  
- Show both mobile and desktop layouts  

---

## ✅ Final Output Required
- Page-wise UI layout  
- Component breakdown  
- Visual hierarchy explanation  
- Sample UI copy (headings, labels, CTAs)  
- Clean, production-ready design mindset  
