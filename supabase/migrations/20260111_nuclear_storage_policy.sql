-- NUCLEAR OPTION: Reset Storage Policies to Ultra-Permissive for Public Buckets
-- This removes complexity and ensures public read access is absolute.

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access Blog Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Profile" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Profile Assets 2026" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Gallery Images 2026" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Blog Images 2026" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Social Icons 2026" ON storage.objects;
DROP POLICY IF EXISTS "Anon Read Profile Assets" ON storage.objects;
DROP POLICY IF EXISTS "Anon Read Gallery Images" ON storage.objects;
DROP POLICY IF EXISTS "Anon Read Blog Images" ON storage.objects;
DROP POLICY IF EXISTS "Anon Read Social Icons" ON storage.objects;

-- 2. Create a single, simple, permissive read policy for ALL public buckets
CREATE POLICY "Nuclear Public Read 2026"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('profile-assets', 'gallery-images', 'blog_images', 'social-icons') );

-- 3. Ensure buckets are public
UPDATE storage.buckets
SET public = true
WHERE id IN ('profile-assets', 'gallery-images', 'blog_images', 'social-icons');
