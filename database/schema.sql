-- PostgreSQL Schema for AI Resume & Portfolio Builder (Supabase Compatible)

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    professional_title TEXT,
    phone TEXT,
    location TEXT,
    avatar_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    target_role TEXT,
    template_id TEXT NOT NULL DEFAULT 'modern',
    summary TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Educations Table
CREATE TABLE IF NOT EXISTS public.educations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    gpa TEXT,
    coursework TEXT,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    employment_type TEXT DEFAULT 'Full-time',
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    responsibilities TEXT,
    achievements TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'Other',
    name TEXT NOT NULL,
    proficiency TEXT DEFAULT 'Intermediate',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT[],
    github_url TEXT,
    live_url TEXT,
    start_date TEXT,
    end_date TEXT,
    key_contributions TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT NOT NULL,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organization TEXT,
    date TEXT,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Custom / Additional Sections Table
CREATE TABLE IF NOT EXISTS public.custom_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- languages, interests, volunteer, awards, publications, etc.
    title TEXT NOT NULL,
    content TEXT,
    is_enabled BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Portfolios Table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    theme_id TEXT DEFAULT 'developer',
    is_published BOOLEAN DEFAULT true,
    tagline TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Resume Versions Table
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    version_label TEXT DEFAULT 'Snapshot',
    resume_snapshot JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Resume Scores Table
CREATE TABLE IF NOT EXISTS public.resume_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    breakdown JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. AI Generations Log Table
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    action TEXT NOT NULL,
    original_content TEXT,
    generated_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Contact Messages Table (For Portfolio Visitors)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public can view profile for published portfolios" ON public.profiles FOR SELECT USING (true);

-- Resumes Policies
CREATE POLICY "Users can manage their own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view resumes tied to published portfolios" ON public.resumes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.portfolios p 
        WHERE p.resume_id = public.resumes.id AND p.is_published = true
    )
);

-- Child tables policies
CREATE POLICY "Users manage educations" ON public.educations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = educations.resume_id AND r.user_id = auth.uid())
);
CREATE POLICY "Public view educations" ON public.educations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.portfolios p JOIN public.resumes r ON p.resume_id = r.id WHERE r.id = educations.resume_id AND p.is_published = true)
);

CREATE POLICY "Users manage experiences" ON public.experiences FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = experiences.resume_id AND r.user_id = auth.uid())
);
CREATE POLICY "Public view experiences" ON public.experiences FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.portfolios p JOIN public.resumes r ON p.resume_id = r.id WHERE r.id = experiences.resume_id AND p.is_published = true)
);

CREATE POLICY "Users manage skills" ON public.skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = skills.resume_id AND r.user_id = auth.uid())
);
CREATE POLICY "Public view skills" ON public.skills FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.portfolios p JOIN public.resumes r ON p.resume_id = r.id WHERE r.id = skills.resume_id AND p.is_published = true)
);

CREATE POLICY "Users manage projects" ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = projects.resume_id AND r.user_id = auth.uid())
);
CREATE POLICY "Public view projects" ON public.projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.portfolios p JOIN public.resumes r ON p.resume_id = r.id WHERE r.id = projects.resume_id AND p.is_published = true)
);

CREATE POLICY "Users manage certifications" ON public.certifications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = certifications.resume_id AND r.user_id = auth.uid())
);

CREATE POLICY "Users manage achievements" ON public.achievements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = achievements.resume_id AND r.user_id = auth.uid())
);

CREATE POLICY "Users manage custom_sections" ON public.custom_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = custom_sections.resume_id AND r.user_id = auth.uid())
);

-- Portfolios Policies
CREATE POLICY "Users manage own portfolio" ON public.portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public view published portfolios" ON public.portfolios FOR SELECT USING (is_published = true);

-- Contact Messages Policies
CREATE POLICY "Anyone can send message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners view messages" ON public.contact_messages FOR SELECT USING (auth.uid() = portfolio_user_id);

-- 15. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free', -- free | pro_monthly | pro_yearly
    status TEXT NOT NULL DEFAULT 'active', -- active | cancelled | expired | past_due
    currency TEXT NOT NULL DEFAULT 'INR', -- INR | USD | EUR | GBP
    amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    gateway TEXT DEFAULT 'razorpay',
    gateway_customer_id TEXT,
    gateway_subscription_id TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Payment Transactions Table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    gateway_payment_id TEXT UNIQUE,
    gateway_order_id TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL, -- created | captured | failed | refunded
    payment_method TEXT, -- upi | card | netbanking | wallet
    country TEXT DEFAULT 'IN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);

