import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sampleResume } from '../utils/sampleData';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(sampleResume);
  const [versions, setVersions] = useState([]);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Load user resumes or guest draft on mount
  useEffect(() => {
    const guestDraft = localStorage.getItem('ai_guest_resume_draft');
    const saved = localStorage.getItem('ai_user_resumes');
    
    if (guestDraft) {
      try {
        const parsedDraft = JSON.parse(guestDraft);
        setActiveResume(parsedDraft);
        setResumes(prev => [parsedDraft, ...prev.filter(r => r.id !== parsedDraft.id)]);
      } catch (e) {}
    } else if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumes(parsed);
        if (parsed.length > 0) setActiveResume(parsed[0]);
      } catch (e) {
        setResumes([sampleResume]);
      }
    } else {
      setResumes([sampleResume]);
      localStorage.setItem('ai_user_resumes', JSON.stringify([sampleResume]));
    }
  }, []);

  // Save resume state & guest draft
  const saveResume = useCallback((updatedResume) => {
    const target = updatedResume || activeResume;
    setIsSaving(true);
    
    // Save guest draft continuously
    localStorage.setItem('ai_guest_resume_draft', JSON.stringify(target));

    setResumes(prev => {
      const idx = prev.findIndex(r => r.id === target.id);
      let nextList;
      if (idx !== -1) {
        nextList = [...prev];
        nextList[idx] = { ...target, updatedAt: new Date().toISOString() };
      } else {
        nextList = [target, ...prev];
      }
      localStorage.setItem('ai_user_resumes', JSON.stringify(nextList));
      return nextList;
    });

    // Try background backend save
    api.resumes.update(target.id, target).catch(() => {});

    setTimeout(() => {
      setIsSaving(false);
    }, 400);
  }, [activeResume]);

  // Transfer Guest Draft to Authenticated User
  const transferGuestDraftToUser = useCallback((user) => {
    if (!user) return;
    const guestDraftRaw = localStorage.getItem('ai_guest_resume_draft');
    if (!guestDraftRaw) return;

    try {
      const draft = JSON.parse(guestDraftRaw);
      const userResume = {
        ...draft,
        userId: user.id,
        updatedAt: new Date().toISOString()
      };
      
      setActiveResume(userResume);
      setResumes(prev => [userResume, ...prev.filter(r => r.id !== userResume.id)]);
      localStorage.setItem('ai_user_resumes', JSON.stringify([userResume]));
      api.resumes.create(userResume).catch(() => {});
    } catch (e) {
      console.error('[Guest Draft Transfer Error]:', e);
    }
  }, []);

  const updateActiveResume = useCallback((updater) => {
    setActiveResume(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveResume(next);
      return next;
    });
  }, [saveResume]);

  const createVersion = useCallback((label = 'Manual Snapshot') => {
    const newVersion = {
      id: `v_${Date.now()}`,
      versionNumber: versions.length + 1,
      label,
      snapshot: JSON.parse(JSON.stringify(activeResume)),
      createdAt: new Date().toISOString()
    };
    setVersions(prev => [newVersion, ...prev]);
    addToast(`Saved Resume Version v${newVersion.versionNumber}`, 'success');
  }, [activeResume, versions, addToast]);

  const restoreVersion = useCallback((versionId) => {
    const target = versions.find(v => v.id === versionId);
    if (target) {
      setActiveResume(target.snapshot);
      saveResume(target.snapshot);
      addToast(`Restored to Version v${target.versionNumber}`, 'info');
    }
  }, [versions, saveResume, addToast]);

  const duplicateResume = useCallback((resumeId) => {
    if (resumes.length >= 1) {
      addToast('Free Plan limit reached (1 Free Resume). Upgrade to Pro for unlimited resumes & portfolio hosting!', 'info');
      return null;
    }
    const target = resumes.find(r => r.id === resumeId) || activeResume;
    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: `res_${Date.now()}`,
      title: `${target.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    setResumes(prev => [copy, ...prev]);
    localStorage.setItem('ai_user_resumes', JSON.stringify([copy, ...resumes]));
    addToast('Resume duplicated successfully', 'success');
    return copy;
  }, [resumes, activeResume, addToast]);

  const deleteResume = useCallback((resumeId) => {
    setResumes(prev => {
      const filtered = prev.filter(r => r.id !== resumeId);
      localStorage.setItem('ai_user_resumes', JSON.stringify(filtered));
      if (filtered.length > 0) setActiveResume(filtered[0]);
      return filtered;
    });
    addToast('Resume deleted', 'info');
  }, [addToast]);

  const createNewResume = useCallback((title = 'Untitled Resume') => {
    if (resumes.length >= 1) {
      addToast('Free Plan limit reached (1 Free Resume). Upgrade to Pro for unlimited resumes & portfolio hosting!', 'info');
      return null;
    }
    const newRes = {
      ...JSON.parse(JSON.stringify(sampleResume)),
      id: `res_${Date.now()}`,
      title,
      summary: '',
      educations: [],
      experiences: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: []
    };
    setActiveResume(newRes);
    setResumes(prev => [newRes, ...prev]);
    saveResume(newRes);
    setWizardStep(1);
    addToast('New resume created', 'success');
    return newRes;
  }, [resumes, saveResume, addToast]);

  return (
    <ResumeContext.Provider value={{
      resumes,
      activeResume,
      setActiveResume,
      updateActiveResume,
      saveResume,
      isSaving,
      wizardStep,
      setWizardStep,
      versions,
      createVersion,
      restoreVersion,
      duplicateResume,
      deleteResume,
      createNewResume,
      transferGuestDraftToUser
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
}
