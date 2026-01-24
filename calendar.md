# 📅 ReNotify V2 – Smart Reminder Calendar (Master Prompt)

## Role & Objective
You are a **senior product designer + frontend architect** building a **custom in-app Reminder Calendar for ReNotify V2**, designed specifically for **warranty, AMC, and service lifecycle management**.  
This calendar is a **complete replacement for Google Calendar** within the ReNotify ecosystem.

The UI must be **visually delightful, extremely convenient, and purpose-built for reminders**, not generic events.

---

## 🧠 Core Concept
This calendar automatically:

- Reads due dates from the dataset:
  - `warranty_end`
  - `amc_end_date`
  - `next_service_due`
- Generates smart reminders
- Sends **in-app alerts + device push notifications**
- Displays **status-based timelines**, not just dates

This calendar is **context-aware, data-driven, and deeply integrated** with ReNotify’s core idea.

---

## 🧱 Mandatory Features
- ✅ In-app reminders  
- ✅ Expiry timeline view  
- ✅ Status badges (**Active / Expiring Soon / Expired**)  
- ✅ Push notifications (without Google Calendar dependency)  
- ✅ Timeline + Grid calendar views  

---

## 🗂 Data Fields Used
Each reminder must be tied to:
- `customer_mobile`
- `product_name`
- `brand` + `model_number`
- `retailer_name`
- `warranty_end`
- `amc_end_date`
- `next_service_due`
- `consent_flag`
- `city` + `pincode`

---

## 🗺️ Calendar Page Structure

### 1️⃣ Calendar Home (Reminder Hub)
**Top Bar**
- Month selector  
- Toggle buttons:
  - Timeline View  
  - Grid View  
- Filter icon  

**Smart Summary Strip (horizontal scroll)**
- Warranties expiring this month  
- AMCs ending soon  
- Services due this week  

---

### 2️⃣ Timeline Calendar View (Primary View)
**Purpose:** Visualize product lifecycles over time

**Design**
- Vertical timeline (mobile-first)  
- Horizontal timeline (desktop)  
- Date markers (Today highlighted)

**Timeline Cards – Each card shows:**
- Product name + brand  
- Reminder type icon:
  - Warranty  
  - AMC  
  - Service  
- Due date (relative: “in 5 days”, “expired 2 days ago”)  
- Status badge:
  - 🟢 Active  
  - 🟠 Expiring Soon  
  - 🔴 Expired  
- Customer mobile (masked)  
- CTA:
  - Notify customer  
  - Snooze reminder  

**Color Rules**
- Green → Safe window  
- Orange → Expiring within threshold (e.g., 30 days)  
- Red → Expired / overdue  

---

### 3️⃣ Grid Calendar View (Traditional but Smart)
**Purpose:** Familiar monthly planning, upgraded

**Design**
- Month grid (7×5)  
- Heatmap-style dots on dates  
- Stackable reminder chips per date  

**Each Reminder Chip**
- Icon (Warranty / AMC / Service)  
- Short product name  
- Status color strip  

**Tap / Click Interaction**
Opens a **Reminder Detail Bottom Sheet / Modal** with:
- Full product & customer details  
- Timeline preview  
- Action buttons  

---

### 4️⃣ Reminder Detail View
**Sections**
- Product Card  
- Customer Card  
- Reminder Type & Due Date  
- Expiry progress bar (start → end)  
- Consent status indicator  
- Notification history  

**Actions**
- Send notification  
- Reschedule  
- Mark as resolved  
- Extend warranty / AMC  

---

## 🔔 Notification System (Core Logic UI)

**Reminder Rules UI**
- Notify X days before expiry  
- Notify on expiry day  
- Notify X days after expiry  
- Auto-disable if `consent_flag = NO`

**Notification Types**
- In-app banner  
- Push notification  
- Badge count on app icon  

---

## 🎨 Visual Design Language
- Timeline-first UX (not date-first)  
- Rounded cards with depth  
- Subtle animations for:
  - Today marker  
  - Upcoming reminders  
- Sticky “Today” indicator  
- Empty states like:
  - *“No upcoming expiries 🎉”*

---

## 🧩 Component Architecture
Reusable components:
- `ReminderCard`
- `TimelineNode`
- `StatusBadge`
- `ExpiryProgressBar`
- `ReminderChip`
- `NotificationToggle`

---

## 🛠️ Tech Expectations
- Mobile-first  
- React / Next.js style component logic  
- Smooth transitions (Framer Motion style)  
- Tailwind-like spacing  
- Offline-safe reminder caching  
- Works without Google Calendar integration  

---

## 🏁 Final Output Expectations
- Timeline calendar UI  
- Grid calendar UI  
- Reminder generation logic (conceptual)  
- Notification UX flow  
- Empty / loading states  
- Design that feels **native, intentional, and better than Google Calendar** for this use case  

---

## 💡 Design North Star
> **“This calendar doesn’t manage time — it manages responsibility.”**
