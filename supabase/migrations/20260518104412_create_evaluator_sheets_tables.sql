/*
  # Create Evaluator Marks Sheet Tables

  1. New Tables
    - `evaluator_sheets`
      - `id` (uuid, primary key) - Unique identifier for each sheet
      - `qp_code` (text) - Question Paper Code
      - `packet_number` (text) - Packet Number
      - `date` (date) - Date of evaluation
      - `subject_name` (text) - Name of the subject
      - `evaluator_name` (text) - Name of the evaluator
      - `evaluator_code` (text) - Evaluator code
      - `board_evaluator` (text) - Board evaluator name
      - `trimester` (text) - Trimester information
      - `evaluator_signature` (text, default '') - Evaluator signature text
      - `board_evaluator_signature` (text, default '') - Board evaluator signature text
      - `signature_date` (date) - Date of signature
      - `remarks` (text, default '') - Remarks if any
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `student_marks`
      - `id` (uuid, primary key) - Unique identifier for each mark entry
      - `sheet_id` (uuid, foreign key) - References evaluator_sheets.id
      - `sl_no` (integer) - Serial number (1-20)
      - `q1` (integer, default 0) - Marks for Question 1
      - `q2` (integer, default 0) - Marks for Question 2
      - `q3` (integer, default 0) - Marks for Question 3
      - `q4` (integer, default 0) - Marks for Question 4
      - `q5` (integer, default 0) - Marks for Question 5
      - `q6` (integer, default 0) - Marks for Question 6
      - `q7` (integer, default 0) - Marks for Question 7
      - `q8` (integer, default 0) - Marks for Question 8
      - `q9` (integer, default 0) - Marks for Question 9
      - `total_marks` (integer, default 0) - Auto-calculated total marks
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated and anonymous access (college staff use, no auth required)
    - Allow full CRUD operations for all users since this is an internal college tool

  3. Important Notes
    - Each evaluator sheet has exactly 20 student rows
    - Total marks are auto-calculated from Q1-Q9
    - Cascade delete: when a sheet is deleted, its student marks are also deleted
*/

CREATE TABLE IF NOT EXISTS evaluator_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qp_code text NOT NULL DEFAULT '',
  packet_number text NOT NULL DEFAULT '',
  date date,
  subject_name text NOT NULL DEFAULT '',
  evaluator_name text NOT NULL DEFAULT '',
  evaluator_code text NOT NULL DEFAULT '',
  board_evaluator text NOT NULL DEFAULT '',
  trimester text NOT NULL DEFAULT '',
  evaluator_signature text NOT NULL DEFAULT '',
  board_evaluator_signature text NOT NULL DEFAULT '',
  signature_date date,
  remarks text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id uuid NOT NULL REFERENCES evaluator_sheets(id) ON DELETE CASCADE,
  sl_no integer NOT NULL,
  q1 integer NOT NULL DEFAULT 0,
  q2 integer NOT NULL DEFAULT 0,
  q3 integer NOT NULL DEFAULT 0,
  q4 integer NOT NULL DEFAULT 0,
  q5 integer NOT NULL DEFAULT 0,
  q6 integer NOT NULL DEFAULT 0,
  q7 integer NOT NULL DEFAULT 0,
  q8 integer NOT NULL DEFAULT 0,
  q9 integer NOT NULL DEFAULT 0,
  total_marks integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluator_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;

-- Policies for evaluator_sheets (open access for college internal use)
CREATE POLICY "Anyone can view evaluator sheets"
  ON evaluator_sheets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert evaluator sheets"
  ON evaluator_sheets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update evaluator sheets"
  ON evaluator_sheets FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete evaluator sheets"
  ON evaluator_sheets FOR DELETE
  TO anon, authenticated
  USING (true);

-- Policies for student_marks (open access for college internal use)
CREATE POLICY "Anyone can view student marks"
  ON student_marks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert student marks"
  ON student_marks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update student marks"
  ON student_marks FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete student marks"
  ON student_marks FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_marks_sheet_id ON student_marks(sheet_id);
CREATE INDEX IF NOT EXISTS idx_evaluator_sheets_date ON evaluator_sheets(date);
CREATE INDEX IF NOT EXISTS idx_evaluator_sheets_subject ON evaluator_sheets(subject_name);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_evaluator_sheets_updated_at ON evaluator_sheets;
CREATE TRIGGER update_evaluator_sheets_updated_at
  BEFORE UPDATE ON evaluator_sheets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();