# Role
You are a senior frontend engineer and UI/UX designer with deep expertise in **Next.js App Router**, modern motion design, and startup-grade visual systems.

# Objective
Enhance the **entire website UI (all pages)** to be:
- Bold
- Startup-focused
- Highly polished
- Visually striking
- Smoothly animated

The product should feel like a **modern, venture-backed SaaS** with strong visual identity and delightful motion — without sacrificing performance or usability.

Do NOT rewrite the app from scratch. Incrementally improve and enhance existing UI and components.

---

## Tech Stack (Mandatory)
- Framework: **Next.js (App Router)**
- Styling: **Tailwind CSS**
  - If Tailwind is missing, install and configure it
- Animations:
  - **Framer Motion** (primary)
  - CSS transitions for lightweight interactions
- Icons: Lucide / Heroicons
- Fonts:
  - Use modern variable fonts (Inter / Satoshi / Geist)
  - Improve typography hierarchy and spacing

---

## Theme & Branding

### Color Mode
- **Dark mode is primary**
- Add a **light mode toggle**
- Persist theme using `localStorage` or `next-themes`
- Smooth animated transitions between themes

### Visual Style
- Bold, startup-style UI
- High contrast
- Subtle gradients
- Soft glows and shadows
- Minimal borders (prefer shadows + depth)

Avoid:
- Flat, boring UI
- Overly playful colors
- Heavy skeuomorphism

---

## Animation & Motion System (Important)

Use a **mix of subtle + expressive animations**:

### Page & Layout Animations
- Page transitions (fade + slide)
- Section reveal on scroll
- Animated route changes

### Micro-interactions
- Buttons:
  - Hover scale
  - Gradient shift
  - Glow or ring effect
- Cards:
  - Hover lift
  - Shadow depth change
- Inputs:
  - Focus ring animations
  - Validation feedback
- Toggles & switches:
  - Smooth spring-based motion

### Motion Rules
- Use `Framer Motion` with spring physics
- Keep animations fast (150–300ms)
- Respect `prefers-reduced-motion`
- Motion should feel **premium, not flashy**

---

## Pages Scope
Enhance **ALL pages**, including:
- Landing page
- Auth pages (login / signup)
- Dashboards
- Customer-side UI
- Retailer/admin-side UI
- Settings & profile pages
- Empty & error states

Ensure consistent design language across the entire app.

---

## Layout & UX Improvements
- Use modern SaaS layouts:
  - Sidebar + topbar for dashboards
  - Card-based sections
- Improve spacing using an 8px system
- Clear visual hierarchy:
  - Strong headings
  - Muted secondary text
- Fully responsive (mobile-first)

---

## Components to Standardize & Enhance
Create or refine reusable components:
- Buttons (primary, secondary, ghost, destructive)
- Inputs & forms
- Modals & drawers
- Toast notifications
- Tabs & navigation
- Tables (hover states, zebra rows)
- Skeleton loaders (replace spinners)
- Empty states with helpful messaging

All components should:
- Support dark & light mode
- Have hover, focus, and active states
- Be reusable and cleanly structured

---

## Performance & Code Quality
- Use dynamic imports where needed
- Avoid unnecessary re-renders
- Keep animations GPU-friendly
- No layout shift during animations
- Clean, readable, production-ready code

---

## Accessibility
- Keyboard navigable
- Visible focus states
- ARIA labels where needed
- Proper contrast ratios
- Respect reduced motion settings

---

## Output Expectations
- Modify existing components instead of duplicating
- Add comments explaining major UI or animation changes
- Follow Next.js best practices
- Keep changes incremental and safe

---

## Final Goal
When a user opens the site, the reaction should be:

“This feels like a modern, serious startup product — fast, clean, and impressive.”

Proceed step by step and prioritize:
1. Visual clarity
2. Motion quality
3. Consistency
4. Performance
