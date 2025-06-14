/*
  # Create event_attachments storage bucket with proper policies

  1. Storage Setup
    - Create `event_attachments` bucket if it doesn't exist
    - Set up comprehensive RLS policies for secure file access
    - Allow authenticated users to manage files in their own folders

  2. Security
    - Users can only access files in folders matching their user ID
    - Files are organized by user_id/event_id/filename structure
    - Proper CRUD permissions for authenticated users
*/

-- Create storage bucket (using DO block to handle conflicts gracefully)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'event_attachments', 
    'event_attachments', 
    false,
    52428800, -- 50MB in bytes
    ARRAY[
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
    ]
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Bucket already exists, update its properties
    UPDATE storage.buckets 
    SET 
      public = false,
      file_size_limit = 52428800,
      allowed_mime_types = ARRAY[
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
        'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'
      ]
    WHERE id = 'event_attachments';
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Users can upload files to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can view files in own folder"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can update files in own folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can delete files in own folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event_attachments' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);