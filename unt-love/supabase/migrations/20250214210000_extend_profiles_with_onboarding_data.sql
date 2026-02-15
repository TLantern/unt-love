-- Extend profiles table with onboarding data

-- Add About You fields
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists academic_year text;
alter table public.profiles add column if not exists major text;
alter table public.profiles add column if not exists height text;
alter table public.profiles add column if not exists ethnicity text;
alter table public.profiles add column if not exists interests text[];
alter table public.profiles add column if not exists about_me text;
alter table public.profiles add column if not exists instagram_handle text;

-- Add Your Type (preferences) fields
alter table public.profiles add column if not exists age_min integer;
alter table public.profiles add column if not exists age_max integer;
alter table public.profiles add column if not exists academic_years_preference text[];
alter table public.profiles add column if not exists height_preference text;
alter table public.profiles add column if not exists ethnicity_preference text[];
alter table public.profiles add column if not exists intent_preference text;
alter table public.profiles add column if not exists must_have_values text[];
alter table public.profiles add column if not exists lifestyle_match text[];
alter table public.profiles add column if not exists dealbreakers text[];
alter table public.profiles add column if not exists open_to_surprises boolean default false;

-- Add completion tracking
alter table public.profiles add column if not exists profile_completed boolean default false;
alter table public.profiles add column if not exists preferences_completed boolean default false;
alter table public.profiles add column if not exists onboarding_completed boolean default false;
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- Add trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function update_updated_at_column();