import React from 'react';

export default function ProfessionalTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];

  return (
    <div id="resume-document" className="resume-a4-page font-serif text-slate-900 leading-normal">
      {/* Centered Classic Header */}
      <header className="text-center border-b border-slate-400 pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">{info.fullName || 'Alex Johnson'}</h1>
        <p className="text-sm font-sans font-semibold text-slate-700 italic mt-0.5">{info.professionalTitle}</p>
        <div className="flex justify-center items-center gap-3 text-xs font-sans text-slate-600 mt-2">
          {info.location && <span>{info.location}</span>}
          {info.email && <span>• {info.email}</span>}
          {info.phone && <span>• {info.phone}</span>}
          {info.linkedinUrl && <span>• LinkedIn</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-sans font-bold border-b border-slate-300 pb-0.5 mb-1.5 text-slate-800">Professional Summary</h2>
          <p className="text-xs font-sans text-slate-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-sans font-bold border-b border-slate-300 pb-0.5 mb-2 text-slate-800">Professional Experience</h2>
          <div className="space-y-3 font-sans">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.jobTitle} — <span className="font-normal italic text-slate-700">{exp.company}</span></span>
                  <span className="text-slate-500 font-normal">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="whitespace-pre-line text-slate-700 mt-1 leading-relaxed">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-sans font-bold border-b border-slate-300 pb-0.5 mb-2 text-slate-800">Education</h2>
          <div className="space-y-2 font-sans">
            {educations.map((edu, i) => (
              <div key={edu.id || i} className="text-xs flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>, {edu.institution}
                </div>
                <span className="text-slate-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-sans font-bold border-b border-slate-300 pb-0.5 mb-1.5 text-slate-800">Core Competencies & Skills</h2>
          <p className="text-xs font-sans text-slate-700">
            {skills.map(s => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs uppercase font-sans font-bold border-b border-slate-300 pb-0.5 mb-1.5 text-slate-800">Key Projects</h2>
          <div className="space-y-2 font-sans text-xs">
            {projects.map((p, i) => (
              <div key={p.id || i}>
                <span className="font-bold text-slate-900">{p.name}: </span>
                <span className="text-slate-700">{p.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
