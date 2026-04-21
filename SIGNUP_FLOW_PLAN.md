# Signup Flow Plan

## Goal

Create clear signup destinations for every pricing tier so visitors who click Free, Pro, or Elite can take the next step instead of looping back to the homepage.

## Stack Plan

1. Signup page foundation
- Add routed signup pages for `/signup/free`, `/signup/pro`, and `/signup/elite`.
- Wire all pricing tier buttons to the matching signup route.
- Use the existing pricing tier data so plan names, prices, descriptions, and features stay consistent.
- Add a polished static signup form that captures early-access interest without introducing payment or backend dependencies.

2. Conversion polish
- Add stronger tier-specific confirmation states.
- Improve form microcopy around what happens next for Free, Pro, and Elite.
- Add reassurance copy for paid tiers that payment will happen later when subscriptions are ready.

3. Backend/payment integration
- Decide whether Free creates an account directly or joins early access first.
- Connect form submissions to the chosen backend or CRM.
- Add Stripe Checkout or subscription billing for Pro and Elite when pricing is final.
- Track signup conversion events for each tier.

4. Post-signup experience
- Add a thank-you page or modal with next actions.
- Offer app download, waitlist share, or city/sport onboarding.
- Consider business logic for invite codes, early access priority, and launch cities.

## First PR Scope

The first PR should only ship the safe frontend foundation:

- `SIGNUP_FLOW_PLAN.md`
- tier-specific signup routes
- pricing CTA routing
- static signup form
- confirmation state after form submission
- no payment provider
- no backend integration

## Done Criteria

- Free tier button opens `/signup/free`.
- Pro tier button opens `/signup/pro`.
- Elite tier button opens `/signup/elite`.
- Unknown signup tiers redirect back to pricing.
- Each signup page clearly shows the selected tier, benefits, and next step.
- Build passes.
