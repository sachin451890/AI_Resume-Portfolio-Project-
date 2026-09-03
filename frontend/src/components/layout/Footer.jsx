import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            AI Resume & Portfolio
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Build ATS-optimized resumes and publish personal developer portfolios in minutes using Google Gemini AI.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#features" className="hover:text-white transition">AI Resume Engine</a></li>
            <li><a href="#templates" className="hover:text-white transition">Resume Templates</a></li>
            <li><a href="#portfolio" className="hover:text-white transition">Portfolio Generator</a></li>
            <li><a href="#pricing" className="hover:text-white transition">Pricing Plans</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Templates</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer">Modern Resume</span></li>
            <li><span className="hover:text-white cursor-pointer">Minimal ATS</span></li>
            <li><span className="hover:text-white cursor-pointer">Executive Leadership</span></li>
            <li><span className="hover:text-white cursor-pointer">Developer Monospace</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Connect</h4>
          <div className="flex gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} AI Resume & Portfolio Builder. All rights reserved.</p>
        <p className="flex items-center gap-1">Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for professionals worldwide.</p>
      </div>
    </footer>
  );
}
