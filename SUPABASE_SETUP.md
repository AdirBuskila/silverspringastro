# Supabase Setup for Silver Spring Observatory

Supabase holds everything managed from the admin page (`/admin`): uploaded photos, which photos are hidden, and which are starred for the home page. The site's built-in photos live in this repository. If Supabase is unreachable, the site still works from the built-in photos, but hidden built-in photos reappear until it's back.

## Setting up a project from scratch

1. Create a project at [supabase.com](https://supabase.com).
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and in Vercel (Settings → Environment Variables). See `env.example`.
3. In the SQL Editor, run `supabase/schema.sql`, then every file in `supabase/migrations/` in order.
4. Add the admin email addresses. This repository is public, so they aren't stored in it:

   ```sql
   insert into public.site_admins (email) values ('someone@example.com');
   ```

5. Under Authentication → Users, use **Add user → Create new user** with **Auto Confirm User** checked. Password login needs no email delivery. Supabase's built-in email only reaches project team members, so invitations and reset emails won't reach anyone else unless custom SMTP is configured.
6. Under Authentication → Sign In / Providers, turn off **Allow new users to sign up**.

## How access works

- Anyone can read photos and settings.
- Only signed-in accounts listed in `site_admins` can change them. This is enforced by the database policies in `supabase/migrations/20261101_photo_controls.sql`, and `/admin` shows its tools only to those accounts.
- The `anon` key is designed to be public. Never put the service role key in the frontend or in this repository.

## Backups

`.github/workflows/backup-uploads.yml` runs weekly and saves the uploaded photos and settings as an artifact, kept for 90 days, on the workflow run's page. It needs the repository secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Its weekly request also keeps the free project from pausing for inactivity. GitHub stops scheduled workflows after 60 days without repository activity and emails the repo owner, who can re-enable it from the Actions tab.

## Permanently removing a built-in photo

"Remove from site" hides a photo from every page, but a built-in file stays at its direct URL and in git history. To remove one properly, delete its entry from `src/data/` and its files from `public/`.
