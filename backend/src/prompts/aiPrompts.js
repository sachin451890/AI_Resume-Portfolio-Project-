/**
 * Centralized AI Prompts for AI Resume & Portfolio Engine
 * Follows strict factual grounding rules: Never fabricate experience, metrics, titles, or dates.
 */

const SYSTEM_INSTRUCTION = `You are an expert ATS-certified professional resume writer and career coach.
CRITICAL INSTRUCTION:
- You must ONLY use facts, technologies, dates, achievements, and metrics provided by the user.
- NEVER invent or fabricate facts, metrics, companies, dates, qualifications, or credentials that the user did not specify.
- Focus on strong action verbs, active voice, high impact professional tone, concise formatting, and ATS-friendly phrasing.
- Return response in clean JSON or text as requested by the task.`;

module.exports = {
  SYSTEM_INSTRUCTION,

  improveSummary: (content, action = 'improve') => {
    let actionGuidance = "Enhance the flow, tone, and professional impact.";
    if (action === 'shorten') actionGuidance = "Make it concise and impactful in 2-3 compelling sentences.";
    if (action === 'ats') actionGuidance = "Optimize word choices with standard industry terminology for high ATS readability.";
    if (action === 'impact') actionGuidance = "Focus on leadership, core competencies, and value proposition.";
    if (action === 'professional') actionGuidance = "Ensure an executive-ready formal tone.";

    return `Task: Rewrite the following professional summary.
Action Goal: ${actionGuidance}
Original User Input: "${content}"

Rules:
1. Preserve every real detail mentioned (degree, years of experience, core domains).
2. Do NOT add fake metrics (e.g. don't say "increased revenue by 50%" unless the user wrote it).
3. Output ONLY the improved summary text without quotes or preamble.`;
  },

  improveExperience: (jobTitle, company, responsibilities) => {
    return `Task: Transform the following raw job experience into 3 to 5 powerful, achievement-oriented bullet points.
Context:
- Job Title: ${jobTitle}
- Company: ${company}
- User Input: "${responsibilities}"

Rules:
1. Start each bullet point with a strong action verb (e.g., Developed, Orchestrated, Engineered, Spearheaded, Optimized).
2. Improve clarity, impact, and ATS score.
3. DO NOT invent metrics, tools, or dates not provided.
4. Output each bullet point starting with a bullet character "• ".`;
  },

  improveProject: (projectName, description, technologies) => {
    return `Task: Enhance the project description for a resume.
Context:
- Project Name: ${projectName}
- Technologies Used: ${Array.isArray(technologies) ? technologies.join(', ') : technologies}
- Raw Description: "${description}"

Rules:
1. Highlight technical implementation, architecture, and core features cleanly.
2. Format as 2-3 crisp bullet points starting with "• ".
3. DO NOT add technologies or features that were not provided.`;
  },

  suggestSkills: (resumeData) => {
    return `Task: Based on the provided resume details, suggest relevant skill keywords that the candidate likely possesses but hasn't explicitly listed.
Resume Summary: ${resumeData.summary || ''}
Target Role: ${resumeData.targetRole || ''}
Experiences: ${JSON.stringify(resumeData.experiences || [])}
Current Skills Listed: ${JSON.stringify(resumeData.skills || [])}

Rules:
1. Suggestions must strictly align with the technologies, tools, or domain methods mentioned in the input experience or title.
2. Return output as a JSON array of strings: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"].
3. Return ONLY valid JSON array.`;
  },

  calculateATSScore: (resumeData) => {
    return `Task: Evaluate this resume for ATS (Applicant Tracking System) optimization and overall quality.
Resume Content: ${JSON.stringify(resumeData)}

Perform a thorough analysis across 8 categories:
1. Formatting & Structure
2. Professional Summary
3. Skills Categorization
4. Experience Bullet Impact
5. Projects Quality
6. Action Verbs & Keywords
7. ATS Machine Readability
8. Contact Information Completeness

Return a JSON object with this EXACT structure:
{
  "overallScore": 84,
  "categoryScores": {
    "formatting": 85,
    "summary": 80,
    "skills": 90,
    "experience": 82,
    "projects": 85,
    "keywords": 80,
    "atsReadability": 90,
    "contactInfo": 95
  },
  "strengths": ["Clear section headers", "Strong skill categorization"],
  "criticalFixes": ["Add measurable outcomes in experience", "Include target job title in summary"],
  "actionableTips": [
    "Tip 1: Replace generic phrases with active verbs.",
    "Tip 2: Add LinkedIn or GitHub link if missing."
  ]
}

Return ONLY valid JSON.`;
  },

  matchJobDescription: (resumeData, jobDescription) => {
    return `Task: Compare candidate's resume data against the target Job Description to identify keyword gaps and alignment score.
Resume Data: ${JSON.stringify(resumeData)}
Target Job Description: "${jobDescription}"

Analyse match score %, matched keywords, missing keywords, and specific alignment advice.

Return a JSON object with this EXACT structure:
{
  "matchScore": 76,
  "matchedKeywords": ["React", "TypeScript", "REST API", "Tailwind CSS"],
  "missingKeywords": ["GraphQL", "Docker", "CI/CD"],
  "experienceAlignment": "Strong alignment for frontend development; missing DevOps keywords mentioned in requirements.",
  "recommendedImprovements": [
    "Highlight experience with automated testing if applicable.",
    "Ensure 'TypeScript' is prominently featured under Skills."
  ]
}

Return ONLY valid JSON.`;
  },

  generateCoverLetter: (resumeData, jobTitle, companyName, jobDescription = '') => {
    return `Task: Write a highly targeted, professional cover letter for the candidate applying to ${jobTitle} at ${companyName}.
Candidate Data: ${JSON.stringify(resumeData)}
Job Description Details: "${jobDescription}"

Rules:
1. Match the candidate's actual experience and skills to the company position.
2. Tone: Professional, enthusiastic, confident.
3. Structure: 3-4 paragraphs (Opening, Value Proposition, Technical Alignment, Call to Action).
4. Do NOT invent fake experiences or metrics.`;
  }
};
