const aiService = require('../services/aiService');

exports.generateQuestions = async (req, res) => {
  try {
    const { role = 'Software Engineer', jobDescription = '', experienceLevel = 'Mid-Level' } = req.body;

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

    const rawResponse = await aiService.generateContent(prompt);
    
    // Parse JSON safely
    let parsed;
    try {
      const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      parsed = {
        questions: [
          { id: 1, category: "General", question: `Tell me about your experience as a ${role}.`, hints: ["Focus on recent accomplishments"] },
          { id: 2, category: "Technical", question: `What technical challenges have you overcome in your previous project?`, hints: ["Explain problem, action, result"] },
          { id: 3, category: "Behavioral", question: `Describe a scenario where you had to manage tight deadlines.`, hints: ["Highlight prioritization skills"] }
        ]
      };
    }

    return res.json({
      success: true,
      questions: parsed.questions || parsed
    });
  } catch (err) {
    console.error('[Interview Questions Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate interview questions.' });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, role = 'Software Engineer' } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

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

    const rawResponse = await aiService.generateContent(prompt);
    
    let parsed;
    try {
      const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      parsed = {
        score: 78,
        summary: "Good structured response with clear points.",
        strengths: ["Clear explanation", "Relevant examples"],
        improvements: ["Add more quantifiable metrics"],
        modelAnswer: "An ideal response would include specific results and technologies used."
      };
    }

    return res.json({
      success: true,
      evaluation: parsed
    });
  } catch (err) {
    console.error('[Evaluate Answer Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to evaluate interview answer.' });
  }
};
