-- Add is_carousel column to gallery table
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_carousel BOOLEAN DEFAULT FALSE;
