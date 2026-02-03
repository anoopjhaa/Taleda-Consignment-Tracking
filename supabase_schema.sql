-- Enable UUID extension if we want to use UUIDs (optional, using BIGINT/SERIAL for now to match old schema)
-- create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id bigint primary key generated always as identity,
  username text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONSIGNMENTS TABLE
create table if not exists consignments (
  id bigint primary key generated always as identity,
  tracking_number text unique not null,
  sender_city text not null,
  receiver_city text not null,
  sender_coords text not null, -- JSON String
  receiver_coords text not null, -- JSON String
  status text not null,
  eta_date timestamp with time zone,
  dispatch_date timestamp with time zone,
  distance_km real,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SEED DEFAULT ADMIN USER
-- Username: admin
-- Password: admin123 (Hash generated via bcrypt)
insert into users (username, password_hash)
values ('admin', '$2b$10$3/AfHQzEQpAeF5RIlEW9ceGz4gyxbH/MZCWtl8xrf08ZbPRDx/Jeu');
