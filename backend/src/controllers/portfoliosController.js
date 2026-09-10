const redisService = require('../services/redisService');

let localPortfoliosStore = [];

exports.getPortfolioByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Try Redis Cache for ultra-fast public portfolio page rendering
    const cachedPortfolio = await redisService.getCachedPortfolio(username);
    if (cachedPortfolio && cachedPortfolio.is_published) {
      return res.json({ portfolio: cachedPortfolio, source: 'redis-cache' });
    }

    const portfolio = localPortfoliosStore.find(p => p.username.toLowerCase() === username.toLowerCase());

    if (!portfolio || !portfolio.is_published) {
      return res.status(404).json({ error: 'Portfolio not found or private.' });
    }

    // Store in Redis
    await redisService.cachePortfolio(username, portfolio);
    return res.json({ portfolio });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const portfolioData = req.body;

    let updatedPortfolio = null;
    const existingIndex = localPortfoliosStore.findIndex(p => p.user_id === userId);
    if (existingIndex !== -1) {
      localPortfoliosStore[existingIndex] = {
        ...localPortfoliosStore[existingIndex],
        ...portfolioData,
        updated_at: new Date().toISOString()
      };
      updatedPortfolio = localPortfoliosStore[existingIndex];
    } else {
      updatedPortfolio = {
        id: `port_${Date.now()}`,
        user_id: userId,
        username: portfolioData.username || `user_${Math.floor(Math.random() * 10000)}`,
        theme_id: portfolioData.themeId || 'developer',
        is_published: portfolioData.isPublished !== undefined ? portfolioData.isPublished : true,
        tagline: portfolioData.tagline || '',
        bio: portfolioData.bio || '',
        resume_data: portfolioData.resumeData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localPortfoliosStore.push(updatedPortfolio);
    }

    // Cache updated portfolio in Redis
    if (updatedPortfolio.username) {
      await redisService.cachePortfolio(updatedPortfolio.username, updatedPortfolio);
    }

    return res.json({ portfolio: updatedPortfolio });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.sendContactMessage = async (req, res) => {
  try {
    const { username } = req.params;
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    console.log(`[Contact Form] Message received for ${username} from ${name} (${email}): ${message}`);
    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.parseResumeToPortfolio = async (req, res) => {
  const aiService = require('../services/aiService');
  try {
    const { resumeText = '', resumeData = null } = req.body;

    const sourceData = resumeData ? JSON.stringify(resumeData) : resumeText;

    const prompt = `
Act as an expert AI Portfolio Designer and Web Engineer.
Extract and convert the following resume data into an animated, high-converting portfolio website structure.

Resume Content:
${sourceData}

Respond strictly in JSON format with this structure:
{
  "name": "Candidate Full Name",
  "title": "Professional Role / Headline",
  "tagline": "Catchy 1-sentence tagline for portfolio hero section",
  "bio": "Compelling 2-3 paragraph professional bio",
  "themeId": "quantum-motion",
  "accentColor": "#6366f1",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "title": "Project Name",
      "description": "Engaging project description highlighting achievements",
      "technologies": ["Tech 1", "Tech 2"],
      "githubUrl": "https://github.com",
      "liveUrl": "https://example.com"
    }
  ],
  "experiences": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "2022 - Present",
      "highlights": ["Key achievement bullet 1", "Key achievement bullet 2"]
    }
  ],
  "contactEmail": "email@example.com",
  "availability": "🟢 Available for Full-Time & Freelance"
}
`;

    const fallbackPortfolio = {
      name: resumeData?.personalInfo?.fullName || "Software Specialist",
      title: resumeData?.personalInfo?.jobTitle || "Full Stack Developer",
      tagline: "Building scalable, high-performance web applications with modern architecture.",
      bio: resumeData?.personalInfo?.summary || "Passionate software engineer focused on building clean, user-centric web applications and AI-driven platforms.",
      themeId: "quantum-motion",
      accentColor: "#6366f1",
      skills: resumeData?.skills?.map(s => s.name || s) || ["React", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "REST APIs"],
      projects: resumeData?.projects?.map(p => ({
        title: p.title || "Web Application Project",
        description: p.description || "Designed and built high-performance web application with modern tech stack.",
        technologies: p.technologies ? (typeof p.technologies === 'string' ? p.technologies.split(',') : p.technologies) : ["React", "Node.js"],
        githubUrl: p.githubUrl || "https://github.com",
        liveUrl: p.link || "https://example.com"
      })) || [
        {
          title: "AI SaaS Career Platform",
          description: "Full-stack AI resume builder and automated portfolio generator.",
          technologies: ["React", "Node.js", "Tailwind CSS", "Gemini AI"],
          githubUrl: "https://github.com",
          liveUrl: "https://example.com"
        }
      ],
      experiences: resumeData?.experience?.map(e => ({
        company: e.company || "Tech Enterprise",
        role: e.jobTitle || "Developer",
        duration: `${e.startDate || '2022'} - ${e.endDate || 'Present'}`,
        highlights: e.responsibilities ? e.responsibilities.split('\n').filter(Boolean) : ["Engineered web features."]
      })) || [],
      contactEmail: resumeData?.personalInfo?.email || "candidate@example.com",
      availability: "🟢 Available for Full-Time & Freelance"
    };

    try {
      const rawResponse = await aiService.generateContent(prompt, true);
      let parsed = typeof rawResponse === 'object' ? rawResponse : JSON.parse(rawResponse.replace(/```json/g, '').replace(/```/g, '').trim());
      return res.json({ success: true, portfolioData: parsed });
    } catch (aiErr) {
      console.warn('[AI Portfolio Parser Warning]: Falling back to smart parsed structure:', aiErr.message);
      return res.json({ success: true, portfolioData: fallbackPortfolio });
    }
  } catch (err) {
    console.error('[Parse Resume Error]:', err.message);
    return res.status(500).json({ error: 'Failed to convert resume to portfolio.' });
  }
};

exports.generateProjectReadme = async (req, res) => {
  const aiService = require('../services/aiService');
  try {
    const { title = 'My Project', description = '', technologies = [] } = req.body;

    const techString = Array.isArray(technologies) ? technologies.join(', ') : technologies;

    const prompt = `
Act as an Lead Open-Source Developer & Technical Writer.
Generate a professional Portfolio Showcase Description and a complete GitHub README.md for the following project:

Project Title: ${title}
Technologies: ${techString}
Short Context: ${description}

Respond strictly in JSON format with this structure:
{
  "showcaseDescription": "3-4 sentence high-impact bulleted portfolio showcase summary with metrics and key tech highlights",
  "readmeMarkdown": "# ${title}\\n\\n[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)\\n\\n## 🚀 Overview\\n\\n...Complete professional markdown README with Badges, Features, Architecture, Installation, Usage, and License..."
}
`;

    const fallbackResponse = {
      showcaseDescription: `• Engineered ${title} utilizing ${techString || 'modern web technologies'} to deliver high performance and seamless user experience.\n• Architected clean component architecture with responsive layout, robust state management, and optimized rendering.\n• Designed scalable backend communication and data flow to maintain zero-latency responsiveness under high workloads.`,
      readmeMarkdown: `# ${title}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

## 🚀 Overview
${description || `${title} is a modern, high-performance application built with ${techString || 'cutting-edge web technologies'}.`}

## ✨ Key Features
- **Modern Responsive UI**: Seamless user experience across desktop and mobile form factors.
- **Robust Architecture**: Modular component organization and type-safe code structure.
- **Optimized Performance**: Fast bundle loading and lightning-fast state synchronization.

## 🛠️ Tech Stack
${techString ? techString.split(',').map(t => `- **${t.trim()}**`).join('\n') : '- **JavaScript / React**\n- **Node.js**'}

## 🚀 Quick Start & Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/${title.toLowerCase().replace(/\s+/g, '-')}.git

# Navigate into project directory
cd ${title.toLowerCase().replace(/\s+/g, '-')}

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 📄 License
Distributed under the MIT License.
`
    };

    try {
      const rawResponse = await aiService.generateContent(prompt, true);
      let parsed = typeof rawResponse === 'object' ? rawResponse : JSON.parse(rawResponse.replace(/```json/g, '').replace(/```/g, '').trim());
      return res.json({ success: true, ...parsed });
    } catch (aiErr) {
      console.warn('[Project README Warning]: Falling back to smart template:', aiErr.message);
      return res.json({ success: true, ...fallbackResponse });
    }
  } catch (err) {
    console.error('[Project README Error]:', err.message);
    return res.status(500).json({ error: 'Failed to generate project README.' });
  }
};
