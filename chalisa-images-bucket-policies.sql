-- Storage policies for chalisa-images bucket

-- Allow public read access
CREATE POLICY "Public Access for chalisa-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chalisa-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to chalisa-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update chalisa-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete from chalisa-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);
