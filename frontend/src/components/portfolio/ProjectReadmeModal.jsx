import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, FileText, Code2, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ProjectReadmeModal({ isOpen, onClose, projectData, onApplyShowcaseDescription }) {
  if (!isOpen || !projectData) return null;

  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('showcase'); // 'showcase' | 'readme'

  const [showcaseDesc, setShowcaseDesc] = useState('');
  const [readmeMd, setReadmeMd] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/portfolios/generate-project-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectData.title || 'My Project',
          description: projectData.description || '',
          technologies: projectData.technologies || []
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate project README');
      }

      setShowcaseDesc(data.showcaseDescription);
      setReadmeMd(data.readmeMarkdown);
      addToast('🎉 AI Project Description & README generated!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">AI Project Description & README Generator</h3>
            <p className="text-xs text-slate-400">Project: <span className="font-bold text-indigo-300">{projectData.title}</span></p>
          </div>
        </div>

        {/* Generate Trigger Banner if not generated yet */}
        {!showcaseDesc && !readmeMd && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Generate AI Documentation & GitHub README</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Generate high-impact portfolio showcase bullets and a complete open-source GitHub `README.md` with badges, architecture overview, and setup instructions.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 inline-flex items-center gap-2 transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Documentation with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300 fill-current" />
                  <span>Generate AI README & Showcase Description</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tabs & Output Workspace when generated */}
        {(showcaseDesc || readmeMd) && (
          <div className="space-y-4">
            {/* Tab Bar */}
            <div className="flex border-b border-slate-800 text-xs font-bold gap-4">
              <button
                onClick={() => setActiveTab('showcase')}
                className={`pb-2 flex items-center gap-1.5 transition ${
                  activeTab === 'showcase' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" /> Showcase Description
              </button>
              <button
                onClick={() => setActiveTab('readme')}
                className={`pb-2 flex items-center gap-1.5 transition ${
                  activeTab === 'readme' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4" /> GitHub README.md
              </button>
            </div>

            {/* Showcase Tab */}
            {activeTab === 'showcase' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {showcaseDesc}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleCopy(showcaseDesc)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Text</span>
                  </button>

                  {onApplyShowcaseDescription && (
                    <button
                      onClick={() => {
                        onApplyShowcaseDescription(showcaseDesc);
                        addToast('Applied showcase description to project!', 'success');
                        onClose();
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
                    >
                      <Check className="w-4 h-4" /> Apply to Project Description
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* README Tab */}
            {activeTab === 'readme' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {readmeMd}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleCopy(readmeMd)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copy README.md Code</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
