-- Add color column to social_links for custom branding
ALTER TABLE social_links 
ADD COLUMN IF NOT EXISTS color text DEFAULT '#FF00FF';
