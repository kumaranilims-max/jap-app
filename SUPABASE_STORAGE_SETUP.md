# Supabase Storage Setup for Chalisa Verse Images

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter bucket name: `chalisa-images`
5. Make it **Public** (so images can be accessed)
6. Click **Create Bucket**

## Step 2: Set Bucket Policies (Optional - for public access)

If you want public read access, add this policy:

```sql
-- Allow public read access to chalisa-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chalisa-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chalisa-images' 
  AND auth.role() = 'authenticated'
);
```

## Step 3: Update Code

The bucket name in code is already set to `mantra-images` in the uploadImage function.
You can either:
- Use the same `mantra-images` bucket for both mantras and chalisa verses
- OR create a new `chalisa-images` bucket and update the code

## Quick Setup (Using Existing Bucket)

If you already have `mantra-images` bucket, you can use it for chalisa images too.
No code changes needed!

## Alternative: Create New Bucket for Chalisa

If you want separate bucket, create `chalisa-images` and the code will work automatically.
