const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const redisService = require('../services/redisService');

// Helper to initialize Supabase client if configured
let supabase = null;
if (config.supabaseUrl && config.supabaseServiceRoleKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
}

// In-memory fallback database for local offline testing
let localResumesStore = [];

exports.getAllResumes = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user-123';

    // 1. Try Redis Cache
    const cachedList = await redisService.getCachedUserResumesList(userId);
    if (cachedList) {
      return res.json({ resumes: cachedList, source: 'redis-cache' });
    }

    let userResumes = [];
    if (supabase) {
      const { data, error } = await supabase
        .from('resumes')
        .select('*, educations(*), experiences(*), skills(*), projects(*), certifications(*), achievements(*), custom_sections(*)')
        .eq('user_id', userId);

      if (error) throw error;
      userResumes = data || [];
    } else {
      userResumes = localResumesStore.filter(r => r.user_id === userId);
    }

    // Cache in Redis
    await redisService.cacheUserResumesList(userId, userResumes);
    return res.json({ resumes: userResumes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check Redis Cache for Instant Resume Structure Lookup
    const cachedResume = await redisService.getCachedResumeStructure(id);
    if (cachedResume) {
      return res.json({ resume: cachedResume, source: 'redis-cache' });
    }

    let resume = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('resumes')
        .select('*, educations(*), experiences(*), skills(*), projects(*), certifications(*), achievements(*), custom_sections(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      resume = data;
    } else {
      resume = localResumesStore.find(r => r.id === id);
    }

    if (!resume) return res.status(404).json({ error: 'Resume not found.' });

    // Store in Redis Cache
    await redisService.cacheResumeStructure(id, resume);
    return res.json({ resume });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createResume = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    const resumeData = req.body;

    const newResume = {
      id: resumeData.id || `res_${Date.now()}`,
      user_id: userId,
      title: resumeData.title || 'My Professional Resume',
      target_role: resumeData.targetRole || '',
      template_id: resumeData.templateId || 'modern',
      personal_info: resumeData.personalInfo || {},
      summary: resumeData.summary || '',
      educations: resumeData.educations || [],
      experiences: resumeData.experiences || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      achievements: resumeData.achievements || [],
      custom_sections: resumeData.customSections || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let savedResume = newResume;
    if (supabase) {
      const { data, error } = await supabase.from('resumes').insert(newResume).select().single();
      if (error) throw error;
      savedResume = data;
    } else {
      localResumesStore.push(newResume);
    }

    // Cache structure & invalidate list cache in Redis
    await redisService.cacheResumeStructure(savedResume.id, savedResume);
    await redisService.invalidateResumeCache(null, userId);

    return res.status(201).json({ resume: savedResume });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    let updatedResume = null;
    if (supabase) {
      const { data, error } = await supabase.from('resumes').update(updates).eq('id', id).select().single();
      if (error) throw error;
      updatedResume = data;
    } else {
      const index = localResumesStore.findIndex(r => r.id === id);
      if (index === -1) return res.status(404).json({ error: 'Resume not found.' });

      localResumesStore[index] = { ...localResumesStore[index], ...updates };
      updatedResume = localResumesStore[index];
    }

    // Update Redis cache immediately
    await redisService.cacheResumeStructure(id, updatedResume);
    await redisService.invalidateResumeCache(null, updatedResume.user_id);

    return res.json({ resume: updatedResume });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'demo-user-123';

    if (supabase) {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
    } else {
      localResumesStore = localResumesStore.filter(r => r.id !== id);
    }

    // Evict from Redis Cache
    await redisService.invalidateResumeCache(id, userId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.duplicateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'demo-user-123';
    let target = null;

    if (supabase) {
      const { data } = await supabase.from('resumes').select('*').eq('id', id).single();
      target = data;
    } else {
      target = localResumesStore.find(r => r.id === id);
    }

    if (!target) return res.status(404).json({ error: 'Resume not found.' });

    const duplicated = {
      ...target,
      id: `res_${Date.now()}`,
      title: `${target.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let savedDuplicated = duplicated;
    if (supabase) {
      const { data, error } = await supabase.from('resumes').insert(duplicated).select().single();
      if (error) throw error;
      savedDuplicated = data;
    } else {
      localResumesStore.push(duplicated);
    }

    // Cache duplicated resume in Redis
    await redisService.cacheResumeStructure(savedDuplicated.id, savedDuplicated);
    await redisService.invalidateResumeCache(null, userId);

    return res.status(201).json({ resume: savedDuplicated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
