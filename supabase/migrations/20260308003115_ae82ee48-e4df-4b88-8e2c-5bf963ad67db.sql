
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  niche TEXT,
  business_type TEXT,
  main_goal TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create ad_generations table
CREATE TABLE public.ad_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_service TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  campaign_goal TEXT NOT NULL,
  platform TEXT NOT NULL,
  generated_ads JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ads" ON public.ad_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ads" ON public.ad_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ads" ON public.ad_generations FOR DELETE USING (auth.uid() = user_id);

-- Create copy_generations table
CREATE TABLE public.copy_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_service TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  sales_goal TEXT NOT NULL,
  content_type TEXT NOT NULL,
  generated_copy JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.copy_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own copies" ON public.copy_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own copies" ON public.copy_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own copies" ON public.copy_generations FOR DELETE USING (auth.uid() = user_id);

-- Create funnel_generations table
CREATE TABLE public.funnel_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_service TEXT NOT NULL,
  funnel_type TEXT NOT NULL,
  generated_funnel JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own funnels" ON public.funnel_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own funnels" ON public.funnel_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own funnels" ON public.funnel_generations FOR DELETE USING (auth.uid() = user_id);

-- Create campaign_analysis table
CREATE TABLE public.campaign_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  ad_cost NUMERIC(10,2) DEFAULT 0,
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own campaigns" ON public.campaign_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON public.campaign_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON public.campaign_analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON public.campaign_analysis FOR DELETE USING (auth.uid() = user_id);

-- Create content_ideas table
CREATE TABLE public.content_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  generated_ideas JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ideas" ON public.content_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON public.content_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON public.content_ideas FOR DELETE USING (auth.uid() = user_id);
