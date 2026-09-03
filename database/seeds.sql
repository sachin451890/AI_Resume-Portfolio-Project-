-- Sample Seed Data for AI Resume & Portfolio Builder

-- Note: In real Supabase, user IDs come from auth.users.
-- Below is sample structure reference data for testing local databases.

INSERT INTO public.profiles (id, full_name, email, professional_title, phone, location, avatar_url, linkedin_url, github_url, portfolio_url, bio)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Alex Johnson',
    'alex.johnson@example.com',
    'Senior Full-Stack Engineer',
    '+1 (555) 234-5678',
    'San Francisco, CA',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://linkedin.com/in/alexjohnson',
    'https://github.com/alexjohnson',
    'https://alexjohnson.dev',
    'Passionate full-stack developer with 5+ years of experience building modern web applications, scalable cloud microservices, and AI-driven user interfaces.'
) ON CONFLICT (id) DO NOTHING;
