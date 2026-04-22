# Scout Sports Marketing Site

Premium marketing website for Scout Sports, built with React, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, and Lucide React.

## What This Includes

- Multi-page marketing site foundation
- Responsive `Home`, `Pricing`, `How It Works`, and `Businesses / Clubs` pages
- Shared navigation, footer, layout, and reusable UI components
- Premium dark theme with Scout's purple and blue accent system
- Centralized content data for easy iteration

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and fill in the Supabase values when marketing form persistence is ready:

```bash
cp .env.example .env.local
```

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The service role key should never be exposed in this frontend project.

## Supabase Setup

The SQL setup script is intentionally kept local and ignored by git. Use your local Supabase setup script in the Supabase SQL editor to create the marketing tables, indexes, and insert-only public RLS policies.

## Project Structure

```text
src/
  assets/
  components/
  data/
  pages/
  sections/
  styles/
  App.tsx
  main.tsx
```

## Notes

- The current first pass prioritizes the overall visual system, layout quality, shared structure, and Home/Pricing depth.
- The remaining pages are fully routed and styled so they can scale into a more detailed marketing site without rework.
