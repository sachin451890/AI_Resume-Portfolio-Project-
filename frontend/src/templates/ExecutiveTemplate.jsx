import React from 'react';

export default function ExecutiveTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];
  const achievements = data.achievements || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-900 leading-normal">
      {/* Executive Dark Header Banner */}
      <header className="-mx-[15mm] -mt-[15mm] p-6 bg-slate-900 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white">{info.fullName || 'Alex Johnson'}</h1>
            <p className="text-sm text-slate-300 font-medium tracking-wide uppercase mt-0.5">{info.professionalTitle}</p>
          </div>
          <div className="text-right text-xs text-slate-300 space-y-0.5">
            {info.email && <p>{info.email}</p>}
            {info.phone && <p>{info.phone}</p>}
            {info.location && <p>{info.location}</p>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-1.5 border-b-2 border-slate-900 pb-0.5">Executive Summary</h2>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">{data.summary}</p>
        </section>
      )}

      {/* Core Competencies */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-2 border-b-2 border-slate-900 pb-0.5">Areas of Expertise</h2>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-800">
            {skills.map((sk, i) => (
              <div key={sk.id || i} className="bg-slate-100 px-2.5 py-1 rounded border-l-2 border-slate-900">
                {sk.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Professional Experience */}
      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-3 border-b-2 border-slate-900 pb-0.5">Professional Leadership</h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900">{exp.jobTitle}</span>
                  <span className="text-slate-500 font-medium">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-slate-700 font-semibold mb-1">{exp.company} | {exp.location}</p>
                <p className="whitespace-pre-line text-slate-700 leading-relaxed">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements / Education */}
      <div className="grid grid-cols-2 gap-6">
        {educations.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-2 border-b-2 border-slate-900 pb-0.5">Education</h2>
            {educations.map((edu, i) => (
              <div key={edu.id || i} className="text-xs">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-slate-600">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-2 border-b-2 border-slate-900 pb-0.5">Key Achievements</h2>
            {achievements.map((ach, i) => (
              <div key={ach.id || i} className="text-xs mb-1">
                <p className="font-bold text-slate-900">{ach.title}</p>
                <p className="text-slate-600">{ach.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
