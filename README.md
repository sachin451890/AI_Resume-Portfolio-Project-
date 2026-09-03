# AI Resume & Portfolio Builder

A complete, production-ready full-stack web application designed to generate professional, ATS-friendly resumes and personal portfolio websites from a single multi-step wizard. Powered by **React (Vite)**, **Node.js / Express**, **Supabase PostgreSQL**, and **Google Gemini AI**.

---

## 🌟 Key Features

1. **SaaS Landing Page**: Modern dark-mode UI with Hero showcase, Feature grid, 5-step workflow breakdown, interactive template switcher, and transparent pricing.
2. **Supabase Authentication**: Secure Email/Password registration, login, session persistence, protected routes, and password reset.
3. **10-Step Resume Builder Wizard**:
   - Step 1: Personal Information (Photo, LinkedIn, GitHub, Portfolio URLs)
   - Step 2: Professional Summary (+ 1-Click AI Rewriter)
   - Step 3: Education (Multiple entries)
   - Step 4: Experience (Multiple entries + AI Bullet Point Improver without fact fabrication)
   - Step 5: Skills (Categorized + AI Skill Suggestions with explicit user approval)
   - Step 6: Projects (Multiple entries + AI Description Improver)
   - Step 7: Certifications
   - Step 8: Achievements & Honors
   - Step 9: Custom Sections (Toggleable: Languages, Interests, Awards, etc.)
   - Step 10: Template Selection & Real-time A4 Live Preview
4. **6 Working Resume Templates**:
   - **Modern**: Clean two-column layout with vibrant blue accents.
   - **Professional**: Classic corporate layout for corporate & finance roles.
   - **Minimal**: 100% single-column layout optimized for ATS machine readability.
   - **Executive**: Bold dark banner layout for senior leadership positions.
   - **Creative**: Modern gradient sidebar with skill badges.
   - **Developer**: Monospace tech layout highlighting code stack & GitHub repos.
5. **AI Resume Engine**:
   - Backend service powered by official `@google/genai` SDK (`gemini-2.5-flash`).
   - Factual Grounding: Strictly enforces never inventing metrics, companies, dates, or credentials.
   - Smart offline fallbacks if API key is not present during local development.
6. **ATS Resume Scorer**: 0-100 score breakdown across 8 categories (Formatting, Summary, Skills, Experience, Projects, Keywords, ATS Readability, Contact Details) with actionable tips.
7. **Job Description Keyword Matcher**: Paste job description text to calculate % match score, matched keywords, missing keywords, and recommendations.
8. **High-Fidelity PDF Generation**: Precision A4 page layout with proper margins, selectable text, and standard naming `Firstname_Lastname_Resume.pdf`.
9. **Personal Portfolio Generator**: Auto-builds a personal portfolio website from resume data across 5 themes (`Developer`, `Minimal`, `Modern`, `Creative`, `Professional`) with public/private status and public route `/portfolio/:username`.
10. **Resume Management & Versioning**: Create, edit, rename, duplicate, delete with confirm modal, and snapshot version history.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React Icons, Framer Motion, html2pdf.js, jspdf, Supabase JS Client.
- **Backend**: Node.js, Express.js, `@google/genai` (Google Gemini API), `@supabase/supabase-js`, `cors`, `express-rate-limit`.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Authentication.

---

## 📁 Repository Structure

```
.
├── package.json               # Root monorepo workspace scripts
├── .env.example               # Environment variables template
├── README.md                  # Comprehensive setup & architecture documentation
├── database/
│   ├── schema.sql             # Supabase PostgreSQL database tables & RLS policies
│   └── seeds.sql              # Sample seed data
├── backend/
│   ├── package.json
│   ├── server.js              # Express server entry point
│   └── src/
│       ├── config/            # Env configuration module
│       ├── controllers/       # Resumes, AI, Portfolios, PDF controllers
│       ├── middleware/        # Rate limiting & global error handling
│       ├── prompts/           # Centralized AI prompt engineering
│       ├── routes/            # REST API endpoints
│       └── services/          # Gemini AI service & PDF service
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── components/        # Reusable UI (Navbar, Footer, Portfolio themes)
        ├── contexts/          # AuthContext, ResumeContext, ToastContext
        ├── pages/             # LandingPage, Login, Register, Dashboard, ResumeWizard, PortfolioBuilder, PublicPortfolio, ProfileSettings
        ├── services/          # API & Supabase services
        ├── templates/         # 6 Working Resume Templates & TemplateRegistry
        └── utils/             # ATS Scorer, Job Matcher, PDF Exporter, Sample Data
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root or set in backend/frontend:

```env
# Frontend (Vite)
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api

# Backend (Node/Express)
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Quick Start & Local Development

1. **Install Dependencies**:
   ```bash
   npm run setup
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   *Backend runs on `http://localhost:5000`*

3. **Start Frontend App**:
   ```bash
   cd frontend
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173`*

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🔒 Supabase Database & Security

Run `database/schema.sql` in your Supabase SQL Editor. It automatically sets up UUID extensions, all 14 tables, foreign keys, and Row Level Security (RLS) policies for user privacy.
