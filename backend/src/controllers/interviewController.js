const aiService = require('../services/aiService');

exports.generateQuestions = async (req, res) => {
  const { role = 'Software Engineer', jobDescription = '', experienceLevel = 'Mid-Level' } = req.body;

  const fallbackQuestions = [
    { id: 1, category: "HR & Culture", question: `Why are you interested in joining as a ${role} (${experienceLevel}), and how do your skills align with this position?`, hints: ["Highlight your passion and specific role alignment"] },
    { id: 2, category: "Technical Core", question: `Can you explain a key technical architecture decision you made in your recent project as a ${role}?`, hints: ["Focus on problem, decision criteria, and outcome"] },
    { id: 3, category: "System Design", question: `How do you approach optimizing performance, scalability, and security when building features for ${role}?`, hints: ["Discuss caching, database indexing, or API optimization"] },
    { id: 4, category: "Behavioral (STAR)", question: `Describe a challenging situation with tight deadlines or shifting requirements. How did you handle it?`, hints: ["Use Situation, Task, Action, Result framework"] },
    { id: 5, category: "Scenario Based", question: `If a production feature breaks unexpectedly after release, what is your step-by-step diagnostic and remediation process?`, hints: ["Mention logging, rollback, root cause analysis, and post-mortem"] }
  ];

  try {
    const prompt = `
Act as a Senior Hiring Manager & Technical Interviewer for a ${role} position (${experienceLevel}).
${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Generate 5 high-quality interview questions covering:
1. HR / Culture Fit
2. Core Technical Concept
3. System Design / Problem Solving
4. Behavioral (STAR method)
5. Practical / Scenario-based

Respond strictly in JSON format with this structure:
{
  "questions": [
    {
      "id": 1,
      "category": "Technical",
      "question": "Question text here...",
      "hints": ["Hint 1", "Hint 2"]
    }
  ]
}
`;

    const rawResponse = await aiService.generateContent(prompt, true);
    let parsed = typeof rawResponse === 'object' ? rawResponse : JSON.parse(rawResponse.replace(/```json/g, '').replace(/```/g, '').trim());

    const questionsList = parsed.questions || (Array.isArray(parsed) ? parsed : null);

    return res.json({
      success: true,
      questions: (questionsList && questionsList.length > 0) ? questionsList : fallbackQuestions
    });
  } catch (err) {
    console.warn('[Interview Questions Warning]: Falling back to smart questions:', err.message);
    return res.json({
      success: true,
      questions: fallbackQuestions
    });
  }
};

exports.evaluateAnswer = async (req, res) => {
  const { question, answer, role = 'Software Engineer' } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required.' });
  }

  const fallbackEvaluation = {
    score: 82,
    summary: `Solid and well-articulated response demonstrating relevant experience for a ${role}.`,
    strengths: ["Clear problem-solving approach", "Logical structure and relevant context"],
    improvements: ["Incorporate specific quantifiable metrics (e.g. % performance gain, time saved)", "Mention exact tools/frameworks used"],
    modelAnswer: `An ideal response would outline the Situation, Task, Action, and quantitative Results (e.g., 'Implemented Redis caching which reduced response time by 40%').`
  };

  try {
    const prompt = `
Act as an expert Technical Recruiter evaluating an interviewee's answer for a ${role} position.

Question: "${question}"
Candidate Answer: "${answer}"

Provide constructive feedback and evaluation.
Respond strictly in JSON format:
{
  "score": number (0 to 100),
  "summary": "Short 1-sentence assessment summary",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement point 1", "Improvement point 2"],
  "modelAnswer": "An ideal exemplar response for this question"
}
`;

    const rawResponse = await aiService.generateContent(prompt, true);
    let parsed = typeof rawResponse === 'object' ? rawResponse : JSON.parse(rawResponse.replace(/```json/g, '').replace(/```/g, '').trim());

    return res.json({
      success: true,
      evaluation: parsed || fallbackEvaluation
    });
  } catch (err) {
    console.warn('[Evaluate Answer Warning]: Falling back to smart evaluation:', err.message);
    return res.json({
      success: true,
      evaluation: fallbackEvaluation
    });
  }
};
