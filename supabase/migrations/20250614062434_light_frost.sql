/*
  # Fix storage policy error and add enhanced attachments system

  1. Remove problematic storage policy
  2. Add enhanced attachments table
  3. Set up proper file management system

  This migration fixes the raw_data column error and sets up a proper
  attachment system for events.
*/

-- Remove the problematic policy that references non-existent raw_data column
DROP POLICY IF EXISTS "Limit file size to 50MB" ON storage.objects;

-- Create enhanced attachments table
CREATE TABLE IF NOT EXISTS event_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_attachments ENABLE ROW LEVEL SECURITY;

-- Users can only access attachments for their own events
CREATE POLICY "Users can read own event attachments"
  ON event_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attachments.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own event attachments"
  ON event_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attachments.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own event attachments"
  ON event_attachments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attachments.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own event attachments"
  ON event_attachments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attachments.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS event_attachments_event_id_idx ON event_attachments(event_id);
CREATE INDEX IF NOT EXISTS event_attachments_file_type_idx ON event_attachments(file_type);

-- Add a simple file size limit policy (without referencing raw_data)
-- This will be enforced in the application layer instead
COMMENT ON TABLE event_attachments IS 'Stores metadata for event attachments. File size limits (50MB) enforced in application.';