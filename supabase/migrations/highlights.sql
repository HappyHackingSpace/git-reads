create table if not exists highlights (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references sessions(id) on delete cascade,
  text_content text not null,
  start_offset integer not null,
  end_offset integer not null,
  container_xpath text not null,
  color text not null default '#fbbf24',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_highlights_session on highlights(session_id);

create index if not exists idx_highlights_created_at on highlights(created_at);

alter table highlights enable row level security;

create policy "Highlights are viewable by everyone"
  on highlights for select
  using (true);

create policy "Anyone can create highlights"
  on highlights for insert
  with check (true);

create policy "Anyone can delete highlights"
  on highlights for delete
  using (true);

comment on table highlights is 'Stores user highlights for README documents with color-coded priorities';
comment on column highlights.session_id is 'Foreign key reference to the session table';
comment on column highlights.text_content is 'The actual text content that was highlighted';
comment on column highlights.start_offset is 'Character offset where the highlight starts in the document';
comment on column highlights.end_offset is 'Character offset where the highlight ends in the document';
comment on column highlights.container_xpath is 'XPath-like identifier for the container, includes page number (e.g., page:0)';
comment on column highlights.color is 'Hex color code for the highlight (green, orange, or red based on priority)';