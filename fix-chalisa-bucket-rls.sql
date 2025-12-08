-- First, check if policies exist and drop them
DROP POLICY IF EXISTS "Public Access for chalisa-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to chalisa-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update chalisa-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from chalisa-images" ON storage.objects;

-- Simple policy: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
ON storage.objects
FOR ALL
TO authenticated
USING ( bucket_id = 'chalisa-images' )
WITH CHECK ( bucket_id = 'chalisa-images' );

-- Allow public read
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'chalisa-images' );
