/*
  # Create storage bucket for event attachments

  1. Storage Setup
    - Create `event_attachments` bucket
    - Set up RLS policies for user file access
    - Allow authenticated users to upload files to their own folders

  2. Security
    - Users can only access files in their own user_id folder
    - Files are organized by user_id/filename structure
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event_attachments', 'event_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);