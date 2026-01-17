# 📍 ReNotify – Nearby Service Center Feature (Cursor Implementation Prompt)

## Role
You are a **senior full-stack engineer** working on **ReNotify**, a web app built with **Next.js + Supabase**.

Your task is to implement a **Nearby Service Center feature** that works end-to-end:
- Admin uploads a real service center dataset
- Data is stored and indexed in Supabase
- Customers can discover nearby service centers directly from their dashboard
- Smart ranking, filtering, and recommendation logic is applied automatically

This feature must feel **production-ready**, **data-driven**, and **deeply integrated** into the app.

---

## 📦 Dataset Context (Service Centers)

The admin uploads an Excel/CSV file containing **exactly these columns**:

- `service_center_id`
- `service_center_name`
- `service_center_type`
- `parent_partner`
- `address`
- `city`
- `state`
- `pincode`
- `supported_brands`
- `supported_categories`
- `warranty_supported`
- `amc_supported`
- `rating`
- `contact_number`
- `opening_hours`
- `latitude`
- `longitude`
- `last_verified_at`
- `active_status`

This dataset is **large (10k+ rows)** and must be handled efficiently.

---

## 🧑‍💼 Admin Dashboard – Responsibilities

### 1️⃣ Dataset Upload
- Add an **Admin UI** similar to the existing customer dataset upload flow
- Allow upload of `.xlsx` / `.csv`
- Parse and validate columns
- Show:
  - Row count
  - Column mapping preview
  - Upload success / failure state

### 2️⃣ Supabase Integration
Create a Supabase table:

```sql
service_centers (
  service_center_id TEXT PRIMARY KEY,
  service_center_name TEXT,
  service_center_type TEXT,
  parent_partner TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  supported_brands TEXT[],
  supported_categories TEXT[],
  warranty_supported BOOLEAN,
  amc_supported BOOLEAN,
  rating FLOAT,
  contact_number TEXT,
  opening_hours TEXT,
  latitude FLOAT,
  longitude FLOAT,
  last_verified_at DATE,
  active_status BOOLEAN
)
Bulk insert data after upload

Add indexes on:

pincode

city

active_status

rating

👤 Customer Dashboard – Entry Point
Where this feature appears
On the Customer Dashboard, specifically on:

Warranty Detail Page

AMC Detail Page

Service Due Card

Add a primary CTA button:

📍 Find Nearby Service Centers

🔄 Core Feature Flow (Customer Side)
User clicks Find Nearby Service Centers

System reads from customer data:

pincode

city

brand

product_category

warranty_active

amc_active

Query Supabase for matching service centers

Apply smart filtering, ranking, and recommendations

Render results in a clean, card-based UI

🧠 Smart Feature Logic (Must Implement)
1️⃣ Nearby Service Center Discovery (Core)
Filter by:

Same pincode (primary)

Same city (fallback)

Only show active_status = true

Sort by:

Distance (computed using lat/lng)

Rating

2️⃣ Warranty-Eligible Service Center Filtering
If customer warranty is active:

Show only warranty_supported = true

Hide all irrelevant centers automatically

3️⃣ AMC-Aware Service Suggestions
If amc_active = true:

Prioritize amc_supported = true

If amc_active = false:

Allow paid / third-party centers

4️⃣ Smart Ranking Engine
Compute a ranking score per service center:

makefile
Copy code
score =
  (distance_score × 0.4) +
  (rating_score × 0.4) +
  (recency_score × 0.2)
Distance score → closer = higher

Rating score → higher rating = higher

Recency score → more recently verified = higher

Sort results by this score.

5️⃣ “Best for Your Product” Recommendations
Select top 2–3 service centers

Must match:

Brand

Product category

Display with explanation:

“Recommended because it supports Samsung TVs and warranty claims”

6️⃣ Service Center Trust Badges
Show visual badges on cards:

🟢 Authorized (service_center_type = AUTHORIZED)

🟡 Retail Partner

🔵 Recently Verified (last_verified_at within 90 days)

7️⃣ Fallback Logic (Very Important)
If no warranty-supported centers are found:

Automatically show:

Third-party / paid centers

Clearly label them:

“Paid Service Center”

Never show an empty state without alternatives

🎨 UI Expectations (Customer Side)
Service Center Card
Each card must show:

Service center name

Distance (km)

Rating ⭐

City + pincode

Supported brands (chips)

Warranty / AMC badges

Trust badges

CTAs:

Call

View details

UX Rules
Mobile-first

Fast load

Clear explanations

No raw tables

Cards + bottom sheet / modal preferred

🧩 Component Expectations
Reusable components:

FindServiceCenterButton

ServiceCenterCard

DistanceBadge

TrustBadge

RecommendationCard

🛠️ Tech Constraints
Next.js (App Router preferred)

Supabase client + server actions

Efficient querying (avoid loading entire table)

No Google Maps dependency required for MVP

Graceful empty & loading states

✅ Final Outcome
Admin can upload and manage real service center data

Data is stored in Supabase

Customers see nearby, relevant service centers exactly when needed

Feature feels like a core product capability, not an add-on

Strong enough for enterprise demos and Croma pitch

🌟 Product North Star
“A reminder is useless unless it leads to resolution.”




