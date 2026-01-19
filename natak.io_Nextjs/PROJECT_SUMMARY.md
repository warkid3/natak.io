# NATAK.IO Project Summary

**Last Updated:** 2026-01-19
**Tech Stack:** Next.js 16 (App Router), TailwindCSS, Supabase, Framer Motion.

## 🏗️ Architecture Overview

The project is structured as a **Monorepo-style Single App**, using Next.js Route Groups to separate distinct experiences (Marketing vs. App) within the same codebase.

### 📁 Directory Structure

We use **Route Groups** (folders in parentheses) to isolate layouts. These folders do *not* affect the URL path.

| Route Group | Path in Code | URL | Purpose | Layout Details |
| :--- | :--- | :--- | :--- | :--- |
| **(marketing)** | `app/(marketing)/` | `/` | Public Landing Page | **Zero UI**: Clean layout, no sidebar, custom headers/footers. |
| **(auth)** | `app/(auth)/` | `/login`, `/signup` | Authentication | **Minimal**: Centered content, no sidebar, focus on forms. |
| **(app)** | `app/(app)/` | `/assets`, `/admin`, etc. | Main Application | **Dashboard UI**: Includes `AppSidebar`, Topbar, and logged-in state. |

---

## 🗺️ Key Locations

### 1. Landing Page (Brutalist Aesthetic)
- **File**: [`app/(marketing)/page.tsx`](app/(marketing)/page.tsx)
- **Components**: `components/landing/*` (HeroVisual, Features, GalleryWall)
- **Status**: Production-ready, Pricing section removed (as of Jan 19).

### 2. Main Dashboard (The App)
- **Home Redirect**: `/` -> `/assets` (via `app/(app)/page.tsx` redirect logic implies user flow starts at assets or login).
- **Asset DAM**: [`app/(app)/assets/page.tsx`](app/(app)/assets/page.tsx) - The core Interface for managing AI generations.
- **Admin**: [`app/(app)/admin/page.tsx`](app/(app)/admin/page.tsx) - User management and audit logs.
- **Studio**: [`app/(app)/studio/page.tsx`](app/(app)/studio/page.tsx) - Redirects to Assets (currently).

### 3. Authentication
- **Login**: [`app/(auth)/login/page.tsx`](app/(auth)/login/page.tsx)
- **Callback**: [`app/(auth)/auth/callback/page.tsx`](app/(auth)/auth/callback/page.tsx) - Handles Supabase OAuth.

---

## 🎨 Global Styling
- **File**: [`app/globals.css`](app/globals.css)
- **Theme**: "Brutalist Industrial"
- **Key Colors**: Void Black (`#0a0a0b`), Acid Lime (`#ccff00`), Charcoal (`#1a1a1d`).

## 🛠️ Recent Changes
1.  **Merged Landing Page**: Integrated the external marketing site into this repo.
2.  **Refactored Routes**: Moved all app features into `(app)` to fix the sidebar showing up on the landing page.
3.  **Removed Pricing**: Hidden from the landing page view.

## 🚀 How to Run
```bash
npm run dev
# Landing Page: localhost:3000
# App: localhost:3000/assets
# Login: localhost:3000/login
```
