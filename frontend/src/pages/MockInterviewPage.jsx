import React, { useState } from 'react';
import { Bot, Sparkles, Mic, Send, CheckCircle2, Trophy, RefreshCw, Loader2, Award, Lightbulb, MessageSquare } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthRequiredModal from '../components/auth/AuthRequiredModal';

export default function MockInterviewPage() {
  const { user, getToken } = useAuth();
  const { addToast } = useToast();

  const [role, setRole] = useState('Full Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');

  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const [answerInput, setAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState({});

  const [isListening, setIsListening] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGenerateQuestions = async () => {
    if (!user) {
      addToast('Please log in to start AI Mock Interview.', 'info');
      setAuthModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setQuestions([]);
    setEvaluations({});
    setActiveQuestionIndex(0);

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/interview/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role, jobDescription, experienceLevel })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate interview questions.');
      }

      setQuestions(data.questions);
      addToast(`🎉 5 Interview Questions Generated for ${role}!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addToast('Speech Recognition is not supported on this browser. Please type your answer.', 'warning');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      addToast('🎙 Listening to your response... Speak clearly.', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswerInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      addToast('Speech recognition error. Please try typing.', 'error');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleEvaluateAnswer = async () => {
    if (!answerInput.trim()) {
      addToast('Please enter or speak your answer first.', 'warning');
      return;
    }

    const currentQuestion = questions[activeQuestionIndex];
    setIsEvaluating(true);

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/interview/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answerInput,
          role
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to evaluate answer.');
      }

      setEvaluations((prev) => ({
        ...prev,
        [activeQuestionIndex]: data.evaluation
      }));

      addToast(`Evaluation Complete! Score: ${data.evaluation.score}/100`, 'success');
      setAnswerInput('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQuestion = questions[activeQuestionIndex];
  const currentEvaluation = evaluations[activeQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Bot className="w-4 h-4 text-purple-400" /> AI Interview Simulator
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Master Technical & HR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">Mock Interviews</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Practice role-specific interview questions, speak or type your answers, and receive instant AI feedback with scoring & exemplar model answers.
          </p>
        </div>

        {/* Configuration Setup Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Setup Interview Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Target Role / Job Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Data Scientist"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Entry-Level / Junior">Entry-Level / Junior (0-2 Yrs)</option>
                <option value="Mid-Level">Mid-Level (2-5 Yrs)</option>
                <option value="Senior / Lead">Senior / Lead (5+ Yrs)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Job Description (Optional for JD-based questions)</label>
            <textarea
              rows="3"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description to generate specific technical questions..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating 5 AI Interview Questions...</span>
              </>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                <span>Start AI Interview Session</span>
              </>
            )}
          </button>
        </div>

        {/* Questions & Answer Workspace */}
        {questions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto pt-4">
            {/* Sidebar Question Selector (4 Cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Session Questions ({questions.length})</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </h4>

              <div className="space-y-2.5">
                {questions.map((q, idx) => {
                  const evalData = evaluations[idx];
                  const isActive = idx === activeQuestionIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveQuestionIndex(idx);
                        setAnswerInput('');
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Q{idx + 1} • {q.category || 'General'}
                        </span>
                        <p className="text-xs line-clamp-2">{q.question}</p>
                      </div>

                      {evalData && (
                        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {evalData.score}/100
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Question & Answer Area (8 Cols) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Question Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/50 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>Question {activeQuestionIndex + 1} of {questions.length}</span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {currentQuestion.category || 'Interview Question'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  "{currentQuestion.question}"
                </h2>

                {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                  <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Hint: {currentQuestion.hints.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-400" /> Your Response:
                  </label>

                  {/* Speech to Text Button */}
                  <button
                    type="button"
                    onClick={handleSpeechToText}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                      isListening
                        ? 'bg-red-600 text-white border-red-500 animate-pulse'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>

                <textarea
                  rows="5"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Type or speak your interview response here..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !answerInput.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating with AI...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Answer for AI Scoring</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Evaluation Feedback Results */}
              {currentEvaluation && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">AI Evaluation & Feedback</h4>
                    </div>
                    <div className="text-lg font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                      Score: {currentEvaluation.score}/100
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{currentEvaluation.summary}"</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Strengths */}
                    {currentEvaluation.strengths?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
                        <span className="font-bold text-emerald-400 block">Key Strengths</span>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside">
                          {currentEvaluation.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {currentEvaluation.improvements?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1.5">
                        <span className="font-bold text-amber-400 block">Areas for Improvement</span>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside">
                          {currentEvaluation.improvements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Model Exemplar Response */}
                  {currentEvaluation.modelAnswer && (
                    <div className="pt-3 border-t border-slate-850 space-y-1.5 text-xs">
                      <span className="font-bold text-blue-400 block">Exemplar Model Answer:</span>
                      <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                        {currentEvaluation.modelAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
