-- Puro: storage buckets
-- gallery        — public before/after photos, managed in /admin
-- quote-photos   — private B2B request photos (max 30 per request, 10 MB each, images only)
-- booking-photos — private photos a customer attaches to a booking (the owner checks the soiling before the visit)
-- Visitors upload to the private buckets through short-lived signed upload URLs; admins view through signed URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('quote-photos', 'quote-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']),
  ('booking-photos', 'booking-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "admins manage puro buckets" on storage.objects
  for all to authenticated
  using (bucket_id in ('gallery', 'quote-photos', 'booking-photos') and public.is_admin())
  with check (bucket_id in ('gallery', 'quote-photos', 'booking-photos') and public.is_admin());
