-- Add is_admin column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id
      AND (is_admin = true OR email = 'lp070087@gmail.com')
  )
$$;

-- Update existing user with that email to admin
UPDATE public.profiles
SET is_admin = true
WHERE email = 'lp070087@gmail.com';

-- Update handle_new_user to set is_admin automatically for that email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email = 'lp070087@gmail.com' THEN true ELSE false END
  );
  RETURN NEW;
END;
$function$;

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow admins to view all campaigns/funnels/copies/ads/ideas (read-only metrics)
CREATE POLICY "Admins can view all ads"
ON public.ad_generations FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all copies"
ON public.copy_generations FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all funnels"
ON public.funnel_generations FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all campaigns analysis"
ON public.campaign_analysis FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all ideas"
ON public.content_ideas FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));