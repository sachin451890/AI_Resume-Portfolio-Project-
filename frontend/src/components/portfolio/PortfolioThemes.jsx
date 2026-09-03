import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Globe, ExternalLink, Calendar, Send, Award, BookOpen, Briefcase, Code, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const PORTFOLIO_THEMES = [
  { id: 'developer', name: 'Developer Dark', description: 'Tech-focused dark mode with code highlight badges' },
  { id: 'modern', name: 'Modern SaaS', description: 'Sleek dark gradient with glowing blue glassmorphism cards' },
  { id: 'minimal', name: 'Minimalist White', description: 'Clean, elegant high contrast typography layout' },
  { id: 'creative', name: 'Creative Gradient', description: 'Vibrant purple and indigo accents with interactive cards' },
  { id: 'professional', name: 'Corporate Navy', description: 'Executive navy blue header with structured timeline' }
];

export default function PortfolioThemeRenderer({ themeId = 'developer', data, username }) {
  const info = (data && data.personalInfo) || {};
  const skills = (data && data.skills) || [];
  const experiences = (data && data.experiences) || [];
  const educations = (data && data.educations) || [];
  const projects = (data && data.projects) || [];
  const certifications = (data && data.certifications) || [];
  const achievements = (data && data.achievements) || [];

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus({ loading: true, success: false, error: '' });
    try {
      await api.portfolios.sendContact(username || 'user', contactForm);
      setContactStatus({ loading: false, success: true, error: '' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setContactStatus({ loading: false, success: false, error: 'Message sent! (Demo mode)' });
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, sk) => {
    const cat = sk.category || 'Core Skills';
    acc[cat] = acc[cat] || [];
    acc[cat].push(sk);
    return acc;
  }, {});

  // Theme styling configurations
  const isDark = themeId === 'developer' || themeId === 'modern';
  const isCreative = themeId === 'creative';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-300`}>
      {/* Top Floating Nav */}
      <nav className={`sticky top-0 z-40 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md border-b py-3 px-6`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-lg tracking-tight">
            {info.fullName || 'Portfolio'}
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-500 transition">About</a>
            <a href="#skills" className="hover:text-blue-500 transition">Skills</a>
            <a href="#experience" className="hover:text-blue-500 transition">Experience</a>
            <a href="#projects" className="hover:text-blue-500 transition">Projects</a>
            <a href="#contact" className="hover:text-blue-500 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-24 px-6 relative overflow-hidden ${themeId === 'creative' ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 text-white' : ''}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {info.avatarUrl && (
            <img src={info.avatarUrl} alt={info.fullName} className="w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-blue-500/30 shadow-xl" />
          )}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              {info.fullName || 'Alex Johnson'}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-blue-500">
              {info.professionalTitle || 'Software Developer'}
            </p>
          </div>
          {info.location && (
            <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" /> {info.location}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a href="#projects" className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-500/25 flex items-center gap-2">
              View Work <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contact" className={`px-6 py-3 rounded-lg font-semibold border ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-300 hover:bg-slate-100 text-slate-800'} transition`}>
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      {data.summary && (
        <section id="about" className={`py-16 px-6 ${isDark ? 'bg-slate-900/50' : 'bg-white'} border-y border-slate-800/50`}>
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-blue-500 flex items-center gap-2">
              <Code className="w-6 h-6" /> About Me
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-300">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 px-6 max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Skills & Expertise</h2>
            <p className="text-slate-400 text-sm">Technologies and tools I work with daily</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border shadow-sm space-y-3`}>
                <h3 className="text-lg font-semibold text-blue-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <span key={s.id || s.name} className={`px-3 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-slate-800 text-blue-300 border border-slate-700' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experiences.length > 0 && (
        <section id="experience" className={`py-20 px-6 ${isDark ? 'bg-slate-900/40' : 'bg-white'} border-y border-slate-800/50`}>
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Work History</h2>
              <p className="text-slate-400 text-sm">My professional journey and track record</p>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:md:left-1/2 before:-ml-px before:w-0.5 before:bg-slate-800">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border shadow-sm space-y-2`}>
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                      <h3 className="font-bold text-lg text-slate-100">{exp.jobTitle}</h3>
                      <span className="text-xs font-semibold text-blue-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">{exp.company} • {exp.location}</p>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-800">{exp.responsibilities}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 px-6 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-slate-400 text-sm">Real-world applications built with modern tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, i) => (
              <div key={proj.id || i} className={`p-6 rounded-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border shadow-lg flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition`}>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center justify-between">
                    {proj.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[11px] font-medium bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-800 text-sm font-semibold">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1.5">
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-6 ${isDark ? 'bg-slate-900/60' : 'bg-white'} border-t border-slate-800`}>
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Get In Touch</h2>
            <p className="text-slate-400 text-sm">Have a question or want to work together? Drop a message!</p>
          </div>

          <form onSubmit={handleContactSubmit} className={`p-8 rounded-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border text-left space-y-4 shadow-xl`}>
            {contactStatus.success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Thank you! Your message has been sent successfully.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Let's build something amazing together..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={contactStatus.loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" /> {contactStatus.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} {info.fullName || 'User'}. Built with AI Resume & Portfolio Builder.
      </footer>
    </div>
  );
}
