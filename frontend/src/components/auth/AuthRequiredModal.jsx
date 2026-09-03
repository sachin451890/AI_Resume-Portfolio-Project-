import React, { useState } from 'react';
import { Lock, Sparkles, X, ArrowRight, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useResume } from '../../contexts/ResumeContext';
import { useToast } from '../../contexts/ToastContext';

export default function AuthRequiredModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, loginWithGoogle } = useAuth();
  const { transferGuestDraftToUser } = useResume();
  const { addToast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await loginWithGoogle();
      addToast('Authenticated with Google!', 'success');
      if (data?.user) transferGuestDraftToUser(data.user);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (activeTab === 'register') {
      if (!fullName.trim()) {
        setError('Full Name is required for registration.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password confirmation.');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (activeTab === 'login') {
        result = await login(email, password);
        addToast('Welcome back! Authenticated successfully.', 'success');
      } else {
        result = await register(email, password, fullName || 'User');
        addToast('Account created & authenticated successfully!', 'success');
      }

      const authenticatedUser = result?.user || result?.session?.user;
      if (authenticatedUser) {
        transferGuestDraftToUser(authenticatedUser);
      }

      onClose();
      // Auto-continue pending export action!
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      addToast(err.message || 'Auth failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close (X) Button - Closes Modal Without Export */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
          title="Close without downloading"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Copy */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Your resume is ready!</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Create a free account or log in to download your professional resume and keep it saved for later.
          </p>
        </div>

        {/* Continue with Google Option */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-100 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition ${activeTab === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Create Free Account
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition ${activeTab === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Log In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Alex Johnson"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{activeTab === 'register' ? 'Create Account & Continue Export' : 'Log In & Download PDF'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guest Return Secondary Option */}
        <div className="pt-2 text-center space-y-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-medium transition"
          >
            Not ready to sign in? Continue editing as guest.
          </button>
          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Your resume draft is saved locally
          </div>
        </div>
      </div>
    </div>
  );
}
