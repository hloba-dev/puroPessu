-- Puro: server-side functions (called with the service role only)
set search_path = public, extensions;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Atomically books a slot: picks the first free active staff member; the exclusion
-- constraint on bookings makes a double booking impossible even under concurrency.
create or replace function public.book_slot(p_booking jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_starts timestamptz := (p_booking ->> 'starts_at')::timestamptz;
  v_ends timestamptz := (p_booking ->> 'ends_at')::timestamptz;
  v_gift text := nullif(p_booking ->> 'gift_card_code', '');
  v_discount int := coalesce((p_booking ->> 'discount_cents')::int, 0);
  v_card public.gift_cards;
  v_staff record;
  v_id uuid;
  v_ref text;
  v_token text;
begin
  if v_starts is null or v_ends is null or v_ends <= v_starts then
    raise exception 'invalid_range';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'no_items';
  end if;

  if v_gift is not null then
    select * into v_card
    from public.gift_cards g
    where g.code = v_gift
      and g.status = 'paid'
      and (g.valid_until is null or g.valid_until >= current_date)
    for update;
    if not found then
      raise exception 'gift_card_invalid';
    end if;
    -- a value card can never pay more than what is left on it
    if v_card.amount_cents is not null and v_discount > coalesce(v_card.balance_cents, v_card.amount_cents) then
      raise exception 'gift_card_invalid';
    end if;
  elsif v_discount <> 0 then
    raise exception 'discount_without_gift_card';
  end if;

  for v_staff in select s.id from public.staff s where s.is_active order by s.id loop
    if exists (
      select 1
      from public.blocked_times b
      where (b.staff_id is null or b.staff_id = v_staff.id)
        and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(v_starts, v_ends, '[)')
    ) then
      continue;
    end if;

    begin
      v_ref := 'PU-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
      v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');

      insert into public.bookings (
        ref_code, locale, customer_type, name, phone, email, company, y_tunnus,
        address, postal_code, city, floor, parking, notes,
        starts_at, ends_at, duration_min, staff_id,
        subtotal_cents, travel_cents, min_fill_cents, promo_cents, promo_details, discount_cents, total_cents,
        gift_card_code, marketing_consent, manage_token
      ) values (
        v_ref,
        coalesce(p_booking ->> 'locale', 'fi'),
        coalesce(p_booking ->> 'customer_type', 'private')::public.customer_type,
        p_booking ->> 'name',
        p_booking ->> 'phone',
        p_booking ->> 'email',
        nullif(p_booking ->> 'company', ''),
        nullif(p_booking ->> 'y_tunnus', ''),
        p_booking ->> 'address',
        p_booking ->> 'postal_code',
        p_booking ->> 'city',
        nullif(p_booking ->> 'floor', ''),
        nullif(p_booking ->> 'parking', ''),
        nullif(p_booking ->> 'notes', ''),
        v_starts,
        v_ends,
        (p_booking ->> 'duration_min')::int,
        v_staff.id,
        (p_booking ->> 'subtotal_cents')::int,
        coalesce((p_booking ->> 'travel_cents')::int, 0),
        coalesce((p_booking ->> 'min_fill_cents')::int, 0),
        coalesce((p_booking ->> 'promo_cents')::int, 0),
        coalesce(p_booking -> 'promo_details', '{}'::jsonb),
        v_discount,
        (p_booking ->> 'total_cents')::int,
        v_gift,
        coalesce((p_booking ->> 'marketing_consent')::boolean, false),
        v_token
      )
      returning id into v_id;

      insert into public.booking_items (
        booking_id, service_id, service_slug, name, option_ids, option_slugs,
        qty, unit_price_cents, duration_min, very_dirty
      )
      select
        v_id,
        (i ->> 'service_id')::int,
        i ->> 'service_slug',
        i ->> 'name',
        coalesce(array(select jsonb_array_elements_text(i -> 'option_ids')::int), '{}'),
        coalesce(array(select jsonb_array_elements_text(i -> 'option_slugs')), '{}'),
        (i ->> 'qty')::int,
        (i ->> 'unit_price_cents')::int,
        coalesce((i ->> 'duration_min')::int, 0),
        coalesce((i ->> 'very_dirty')::boolean, false)
      from jsonb_array_elements(p_items) as i;

      if v_gift is not null then
        -- value card: the remainder stays usable; service card: used up in one go
        update public.gift_cards g
        set balance_cents = case
              when g.amount_cents is null then g.balance_cents
              else coalesce(g.balance_cents, g.amount_cents) - v_discount
            end,
            status = case
              when g.amount_cents is null or coalesce(g.balance_cents, g.amount_cents) - v_discount <= 0
                then 'redeemed'::public.gift_card_status
              else 'paid'::public.gift_card_status
            end,
            redeemed_booking_id = v_id
        where g.id = v_card.id;
      end if;

      return jsonb_build_object(
        'id', v_id,
        'ref_code', v_ref,
        'manage_token', v_token,
        'staff_id', v_staff.id
      );
    exception
      when exclusion_violation then
        -- this staff member is busy: try the next one
        null;
    end;
  end loop;

  raise exception 'slot_taken';
end;
$$;

-- Moves an active, not yet started booking to a new time; keeps the same staff member when possible.
create or replace function public.reschedule_booking(p_token text, p_starts timestamptz, p_ends timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_booking public.bookings;
  v_staff record;
begin
  if p_ends <= p_starts then
    raise exception 'invalid_range';
  end if;

  select * into v_booking
  from public.bookings
  where manage_token = p_token and status in ('pending', 'confirmed') and starts_at > now()
  for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  for v_staff in
    select s.id from public.staff s where s.is_active order by (s.id = v_booking.staff_id) desc, s.id
  loop
    if exists (
      select 1
      from public.blocked_times b
      where (b.staff_id is null or b.staff_id = v_staff.id)
        and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_starts, p_ends, '[)')
    ) then
      continue;
    end if;

    begin
      update public.bookings
      set starts_at = p_starts, ends_at = p_ends, staff_id = v_staff.id
      where id = v_booking.id;
      return jsonb_build_object('id', v_booking.id, 'staff_id', v_staff.id);
    exception
      when exclusion_violation then
        null;
    end;
  end loop;

  raise exception 'slot_taken';
end;
$$;

-- Gift card bookkeeping follows the booking status, whoever changes it (customer link or admin):
-- cancelling gives the used amount back; re-activating a cancelled booking takes it again,
-- and is refused if the card has been spent elsewhere in the meantime.
create or replace function public.sync_gift_card_with_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_card public.gift_cards;
begin
  if new.gift_card_code is null or (new.status = 'cancelled') = (old.status = 'cancelled') then
    return new;
  end if;

  select * into v_card from public.gift_cards where code = new.gift_card_code for update;
  if not found then
    return new;
  end if;

  if new.status = 'cancelled' then
    update public.gift_cards g
    set status = 'paid',
        balance_cents = case
          when g.amount_cents is null then g.balance_cents
          else least(g.amount_cents, coalesce(g.balance_cents, 0) + new.discount_cents)
        end,
        redeemed_booking_id = null
    where g.id = v_card.id and g.status in ('paid', 'redeemed');
  else
    if v_card.status <> 'paid'
       or (v_card.amount_cents is not null and coalesce(v_card.balance_cents, v_card.amount_cents) < new.discount_cents) then
      raise exception 'gift_card_unavailable';
    end if;
    update public.gift_cards g
    set balance_cents = case
          when g.amount_cents is null then g.balance_cents
          else coalesce(g.balance_cents, g.amount_cents) - new.discount_cents
        end,
        status = case
          when g.amount_cents is null or coalesce(g.balance_cents, g.amount_cents) - new.discount_cents <= 0
            then 'redeemed'::public.gift_card_status
          else 'paid'::public.gift_card_status
        end,
        redeemed_booking_id = new.id
    where g.id = v_card.id;
  end if;
  return new;
end;
$$;

create trigger bookings_sync_gift_card
after update of status on public.bookings
for each row execute function public.sync_gift_card_with_booking();

-- Has this customer booked before? Decides between the first-order and the returning-customer discount.
create or replace function public.customer_has_bookings(p_email text, p_phone text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bookings b
    where b.status in ('pending', 'confirmed', 'done')
      -- an empty value never matches: manual bookings taken by phone have no e-mail
      and (
        (nullif(trim(p_email), '') is not null and lower(b.email) = lower(trim(p_email)))
        or (nullif(trim(p_phone), '') is not null and b.phone = trim(p_phone))
      )
  );
$$;

-- Fixed-window rate limiter. Returns true while the caller is within the limit.
create or replace function public.hit_rate_limit(p_key text, p_window_seconds int, p_max int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_count int;
begin
  insert into public.rate_limits as r (key, bucket, count)
  values (p_key, v_bucket, 1)
  on conflict (key, bucket) do update set count = r.count + 1
  returning r.count into v_count;

  if random() < 0.02 then
    delete from public.rate_limits where bucket < now() - interval '1 day';
  end if;

  return v_count <= p_max;
end;
$$;

-- These run with definer rights: only the server (service role) may call them.
revoke execute on function public.book_slot(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.reschedule_booking(text, timestamptz, timestamptz) from public, anon, authenticated;
revoke execute on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
revoke execute on function public.customer_has_bookings(text, text) from public, anon, authenticated;
grant execute on function public.customer_has_bookings(text, text) to service_role;
grant execute on function public.book_slot(jsonb, jsonb) to service_role;
grant execute on function public.reschedule_booking(text, timestamptz, timestamptz) to service_role;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
