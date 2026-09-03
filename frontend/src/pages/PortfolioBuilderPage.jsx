import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Eye, Save, ExternalLink, Check, Copy, Sparkles, Layers } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { PORTFOLIO_THEMES } from '../components/portfolio/PortfolioThemes';
import PortfolioThemeRenderer from '../components/portfolio/PortfolioThemes';
import { useToast } from '../contexts/ToastContext';

export default function PortfolioBuilderPage() {
  const { activeResume } = useResume();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('alexjohnson');
  const [themeId, setThemeId] = useState('developer');
  const [isPublished, setIsPublished] = useState(true);

  const publicUrl = `${window.location.origin}/portfolio/${username}`;

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    addToast('Portfolio link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">Portfolio Website Generator</h1>
            <p className="text-xs text-slate-400">Generated automatically from your resume data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyPublicUrl}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy Link
          </button>
          <a
            href={`/portfolio/${username}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Page
          </a>
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Settings Sidebar (4 Cols) */}
        <div className="lg:col-span-4 p-6 overflow-y-auto max-h-[calc(100vh-65px)] border-r border-slate-800 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Portfolio Settings</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Public Handle / Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 rounded-l-xl bg-slate-800 border border-r-0 border-slate-700 text-xs text-slate-400 font-mono">
                  /portfolio/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl bg-slate-900 border border-slate-700 text-xs font-mono text-blue-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <p className="font-bold text-white text-xs">Public Website Status</p>
                <p className="text-[11px] text-slate-400">Allow anyone to view your portfolio link</p>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">Portfolio Theme</h2>
            <div className="space-y-3">
              {PORTFOLIO_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between ${
                    themeId === theme.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs">{theme.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{theme.description}</p>
                  </div>
                  {themeId === theme.id && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Portfolio Live Preview (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 overflow-y-auto max-h-[calc(100vh-65px)] p-6 flex justify-center items-start">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <PortfolioThemeRenderer themeId={themeId} data={activeResume} username={username} />
          </div>
        </div>
      </div>
    </div>
  );
}
