import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function BlueWhiteTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];
  const customSections = data.customSections || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-900 bg-white leading-normal flex flex-col justify-between">
      <div>
        {/* Blue Header Banner */}
        <header className="bg-blue-800 text-white p-6 -mx-[15mm] -mt-[15mm] mb-5 shadow-md">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-white truncate">{info.fullName || 'Alex Johnson'}</h1>
              <p className="text-blue-200 text-sm font-semibold tracking-wide uppercase">{info.professionalTitle || 'Senior Software Engineer'}</p>
            </div>
            {info.avatarUrl && (
              <img src={info.avatarUrl} alt={info.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-white shrink-0 ml-4 shadow" />
            )}
          </div>

          {/* Contact Bar Inside Blue Header */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100 mt-4 pt-3 border-t border-blue-700/80">
            {info.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-300" /> {info.email}</span>}
            {info.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-300" /> {info.phone}</span>}
            {info.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-300" /> {info.location}</span>}
            {info.linkedinUrl && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-blue-300" /> LinkedIn</span>}
            {info.githubUrl && <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5 text-blue-300" /> GitHub</span>}
            {info.portfolioUrl && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-blue-300" /> Portfolio</span>}
          </div>
        </header>

        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={exp.id || i} className="text-xs border-l-2 border-blue-600 pl-3">
                  <div className="flex justify-between items-baseline gap-4 font-bold text-slate-900">
                    <span className="text-sm min-w-0 flex-1">{exp.jobTitle}</span>
                    <span className="text-blue-700 font-semibold shrink-0 text-right">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-blue-800 font-semibold mb-1">
                    {exp.company} <span className="text-slate-500 font-normal">| {exp.location}</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-700 leading-relaxed">{exp.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section (Blue & White Badges) */}
        {skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-2.5">
              Key Competencies & Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((sk, i) => (
                <span key={sk.id || i} className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-md shadow-sm">
                  {sk.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-3">
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, i) => (
                <div key={proj.id || i} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-baseline gap-4 font-bold text-slate-900">
                    <span className="text-blue-900 min-w-0 flex-1">{proj.name}</span>
                    {proj.technologies && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0 text-right">
                        {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications (Two-Column Layout) */}
        <div className="grid grid-cols-2 gap-6">
          {educations.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-2">
                Education
              </h2>
              {educations.map((edu, i) => (
                <div key={edu.id || i} className="text-xs mb-2">
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-blue-700 font-semibold">{edu.institution}</p>
                  <p className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-blue-800 border-b-2 border-blue-800 pb-1 mb-2">
                Certifications
              </h2>
              {certifications.map((c, i) => (
                <div key={c.id || i} className="text-xs mb-1.5">
                  <p className="font-bold text-slate-900">{c.name}</p>
                  <p className="text-blue-700 text-[11px] font-semibold">{c.organization}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
