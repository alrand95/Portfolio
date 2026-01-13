-- Add new columns to social_links table
ALTER TABLE social_links 
ADD COLUMN IF NOT EXISTS icon_url text, 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Create storage bucket for social icons if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('social-icons', 'social-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read of social icons
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'social-icons' );

-- Policy to allow authenticated upload (Admin)
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'social-icons' );

-- Policy to allow authenticated update (Admin)
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'social-icons' );

-- Policy to allow authenticated delete (Admin)
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'social-icons' );
