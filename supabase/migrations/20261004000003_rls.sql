-- Puro: row level security
-- Anonymous visitors may only read the public catalog. Every write goes through
-- Server Actions with the service role (which bypasses RLS). Admins are users listed in `admins`.
set search_path = public, extensions;

alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_options enable row level security;
alter table public.settings enable row level security;
alter table public.postal_codes enable row level security;
alter table public.staff enable row level security;
alter table public.gift_cards enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;
alter table public.blocked_times enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.data_deletion_requests enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reviews enable row level security;
alter table public.admins enable row level security;
alter table public.rate_limits enable row level security;

-- ---------- public read ----------
create policy "public reads active categories" on public.service_categories
  for select to anon, authenticated using (is_active);

create policy "public reads active services" on public.services
  for select to anon, authenticated using (is_active);

create policy "public reads service options" on public.service_options
  for select to anon, authenticated using (true);

create policy "public reads settings" on public.settings
  for select to anon, authenticated using (true);

create policy "public reads postal codes" on public.postal_codes
  for select to anon, authenticated using (true);

create policy "public reads gallery" on public.gallery_items
  for select to anon, authenticated using (true);

create policy "public reads published reviews" on public.reviews
  for select to anon, authenticated using (is_published);

-- ---------- admins: full access to everything ----------
do $$
declare
  t text;
begin
  foreach t in array array[
    'service_categories', 'services', 'service_options', 'settings', 'postal_codes', 'staff',
    'gift_cards', 'bookings', 'booking_items', 'blocked_times', 'quote_requests',
    'contact_messages', 'data_deletion_requests', 'gallery_items', 'reviews'
  ] loop
    execute format(
      'create policy "admins manage %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t
    );
  end loop;
end;
$$;

-- a signed-in user may see only their own admin row; the list is managed with SQL / the dashboard
create policy "user reads own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------- defense in depth ----------
-- RLS does not cover TRUNCATE, and anonymous visitors never need to write: anon gets
-- SELECT on the public catalog only; signed-in users keep DML, gated by the admin policies above.
revoke all on all tables in schema public from anon;
revoke truncate on all tables in schema public from authenticated;

grant select on public.service_categories, public.services, public.service_options,
  public.settings, public.postal_codes, public.gallery_items, public.reviews
to anon, authenticated;
