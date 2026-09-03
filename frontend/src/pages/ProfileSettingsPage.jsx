import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Linkedin, Github, Globe, Shield, Bell, Save, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useResume } from '../contexts/ResumeContext';
import { useToast } from '../contexts/ToastContext';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { activeResume, updateActiveResume } = useResume();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    fullName: user?.user_metadata?.full_name || activeResume.personalInfo?.fullName || 'Alex Johnson',
    email: user?.email || activeResume.personalInfo?.email || 'alex@example.com',
    phone: activeResume.personalInfo?.phone || '+1 (555) 234-5678',
    location: activeResume.personalInfo?.location || 'San Francisco, CA',
    linkedinUrl: activeResume.personalInfo?.linkedinUrl || 'https://linkedin.com/in/alexjohnson',
    githubUrl: activeResume.personalInfo?.githubUrl || 'https://github.com/alexjohnson'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateActiveResume(prev => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {}),
        ...info
      }
    }));
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Profile & Account Settings</h1>
            <p className="text-xs text-slate-400">Manage your credentials, social links, and notifications</p>
          </div>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Account & Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={info.fullName}
                onChange={e => setInfo({ ...info, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={info.email}
                onChange={e => setInfo({ ...info, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={info.phone}
                onChange={e => setInfo({ ...info, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={info.location}
                onChange={e => setInfo({ ...info, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Profile Links */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" /> Online Profiles & Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={info.linkedinUrl}
                onChange={e => setInfo({ ...info, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Profile</label>
              <input
                type="url"
                value={info.githubUrl}
                onChange={e => setInfo({ ...info, githubUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
