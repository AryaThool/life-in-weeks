/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text, optional)
      - `date` (date)
      - `week_number` (integer, calculated from birthdate)
      - `category` (text)
      - `color` (text, hex color code)
      - `attachments` (jsonb, array of file URLs)
      - `notify_on_anniversary` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `events` table
    - Add policies for users to manage their own events

  3. Indexes
    - Add index on user_id for performance
    - Add index on date for timeline queries
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  week_number integer NOT NULL,
  category text NOT NULL DEFAULT 'personal',
  color text NOT NULL DEFAULT '#3B82F6',
  attachments jsonb DEFAULT '[]'::jsonb,
  notify_on_anniversary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_week_number_idx ON events(week_number);