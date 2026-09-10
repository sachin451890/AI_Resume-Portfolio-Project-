import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, User, LayoutDashboard, LogOut, FileText, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              AI Resume <span className="text-blue-500 font-normal">& Portfolio</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <a href="/#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="/#templates" className="hover:text-blue-400 transition-colors">Templates</a>
          <a href="/#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
          <Link to="/portfolio-builder" className="hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> My Portfolio
          </Link>
          <Link to="/interview" className="hover:text-purple-400 font-semibold transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Interview
          </Link>
          <a href="/#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
        </div>

        {/* Action Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-2 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 text-sm font-medium">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-200">Home</Link>
          <a href="/#features" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-200">Features</a>
          <a href="/#templates" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-200">Templates</a>
          <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-200">How It Works</a>
          <a href="/#pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-200">Pricing</a>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-semibold bg-blue-600 text-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold bg-blue-600 text-white"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
