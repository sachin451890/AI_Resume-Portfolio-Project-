import React, { useState } from 'react';
import { X, Plus, User, Check, ArrowRight } from 'lucide-react';

export default function GoogleAccountPickerModal({ isOpen, onClose, onSelectAccount }) {
  if (!isOpen) return null;

  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const sampleAccounts = [
    { email: 'alex.developer@gmail.com', name: 'Alex Johnson', avatarSeed: 'Alex' },
    { email: 'sachin.work@gmail.com', name: 'Sachin Kumar', avatarSeed: 'Sachin' },
    { email: 'user.personal@gmail.com', name: 'Personal User', avatarSeed: 'User' }
  ];

  const handleSelect = (account) => {
    onSelectAccount(account);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customEmail.split('@')[0] || 'User';
    onSelectAccount({
      email: customEmail.trim(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      avatarSeed: name
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-1">
          <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-900">Choose an account</h3>
          <p className="text-xs text-slate-500">to continue to AI Resume & Portfolio Builder</p>
        </div>

        {/* List of Logged In Google Gmail Accounts */}
        <div className="space-y-1.5 divide-y divide-slate-100">
          {sampleAccounts.map((acc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(acc)}
              className="w-full pt-2.5 pb-2.5 px-3 rounded-2xl hover:bg-slate-100 flex items-center justify-between transition text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.avatarSeed}`}
                  alt={acc.name}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">{acc.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{acc.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600">Select</span>
            </button>
          ))}
        </div>

        {/* Custom Account Input Toggle */}
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="w-full py-2.5 px-3 rounded-2xl hover:bg-slate-100 border border-dashed border-slate-300 text-xs text-slate-700 font-semibold flex items-center gap-2 transition"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Plus className="w-4 h-4" />
            </div>
            <span>Use another Gmail account</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1">
            <label className="block text-[11px] font-semibold text-slate-600">Enter Gmail Address:</label>
            <input
              type="email"
              required
              value={customEmail}
              onChange={e => setCustomEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <span>Sign In with this Gmail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-slate-400">
          To continue, Google will share your name, email address, and profile picture.
        </div>
      </div>
    </div>
  );
}
