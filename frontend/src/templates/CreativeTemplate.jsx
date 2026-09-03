import React from 'react';

export default function CreativeTemplate({ data }) {
  const info = data.personalInfo || {};
  const skills = data.skills || [];
  const experiences = data.experiences || [];
  const educations = data.educations || [];
  const projects = data.projects || [];

  return (
    <div id="resume-document" className="resume-a4-page font-sans text-slate-900 flex flex-col justify-between">
      {/* Creative Header */}
      <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white p-5 -mx-[15mm] -mt-[15mm] mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{info.fullName || 'Alex Johnson'}</h1>
            <p className="text-purple-200 text-sm font-semibold tracking-wide mt-0.5">{info.professionalTitle}</p>
          </div>
          <div className="text-right text-xs text-purple-100 space-y-1">
            {info.email && <p>{info.email}</p>}
            {info.phone && <p>{info.phone}</p>}
            {info.location && <p>{info.location}</p>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <p className="text-xs text-slate-700 leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-100 italic">
            "{data.summary}"
          </p>
        </section>
      )}

      {/* Two Column Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="col-span-8 space-y-5">
          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-full inline-block"></span> Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={exp.id || i} className="text-xs border-l-2 border-purple-200 pl-3">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.jobTitle}</span>
                      <span className="text-purple-600 font-normal">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-slate-500 font-medium">{exp.company} • {exp.location}</p>
                    <p className="whitespace-pre-line text-slate-700 mt-1">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block"></span> Portfolio & Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={proj.id || i} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
                    <p className="font-bold text-slate-900">{proj.name}</p>
                    <p className="text-slate-600 mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-5">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3">Skillsets</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s, i) => (
                  <span key={s.id || i} className="text-[10px] font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <section>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-purple-700 mb-3">Education</h2>
              {educations.map((edu, i) => (
                <div key={edu.id || i} className="text-xs mb-2">
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-500">{edu.institution}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
