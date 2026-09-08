import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Globe, Eye, Save, ExternalLink, Check, Copy, Sparkles, Layers, 
  ShieldCheck, Zap, Lock, Star, CheckCircle2, CreditCard, Rocket, Smartphone, Code2
} from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { PORTFOLIO_THEMES } from '../components/portfolio/PortfolioThemes';
import PortfolioThemeRenderer from '../components/portfolio/PortfolioThemes';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import TestPaymentModal from '../components/billing/TestPaymentModal';
import AuthRequiredModal from '../components/auth/AuthRequiredModal';

export default function PortfolioBuilderPage() {
  const { activeResume } = useResume();
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Subscription state (defaults to false - user CANNOT build portfolio without subscribing)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'yearly'

  const [username, setUsername] = useState('alexjohnson');
  const [themeId, setThemeId] = useState('developer');
  const [accentColor, setAccentColor] = useState('blue');
  const [availabilityStatus, setAvailabilityStatus] = useState('🟢 Available for Full-Time & Freelance Projects');
  const [isPublished, setIsPublished] = useState(true);

  const publicUrl = `${window.location.origin}/portfolio/${username}`;

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    addToast('Portfolio link copied to clipboard!', 'success');
  };

  const handleOpenPaymentModal = () => {
    if (!user) {
      addToast('Please log in or create an account to unlock your portfolio subscription.', 'info');
      setAuthModalOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsPaymentModalOpen(true);
  };

  const handleSimulatePaymentSuccess = async (details) => {
    setIsSubscribed(true);
    addToast('🎉 Pro Subscription activated successfully! Your Portfolio Builder is now fully unlocked.', 'success');
  };

  const mockOrderData = {
    id: `order_portfolio_${Date.now()}`,
    displayAmount: selectedPlan === 'yearly' ? '6,999' : '799',
    currency: 'INR',
    symbol: '₹',
    keyId: 'rzp_test_portfolio_mock'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base leading-tight">Portfolio Website Builder</h1>
              {isSubscribed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Pro Unlocked
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Subscription Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Turn your resume data into a published personal website</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <>
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
            </>
          ) : (
            <button
              onClick={handleOpenPaymentModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition transform hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300" /> Subscribe to Unlock
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      {!isSubscribed ? (
        /* Dedicated Portfolio Subscription & Unlock Landing Page */
        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-6xl mx-auto w-full space-y-12">
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-8 md:p-12 overflow-hidden text-center space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Personal Hosted Portfolio Feature</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
              Launch Your Hosted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Portfolio Website</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Convert your resume data into an interactive, beautifully designed personal website with a custom shareable link, multiple themes, and instant deployment.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-left">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <Globe className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-white text-xs">Custom Handle Link</h4>
                <p className="text-[11px] text-slate-400">Get your personal URL `/portfolio/yourname` to share on LinkedIn & email</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <Code2 className="w-6 h-6 text-blue-400" />
                <h4 className="font-bold text-white text-xs">4 Interactive Themes</h4>
                <p className="text-[11px] text-slate-400">Modern Developer, Minimalist, Executive & Glassmorphic themes</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <Rocket className="w-6 h-6 text-purple-400" />
                <h4 className="font-bold text-white text-xs">Instant Resume Sync</h4>
                <p className="text-[11px] text-slate-400">Updates automatically whenever you edit your resume entries</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <Smartphone className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-white text-xs">100% Mobile Ready</h4>
                <p className="text-[11px] text-slate-400">Flawless design on all smartphones, tablets, and desktop displays</p>
              </div>
            </div>

            {/* Action Subscription Call to Action */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleOpenPaymentModal}
                className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-current" />
                <span>Subscribe Now to Unlock Portfolio (₹799 / $9)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Multi-Currency Support • Cancel anytime
            </p>
          </div>

          {/* Pricing Plan Selector Cards */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Choose Your Portfolio Subscription Plan</h2>
              <p className="text-xs text-slate-400">Select a plan to unlock portfolio website hosting and premium themes</p>
              
              {/* Billing Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedPlan === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly Plan
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                    selectedPlan === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Yearly Plan <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Save 25%</span>
                </button>
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              {/* Pro Portfolio Plan Exclusive Card */}
              <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/80 border-2 border-blue-500 space-y-6 shadow-2xl relative">
                <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                  Pro Exclusive Feature
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Pro Portfolio Subscription</span>
                  </div>

                  <div className="text-4xl font-extrabold text-white">
                    {selectedPlan === 'yearly' ? '₹6,999' : '₹799'} <span className="text-xs text-slate-400 font-normal">/ {selectedPlan === 'yearly' ? 'year' : 'month'} ($9/mo)</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Portfolio Website Builder is strictly a Pro Subscription feature. Unlock personal hosted website URL, themes & 1-click resume synchronization.
                  </p>

                  <ul className="space-y-3 text-xs text-slate-200 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Hosted Website Link</strong> (`/portfolio/:handle`)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>4 Interactive Themes</strong> (Developer, Minimal, Exec, Creative)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Real-time Resume Auto-Sync</strong>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Unlimited Resumes, PDF & DOCX Exports</strong>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleOpenPaymentModal}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-extrabold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Subscribe Now to Unlock Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked Portfolio Builder Main Split Interface */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Settings Sidebar (4 Cols) */}
          <div className="lg:col-span-4 p-6 overflow-y-auto max-h-[calc(100vh-65px)] border-r border-slate-800 space-y-6">
            {/* Pro Active Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pro Plan Active</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  UNLOCKED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your portfolio website is live and publicly accessible! Customize your theme and public link below.
              </p>
            </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Badge Status</label>
                <input
                  type="text"
                  value={availabilityStatus}
                  onChange={e => setAvailabilityStatus(e.target.value)}
                  placeholder="e.g. 🟢 Available for Hire"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
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

            {/* Accent Color Picker */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h2 className="text-sm font-bold text-white">Accent Theme Color</h2>
              <div className="flex items-center gap-3">
                {[
                  { id: 'blue', color: 'bg-blue-600' },
                  { id: 'emerald', color: 'bg-emerald-600' },
                  { id: 'purple', color: 'bg-purple-600' },
                  { id: 'amber', color: 'bg-amber-500' },
                  { id: 'rose', color: 'bg-rose-600' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setAccentColor(c.id)}
                    className={`w-7 h-7 rounded-full ${c.color} transition transform hover:scale-110 flex items-center justify-center ${
                      accentColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'opacity-80'
                    }`}
                  >
                    {accentColor === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-lg font-bold text-white">Select Portfolio Theme</h2>
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
              <PortfolioThemeRenderer 
                themeId={themeId} 
                data={activeResume} 
                username={username}
                accentColor={accentColor}
                availabilityStatus={availabilityStatus}
              />
            </div>
          </div>
        </div>
      )}

      {/* Test Payment Modal Integration */}
      <TestPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={mockOrderData}
        onSimulateSuccess={handleSimulatePaymentSuccess}
      />

      {/* Auth Modal Integration for Unauthenticated Users */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

