# Avocat-Link

Avocat-Link is a full-stack legal consultation platform built with Next.js and Supabase.

## Features

- Email/password authentication with Supabase Auth
- Protected dashboard route for authenticated users only
- Lawyers list from the `avocats` table
- Consultation creation flow (lawyer + date/time + PDF upload)
- Personal consultation history with secure signed PDF links
- Row Level Security and private storage policies for strict data isolation

## Tech Stack

- Next.js (App Router, TypeScript)
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS (utility-first styling)
- Deployment target: Vercel

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` with your Supabase project values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (recommended for auth redirects)

4. Apply database schema and policies in Supabase SQL Editor using:

- `supabase/migrations/20260426235000_avocat_link_schema.sql`

5. Run development server:

```bash
npm run dev
```

## Auth Redirect Configuration

In Supabase Auth settings:

- Add local redirect URL: `http://localhost:3000/auth/callback`
- Add production redirect URL: `https://your-vercel-domain.vercel.app/auth/callback`

## Security Model

- `consultations` uses RLS so users can only read/write their own rows (`client_id = auth.uid()`).
- `avocats` is read-only for authenticated users.
- PDF files are stored in private bucket `consultation-documents`.
- Storage policies restrict object access to user-scoped paths:
  - `<user_id>/consultations/<file>.pdf`

## Scripts

- `npm run dev` - start local dev server
- `npm run lint` - run ESLint
- `npm run build` - create production build
- `npm run start` - serve production build

## Deployment on Vercel

1. Import the repository to Vercel.
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
3. Deploy and verify login, route protection, PDF upload, and consultation list flow.
