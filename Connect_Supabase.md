# ReNotify v2 — Supabase Integration Specification

## Objective
Integrate **Supabase** as the backend for ReNotify v2 to handle:

- Database storage for uploaded datasets
- Role-based authentication (Admin vs Customer)
- Mobile-number-based customer login
- Admin dataset upload & parsing
- Secure row-level access for customers
- Shared data source powering both UIs

---

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL + Auth + Storage)
- Existing Tailwind UI & components

---

## Supabase Project Setup

### Required Environment Variables
Create `.env.local` and wire Supabase client:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

yaml
Copy code

Use:
- `anon key` for client-side access
- `service role key` for admin-only dataset upload APIs

---

## Database Schema (Core Tables)

### 1. `profiles`
Maps Supabase auth users to roles.

```sql
id uuid primary key references auth.users(id) on delete cascade
role text check (role in ('ADMIN', 'CUSTOMER'))
customer_mobile text
created_at timestamp with time zone default now()
2. datasets
Tracks uploaded files.

sql
Copy code
id uuid primary key default gen_random_uuid()
uploaded_by uuid references auth.users(id)
file_name text
uploaded_at timestamp with time zone default now()
row_count integer
3. customer_products (MAIN TABLE)
Parsed dataset rows go here.

sql
Copy code
id uuid primary key default gen_random_uuid()
customer_mobile text
consent_flag boolean
retailer_name text
invoice_id text
purchase_date date
product_category text
product_name text
brand text
model_number text
serial_number text
warranty_start date
warranty_end date
warranty_type text
amc_active boolean
amc_end_date date
next_service_due date
city text
pincode text
dataset_id uuid references datasets(id)
created_at timestamp with time zone default now()
Authentication Strategy
Admin Authentication
Email + password (Supabase Auth)

On signup/login:

Insert row into profiles with role = ADMIN

Customer Authentication (Mobile-Based)
Login Flow
User enters mobile number

Backend checks:

mobile exists in customer_products

consent_flag = true

If valid:

Create or fetch Supabase auth user

Insert profile with role = CUSTOMER

Attach customer_mobile to profile

Login succeeds (OTP mocked initially)

No customer can log in unless their mobile exists in uploaded dataset.

Row Level Security (CRITICAL)
Enable RLS on customer_products
Customer Policy
sql
Copy code
CREATE POLICY "Customers can view their own products"
ON customer_products
FOR SELECT
USING (
  customer_mobile = (
    SELECT customer_mobile FROM profiles
    WHERE profiles.id = auth.uid()
  )
);
Admin Policy
sql
Copy code
CREATE POLICY "Admins can access all rows"
ON customer_products
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND role = 'ADMIN'
  )
);
Dataset Upload Flow (Admin Only)
Upload Steps
Admin uploads Excel / CSV from UI

File stored in Supabase Storage (datasets bucket)

Backend API route:

Parses file

Validates required columns

Inserts rows into customer_products

Creates entry in datasets table

Required Column Validation
Fail upload if any column missing:

customer_mobile

consent_flag

product_name

warranty_end

Supabase Storage
Bucket: datasets
Private access

Only admins can upload

Used for audit & reprocessing

API Routes (Next.js App Router)
Admin Routes
/api/admin/upload-dataset

/api/admin/stats

/api/admin/customers

/api/admin/products

Use service role key here.

Customer Routes
/api/customer/dashboard

/api/customer/products

/api/customer/alerts

Use anon key + RLS.

Client Setup
Supabase Client
lib/supabase/client.ts → browser client

lib/supabase/server.ts → server client

UI Integration Mapping
Admin UI
Dataset upload → Supabase Storage + DB

Dashboards → aggregated SQL queries

Tables → full dataset access

Customer UI
Auth via mobile number

Queries filtered automatically by RLS

Product & warranty views powered by customer_products

Security Rules Summary
Customers:

Read-only access

Only their own rows

Admins:

Full read/write

Upload & reprocess datasets

No client-side trust — RLS enforced everywhere

Non-Goals (For Now)
No SMS gateway

No real OTP verification

No multi-retailer accounts

No dataset editing from UI

Success Criteria
Admin uploads dataset → data visible instantly

Customer logs in via mobile → sees correct products

No customer can access another customer's data

Admin dashboards reflect real database values

Supabase fully replaces mock data layer