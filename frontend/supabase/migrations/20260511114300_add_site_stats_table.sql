-- Create site_stats table to track landing page visits
CREATE TABLE IF NOT EXISTS public.site_stats (
    page TEXT PRIMARY KEY,
    count BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow public to increment (we'll use a more secure approach later if needed, but for simple counters this is common)
-- Actually, the frontend does the incrementing, so we need to allow anonymous updates or use a function.
-- Given the current implementation in marketingApi.ts, we need to allow SELECT and INSERT/UPDATE for anon.

CREATE POLICY "Allow public to view stats" ON public.site_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow public to update stats" ON public.site_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to increment stats" ON public.site_stats
    FOR UPDATE USING (true);

-- Initialize the landing page row if it doesn't exist
INSERT INTO public.site_stats (page, count)
VALUES ('landing', 0)
ON CONFLICT (page) DO NOTHING;
