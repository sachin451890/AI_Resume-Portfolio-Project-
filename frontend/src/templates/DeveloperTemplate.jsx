import React from 'react';
import { Terminal, Code, Cpu, Link as LinkIcon } from 'lucide-react';

export default function DeveloperTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];

  return (
    <div id="resume-document" className="resume-a4-page font-mono text-slate-800 leading-snug">
      {/* Dev Terminal Header */}
      <header className="border-2 border-slate-900 rounded p-3 bg-slate-900 text-slate-100 mb-4">
        <div className="flex items-center gap-1.5 mb-2 border-b border-slate-800 pb-1.5 text-xs text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>~/developer-profile/resume.json</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-sans text-emerald-400">{info.fullName || 'Alex Johnson'}</h1>
            <p className="text-xs font-mono text-slate-300 mt-0.5">{info.professionalTitle || 'Full Stack Engineer'}</p>
          </div>
          <div className="text-right text-[11px] text-slate-300 space-y-0.5 font-sans">
            {info.email && <p>{info.email}</p>}
            {info.githubUrl && <p className="text-emerald-300">{info.githubUrl.replace('https://', '')}</p>}
            {info.location && <p>{info.location}</p>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
            <Code className="w-3.5 h-3.5" /> // About
          </h2>
          <p className="text-xs font-sans text-slate-700 leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">{data.summary}</p>
        </section>
      )}

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> // Tech Stack & Competencies
          </h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
              <span key={s.id || i} className="text-[11px] font-mono bg-slate-900 text-emerald-400 border border-slate-800 px-2 py-0.5 rounded">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-700 mb-2">// Experience</h2>
          <div className="space-y-3 font-sans">
            {experiences.map((exp, i) => (
              <div key={exp.id || i} className="text-xs border-l-2 border-slate-900 pl-2.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.jobTitle} @ <span className="text-emerald-700 font-mono">{exp.company}</span></span>
                  <span className="text-slate-400 text-[11px]">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="whitespace-pre-line text-slate-700 mt-1 leading-relaxed">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-700 mb-2">// Featured Code Projects</h2>
          <div className="space-y-2.5 font-sans">
            {projects.map((proj, i) => (
              <div key={proj.id || i} className="text-xs bg-slate-50 p-2 rounded border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3 text-emerald-600" /> {proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[10px] font-mono text-emerald-700 font-normal">
                      [{Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}]
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-[11px] mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section>
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-700 mb-1">// Education</h2>
          {educations.map((edu, i) => (
            <div key={edu.id || i} className="text-xs font-sans flex justify-between">
              <span className="font-bold">{edu.degree} — {edu.institution}</span>
              <span className="text-slate-400">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
