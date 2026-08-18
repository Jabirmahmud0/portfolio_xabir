create extension if not exists pgcrypto;
-- statement-breakpoint
create table if not exists portfolio_sections (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- statement-breakpoint
create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section text not null check (section in ('full-stack', 'ai-tools', 'frontend-ui')),
  name text not null,
  description text not null,
  tags jsonb not null default '[]'::jsonb,
  github_url text,
  backend_url text,
  live_url text,
  deployments jsonb not null default '[]'::jsonb,
  image_url text,
  status text,
  category text,
  featured boolean not null default false,
  homepage boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  case_study jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- statement-breakpoint
create or replace function enforce_portfolio_project_deployment_status()
returns trigger
language plpgsql
as $$
begin
  if nullif(btrim(new.live_url), '') is not null then
    new.status := 'Deployed';
  end if;
  return new;
end;
$$;
-- statement-breakpoint
drop trigger if exists portfolio_project_deployment_status on portfolio_projects;
-- statement-breakpoint
create trigger portfolio_project_deployment_status
before insert or update of live_url, status on portfolio_projects
for each row execute function enforce_portfolio_project_deployment_status();
-- statement-breakpoint
update portfolio_projects
set status = 'Deployed', updated_at = now()
where nullif(btrim(live_url), '') is not null
  and status is distinct from 'Deployed';
-- statement-breakpoint
create index if not exists portfolio_projects_public_idx on portfolio_projects (published, deleted_at, sort_order);
-- statement-breakpoint
create index if not exists portfolio_projects_section_idx on portfolio_projects (section, sort_order);
-- statement-breakpoint
create table if not exists portfolio_admin_credentials (
  singleton boolean primary key default true check (singleton),
  email text not null,
  password_hash text not null,
  updated_at timestamptz not null default now()
);
