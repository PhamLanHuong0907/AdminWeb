-- ==========================================
-- 1. STORAGE & BUCKETS
-- ==========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('uploads', 'uploads', true, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');
CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "Allow authenticated update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads');

-- ==========================================
-- 2. TABLES CREATION
-- ==========================================

-- 2.1 Navigation
CREATE TABLE public.navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  dropdown JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;

-- 2.2 Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  gradient TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  href TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 2.3 Hero Sections
CREATE TABLE public.hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  background_image TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  slogan TEXT,
  cards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;

-- 2.4 Product Services (Input JSON here)
CREATE TABLE public.product_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  products JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.product_services ENABLE ROW LEVEL SECURITY;

-- 2.5 Product Definitions (Product1 - Unique Identity)
CREATE TABLE public.product_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, title) 
);
ALTER TABLE public.product_definitions ENABLE ROW LEVEL SECURITY;

-- 2.6 Products (Detail Table)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id UUID REFERENCES public.product_definitions(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT, -- Tự động inherit từ definitions
  path TEXT,
  highlight TEXT,
  description TEXT,
  image TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2.7 Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client TEXT,
  description TEXT,
  category_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  path TEXT,
  url_word TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2.8 Prizes
CREATE TABLE public.prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  period TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  text_color TEXT,
  border_color TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- 2.9 Blogs
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  author TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  url_word TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 2.10 Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  position TEXT,
  company TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 2.11 User Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. RLS POLICIES (Standard Setup)
-- ==========================================
-- (Áp dụng policy chung cho gọn, bạn có thể tách lẻ nếu muốn control kỹ hơn)
DO $$ 
DECLARE 
    tbl text; 
BEGIN 
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP 
        EXECUTE format('DROP POLICY IF EXISTS "Public read" ON %I', tbl);
        EXECUTE format('CREATE POLICY "Public read" ON %I FOR SELECT USING (true)', tbl);
        
        EXECUTE format('DROP POLICY IF EXISTS "Auth full access" ON %I', tbl);
        EXECUTE format('CREATE POLICY "Auth full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', tbl);
    END LOOP; 
END $$;

-- Policy riêng cho User Roles (chỉ user xem được role của mình)
DROP POLICY IF EXISTS "Public read" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 4. FUNCTIONS & LOGIC
-- ==========================================

-- 4.1 Hàm update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4.2 Hàm Check Role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 4.3 Hàm: Auto Sync Navigation (Đã sửa logic path cho Products)
CREATE OR REPLACE FUNCTION public.auto_sync_to_navigation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  nav_label TEXT;
  nav_href TEXT;
BEGIN
  IF TG_TABLE_NAME = 'services' THEN
    nav_label := NEW.title;
    nav_href := NEW.href;
  ELSIF TG_TABLE_NAME = 'projects' THEN
    nav_label := NEW.title;
    nav_href := NEW.path;
  ELSIF TG_TABLE_NAME = 'products' THEN
    nav_label := NEW.title;
    -- [UPDATE]: Thêm tiền tố /products/ để link hoạt động đúng
    nav_href := '/products/' || NEW.path; 
  ELSIF TG_TABLE_NAME = 'blogs' THEN
    nav_label := NEW.title;
    nav_href := '/blogs/' || NEW.slug; 
  END IF;

  IF nav_label IS NOT NULL AND nav_href IS NOT NULL THEN
    INSERT INTO public.navigation (label, href, sort_order, dropdown)
    VALUES (nav_label, nav_href, 99, '[]'::jsonb); 
  END IF;
  RETURN NEW;
END;
$$;

-- 4.4 Hàm: Sync JSON -> Product Definitions (Trigger 1)
CREATE OR REPLACE FUNCTION public.sync_json_to_product_definitions()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  prod_title TEXT;
BEGIN
  IF NEW.products IS NULL OR jsonb_typeof(NEW.products) != 'array' THEN RETURN NEW; END IF;
  FOR prod_title IN SELECT value FROM jsonb_array_elements_text(NEW.products) LOOP
    INSERT INTO public.product_definitions (service_id, title)
    VALUES (NEW.service_id, prod_title)
    ON CONFLICT (service_id, title) DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$;

-- 4.5 Hàm: Create Product Details from Definition (Trigger 2)
CREATE OR REPLACE FUNCTION public.auto_create_product_details()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE definition_id = NEW.id) THEN
    INSERT INTO public.products (service_id, definition_id, title, path, sort_order)
    VALUES (
      NEW.service_id,
      NEW.id,
      NEW.title,
      lower(regexp_replace(NEW.title, '\s+', '-', 'g')), -- Slugify
      0
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 4.6 Hàm: Sync Title Change (Khi sửa tên ở Definition -> Update ở Products)
CREATE OR REPLACE FUNCTION public.sync_title_change_to_details()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF OLD.title IS DISTINCT FROM NEW.title THEN
    UPDATE public.products SET title = NEW.title WHERE definition_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- 4.7 Hàm: Inherit Title (Khi insert tay vào Products -> Lấy tên từ Definition)
CREATE OR REPLACE FUNCTION public.inherit_title_from_definition()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.definition_id IS NOT NULL THEN
    SELECT title INTO NEW.title FROM public.product_definitions WHERE id = NEW.definition_id;
  END IF;
  RETURN NEW;
END;
$$;

-- ==========================================
-- 5. TRIGGERS
-- ==========================================

-- 5.1 Triggers Updated_At (Gắn cho mọi bảng)
CREATE TRIGGER update_nav_time BEFORE UPDATE ON public.navigation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_serv_time BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_time BEFORE UPDATE ON public.hero_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ps_time BEFORE UPDATE ON public.product_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pd_time BEFORE UPDATE ON public.product_definitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prod_time BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proj_time BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prize_time BEFORE UPDATE ON public.prizes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_time BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testi_time BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5.2 Triggers Logic Nghiệp Vụ
-- Logic 1: Input JSON -> Definitions
CREATE TRIGGER trg_sync_json_definitions AFTER INSERT OR UPDATE ON public.product_services FOR EACH ROW EXECUTE FUNCTION public.sync_json_to_product_definitions();

-- Logic 2: Definitions -> Create Details in Products Table
CREATE TRIGGER trg_auto_details AFTER INSERT ON public.product_definitions FOR EACH ROW EXECUTE FUNCTION public.auto_create_product_details();

-- Logic 3: Update Title in Definitions -> Update Title in Products
CREATE TRIGGER trg_sync_title_change AFTER UPDATE ON public.product_definitions FOR EACH ROW EXECUTE FUNCTION public.sync_title_change_to_details();

-- Logic 4: Insert Products -> Auto inherit title (đề phòng nhập tay)
CREATE TRIGGER trg_inherit_title BEFORE INSERT OR UPDATE OF definition_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.inherit_title_from_definition();

-- 5.3 Triggers Navigation (Tự động thêm vào Menu)
CREATE TRIGGER trigger_auto_nav_services AFTER INSERT ON public.services FOR EACH ROW EXECUTE FUNCTION public.auto_sync_to_navigation();
CREATE TRIGGER trigger_auto_nav_projects AFTER INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.auto_sync_to_navigation();
CREATE TRIGGER trigger_auto_nav_products AFTER INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.auto_sync_to_navigation();
CREATE TRIGGER trigger_auto_nav_blogs AFTER INSERT ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.auto_sync_to_navigation();