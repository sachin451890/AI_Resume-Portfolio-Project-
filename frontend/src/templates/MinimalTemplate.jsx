import React from 'react';

export default function MinimalTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-900 leading-snug">
      {/* Minimal Header */}
      <header className="mb-5">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{info.fullName || 'Alex Johnson'}</h1>
        <p className="text-sm font-medium text-slate-500 mt-0.5">{info.professionalTitle}</p>
        <div className="flex flex-wrap gap-x-4 text-xs text-slate-400 mt-2">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>{info.phone}</span>}
          {info.location && <span>{info.location}</span>}
          {info.githubUrl && <span>GitHub</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="text-xs">
                <div className="flex justify-between items-baseline font-medium text-slate-900">
                  <span>{exp.jobTitle} <span className="text-slate-400 font-normal">at</span> {exp.company}</span>
                  <span className="text-slate-400 text-[11px]">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="whitespace-pre-line text-slate-600 mt-1">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2">Projects</h2>
          <div className="space-y-3 text-xs">
            {projects.map((proj, i) => (
              <div key={proj.id || i}>
                <p className="font-medium text-slate-900">{proj.name}</p>
                <p className="text-slate-600 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education */}
      <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
        {skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">Skills</h2>
            <p className="text-xs text-slate-600 leading-normal">{skills.map(s => s.name).join(', ')}</p>
          </div>
        )}
        {educations.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">Education</h2>
            {educations.map((edu, i) => (
              <div key={edu.id || i} className="text-xs">
                <p className="font-medium text-slate-900">{edu.degree}</p>
                <p className="text-slate-500">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
