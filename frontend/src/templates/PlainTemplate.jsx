import React from 'react';

export default function PlainTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];
  const customSections = data.customSections || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-900 bg-white leading-normal">
      {/* Header - Plain Black & White Text */}
      <header className="mb-4 pb-2.5 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">{info.fullName || 'Alex Johnson'}</h1>
        <p className="text-xs font-bold text-slate-700 mt-0.5">{info.professionalTitle || 'Software Engineer'}</p>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-700 mt-2">
          {info.location && <span>{info.location}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.email && <span>• {info.email}</span>}
          {info.linkedinUrl && <span>• {info.linkedinUrl.replace('https://', '')}</span>}
          {info.githubUrl && <span>• {info.githubUrl.replace('https://', '')}</span>}
          {info.portfolioUrl && <span>• {info.portfolioUrl.replace('https://', '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="text-xs">
                <div className="flex justify-between items-baseline gap-4 font-bold text-slate-900">
                  <span className="min-w-0 flex-1">{exp.jobTitle} — <span className="font-semibold text-slate-800">{exp.company}</span></span>
                  <span className="shrink-0 font-medium text-slate-700 text-right">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-[11px] italic text-slate-600 mt-0.5">{exp.location}</p>}
                <p className="whitespace-pre-line text-slate-800 mt-1 leading-relaxed">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5">
            Key Projects
          </h2>
          <div className="space-y-2.5 text-xs">
            {projects.map((proj, i) => (
              <div key={proj.id || i}>
                <div className="flex justify-between items-baseline gap-4 font-bold text-slate-900">
                  <span className="min-w-0 flex-1">{proj.name}</span>
                  {proj.technologies && (
                    <span className="shrink-0 font-mono text-[10px] font-normal text-slate-700 text-right">
                      [{Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}]
                    </span>
                  )}
                </div>
                <p className="text-slate-800 mt-0.5 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {educations.map((edu, i) => (
              <div key={edu.id || i} className="flex justify-between items-baseline gap-4 text-slate-900">
                <div className="min-w-0 flex-1">
                  <span className="font-bold">{edu.degree}</span> — <span className="font-medium">{edu.institution}</span>
                </div>
                <span className="shrink-0 text-slate-700 font-medium text-right">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-1.5">
            Technical & Professional Skills
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            {skills.map(s => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-1">
            Certifications
          </h2>
          <p className="text-xs text-slate-800">
            {certifications.map(c => `${c.name} (${c.organization})`).join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.filter(cs => cs.isEnabled).map((cs, i) => (
        <section key={cs.id || i} className="mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-1">
            {cs.title}
          </h2>
          <p className="text-xs text-slate-800">{cs.content}</p>
        </section>
      ))}
    </div>
  );
}
