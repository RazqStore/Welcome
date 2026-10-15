-- ============================================================
-- Razq Store — قاعدة البيانات
-- الصق هذا الملف كاملاً في Supabase → SQL Editor → Run
-- ============================================================

-- ---------- الجداول ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  provider text,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('discord','fivem')),
  price numeric(10,3) not null check (price >= 0),
  old_price numeric(10,3),
  image_url text,
  badge text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  rating int not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 400),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity (start with 1001),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text,
  items jsonb not null,
  total numeric(10,3) not null,
  coupon text,
  status text not null default 'pending' check (status in ('pending','paid','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  code text primary key,
  percent int not null check (percent between 1 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text
);

-- ---------- دالة التحقق من الأدمن ----------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- إنشاء بروفايل تلقائي عند التسجيل ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, avatar_url, provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'user_name', split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    new.raw_app_meta_data->>'provider'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- الصلاحيات (RLS) ----------
alter table public.profiles  enable row level security;
alter table public.admins    enable row level security;
alter table public.products  enable row level security;
alter table public.reviews   enable row level security;
alter table public.orders    enable row level security;
alter table public.coupons   enable row level security;
alter table public.settings  enable row level security;

-- profiles: المستخدم يشوف نفسه، والأدمن يشوف الجميع
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());

-- admins: كل مستخدم يقدر يعرف هل هو أدمن (يقرأ صفه فقط)
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select using (user_id = auth.uid());

-- products: الكل يقرأ المفعّل، والأدمن يتحكم بكل شيء
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- reviews: الكل يقرأ، المسجّل يضيف/يعدّل تقييمه، الأدمن يحذف
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (true);
drop policy if exists "reviews insert own" on public.reviews;
create policy "reviews insert own" on public.reviews for insert with check (user_id = auth.uid());
drop policy if exists "reviews update own" on public.reviews;
create policy "reviews update own" on public.reviews for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "reviews delete own or admin" on public.reviews;
create policy "reviews delete own or admin" on public.reviews for delete using (user_id = auth.uid() or public.is_admin());

-- orders: المستخدم ينشئ ويشوف طلباته فقط، والأدمن يشوف ويعدّل الكل
drop policy if exists "orders insert own" on public.orders;
create policy "orders insert own" on public.orders for insert with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "orders read own or admin" on public.orders;
create policy "orders read own or admin" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete" on public.orders for delete using (public.is_admin());

-- coupons: الزائر يقدر يتحقق من كود مفعّل، والأدمن يدير الكل
drop policy if exists "coupons read active" on public.coupons;
create policy "coupons read active" on public.coupons for select using (active or public.is_admin());
drop policy if exists "coupons admin write" on public.coupons;
create policy "coupons admin write" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- settings: الكل يقرأ (إعلان، رابط الديسكورد)، والأدمن يكتب
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings for select using (true);
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- ---------- إعدادات افتراضية ----------
insert into public.settings (key, value) values
  ('announcement', 'حياكم الله نورتو في Razq Store'),
  ('announcement_on', 'false')
on conflict (key) do nothing;

-- ============================================================
-- بعد ما تسجّل دخولك بالموقع مرة واحدة، شغّل هذا السطر لتصير أدمن
-- (بدّل البريد ببريد حسابك الذي سجلت به: ديسكورد أو جوجل):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL@example.com';
--
-- ============================================================
