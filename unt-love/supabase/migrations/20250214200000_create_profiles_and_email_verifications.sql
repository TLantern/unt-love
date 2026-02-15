-- unt-love: profiles + email_verifications with RLS

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  email_verified boolean default false,
  created_at timestamptz default now()
);

create table public.email_verifications (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.email_verifications enable row level security;
alter table public.profiles enable row level security;

-- Profiles: users can only read/update their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- email_verifications: no public access (API uses service role)
create policy "email_verifications_no_public" on public.email_verifications
  for all using (false);
