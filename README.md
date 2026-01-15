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

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

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
