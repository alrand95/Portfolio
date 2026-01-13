-- Force Anon Access for Public Buckets
-- Explicitly grants usage to the 'anon' role to avoid any ambiguity with 'public'

-- 1. Profile Assets
CREATE POLICY "Anon Read Profile Assets"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'profile-assets');

-- 2. Gallery Images
CREATE POLICY "Anon Read Gallery Images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'gallery-images');

-- 3. Blog Images
CREATE POLICY "Anon Read Blog Images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'blog_images');

-- 4. Social Icons
CREATE POLICY "Anon Read Social Icons"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'social-icons');
