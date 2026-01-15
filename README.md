# ReNotify V2

ReNotify helps you automatically organize your bills and warranties and sends timely reminders so you never miss an important date.

## Features

- 📱 **Customer Management** - Track customer purchases, consent status, and contact information
- 🛡️ **Warranty Tracking** - Monitor warranty status with visual timelines and expiration alerts
- 📋 **AMC Management** - Track Annual Maintenance Contracts and renewal dates
- 🔔 **Smart Reminders** - Automated service reminders based on purchase dates
- 📊 **Dashboard** - Comprehensive overview with KPIs and recent activity
- 🧾 **Invoice Management** - View and search all purchase records
- ⚙️ **Settings** - Configure notification rules and data management

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Supabase** - Backend (PostgreSQL + Auth + Storage)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys from Project Settings → API
   - Create `.env.local` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

3. Set up database:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script to create tables and RLS policies

4. Set up storage:
   - Go to Storage → Create bucket named `datasets`
   - Set it to **Private**
   - Add policies for admin access (see `supabase/README.md`)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Creating Admin User

After setting up Supabase:
1. Sign up via the admin login page
2. Go to Supabase Dashboard → Authentication → Users
3. Find your user and copy the user ID
4. Go to SQL Editor and run:
   ```sql
   UPDATE profiles
   SET role = 'ADMIN'
   WHERE id = 'your_user_id_here';
   ```

## Project Structure

```
ReNotify/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── customers/          # Customer management
│   ├── invoices/           # Invoice listing
│   ├── alerts/             # Alerts & reminders
│   └── settings/           # Settings page
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── sections/           # Page sections
├── lib/                    # Utilities and data
│   ├── types.ts            # TypeScript types
│   └── data/               # Mock data
└── styles/                 # Global styles
```

## Design Principles

- **Mobile-First** - Responsive design optimized for mobile devices
- **Premium UI** - Clean, modern interface with soft shadows and gradients
- **Accessibility** - Clear visual hierarchy and readable typography
- **Performance** - Optimized components and smooth interactions

## License

MIT
