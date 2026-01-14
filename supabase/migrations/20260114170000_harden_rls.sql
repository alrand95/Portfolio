-- Fix Functions: Secure search_path
ALTER FUNCTION public.clean_old_rate_limits() SET search_path = public;
ALTER FUNCTION public.check_rate_limit(text) SET search_path = public;

-- Fix blog_posts: Drop permissive policies
DROP POLICY IF EXISTS "Users can insert blog posts" ON "public"."blog_posts";
DROP POLICY IF EXISTS "Users can update blog posts" ON "public"."blog_posts";
DROP POLICY IF EXISTS "Users can delete blog posts" ON "public"."blog_posts";

-- blog_posts: Create missing restrictive INSERT policy
CREATE POLICY "Only admin can insert blog posts" ON "public"."blog_posts"
FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['rundkhaled1995@gmail.com'::text, 'aliaktarsimon@gmail.com'::text]));

-- Fix skills: Drop permissive policy and recreate restricted
DROP POLICY IF EXISTS "Admin skills update" ON "public"."skills";

CREATE POLICY "Admins can manage skills" ON "public"."skills"
FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['rundkhaled1995@gmail.com'::text, 'aliaktarsimon@gmail.com'::text]));

-- Fix social_links: Drop permissive policy and recreate restricted
DROP POLICY IF EXISTS "Admin socials update" ON "public"."social_links";

CREATE POLICY "Admins can manage socials" ON "public"."social_links"
FOR ALL TO authenticated
USING ((auth.jwt() ->> 'email'::text) = ANY (ARRAY['rundkhaled1995@gmail.com'::text, 'aliaktarsimon@gmail.com'::text]));
