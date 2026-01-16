-- Operations Dashboard Migration
-- Adds pipeline tracking and QC workflow columns to jobs table

-- Add new enum for quality status
CREATE TYPE quality_status AS ENUM ('pending', 'approved', 'rejected');

-- Add tracking columns to jobs table
ALTER TABLE jobs 
  ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS quality_status quality_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost DECIMAL(10,4) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('Twitter', 'Instagram', 'Client')),
  ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT FALSE;

-- Add 'paused' to job_status enum
ALTER TYPE job_status ADD VALUE IF NOT EXISTS 'paused';

-- Create indexes for operations dashboard queries
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_current_step ON jobs(current_step);
CREATE INDEX IF NOT EXISTS idx_jobs_quality_status ON jobs(quality_status);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- Add comment for documentation
COMMENT ON COLUMN jobs.current_step IS 'Pipeline step: 1=Base Gen, 2=Cloth Swap, 3=Upscale, 4=Video Prep, 5=Final Render';
COMMENT ON COLUMN jobs.progress IS 'Overall job progress percentage (0-100)';
COMMENT ON COLUMN jobs.cost IS 'Accumulated credit cost for completed steps';
COMMENT ON COLUMN jobs.quality_status IS 'QC workflow status for completed jobs';
