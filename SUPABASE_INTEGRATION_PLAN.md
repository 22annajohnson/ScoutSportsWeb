# Supabase Integration Plan

## Goal

Connect the Scout Sports marketing website to the existing Supabase database in a way that separates two different user intents:

- Paid tier checkout intent: users who click Pro or Elite because they want to buy a paid membership.
- Sport/city launch interest: users who want Scout to notify them when the app supports their sport, city, or community.

These flows should not be treated as the same thing. Paid tiers should move toward a checkout portion of the site, even if checkout stays unreleased for now. Launch-interest signup should build a database of people, sports, cities, and demand signals before the app fully releases each sport.

## Product Direction

### Paid Tiers

Pro and Elite should eventually route to a checkout experience.

Near-term behavior:
- Pro and Elite buttons can route to checkout-intent pages such as `/checkout/pro` and `/checkout/elite`.
- Checkout pages can be marked as coming soon or invite-only until payment is ready.
- If checkout is not live, the page can still capture "notify me when Pro/Elite opens" as checkout intent.
- The site should not imply payment was taken unless Stripe or another payment provider is fully connected.

Long-term behavior:
- Pro and Elite checkout pages should connect to Stripe Checkout, Supabase Auth, or the app's purchase flow.
- Successful purchases should create or update subscription records in the app database.
- Paid subscriptions should be separate from launch-interest records.

### Free / Sport Interest Signup

Free signup and sport-interest signup should focus on demand collection before launch.

Near-term behavior:
- Free tier can route to `/signup` or `/interest`.
- Users provide email, city, sport, and play preferences.
- The site stores what sports and cities people want Scout to support.
- This data helps prioritize app rollout, sport support, partner discovery, and local community launches.

Long-term behavior:
- When a sport or city opens, interested users can receive launch emails or app invites.
- Interested users can later convert into Free, Pro, or Elite app users.
- Interest records should remain useful even if the user never purchases a paid tier.

## Recommended Route Split

### Interest / Pre-Release Signup Routes

Use these for launch demand and sport availability:

```text
/signup
/signup/free
/interest
/interest/:sport
```

Recommended first pass:
- Keep `/signup/free` for the Free tier.
- Add or eventually redirect to `/interest` when sport launch demand becomes the main signup motion.
- Use the same underlying Supabase table for Free signup and sport interest.

### Checkout Routes

Use these for paid tier purchase intent:

```text
/checkout/pro
/checkout/elite
```

Recommended first pass:
- Add checkout pages, but keep them gated as "coming soon" or "request early access."
- Do not collect payment yet.
- Capture checkout intent separately from sport launch interest.

## Data Model Divide

### Table 1: `marketing_sport_interests`

Purpose:
- capture pre-release demand for sports, cities, and player communities
- power launch prioritization
- support waitlists and launch notifications

Source routes:
- `/signup/free`
- `/signup`
- `/interest`
- `/interest/:sport`
- fallback capture from checkout pages if a paid tier is not available yet

Recommended columns:

```sql
create table marketing_sport_interests (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  email text not null,
  city text not null,
  state_region text,
  country text default 'US',
  primary_sport text not null,
  secondary_sports text[],
  skill_level text,
  play_frequency text,
  looking_for text,
  preferred_tier text check (preferred_tier in ('free', 'pro', 'elite')),
  source_intent text not null default 'sport_interest',
  launch_status_at_signup text default 'pre_release',
  landing_path text,
  submitted_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);
```

Notes:
- `preferred_tier` is only a preference, not a subscription.
- `source_intent` should distinguish `free_signup`, `sport_interest`, `checkout_fallback`, or `waitlist`.
- `launch_status_at_signup` helps separate people waiting for unreleased sports from users signing up after launch.

Recommended indexes:

```sql
create index marketing_sport_interests_email_idx
  on marketing_sport_interests (email);

create index marketing_sport_interests_sport_city_idx
  on marketing_sport_interests (primary_sport, city);

create index marketing_sport_interests_created_at_idx
  on marketing_sport_interests (created_at desc);
```

### Table 2: `marketing_checkout_intents`

Purpose:
- capture users who clicked into Pro or Elite before checkout is released
- measure paid-tier demand separately from sport launch demand
- support follow-up when paid checkout becomes available

Source routes:
- `/checkout/pro`
- `/checkout/elite`
- Pro and Elite CTA fallback forms

Recommended columns:

```sql
create table marketing_checkout_intents (
  id uuid primary key default gen_random_uuid(),
  selected_tier text not null check (selected_tier in ('pro', 'elite')),
  email text not null,
  first_name text,
  city text,
  primary_sport text,
  intent_status text not null default 'checkout_not_live',
  checkout_path text,
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);
```

Notes:
- This table does not represent a paid subscription.
- It should not be used as source of truth for active paid users.
- Once Stripe is live, successful paid subscriptions should be written to app subscription tables, not only this marketing table.

Recommended indexes:

```sql
create index marketing_checkout_intents_email_idx
  on marketing_checkout_intents (email);

create index marketing_checkout_intents_tier_idx
  on marketing_checkout_intents (selected_tier);

create index marketing_checkout_intents_created_at_idx
  on marketing_checkout_intents (created_at desc);
```

### Table 3: `marketing_partner_leads`

Purpose:
- capture business, club, court, restaurant, and sponsor leads
- keep partnership demand separate from player demand and checkout intent

Source routes:
- `/business`
- future partnership landing pages

Recommended columns:

```sql
create table marketing_partner_leads (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  email text not null,
  organization_name text not null,
  organization_type text not null,
  city text not null,
  partnership_interest text,
  notes text,
  landing_path text,
  submitted_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamptz not null default now()
);
```

## Flow Definitions

### Free Tier Click

Recommended route:

```text
/signup/free
```

Data written:
- `marketing_sport_interests`
- `preferred_tier = 'free'`
- `source_intent = 'free_signup'`

User-facing promise:
- Join Scout early.
- Tell us your sport and city.
- Get notified when your local sports community opens.

### Pro Tier Click

Recommended route:

```text
/checkout/pro
```

Data written before checkout is live:
- `marketing_checkout_intents`
- `selected_tier = 'pro'`
- `intent_status = 'checkout_not_live'`

Optional additional data:
- If the user also enters city and sport, write or upsert a matching row in `marketing_sport_interests` with `preferred_tier = 'pro'`.

User-facing promise before checkout is live:
- Pro is not available yet.
- Reserve interest and get notified when paid memberships open.
- No payment is collected.

### Elite Tier Click

Recommended route:

```text
/checkout/elite
```

Data written before checkout is live:
- `marketing_checkout_intents`
- `selected_tier = 'elite'`
- `intent_status = 'checkout_not_live'`

Optional additional data:
- If the user also enters city and sport, write or upsert a matching row in `marketing_sport_interests` with `preferred_tier = 'elite'`.

User-facing promise before checkout is live:
- Elite is not available yet.
- Reserve premium access interest.
- Get notified about Elite circles, visibility, and partner perks when available.
- No payment is collected.

## Security Plan

Use the Supabase anon key in the Vite app:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never expose the Supabase service role key in the website.

Enable RLS on all marketing tables.

Initial public permissions:
- allow anonymous inserts into marketing tables
- do not allow anonymous selects
- do not allow anonymous updates
- do not allow anonymous deletes

Example policy direction:

```sql
alter table marketing_sport_interests enable row level security;
alter table marketing_checkout_intents enable row level security;
alter table marketing_partner_leads enable row level security;

create policy "Allow public sport interest inserts"
  on marketing_sport_interests
  for insert
  to anon
  with check (true);

create policy "Allow public checkout intent inserts"
  on marketing_checkout_intents
  for insert
  to anon
  with check (true);

create policy "Allow public partner lead inserts"
  on marketing_partner_leads
  for insert
  to anon
  with check (true);
```

## Frontend Implementation Plan

### Phase 1: Clarify Routes And Copy

- Keep Free signup as interest capture.
- Move Pro and Elite CTAs toward checkout routes.
- Add checkout coming-soon pages for Pro and Elite.
- Clearly state that paid checkout is not live yet.
- Keep no-payment language visible on checkout-intent pages.

### Phase 2: Supabase Foundation

- install `@supabase/supabase-js`
- add `.env.example`
- add `src/lib/supabase.ts`
- add helpers for UTM/referrer attribution
- add typed insert helpers for sport interests and checkout intents

### Phase 3: Sport Interest Capture

- write Free signup and sport-interest submissions to `marketing_sport_interests`
- capture sport, city, frequency, skill level, and what the user wants from Scout
- show loading, success, and error states

### Phase 4: Checkout Intent Capture

- write Pro and Elite pre-checkout submissions to `marketing_checkout_intents`
- optionally also write sport/city demand to `marketing_sport_interests`
- keep checkout marked unreleased until payment provider is connected

### Phase 5: Real Checkout

- connect `/checkout/pro` and `/checkout/elite` to Stripe or the app's purchase flow
- keep successful subscriptions in dedicated app subscription tables
- use `marketing_checkout_intents` only as pre-checkout demand and attribution history

### Phase 6: Partner Lead Capture

- add a dedicated form to `/business`
- write partner submissions to `marketing_partner_leads`
- add confirmation and error states

## Validation Plan

Sport interest validation:
- valid email
- required city
- required primary sport
- optional first name
- optional skill level and play frequency

Checkout intent validation:
- selected tier must be `pro` or `elite`
- valid email
- optional sport and city
- no payment fields until real checkout is ready

Partner lead validation:
- valid email
- required contact name
- required organization name
- required organization type
- required city

## Recommended PR Stack

### PR 1: Clarify Signup vs Checkout Plan

- update this plan
- update route/copy direction if needed
- no Supabase writes yet

### PR 2: Checkout Route Foundation

- add `/checkout/pro` and `/checkout/elite`
- route Pro and Elite buttons to checkout pages
- keep Free routed to signup/interest capture
- add coming-soon checkout copy

### PR 3: Supabase Environment Foundation

- install `@supabase/supabase-js`
- add `.env.example`
- add Supabase client helper
- add attribution helper

### PR 4: Sport Interest Persistence

- connect Free/interest form to `marketing_sport_interests`
- add loading, success, and error states
- capture sport/city demand cleanly

### PR 5: Checkout Intent Persistence

- connect checkout coming-soon forms to `marketing_checkout_intents`
- keep payment disabled
- capture Pro and Elite demand separately

### PR 6: Business Partner Lead Capture

- add partner form
- connect to `marketing_partner_leads`

## Open Questions

- Should `/signup/free` remain the canonical Free route, or should Free move to `/interest`?
- Which sports should be first-class options before launch?
- Do you want checkout pages hidden behind a feature flag until ready?
- Should Pro and Elite checkout-intent users also be added to sport-interest demand automatically?
- Should Supabase schema changes live in this repo as SQL files, or be managed in the app repo?
