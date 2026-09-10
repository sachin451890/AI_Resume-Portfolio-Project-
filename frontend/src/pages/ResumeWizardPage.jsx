import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, ArrowRight, Save, Download, Bot, CheckCircle, Plus, Trash2, 
  ChevronUp, ChevronDown, ShieldCheck, Eye, Layers, FileText, Check, AlertCircle, Copy, HelpCircle
} from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ResumeTemplateRenderer, { TEMPLATES } from '../templates/TemplateRegistry';
import { calculateLocalATSScore } from '../utils/atsScorer';
import { calculateJobMatch } from '../utils/jobMatcher';
import { exportResumeToPDF } from '../utils/pdfExporter';
import AuthRequiredModal from '../components/auth/AuthRequiredModal';
import ExportFormatModal from '../components/export/ExportFormatModal';
import ResumeFileUploader from '../components/common/ResumeFileUploader';

export default function ResumeWizardPage() {
  const { activeResume, updateActiveResume, saveResume, isSaving, wizardStep, setWizardStep, createVersion } = useResume();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [pendingAction, setPendingAction] = useState(null);

  // Download / Export Trigger
  const handleDownload = async () => {
    if (!user) {
      addToast('Please log in or create a free account to export your resume.', 'info');
      setPendingAction('EXPORT_PDF');
      setAuthModalOpen(true);
      return;
    }
    setExportModalOpen(true);
  };

  // AI Modal States
  const [aiModal, setAiModal] = useState({ open: false, targetSection: '', original: '', generated: '', action: '', loading: false });
  const [skillSuggestionsModal, setSkillSuggestionsModal] = useState({ open: false, suggestions: [], selected: [], loading: false });

  // Job Description Matcher Modal State
  const [jobMatchModal, setJobMatchModal] = useState({ open: false, jdText: '', result: null, loading: false });

  // ATS Score State
  const [atsAnalysis, setAtsAnalysis] = useState(null);

  const steps = [
    'Personal Info', 'Summary', 'Education', 'Experience', 
    'Skills', 'Projects', 'Certifications', 'Achievements', 
    'Custom Sections', 'Template & Preview'
  ];

  // Helper for updating nested personal info
  const handlePersonalInfoChange = (field, value) => {
    updateActiveResume(prev => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        [field]: value
      }
    }));
  };

  // AI Improvement Actions
  const triggerAISummaryImprove = async (actionType = 'improve') => {
    const current = activeResume.summary || '';
    setAiModal({ open: true, targetSection: 'summary', original: current, generated: '', action: actionType, loading: true });
    try {
      const res = await api.ai.improveSummary(current, actionType);
      setAiModal(prev => ({ ...prev, generated: res.result, loading: false }));
    } catch (err) {
      addToast('Failed to connect to AI backend.', 'error');
      setAiModal(prev => ({ ...prev, loading: false }));
    }
  };

  const triggerAIExperienceImprove = async (expIndex) => {
    const exp = activeResume.experiences[expIndex];
    if (!exp) return;
    setAiModal({ open: true, targetSection: `exp_${expIndex}`, original: exp.responsibilities || '', generated: '', action: 'bullet', loading: true });
    try {
      const res = await api.ai.improveExperience(exp.jobTitle, exp.company, exp.responsibilities);
      setAiModal(prev => ({ ...prev, generated: res.result, loading: false }));
    } catch (err) {
      addToast('Failed to connect to AI backend.', 'error');
      setAiModal(prev => ({ ...prev, loading: false }));
    }
  };

  const triggerAIProjectImprove = async (projIndex) => {
    const proj = activeResume.projects[projIndex];
    if (!proj) return;
    setAiModal({ open: true, targetSection: `proj_${projIndex}`, original: proj.description || '', generated: '', action: 'improve', loading: true });
    try {
      const res = await api.ai.improveProject(proj.name, proj.description, proj.technologies);
      setAiModal(prev => ({ ...prev, generated: res.result, loading: false }));
    } catch (err) {
      addToast('Failed to connect to AI backend.', 'error');
      setAiModal(prev => ({ ...prev, loading: false }));
    }
  };

  const applyAISuggestion = () => {
    if (!aiModal.generated) return;
    if (aiModal.targetSection === 'summary') {
      updateActiveResume(prev => ({ ...prev, summary: aiModal.generated }));
    } else if (aiModal.targetSection.startsWith('exp_')) {
      const idx = parseInt(aiModal.targetSection.split('_')[1], 10);
      updateActiveResume(prev => {
        const nextExps = [...(prev.experiences || [])];
        if (nextExps[idx]) nextExps[idx].responsibilities = aiModal.generated;
        return { ...prev, experiences: nextExps };
      });
    } else if (aiModal.targetSection.startsWith('proj_')) {
      const idx = parseInt(aiModal.targetSection.split('_')[1], 10);
      updateActiveResume(prev => {
        const nextProjs = [...(prev.projects || [])];
        if (nextProjs[idx]) nextProjs[idx].description = aiModal.generated;
        return { ...prev, projects: nextProjs };
      });
    }
    addToast('AI suggestion applied!', 'success');
    setAiModal({ open: false, targetSection: '', original: '', generated: '', action: '', loading: false });
  };

  // AI Skill Suggestions
  const fetchSkillSuggestions = async () => {
    setSkillSuggestionsModal({ open: true, suggestions: [], selected: [], loading: true });
    try {
      const res = await api.ai.suggestSkills(activeResume);
      const suggestions = Array.isArray(res.result) ? res.result : ["TypeScript", "Docker", "REST API", "CI/CD"];
      setSkillSuggestionsModal({ open: true, suggestions, selected: [], loading: false });
    } catch (err) {
      setSkillSuggestionsModal({ open: true, suggestions: ["TypeScript", "REST API", "Docker", "Git"], selected: [], loading: false });
    }
  };

  const applySelectedSkills = () => {
    if (skillSuggestionsModal.selected.length === 0) return;
    const newSkillObjs = skillSuggestionsModal.selected.map(sk => ({
      id: `sk_${Date.now()}_${Math.random()}`,
      name: sk,
      category: 'Suggested Skills',
      proficiency: 'Advanced'
    }));
    updateActiveResume(prev => ({
      ...prev,
      skills: [...(prev.skills || []), ...newSkillObjs]
    }));
    addToast(`Added ${skillSuggestionsModal.selected.length} skills!`, 'success');
    setSkillSuggestionsModal({ open: false, suggestions: [], selected: [], loading: false });
  };

  // Job Matcher Execution
  const runJobMatch = () => {
    if (!jobMatchModal.jdText.trim()) return;
    setJobMatchModal(prev => ({ ...prev, loading: true }));
    const result = calculateJobMatch(activeResume, jobMatchModal.jdText);
    setJobMatchModal(prev => ({ ...prev, result, loading: false }));
  };

  // Run ATS Analysis
  const runATSCheck = () => {
    const analysis = calculateLocalATSScore(activeResume);
    setAtsAnalysis(analysis);
    addToast(`ATS Score: ${analysis.overallScore}/100`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Wizard Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">{activeResume.title || 'Untitled Resume'}</h1>
            <p className="text-xs text-slate-400">Step {wizardStep} of 10: {steps[wizardStep - 1]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              saveResume();
              addToast('Draft saved!', 'success');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5 text-blue-400" /> {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={() => createVersion()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" /> Save Version
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </header>

      {/* Progress Bar Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-3 overflow-x-auto">
        <div className="flex items-center justify-between max-w-6xl mx-auto min-w-[700px] text-xs font-semibold">
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => setWizardStep(i + 1)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition ${
                wizardStep === i + 1
                  ? 'bg-blue-600 text-white font-bold'
                  : wizardStep > i + 1
                  ? 'text-emerald-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">
                {wizardStep > i + 1 ? '✓' : i + 1}
              </span>
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side Form Editor (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-130px)] space-y-8">
          {/* STEP 1: Personal Info */}
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3 space-y-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Personal Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enter your primary contact details or upload an existing resume file to auto-fill with AI</p>
                </div>

                {/* Upload Existing Resume File Box */}
                <div className="pt-2">
                  <ResumeFileUploader
                    onResumeParsed={(parsedData) => {
                      if (parsedData.name) handlePersonalInfoChange('fullName', parsedData.name);
                      if (parsedData.title) handlePersonalInfoChange('professionalTitle', parsedData.title);
                      if (parsedData.contactEmail) handlePersonalInfoChange('email', parsedData.contactEmail);
                      if (parsedData.bio) updateActiveResume('summary', parsedData.bio);
                      if (parsedData.skills) updateActiveResume('skills', parsedData.skills.map(s => ({ name: typeof s === 'string' ? s : s.name, level: 'Advanced' })));
                      addToast('🎉 Resume auto-filled with uploaded file data!', 'success');
                    }}
                    buttonText="Upload Existing Resume to Auto-Fill Wizard (PDF / DOCX / TXT / JSON)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo?.fullName || ''}
                    onChange={e => handlePersonalInfoChange('fullName', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Alex Johnson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title *</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo?.professionalTitle || ''}
                    onChange={e => handlePersonalInfoChange('professionalTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Senior Full Stack Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={activeResume.personalInfo?.email || ''}
                    onChange={e => handlePersonalInfoChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="alex@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo?.phone || ''}
                    onChange={e => handlePersonalInfoChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 234-5678"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location (City, State/Country)</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo?.location || ''}
                    onChange={e => handlePersonalInfoChange('location', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={activeResume.personalInfo?.avatarUrl || ''}
                    onChange={e => handlePersonalInfoChange('avatarUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={activeResume.personalInfo?.linkedinUrl || ''}
                    onChange={e => handlePersonalInfoChange('linkedinUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/alexjohnson"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={activeResume.personalInfo?.githubUrl || ''}
                    onChange={e => handlePersonalInfoChange('githubUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/alexjohnson"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional Summary */}
          {wizardStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Professional Summary</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Write a brief background statement or use AI to refine your intro</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerAISummaryImprove('improve')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
                  >
                    <Bot className="w-4 h-4" /> Improve with AI
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={6}
                  value={activeResume.summary || ''}
                  onChange={e => updateActiveResume(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 leading-relaxed focus:ring-2 focus:ring-blue-500"
                  placeholder="I am a final year computer science student interested in web development and data analytics..."
                ></textarea>
              </div>

              {/* Quick AI Presets */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-300">Quick AI Actions:</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => triggerAISummaryImprove('ats')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-slate-700">
                    Make ATS-Friendly
                  </button>
                  <button onClick={() => triggerAISummaryImprove('shorten')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-slate-700">
                    Shorten (2 sentences)
                  </button>
                  <button onClick={() => triggerAISummaryImprove('professional')} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-slate-700">
                    Make Professional
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Education */}
          {wizardStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Education</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Add your academic degrees, institutions, and coursework</p>
                </div>
                <button
                  onClick={() => {
                    const newEdu = { id: `edu_${Date.now()}`, degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' };
                    updateActiveResume(prev => ({ ...prev, educations: [...(prev.educations || []), newEdu] }));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>

              {(activeResume.educations || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
                  <button
                    onClick={() => {
                      updateActiveResume(prev => ({ ...prev, educations: prev.educations.filter((_, i) => i !== idx) }));
                    }}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Degree / Qualification *</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.educations];
                            list[idx].degree = val;
                            return { ...prev, educations: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="B.S. in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Institution / University *</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.educations];
                            list[idx].institution = val;
                            return { ...prev, educations: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="UC Berkeley"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.educations];
                            list[idx].startDate = val;
                            return { ...prev, educations: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="2016-08"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.educations];
                            list[idx].endDate = val;
                            return { ...prev, educations: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="2020-05"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Experience */}
          {wizardStep === 4 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Work Experience</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Add employment history and use AI to create impactful bullet points</p>
                </div>
                <button
                  onClick={() => {
                    const newExp = { id: `exp_${Date.now()}`, jobTitle: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, responsibilities: '' };
                    updateActiveResume(prev => ({ ...prev, experiences: [...(prev.experiences || []), newExp] }));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              {(activeResume.experiences || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-blue-400">Position #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerAIExperienceImprove(idx)}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" /> Improve Bullets with AI
                      </button>
                      <button
                        onClick={() => {
                          updateActiveResume(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }));
                        }}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={exp.jobTitle || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.experiences];
                            list[idx].jobTitle = val;
                            return { ...prev, experiences: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.experiences];
                            list[idx].company = val;
                            return { ...prev, experiences: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="TechNova Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.experiences];
                            list[idx].startDate = val;
                            return { ...prev, experiences: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="2022-06"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                        disabled={exp.isCurrent}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.experiences];
                            list[idx].endDate = val;
                            return { ...prev, experiences: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 disabled:opacity-50"
                        placeholder="Present"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Responsibilities & Achievements (Bullet points)</label>
                    <textarea
                      rows={4}
                      value={exp.responsibilities || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.experiences];
                          list[idx].responsibilities = val;
                          return { ...prev, experiences: list };
                        });
                      }}
                      className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-100 leading-relaxed"
                      placeholder="• Worked on website and fixed bugs..."
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: Skills */}
          {wizardStep === 5 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Skills & Competencies</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Categorize your technical and soft skills</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchSkillSuggestions}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Bot className="w-4 h-4" /> AI Skill Suggestions
                  </button>
                  <button
                    onClick={() => {
                      const newSk = { id: `sk_${Date.now()}`, name: '', category: 'Programming Languages', proficiency: 'Advanced' };
                      updateActiveResume(prev => ({ ...prev, skills: [...(prev.skills || []), newSk] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(activeResume.skills || []).map((sk, idx) => (
                  <div key={sk.id || idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <input
                      type="text"
                      value={sk.name || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.skills];
                          list[idx].name = val;
                          return { ...prev, skills: list };
                        });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white"
                      placeholder="Skill name (e.g. React.js)"
                    />
                    <select
                      value={sk.category || 'Other'}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.skills];
                          list[idx].category = val;
                          return { ...prev, skills: list };
                        });
                      }}
                      className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300"
                    >
                      <option value="Programming Languages">Languages</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Tools">Tools</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={() => {
                        updateActiveResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Projects */}
          {wizardStep === 6 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Projects</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Highlight key side projects, open-source work, or software products</p>
                </div>
                <button
                  onClick={() => {
                    const newProj = { id: `proj_${Date.now()}`, name: '', description: '', technologies: [], githubUrl: '', liveUrl: '' };
                    updateActiveResume(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {(activeResume.projects || []).map((proj, idx) => (
                <div key={proj.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-blue-400">Project #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerAIProjectImprove(idx)}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 flex items-center gap-1"
                      >
                        <Bot className="w-3.5 h-3.5" /> Improve Description
                      </button>
                      <button
                        onClick={() => {
                          updateActiveResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));
                        }}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                      <input
                        type="text"
                        value={proj.name || ''}
                        onChange={e => {
                          const val = e.target.value;
                          updateActiveResume(prev => {
                            const list = [...prev.projects];
                            list[idx].name = val;
                            return { ...prev, projects: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="E-Commerce Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                        onChange={e => {
                          const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateActiveResume(prev => {
                            const list = [...prev.projects];
                            list[idx].technologies = val;
                            return { ...prev, projects: list };
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100"
                        placeholder="React, Node.js, Express"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={proj.description || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.projects];
                          list[idx].description = val;
                          return { ...prev, projects: list };
                        });
                      }}
                      className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
                      placeholder="An AI-powered dashboard enabling merchants..."
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 7: Certifications */}
          {wizardStep === 7 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Certifications</h2>
                  <p className="text-xs text-slate-400 mt-0.5">List professional certifications and credentials</p>
                </div>
                <button
                  onClick={() => {
                    const newCert = { id: `cert_${Date.now()}`, name: '', organization: '', issueDate: '' };
                    updateActiveResume(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert] }));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </div>

              {(activeResume.certifications || []).map((c, idx) => (
                <div key={c.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                  <button
                    onClick={() => {
                      updateActiveResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));
                    }}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={c.name || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.certifications];
                          list[idx].name = val;
                          return { ...prev, certifications: list };
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={c.organization || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.certifications];
                          list[idx].organization = val;
                          return { ...prev, certifications: list };
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 8: Achievements */}
          {wizardStep === 8 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Achievements & Honors</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Awards, hackathons, and key career recognitions</p>
                </div>
                <button
                  onClick={() => {
                    const newAch = { id: `ach_${Date.now()}`, title: '', organization: '', description: '' };
                    updateActiveResume(prev => ({ ...prev, achievements: [...(prev.achievements || []), newAch] }));
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Achievement
                </button>
              </div>

              {(activeResume.achievements || []).map((ach, idx) => (
                <div key={ach.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative">
                  <button
                    onClick={() => {
                      updateActiveResume(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
                    }}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={ach.title || ''}
                    onChange={e => {
                      const val = e.target.value;
                      updateActiveResume(prev => {
                        const list = [...prev.achievements];
                        list[idx].title = val;
                        return { ...prev, achievements: list };
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                    placeholder="First Place - Hackathon 2023"
                  />
                  <textarea
                    rows={2}
                    value={ach.description || ''}
                    onChange={e => {
                      const val = e.target.value;
                      updateActiveResume(prev => {
                        const list = [...prev.achievements];
                        list[idx].description = val;
                        return { ...prev, achievements: list };
                      });
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
                    placeholder="Brief description..."
                  ></textarea>
                </div>
              ))}
            </div>
          )}

          {/* STEP 9: Custom Sections */}
          {wizardStep === 9 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-extrabold text-white">Custom / Additional Sections</h2>
                <p className="text-xs text-slate-400 mt-0.5">Toggle optional sections like Languages, Interests, Volunteer work, or Publications</p>
              </div>

              {(activeResume.customSections || []).map((cs, idx) => (
                <div key={cs.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={cs.isEnabled}
                    onChange={e => {
                      const val = e.target.checked;
                      updateActiveResume(prev => {
                        const list = [...prev.customSections];
                        list[idx].isEnabled = val;
                        return { ...prev, customSections: list };
                      });
                    }}
                    className="mt-1.5 w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={cs.title || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.customSections];
                          list[idx].title = val;
                          return { ...prev, customSections: list };
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white"
                    />
                    <input
                      type="text"
                      value={cs.content || ''}
                      onChange={e => {
                        const val = e.target.value;
                        updateActiveResume(prev => {
                          const list = [...prev.customSections];
                          list[idx].content = val;
                          return { ...prev, customSections: list };
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 10: Template & Preview Tools */}
          {wizardStep === 10 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-extrabold text-white">Select Template & Audit ATS</h2>
                <p className="text-xs text-slate-400 mt-0.5">Switch resume layouts and analyze match score against target job postings</p>
              </div>

              {/* Template Picker Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateActiveResume(prev => ({ ...prev, templateId: t.id }))}
                    className={`p-3.5 rounded-xl border text-left space-y-1.5 transition ${
                      activeResume.templateId === t.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{t.name}</span>
                      {activeResume.templateId === t.id && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{t.description}</p>
                  </button>
                ))}
              </div>

              {/* ATS Audit & Job Matcher Tools */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> ATS Compatibility Audit
                  </h3>
                  <button
                    onClick={runATSCheck}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    Run ATS Audit
                  </button>
                </div>

                {atsAnalysis && (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200">Overall ATS Readiness Score:</span>
                      <span className="text-lg font-black text-emerald-400">{atsAnalysis.overallScore}/100</span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-semibold text-slate-300">Actionable Improvement Tips:</p>
                      {atsAnalysis.actionableTips.map((tip, i) => (
                        <p key={i} className="text-slate-400 flex items-start gap-1.5">
                          <span className="text-blue-400 font-bold">•</span> {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Matcher Box */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-sm">Analyze Job Description Match</h3>
                <textarea
                  rows={3}
                  value={jobMatchModal.jdText}
                  onChange={e => setJobMatchModal({ ...jobMatchModal, jdText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500"
                  placeholder="Paste target Job Description here to analyze keyword match score..."
                ></textarea>
                <button
                  onClick={runJobMatch}
                  disabled={jobMatchModal.loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-4 h-4" /> {jobMatchModal.loading ? 'Analyzing...' : 'Calculate Job Match Score'}
                </button>

                {jobMatchModal.result && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-purple-300">
                      <span>Match Score:</span>
                      <span className="text-base font-extrabold">{jobMatchModal.result.matchScore}%</span>
                    </div>
                    <p className="text-slate-300"><span className="font-semibold text-emerald-400">Matched Keywords:</span> {jobMatchModal.result.matchedKeywords.join(', ')}</p>
                    <p className="text-slate-300"><span className="font-semibold text-rose-400">Missing Keywords:</span> {jobMatchModal.result.missingKeywords.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nav Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-800">
            <button
              onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
              disabled={wizardStep === 1}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {wizardStep < 10 ? (
              <button
                onClick={() => setWizardStep(wizardStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition"
              >
                Done & Finish <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side A4 Resume Live Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-6 overflow-y-auto max-h-[calc(100vh-130px)] border-l border-slate-800 flex justify-center items-start">
          <div className="w-full max-w-[210mm] shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-white">
            <div className="transform scale-[0.62] sm:scale-[0.72] origin-top">
              <div id="wizard-resume-preview">
                <ResumeTemplateRenderer templateId={activeResume.templateId} data={activeResume} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Rewrite / Comparison Modal */}
      {aiModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" /> AI Content Enhancement Preview
              </h3>
              <button onClick={() => setAiModal({ ...aiModal, open: false })} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {aiModal.loading ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">Gemini AI is crafting professional phrasing...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Original User Input</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{aiModal.original || 'No content'}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                  <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">AI Improved Phrasing</span>
                  <p className="text-slate-100 font-medium leading-relaxed whitespace-pre-line">{aiModal.generated}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setAiModal({ ...aiModal, open: false })}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Discard
              </button>
              <button
                onClick={applyAISuggestion}
                disabled={!aiModal.generated}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
              >
                Apply AI Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Skill Suggestions Modal */}
      {skillSuggestionsModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" /> AI Skill Keyword Suggestions
              </h3>
              <button onClick={() => setSkillSuggestionsModal({ ...skillSuggestionsModal, open: false })} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {skillSuggestionsModal.loading ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Analyzing resume background for relevant skills...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Select the skills you want to add to your resume:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestionsModal.suggestions.map((sk, i) => {
                    const isSel = skillSuggestionsModal.selected.includes(sk);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSkillSuggestionsModal(prev => ({
                            ...prev,
                            selected: isSel ? prev.selected.filter(s => s !== sk) : [...prev.selected, sk]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isSel ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSel ? `✓ ${sk}` : `+ ${sk}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSkillSuggestionsModal({ ...skillSuggestionsModal, open: false })}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={applySelectedSkills}
                disabled={skillSuggestionsModal.selected.length === 0}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow"
              >
                Add ({skillSuggestionsModal.selected.length}) Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Gate Modal for PDF Download */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setAuthModalOpen(false);
          setExportModalOpen(true);
          setPendingAction(null);
        }}
      />

      {/* Export Format Selector (PDF / DOCX) */}
      <ExportFormatModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        resumeData={activeResume}
        previewElementId="wizard-resume-preview"
      />
    </div>
  );
}
