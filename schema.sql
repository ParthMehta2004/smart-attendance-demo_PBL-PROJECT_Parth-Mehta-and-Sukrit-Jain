-- Postgres schema for Smart Attendance
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  reg_no text unique not null,
  name text not null,
  device_mac text unique not null,
  created_at timestamptz default now()
);

create table if not exists professors (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  password_hash text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  classroom text not null,
  opened_at timestamptz default now(),
  closed_at timestamptz
);

create table if not exists attendance (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  marked_at timestamptz default now(),
  lat double precision,
  lon double precision,
  device_mac text not null
);

-- Prevent multiple marks by same user per session
create unique index if not exists uniq_attendance_session_user on attendance(session_id, user_id);
-- Prevent MAC reuse within a session
create unique index if not exists uniq_attendance_session_mac on attendance(session_id, device_mac);

-- Helper extension
create extension if not exists pgcrypto;

-- LHC Configuration table for per-classroom settings
create table if not exists lhc_config (
  id serial primary key,
  classroom text unique not null,
  geo_lat double precision,
  geo_lon double precision,
  geo_radius_m integer,
  updated_at timestamptz default now()
);

-- Insert default configs for all LHCs
insert into lhc_config (classroom, geo_lat, geo_lon, geo_radius_m) values
('LHC001', 26.843983727627208, 75.56469440460206, 200),
('LHC002', 26.843983727627208, 75.56469440460206, 200),
('LHC003', 26.843983727627208, 75.56469440460206, 200),
('LHC004', 26.843983727627208, 75.56469440460206, 200),
('LHC101', 26.843983727627208, 75.56469440460206, 200),
('LHC102', 26.843983727627208, 75.56469440460206, 200),
('LHC103', 26.843983727627208, 75.56469440460206, 200),
('LHC104', 26.843983727627208, 75.56469440460206, 200)
on conflict (classroom) do nothing;
