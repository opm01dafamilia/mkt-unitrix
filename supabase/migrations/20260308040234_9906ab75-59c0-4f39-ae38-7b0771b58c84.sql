ALTER TABLE public.campaign_analysis 
ADD COLUMN IF NOT EXISTS platform text DEFAULT '',
ADD COLUMN IF NOT EXISTS objective text DEFAULT '',
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date;