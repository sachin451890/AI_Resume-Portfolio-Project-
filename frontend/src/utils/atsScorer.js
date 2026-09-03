/**
 * Client-side ATS Scorer algorithm for real-time analysis
 */
export function calculateLocalATSScore(resume) {
  if (!resume) return { overallScore: 0, breakdown: {}, suggestions: [] };

  const info = resume.personalInfo || {};
  const summary = resume.summary || '';
  const skills = resume.skills || [];
  const experiences = resume.experiences || [];
  const projects = resume.projects || [];
  const educations = resume.educations || [];

  let contactScore = 0;
  if (info.fullName) contactScore += 30;
  if (info.email) contactScore += 30;
  if (info.phone) contactScore += 20;
  if (info.linkedinUrl || info.githubUrl) contactScore += 20;

  let summaryScore = 0;
  if (summary.length > 50) summaryScore += 50;
  if (summary.length > 120) summaryScore += 30;
  if (/developer|engineer|manager|designer|analyst|specialist|architect/i.test(summary)) summaryScore += 20;

  let skillsScore = Math.min(100, skills.length * 10);

  let expScore = 0;
  if (experiences.length > 0) expScore += 40;
  const hasBullets = experiences.some(e => (e.responsibilities || '').includes('•') || (e.responsibilities || '').includes('-'));
  if (hasBullets) expScore += 30;
  const hasActionVerbs = experiences.some(e => /developed|engineered|led|spearheaded|built|designed|implemented|optimized/i.test(e.responsibilities || ''));
  if (hasActionVerbs) expScore += 30;

  let projScore = Math.min(100, projects.length * 35);
  let eduScore = educations.length > 0 ? 100 : 40;

  let formattingScore = 90;
  let atsReadabilityScore = 85;

  const categoryScores = {
    contactInfo: contactScore,
    summary: summaryScore,
    skills: skillsScore,
    experience: expScore,
    projects: projScore,
    formatting: formattingScore,
    atsReadability: atsReadabilityScore,
    education: eduScore
  };

  const values = Object.values(categoryScores);
  const overallScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  const strengths = [];
  const criticalFixes = [];
  const actionableTips = [];

  if (contactScore >= 80) strengths.push("Complete contact details & social links");
  else criticalFixes.push("Add missing phone number or LinkedIn/GitHub link");

  if (summaryScore >= 80) strengths.push("Strong professional summary statement");
  else criticalFixes.push("Expand your professional summary to highlight core experience");

  if (skills.length >= 6) strengths.push("Diverse and well-categorized technical skills");
  else actionableTips.push("Add at least 6 to 10 relevant skill keywords");

  if (hasActionVerbs) strengths.push("Uses impactful action verbs in experience bullets");
  else actionableTips.push("Start experience bullets with strong action verbs like 'Engineered' or 'Spearheaded'");

  if (projects.length === 0) actionableTips.push("Add 1-2 featured projects to demonstrate practical accomplishments");

  return {
    overallScore,
    categoryScores,
    strengths,
    criticalFixes,
    actionableTips
  };
}
