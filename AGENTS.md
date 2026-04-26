# Avocat-Link Build Plan

## Project Goal
Build a production-ready full-stack web app named **Avocat-Link** using:
- Frontend: Next.js (React)
- Backend: Supabase (Auth + PostgreSQL + Storage)
- Deployment: Vercel

The app connects clients with lawyers and lets authenticated users create and track legal consultations.

## Implementation Plan
1. Initialize a Next.js app (TypeScript, App Router, ESLint) and set up environment variables for Supabase.
2. Add Supabase client architecture for browser/server usage and clean API integration.
3. Implement email/password authentication with Supabase Auth.
4. Add protected routes so only logged-in users can access dashboard pages.
5. Create database schema for `avocats` and `consultations`.
6. Add constraints and defaults:
   - UUID primary keys
   - `created_at` timestamps
   - `status` allowed values: `pending`, `accepted`, `completed`
7. Enable RLS and write policies so users can only access their own consultations.
8. Configure Storage bucket for PDF uploads and store file reference in `fichier_url`.
9. Build client flows:
   - Login
   - Dashboard
   - View lawyers list
   - Create consultation (lawyer + date/time + PDF upload)
   - View personal consultation status list
10. Ensure responsive UI for desktop and mobile.
11. Run lint/build checks and prepare Vercel deployment settings.

## Database Design

### Table: `avocats`
- `id` (uuid, primary key)
- `nom` (text)
- `specialite` (text)
- `created_at` (timestamp)

### Table: `consultations`
- `id` (uuid, primary key)
- `client_id` (uuid, foreign key -> `auth.users.id`)
- `avocat_id` (uuid, foreign key -> `avocats.id`)
- `date_consultation` (timestamp)
- `status` (text: `pending`, `accepted`, `completed`)
- `fichier_url` (text)
- `created_at` (timestamp)

## Security Plan
- Enable RLS on `consultations`.
- Allow users to `SELECT` only rows where `client_id = auth.uid()`.
- Allow users to `INSERT` only rows where `client_id = auth.uid()`.
- Restrict updates/deletes to own rows only (if enabled).
- Keep `avocats` readable for authenticated users (or public read if required).
- Restrict storage access so users can only upload/read their own PDF files.

## Storage Plan
- Create a dedicated bucket for consultation documents (PDF only).
- Upload using user-scoped paths (example: `<user_id>/consultations/<file>.pdf`).
- Save the resulting file path/URL in `consultations.fichier_url`.

## UI Flow
Login -> Dashboard -> Select Lawyer -> Create Consultation -> Upload File -> View Status

## Stitch MCP UI Plan
- Use Stitch MCP to generate UI screens for:
  - Login/Auth screen
  - Dashboard with lawyers list
  - Consultation creation form with upload
  - Consultations status list
- Apply generated design in Next.js components while preserving accessibility and responsiveness.

## Deployment Readiness
- Use environment variables for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Configure Supabase Auth redirect URLs for Vercel domains.
- Verify production build and route protection before deployment.

## Agent Rules
- Use only Tailwind CSS for styling across the project.
- Do not use CSS Modules, styled-components, Emotion, Sass, or inline style objects unless explicitly requested.
- Keep styling consistent with utility-first Tailwind patterns and responsive classes.
