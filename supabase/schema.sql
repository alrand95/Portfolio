-- Enable Row Level Security
alter table if exists projects enable row level security;
alter table if exists gallery_items enable row level security;
alter table if exists blog_posts enable row level security;
alter table if exists messages enable row level security;

-- Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  cover_image text,
  description text,
  tech_stack text[],
  is_featured boolean default false,
  demo_link text,
  repo_link text,
  created_at timestamptz default now()
);

create policy "Public projects are viewable by everyone" 
  on projects for select 
  using (true);

create policy "Users can insert projects" 
  on projects for insert 
  to authenticated 
  with check (true);

create policy "Users can update projects" 
  on projects for update 
  to authenticated 
  using (true);

-- Gallery Items Table
create table if not exists gallery_items (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  tags text[],
  created_at timestamptz default now()
);

create policy "Public gallery is viewable by everyone" 
  on gallery_items for select 
  using (true);

create policy "Users can insert gallery items" 
  on gallery_items for insert 
  to authenticated 
  with check (true);

-- Blog Posts Table
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  published_at timestamptz,
  created_at timestamptz default now()
);

create policy "Public blog is viewable by everyone" 
  on blog_posts for select 
  using (true);

create policy "Users can insert blog posts" 
  on blog_posts for insert 
  to authenticated 
  with check (true);

-- Messages Table (Summon Me)
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_name text not null,
  email text not null,
  message_body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create policy "Anyone can send message" 
  on messages for insert 
  with check (true);

create policy "Authenticated users can read messages" 
  on messages for select 
  to authenticated 
  using (true);
