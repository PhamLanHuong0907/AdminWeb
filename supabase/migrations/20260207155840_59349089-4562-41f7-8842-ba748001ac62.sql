-- Drop overly permissive policies and replace with admin-only policies

-- Navigation
DROP POLICY IF EXISTS "Navigation editable by authenticated" ON public.navigation;
CREATE POLICY "Navigation editable by admin" ON public.navigation 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Services
DROP POLICY IF EXISTS "Services editable by authenticated" ON public.services;
CREATE POLICY "Services editable by admin" ON public.services 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Hero Sections
DROP POLICY IF EXISTS "Hero sections editable by authenticated" ON public.hero_sections;
CREATE POLICY "Hero sections editable by admin" ON public.hero_sections 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Product Services
DROP POLICY IF EXISTS "Product services editable by authenticated" ON public.product_services;
CREATE POLICY "Product services editable by admin" ON public.product_services 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
DROP POLICY IF EXISTS "Products editable by authenticated" ON public.products;
CREATE POLICY "Products editable by admin" ON public.products 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Projects
DROP POLICY IF EXISTS "Projects editable by authenticated" ON public.projects;
CREATE POLICY "Projects editable by admin" ON public.projects 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Prizes
DROP POLICY IF EXISTS "Prizes editable by authenticated" ON public.prizes;
CREATE POLICY "Prizes editable by admin" ON public.prizes 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blogs
DROP POLICY IF EXISTS "Blogs editable by authenticated" ON public.blogs;
CREATE POLICY "Blogs editable by admin" ON public.blogs 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Testimonials
DROP POLICY IF EXISTS "Testimonials editable by authenticated" ON public.testimonials;
CREATE POLICY "Testimonials editable by admin" ON public.testimonials 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add policy for admin to manage roles
CREATE POLICY "Admin can manage roles" ON public.user_roles 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));