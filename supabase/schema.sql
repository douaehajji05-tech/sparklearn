-- SparkLearn database schema
-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run.
--
-- Storage: files are stored one bucket per category (exams, resources,
-- scholarships, vocabulary, reports, weekly) rather than a single "uploads"
-- bucket, since those 6 buckets already existed in the project. All 6 need
-- "Public bucket" turned ON (Storage > select bucket > Edit bucket).
--
-- Setup checklist (do these in the Supabase dashboard, in this order):
--   1. Run this whole file in the SQL Editor.
--   2. Storage > for each of exams/resources/scholarships/vocabulary/reports/weekly:
--      Edit bucket > toggle "Public bucket" ON.
--   3. Authentication > Providers > Email > turn OFF "Allow new users to sign up"
--      (there is no signup form on the site — you are the only account).
--   4. Authentication > Users > Add user > create your own login (email + password).
--      That's the account you'll use on login.html.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- files: every PDF published from the dashboard (exams, resources, etc.)
-- ---------------------------------------------------------------------------

create table if not exists public.files (
    id          uuid primary key default gen_random_uuid(),
    category    text not null check (category in ('exams','resources','scholarships','vocabulary','reports','weekly')),
    year        text,
    semester    text,
    title       text not null,
    file_path   text not null,
    file_url    text not null,
    created_at  timestamptz not null default now()
);

alter table public.files enable row level security;

create policy "Public can read files"
    on public.files for select
    using (true);

create policy "Authenticated can insert files"
    on public.files for insert
    to authenticated
    with check (true);

create policy "Authenticated can delete files"
    on public.files for delete
    to authenticated
    using (true);

-- ---------------------------------------------------------------------------
-- announcements: shown in the "Latest Announcements" block on the homepage
-- ---------------------------------------------------------------------------

create table if not exists public.announcements (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    content     text not null,
    created_at  timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Public can read announcements"
    on public.announcements for select
    using (true);

create policy "Authenticated can insert announcements"
    on public.announcements for insert
    to authenticated
    with check (true);

create policy "Authenticated can delete announcements"
    on public.announcements for delete
    to authenticated
    using (true);

-- ---------------------------------------------------------------------------
-- storage: one bucket per category holds the actual PDF files.
-- Make each bucket public first (see step 2 above), then run these policies.
-- ---------------------------------------------------------------------------

create policy "Public can view uploaded files"
    on storage.objects for select
    using (bucket_id in ('exams','resources','scholarships','vocabulary','reports','weekly'));

create policy "Authenticated can upload files"
    on storage.objects for insert
    to authenticated
    with check (bucket_id in ('exams','resources','scholarships','vocabulary','reports','weekly'));

create policy "Authenticated can delete uploaded files"
    on storage.objects for delete
    to authenticated
    using (bucket_id in ('exams','resources','scholarships','vocabulary','reports','weekly'));
