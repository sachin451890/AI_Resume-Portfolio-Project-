const aiService = require('../services/aiService');

exports.improveSummary = async (req, res) => {
  try {
    const { content, action } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }
    const result = await aiService.improveSummary(content, action);
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to improve summary.' });
  }
};

exports.improveExperience = async (req, res) => {
  try {
    const { jobTitle, company, responsibilities } = req.body;
    if (!jobTitle || !responsibilities) {
      return res.status(400).json({ error: 'Job title and responsibilities are required.' });
    }
    const result = await aiService.improveExperience(jobTitle, company || '', responsibilities);
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to improve experience.' });
  }
};

exports.improveProject = async (req, res) => {
  try {
    const { name, description, technologies } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }
    const result = await aiService.improveProject(name, description || '', technologies || []);
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to improve project.' });
  }
};

exports.suggestSkills = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const result = await aiService.suggestSkills(resumeData || {});
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to suggest skills.' });
  }
};

exports.calculateATSScore = async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required.' });
    }
    const result = await aiService.calculateATSScore(resumeData);
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to calculate ATS score.' });
  }
};

exports.matchJobDescription = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and Job description are required.' });
    }
    const result = await aiService.matchJobDescription(resumeData, jobDescription);
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to match job description.' });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobTitle, companyName, jobDescription } = req.body;
    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required.' });
    }
    const result = await aiService.generateCoverLetter(resumeData || {}, jobTitle, companyName, jobDescription || '');
    return res.json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to generate cover letter.' });
  }
};
