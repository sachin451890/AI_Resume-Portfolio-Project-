export function calculateJobMatch(resume, jobDescription) {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      matchScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      experienceAlignment: 'Paste a job description to calculate match alignment.',
      recommendedImprovements: []
    };
  }

  const jdText = jobDescription.toLowerCase();
  
  // Extract technical & professional keywords from JD
  const commonTech = [
    'react', 'next.js', 'node.js', 'express', 'javascript', 'typescript', 'python', 'java',
    'sql', 'postgresql', 'mongodb', 'supabase', 'aws', 'docker', 'kubernetes', 'ci/cd',
    'git', 'github', 'tailwind css', 'rest api', 'graphql', 'html', 'css', 'agile', 'scrum',
    'testing', 'jest', 'cypress', 'figma', 'ui/ux', 'microservices', 'redux', 'performance'
  ];

  const targetKeywordsInJD = commonTech.filter(kw => jdText.includes(kw));

  // Collect candidate text
  const candidateSkills = (resume.skills || []).map(s => s.name.toLowerCase());
  const candidateSummary = (resume.summary || '').toLowerCase();
  const candidateExp = (resume.experiences || []).map(e => `${e.jobTitle} ${e.company} ${e.responsibilities}`).join(' ').toLowerCase();
  const candidateProj = (resume.projects || []).map(p => `${p.name} ${p.description} ${(p.technologies || []).join(' ')}`).join(' ').toLowerCase();

  const fullCandidateText = `${candidateSkills.join(' ')} ${candidateSummary} ${candidateExp} ${candidateProj}`;

  const matchedKeywords = [];
  const missingKeywords = [];

  targetKeywordsInJD.forEach(kw => {
    if (fullCandidateText.includes(kw)) {
      matchedKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    } else {
      missingKeywords.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  const totalKw = targetKeywordsInJD.length;
  let matchScore = 75; // Default baseline match
  if (totalKw > 0) {
    matchScore = Math.round((matchedKeywords.length / totalKw) * 100);
  }

  const recommendedImprovements = [];
  if (missingKeywords.length > 0) {
    recommendedImprovements.push(`If you have experience with ${missingKeywords.slice(0, 3).join(', ')}, ensure these skills are explicitly listed in your resume.`);
  }
  if (!jdText.includes((resume.targetRole || '').toLowerCase())) {
    recommendedImprovements.push(`Consider updating your target title to match '${resume.targetRole || 'the job role'}' specified in the posting.`);
  }

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    experienceAlignment: matchScore > 70 
      ? 'Strong alignment between candidate qualifications and job posting requirements.'
      : 'Moderate match. Consider tailored bullet point adjustments.',
    recommendedImprovements
  };
}
