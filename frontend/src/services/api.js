const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic Fetch Wrapper with timeout & fallback handling
 */
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Client Warning] Endpoint ${endpoint} unreachable:`, err.message);
    throw err;
  }
}

export const api = {
  // Resume APIs
  resumes: {
    getAll: () => request('/resumes'),
    getById: (id) => request(`/resumes/${id}`),
    create: (data) => request('/resumes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),
    duplicate: (id) => request(`/resumes/${id}/duplicate`, { method: 'POST' }),
  },

  // AI Service APIs
  ai: {
    improveSummary: (content, action = 'improve') => 
      request('/ai/improve-summary', { method: 'POST', body: JSON.stringify({ content, action }) }),

    improveExperience: (jobTitle, company, responsibilities) => 
      request('/ai/improve-experience', { method: 'POST', body: JSON.stringify({ jobTitle, company, responsibilities }) }),

    improveProject: (name, description, technologies) => 
      request('/ai/improve-project', { method: 'POST', body: JSON.stringify({ name, description, technologies }) }),

    suggestSkills: (resumeData) => 
      request('/ai/suggest-skills', { method: 'POST', body: JSON.stringify({ resumeData }) }),

    calculateATSScore: (resumeData) => 
      request('/ai/ats-score', { method: 'POST', body: JSON.stringify({ resumeData }) }),

    matchJobDescription: (resumeData, jobDescription) => 
      request('/ai/job-match', { method: 'POST', body: JSON.stringify({ resumeData, jobDescription }) }),

    generateCoverLetter: (resumeData, jobTitle, companyName, jobDescription) => 
      request('/ai/cover-letter', { method: 'POST', body: JSON.stringify({ resumeData, jobTitle, companyName, jobDescription }) }),
  },

  // Portfolio APIs
  portfolios: {
    getByUsername: (username) => request(`/portfolios/${username}`),
    save: (portfolioData) => request('/portfolios/save', { method: 'POST', body: JSON.stringify(portfolioData) }),
    sendContact: (username, messageData) => request(`/portfolios/${username}/contact`, { method: 'POST', body: JSON.stringify(messageData) }),
  },

  // PDF APIs
  pdf: {
    generate: (resumeData, htmlContent) => request('/pdf/generate', { method: 'POST', body: JSON.stringify({ resumeData, htmlContent }) }),
  }
};
