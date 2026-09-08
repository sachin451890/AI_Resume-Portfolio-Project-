import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Github, Linkedin, Globe, ExternalLink, Calendar, 
  Send, Award, BookOpen, Briefcase, Code, CheckCircle, ArrowRight, Download, 
  Sparkles, ShieldCheck, Filter, Search, UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { exportResumeToPDF } from '../../utils/pdfExporter';

export const PORTFOLIO_THEMES = [
  { id: 'developer', name: 'Developer Dark', description: 'Tech-focused dark mode with code highlight badges' },
  { id: 'modern', name: 'Modern SaaS', description: 'Sleek dark gradient with glowing blue glassmorphism cards' },
  { id: 'minimal', name: 'Minimalist White', description: 'Clean, elegant high contrast typography layout' },
  { id: 'creative', name: 'Creative Gradient', description: 'Vibrant purple and indigo accents with interactive cards' },
  { id: 'professional', name: 'Corporate Navy', description: 'Executive navy blue header with structured timeline' }
];

export const PORTFOLIO_ACCENTS = [
  { id: 'blue', name: 'Electric Blue', primary: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500' },
  { id: 'emerald', name: 'Emerald Cyber', primary: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'purple', name: 'Neon Purple', primary: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'amber', name: 'Sunset Amber', primary: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500' },
  { id: 'rose', name: 'Crimson Rose', primary: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-500' }
];

export default function PortfolioThemeRenderer({ 
  themeId = 'developer', 
  data, 
  username, 
  accentColor = 'blue',
  availabilityStatus = 'Available for Full-time & Freelance'
}) {
  const info = (data && data.personalInfo) || {};
  const skills = (data && data.skills) || [];
  const experiences = (data && data.experiences) || [];
  const educations = (data && data.educations) || [];
  const projects = (data && data.projects) || [];
  const certifications = (data && data.certifications) || [];
  const achievements = (data && data.achievements) || [];

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: '' });

  // Project filter state
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus({ loading: true, success: false, error: '' });
    try {
      await api.portfolios.sendContact(username || 'user', contactForm);
      setContactStatus({ loading: false, success: true, error: '' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setContactStatus({ loading: false, success: true, error: '' });
      setContactForm({ name: '', email: '', message: '' });
    }
  };

  const handleDownloadPDF = () => {
    if (data) {
      exportResumeToPDF(data);
    }
  };

  // Accent styling mapping
  const accentText = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  }[accentColor] || 'text-blue-400';

  const accentBg = {
    blue: 'bg-blue-600 hover:bg-blue-500',
    emerald: 'bg-emerald-600 hover:bg-emerald-500',
    purple: 'bg-purple-600 hover:bg-purple-500',
    amber: 'bg-amber-500 hover:bg-amber-400',
    rose: 'bg-rose-600 hover:bg-rose-500'
  }[accentColor] || 'bg-blue-600 hover:bg-blue-500';

  const accentBorder = {
    blue: 'border-blue-500',
    emerald: 'border-emerald-500',
    purple: 'border-purple-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500'
  }[accentColor] || 'border-blue-500';

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, sk) => {
    const cat = sk.category || 'Core Technologies';
    acc[cat] = acc[cat] || [];
    acc[cat].push(sk);
    return acc;
  }, {});

  // Filter projects by search and skill tab
  const filteredProjects = projects.filter(p => {
    const matchesSearch = projectSearch === '' || 
      p.name?.toLowerCase().includes(projectSearch.toLowerCase()) || 
      p.description?.toLowerCase().includes(projectSearch.toLowerCase());
    
    const techArray = Array.isArray(p.technologies) ? p.technologies : [p.technologies];
    const matchesSkill = selectedSkillFilter === 'All' || techArray.some(t => String(t).toLowerCase().includes(selectedSkillFilter.toLowerCase()));
    
    return matchesSearch && matchesSkill;
  });

  const isDark = themeId === 'developer' || themeId === 'modern' || themeId === 'creative';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-300`}>
      {/* Top Floating Nav */}
      <nav className={`sticky top-0 z-40 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md border-b py-3.5 px-6`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 font-extrabold text-lg tracking-tight">
            <span className={`w-8 h-8 rounded-xl ${accentBg} text-white flex items-center justify-center font-black text-sm shadow`}>
              {(info.fullName || 'P').charAt(0)}
            </span>
            <span>{info.fullName || 'Portfolio'}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#about" className="hover:text-blue-400 transition">About</a>
            <a href="#skills" className="hover:text-blue-400 transition">Skills</a>
            <a href="#experience" className="hover:text-blue-400 transition">Experience</a>
            <a href="#projects" className="hover:text-blue-400 transition">Projects</a>
            {certifications.length > 0 && <a href="#certifications" className="hover:text-blue-400 transition">Certifications</a>}
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
          </div>
          <button
            onClick={handleDownloadPDF}
            className={`px-3.5 py-1.5 rounded-xl ${accentBg} text-white text-xs font-bold shadow flex items-center gap-1.5 transition`}
          >
            <Download className="w-3.5 h-3.5" /> PDF Resume
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-20 px-6 relative overflow-hidden ${themeId === 'creative' ? 'bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white' : ''}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Availability Status Badge */}
          {availabilityStatus && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{availabilityStatus}</span>
            </div>
          )}

          {info.avatarUrl && (
            <img src={info.avatarUrl} alt={info.fullName} className={`w-28 h-28 rounded-full mx-auto object-cover ring-4 ${accentBorder} shadow-2xl`} />
          )}

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              {info.fullName || 'Alex Johnson'}
            </h1>
            <p className={`text-xl sm:text-2xl font-bold ${accentText}`}>
              {info.professionalTitle || 'Software Engineer'}
            </p>
          </div>

          {info.location && (
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> {info.location}
            </p>
          )}

          {/* Social Profiles Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {info.github && (
              <a href={info.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-blue-400 hover:text-blue-300 transition" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {info.email && (
              <a href={`mailto:${info.email}`} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 transition" title="Email">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {info.phone && (
              <a href={`tel:${info.phone}`} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-purple-400 hover:text-purple-300 transition" title="Phone">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a href="#projects" className={`px-6 py-3 rounded-xl font-bold ${accentBg} text-white transition shadow-lg flex items-center gap-2 text-xs sm:text-sm`}>
              View Work & Projects <ArrowRight className="w-4 h-4" />
            </a>
            <button 
              onClick={handleDownloadPDF} 
              className={`px-6 py-3 rounded-xl font-bold border ${isDark ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200' : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'} text-xs sm:text-sm flex items-center gap-2 transition`}
            >
              <Download className="w-4 h-4 text-blue-400" /> Download PDF Resume
            </button>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      {data.summary && (
        <section id="about" className={`py-16 px-6 ${isDark ? 'bg-slate-900/50' : 'bg-white'} border-y border-slate-800/50`}>
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className={`text-2xl font-bold tracking-tight ${accentText} flex items-center gap-2`}>
              <Code className="w-6 h-6" /> Professional Overview
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-300">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Skills & Matrix Section */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 px-6 max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Skills & Technical Expertise</h2>
            <p className="text-slate-400 text-xs">Technologies and tools mastered</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className={`p-6 rounded-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border shadow-md space-y-4`}>
                <h3 className={`text-base font-bold ${accentText}`}>{category}</h3>
                <div className="space-y-3">
                  {items.map(s => (
                    <div key={s.id || s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>{s.name}</span>
                        <span className="text-slate-400">{s.level || 'Advanced'}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${accentBg} rounded-full`} style={{ width: s.level === 'Expert' ? '95%' : s.level === 'Intermediate' ? '70%' : '85%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience Timeline */}
      {experiences.length > 0 && (
        <section id="experience" className={`py-20 px-6 ${isDark ? 'bg-slate-900/40' : 'bg-white'} border-y border-slate-800/50`}>
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Work History & Experience</h2>
              <p className="text-slate-400 text-xs">Career progression & key accomplishments</p>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:md:left-1/2 before:-ml-px before:w-0.5 before:bg-slate-800">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${accentBg} text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-6 rounded-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border shadow-sm space-y-2`}>
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                      <h3 className="font-bold text-base text-slate-100">{exp.jobTitle}</h3>
                      <span className={`text-xs font-semibold ${accentText}`}>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400">{exp.company} • {exp.location}</p>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-800">{exp.responsibilities}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects with Filter */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 px-6 max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
            <p className="text-slate-400 text-xs">Real-world applications built with modern tech stacks</p>
          </div>

          {/* Search Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-3xl mx-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {['All', 'React', 'Node', 'Python', 'AI'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedSkillFilter(tab)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedSkillFilter === tab ? `${accentBg} text-white` : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((proj, i) => (
              <div key={proj.id || i} className={`p-6 rounded-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border shadow-lg flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition group`}>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t border-slate-800 text-xs font-bold">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" /> Source Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={`${accentText} hover:underline flex items-center gap-1.5`}>
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Grid Section */}
      {certifications.length > 0 && (
        <section id="certifications" className={`py-16 px-6 ${isDark ? 'bg-slate-900/60' : 'bg-white'} border-t border-slate-800`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Verified Certifications</h2>
              <p className="text-slate-400 text-xs">Industry credentials and qualifications</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <Award className={`w-8 h-8 ${accentText} shrink-0`} />
                  <div>
                    <h4 className="font-bold text-xs text-white">{cert.name}</h4>
                    <p className="text-[11px] text-slate-400">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact & Hire Inquiry Section */}
      <section id="contact" className={`py-20 px-6 ${isDark ? 'bg-slate-950' : 'bg-white'} border-t border-slate-800`}>
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Get In Touch / Hire Inquiry</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Have a project, freelance opportunity, or full-time position? Reach out directly via the form below or connect through social channels.
            </p>
          </div>

          {/* Quick Contact & Hire Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {info.email && (
              <a 
                href={`mailto:${info.email}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 space-y-2 transition block group"
              >
                <Mail className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-white text-xs">Direct Email Inquiry</h4>
                <p className="text-[11px] text-slate-400 truncate">{info.email}</p>
              </a>
            )}

            {info.phone && (
              <a 
                href={`tel:${info.phone}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 space-y-2 transition block group"
              >
                <Phone className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-white text-xs">Phone / WhatsApp</h4>
                <p className="text-[11px] text-slate-400 truncate">{info.phone}</p>
              </a>
            )}

            <button
              onClick={handleDownloadPDF}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 space-y-2 transition text-left group block w-full"
            >
              <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-white text-xs">Download Full Resume</h4>
              <p className="text-[11px] text-slate-400">High-resolution PDF document</p>
            </button>
          </div>

          <form onSubmit={handleContactSubmit} className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border text-left space-y-4 shadow-xl`}>
            {contactStatus.success && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Thank you! Your message has been sent successfully to the portfolio owner.
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
                  className={`w-full px-4 py-2.5 rounded-xl text-xs ${isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                  className={`w-full px-4 py-2.5 rounded-xl text-xs ${isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                className={`w-full px-4 py-2.5 rounded-xl text-xs ${isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Let's build something amazing together..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={contactStatus.loading}
              className={`w-full py-3.5 rounded-xl ${accentBg} text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg`}
            >
              <Send className="w-4 h-4" /> {contactStatus.loading ? 'Sending Message...' : 'Send Direct Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-800 flex flex-col items-center justify-center gap-1">
        <p>© {new Date().getFullYear()} {info.fullName || 'User'}. All Rights Reserved.</p>
        <p className="text-[11px] text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" /> Powered by AI Resume & Portfolio Website Generator
        </p>
      </footer>
    </div>
  );
}

