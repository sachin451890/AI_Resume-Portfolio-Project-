import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function ModernTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];
  const customSections = data.customSections || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <header className="border-b-2 border-blue-600 pb-4 mb-5 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{info.fullName || 'Alex Johnson'}</h1>
            <p className="text-lg font-medium text-blue-600 mt-1">{info.professionalTitle || 'Software Engineer'}</p>
            {data.summary && (
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">{data.summary}</p>
            )}
          </div>
          {info.avatarUrl && (
            <img src={info.avatarUrl} alt={info.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shrink-0 ml-4" />
          )}
        </header>

        {/* Contact Info Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          {info.email && (
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600" /> {info.email}</span>
          )}
          {info.phone && (
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> {info.phone}</span>
          )}
          {info.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {info.location}</span>
          )}
          {info.linkedinUrl && (
            <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn</span>
          )}
          {info.githubUrl && (
            <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5 text-blue-600" /> GitHub</span>
          )}
          {info.portfolioUrl && (
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-blue-600" /> Portfolio</span>
          )}
        </div>

        {/* Main Body - Two Columns */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (8 cols) */}
          <div className="col-span-8 space-y-5">
            {/* Experience Section */}
            {experiences.length > 0 && (
              <section>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-3">Work Experience</h2>
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <div key={exp.id || i} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-sm">{exp.jobTitle}</span>
                        <span className="text-slate-500 font-medium">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="flex justify-between text-blue-600 font-medium mb-1">
                        <span>{exp.company}</span>
                        <span className="text-slate-400">{exp.location}</span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 leading-relaxed">{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-3">Featured Projects</h2>
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={proj.id || i} className="text-xs">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{proj.name}</span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (4 cols) */}
          <div className="col-span-4 space-y-5">
            {/* Skills Section */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((sk, i) => (
                    <span key={sk.id || i} className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {educations.length > 0 && (
              <section>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-3">Education</h2>
                <div className="space-y-3">
                  {educations.map((edu, i) => (
                    <div key={edu.id || i} className="text-xs">
                      <p className="font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-slate-400">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-3">Certifications</h2>
                <div className="space-y-2 text-xs">
                  {certifications.map((c, i) => (
                    <div key={c.id || i}>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-slate-500 text-[11px]">{c.organization}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.filter(cs => cs.isEnabled).map((cs, i) => (
              <section key={cs.id || i}>
                <h2 className="text-xs uppercase font-bold tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">{cs.title}</h2>
                <p className="text-xs text-slate-700">{cs.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
