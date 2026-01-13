-- Fix Storage Policies for Public Access
-- Ensures that images are publicly accessible even if something went wrong with previous migrations

-- 1. Profile Assets
CREATE POLICY "Public Read Profile Assets 2026"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-assets');

-- 2. Gallery Images
CREATE POLICY "Public Read Gallery Images 2026"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- 3. Blog Images
CREATE POLICY "Public Read Blog Images 2026"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog_images');

-- 4. Social Icons (Explicitly adding this as it might be missing)
CREATE POLICY "Public Read Social Icons 2026"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'social-icons');

-- Ensure buckets are public (just in case)
UPDATE storage.buckets SET public = true WHERE id IN ('profile-assets', 'gallery-images', 'blog_images', 'social-icons');
