# ECSA Campus Platform (EST-2026-27)

The official digital hub for the **Electronics & Computer Students Association (ECSA)** at PCET's Nutan Maharashtra Institute of Engineering & Technology (NMIET).

Designed around the pillars of **Create | Connect | Build**, this platform features a premium, human-crafted Antigravity 3D UI and robust role-based access control.

## Tech Stack
*   **Frontend:** Next.js 14+ (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, Framer Motion
*   **3D Environment:** React Three Fiber, Three.js, @react-three/drei
*   **Scrolling:** @studio-freight/lenis
*   **Backend & Auth:** Supabase (Auth, PostgreSQL, Storage, Edge Functions)

---

## Local Development Setup

### 1. Installation
Clone the repository (if not already local) and install dependencies:
```bash
npm install
```

### 2. Supabase Configuration
Create a new project on [Supabase](https://supabase.com/).

**Environment Variables:**
Create a `.env.local` file in the root of your project and add your credentials (found in Supabase > Settings > API):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Database Migrations:**
In your Supabase dashboard, open the **SQL Editor**, paste the contents of the `supabase_schema.sql` file (found in the root of this project), and click **Run**. This will generate all the required tables and Row Level Security (RLS) policies.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Setup & Permissions

By default, any user who signs in via the Magic Link (OTP) is assigned the `student` role. 

**To create the first ECSA Admin or Super Admin:**
1. Log in to the application at least once so your profile is created.
2. Go to your Supabase Dashboard.
3. Navigate to **Table Editor** > `profiles`.
4. Find your email/ID row.
5. Change the `role` column from `student` to `ecsa_admin` (or `super_admin`).
6. Refresh the local application and navigate to `/admin` to access the Content Moderation Dashboard.

---

## Seeding Demo Data
To thoroughly test the application, you can inject dummy data into the Supabase database.
You can execute standard `INSERT` SQL queries via the Supabase SQL editor targeting the `clubs`, `events`, `projects`, and `ideas` tables. Make sure to associate `created_by` or `author_id` fields with a valid UUID from your `auth.users` table.

---

## Production Deployment (Vercel)
This project is highly optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **Important:** Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel deployment settings.
5. Click **Deploy**.

Vercel will automatically handle Next.js Server Components, Image Optimization, and Edge caching.
