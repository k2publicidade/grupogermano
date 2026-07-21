create table if not exists public.cms_content (
  id text primary key default uuid_generate_v4()::text, key text unique not null, section text not null,
  label text not null, content_type text not null check (content_type in ('text','textarea','image','url')),
  value text not null default '', status text not null default 'draft' check (status in ('published','draft')),
  updated_at timestamptz not null default now(), updated_by uuid references public.profiles(id)
);
create index if not exists cms_content_section_idx on public.cms_content(section, status);

create table if not exists public.cms_products (
  id text primary key, data jsonb not null, sort_order int not null default 0, updated_at timestamptz not null default now()
);

create table if not exists public.media_library (
  id text primary key default uuid_generate_v4()::text, name text not null, storage_path text not null unique,
  alt_text text not null default '', width int, height int, created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.form_submissions (
  id text primary key default uuid_generate_v4()::text, form_key text not null,
  payload jsonb not null default '{}', status text not null default 'new' check (status in ('new','contacted','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists form_submissions_inbox_idx on public.form_submissions(status, created_at desc);

create table if not exists public.cms_audit_log (
  id text primary key default uuid_generate_v4()::text, action text not null, resource text not null,
  actor_id uuid references public.profiles(id), created_at timestamptz not null default now()
);
create index if not exists cms_audit_log_created_idx on public.cms_audit_log(created_at desc);

alter table public.cms_content enable row level security;
alter table public.cms_products enable row level security;
alter table public.media_library enable row level security;
alter table public.form_submissions enable row level security;
alter table public.cms_audit_log enable row level security;

create policy "public published cms" on public.cms_content for select using (status = 'published');
create policy "staff cms content" on public.cms_content for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "public cms products" on public.cms_products for select using (true);
create policy "staff cms products" on public.cms_products for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "public media metadata" on public.media_library for select using (true);
create policy "staff media" on public.media_library for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "public submit forms" on public.form_submissions for insert with check (true);
create policy "staff submissions" on public.form_submissions for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "staff audit" on public.cms_audit_log for select to authenticated using (public.is_staff());
create policy "staff insert audit" on public.cms_audit_log for insert to authenticated with check (public.is_staff());

insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true) on conflict do nothing;
create policy "public site media" on storage.objects for select using (bucket_id = 'site-media');
create policy "staff manage site media" on storage.objects for all to authenticated using (bucket_id = 'site-media' and public.is_staff()) with check (bucket_id = 'site-media' and public.is_staff());

create or replace function public.replace_cms_document(p_document jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  -- Explicit predicates keep Supabase's safe-update guard enabled while this
  -- service-role-only RPC replaces the document atomically.
  delete from public.cms_audit_log where true;
  delete from public.form_submissions where true;
  delete from public.media_library where true;
  delete from public.cms_content where true;
  delete from public.cms_products where true;

  insert into public.cms_content(id,key,section,label,content_type,value,status,updated_at)
  select id,key,"group",label,"type",value,status,"updatedAt"::timestamptz
  from jsonb_to_recordset(coalesce(p_document->'content','[]'::jsonb))
    as x(id text,key text,"group" text,label text,"type" text,value text,status text,"updatedAt" text);

  insert into public.cms_products(id,data,sort_order)
  select value->>'id', value, ordinality::int
  from jsonb_array_elements(coalesce(p_document->'products','[]'::jsonb)) with ordinality;

  insert into public.media_library(id,name,storage_path,alt_text,width,height,created_at)
  select id,name,url,alt,width,height,"createdAt"::timestamptz
  from jsonb_to_recordset(coalesce(p_document->'media','[]'::jsonb))
    as x(id text,name text,url text,alt text,width int,height int,"createdAt" text);

  insert into public.form_submissions(id,form_key,payload,status,created_at,updated_at)
  select id,form,data,status,"createdAt"::timestamptz,"createdAt"::timestamptz
  from jsonb_to_recordset(coalesce(p_document->'submissions','[]'::jsonb))
    as x(id text,form text,data jsonb,status text,"createdAt" text);

  insert into public.cms_audit_log(id,action,resource,created_at)
  select id,action,resource,"createdAt"::timestamptz
  from jsonb_to_recordset(coalesce(p_document->'audit','[]'::jsonb))
    as x(id text,action text,resource text,"createdAt" text);
end;
$$;
revoke all on function public.replace_cms_document(jsonb) from public, anon, authenticated;
grant execute on function public.replace_cms_document(jsonb) to service_role;
