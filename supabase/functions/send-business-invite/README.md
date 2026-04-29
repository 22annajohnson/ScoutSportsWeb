# Send Business Invite

This Supabase Edge Function sends business portal invitation emails through Resend.

## Required secrets

Set these in your Supabase project before deploying:

- `RESEND_API_KEY`
- `BUSINESS_INVITE_FROM_EMAIL`

Supabase provides these automatically inside the function runtime:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Deploy

```bash
supabase functions deploy send-business-invite
```

## Example sender value

`Scout <invites@yourdomain.com>`

The domain must be verified in Resend.
