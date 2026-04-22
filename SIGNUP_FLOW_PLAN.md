# Signup And Checkout Flow Plan

## Goal

Separate two different actions on the pricing page:

- Free tier signup should collect sport and city interest before Scout launches everywhere.
- Pro and Elite buttons should move toward checkout pages, but checkout should remain unreleased until payment/subscription infrastructure is ready.

This keeps pre-release demand capture clean while still giving the paid tiers a real destination that can later become Stripe/app checkout.

## Route Direction

### Free / Interest Capture

Use:

```text
/signup/free
```

Purpose:
- collect early player interest
- understand which sports and cities to prioritize
- capture what users want from Scout before the app releases each sport/community

Promise:
- no payment
- join the Scout interest list
- get notified when Scout opens for the user’s sport/city

### Paid Checkout Intent

Use:

```text
/checkout/pro
/checkout/elite
```

Purpose:
- give paid tiers a dedicated destination
- prepare the site for checkout without releasing payment yet
- capture Pro/Elite demand separately from Free interest

Promise before checkout is ready:
- checkout is not live yet
- no payment is collected
- users can reserve interest and get notified when paid memberships open

## Data Direction

### Free Signup Data

Eventually write Free signup submissions to `marketing_sport_interests`.

Core fields:
- first name
- email
- city
- primary sport
- optional goals / notes
- preferred tier: `free`
- source intent: `free_signup`

### Paid Checkout Intent Data

Eventually write Pro/Elite checkout-intent submissions to `marketing_checkout_intents`.

Core fields:
- selected tier: `pro` or `elite`
- first name
- email
- optional city
- optional primary sport
- intent status: `checkout_not_live`

Paid checkout intent is not the same thing as an active subscription.

## First PR Scope

The first PR should ship the safe frontend foundation:

- update this plan
- keep Free routed to `/signup/free`
- route Pro to `/checkout/pro`
- route Elite to `/checkout/elite`
- add coming-soon checkout pages for paid tiers
- keep the Free signup form focused on sport/city interest
- keep all forms static with local confirmation state
- no Supabase writes yet
- no Stripe/payment provider yet

## Future PR Stack

1. Supabase environment foundation
- install `@supabase/supabase-js`
- add `.env.example`
- add `src/lib/supabase.ts`
- add attribution helpers

2. Sport interest persistence
- connect `/signup/free` to `marketing_sport_interests`
- add loading, error, and success states
- capture sport/city launch demand

3. Checkout intent persistence
- connect `/checkout/pro` and `/checkout/elite` to `marketing_checkout_intents`
- keep payment disabled
- capture paid tier demand separately from sport interest

4. Real checkout
- connect Pro/Elite checkout to Stripe or app purchase flow
- store successful subscriptions in app subscription tables
- keep marketing checkout intent as attribution/demand history

## Done Criteria For First PR

- Free tier button opens `/signup/free`.
- Pro tier button opens `/checkout/pro`.
- Elite tier button opens `/checkout/elite`.
- `/signup/pro` and `/signup/elite` do not act like paid signup pages.
- Paid checkout pages clearly state that checkout is not live and no payment is collected.
- Build passes.
