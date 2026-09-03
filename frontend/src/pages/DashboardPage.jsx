import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, PlusCircle, Layers, Globe, User, Settings, LogOut, 
  Sparkles, Download, Edit3, Trash2, Copy, CheckCircle, Clock, ExternalLink, ShieldCheck, CreditCard
} from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { useAuth } from '../contexts/AuthContext';
import { exportResumeToPDF } from '../utils/pdfExporter';
import { useToast } from '../contexts/ToastContext';
import ResumeTemplateRenderer from '../templates/TemplateRegistry';
import AuthRequiredModal from '../components/auth/AuthRequiredModal';
import ExportFormatModal from '../components/export/ExportFormatModal';

export default function DashboardPage() {
  const { resumes, activeResume, setActiveResume, createNewResume, duplicateResume, deleteResume } = useResume();
  const { user, logout, getToken } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingResumeToDownload, setPendingResumeToDownload] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [targetResumeForExport, setTargetResumeForExport] = useState(null);

  const [billingInfo, setBillingInfo] = useState({ subscription: null, transactions: [] });

  React.useEffect(() => {
    if (user && getToken) {
      getToken().then(token => {
        if (!token) return;
        fetch('http://localhost:5000/api/payments/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setBillingInfo({ subscription: data.subscription, transactions: data.transactions });
            }
          })
          .catch(() => {});
      });
    }
  }, [user, getToken]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDownloadPDF = async (resume) => {
    const target = resume || activeResume;
    if (!user) {
      addToast('Please log in or create a free account to export your resume.', 'info');
      setPendingResumeToDownload(target);
      setAuthModalOpen(true);
      return;
    }
    setTargetResumeForExport(target);
    setExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">AI Resume & Portfolio</span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'resumes' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" /> My Resumes
            </button>
            <button
              onClick={() => {
                createNewResume();
                navigate('/builder');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 transition"
            >
              <PlusCircle className="w-4 h-4" /> Create Resume
            </button>
            <Link
              to="/portfolio-builder"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <Globe className="w-4 h-4" /> My Portfolio
            </Link>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'billing' ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Billing & Subscription
            </button>
            <Link
              to="/profile"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <User className="w-4 h-4" /> Profile & Settings
            </Link>
          </nav>
        </div>

        {/* User Footer */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
              {(user?.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-white truncate">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 transition" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        {/* Top Greeting Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Professional'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your resumes, preview templates, and update your personal portfolio</p>
          </div>
          <button
            onClick={() => {
              createNewResume();
              navigate('/builder');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" /> Create New Resume
          </button>
        </div>

        {/* Dashboard Overview Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Total Resumes <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">{resumes.length}</div>
                <p className="text-[11px] text-slate-500">Stored locally & synced</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Portfolio Status <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 flex items-center gap-2">
                  Published <CheckCircle className="w-5 h-5" />
                </div>
                <p className="text-[11px] text-slate-500">URL: /portfolio/alexjohnson</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  AI Optimizations <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">14</div>
                <p className="text-[11px] text-slate-500">Bullets & summaries rewritten</p>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    createNewResume();
                    navigate('/builder');
                  }}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left space-y-2 transition group"
                >
                  <PlusCircle className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-sm">Create New Resume</h3>
                  <p className="text-xs text-slate-400">Build with 10-step wizard</p>
                </button>

                <Link
                  to="/portfolio-builder"
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left space-y-2 transition group block"
                >
                  <Globe className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-sm">Create / Edit Portfolio</h3>
                  <p className="text-xs text-slate-400">Generate personal website</p>
                </Link>

                <button
                  onClick={() => navigate('/builder')}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left space-y-2 transition group"
                >
                  <Edit3 className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-sm">Edit Active Resume</h3>
                  <p className="text-xs text-slate-400">{activeResume.title}</p>
                </button>

                <button
                  onClick={() => handleDownloadPDF(activeResume)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left space-y-2 transition group"
                >
                  <Download className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-sm">Download Active PDF</h3>
                  <p className="text-xs text-slate-400">Export high-resolution A4</p>
                </button>
              </div>
            </div>

            {/* Active Resume Preview Card */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Active Resume Document</h2>
                <button
                  onClick={() => navigate('/builder')}
                  className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
                >
                  Open Editor <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-64 h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex justify-center items-start p-2 shrink-0">
                  <div id="dashboard-resume-preview" className="transform scale-[0.35] origin-top">
                    <ResumeTemplateRenderer templateId={activeResume.templateId} data={activeResume} />
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{activeResume.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                        {activeResume.templateId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target Role: {activeResume.targetRole || 'Software Engineer'}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> Updated: Today</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ATS Compatible</span>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => navigate('/builder')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                    >
                      Edit Document
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(activeResume)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Resumes Tab */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">All Saved Resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(res => (
                <div key={res.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-base">{res.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">
                        {res.templateId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{res.personalInfo?.fullName || 'User'} • {res.targetRole || 'Developer'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveResume(res);
                          navigate('/builder');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => duplicateResume(res.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setDeleteConfirmId(res.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing & Subscriptions Tab Content */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Billing & Subscription Management</h2>
                <p className="text-xs text-slate-400">View active plan, renewal date, and transaction payment history</p>
              </div>
              <Link to="/#pricing" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow">
                Change Plan / Upgrade
              </Link>
            </div>

            {/* Current Plan Overview Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Active Plan</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1 capitalize">
                    {billingInfo.subscription?.plan?.replace('_', ' ') || 'Free Starter Plan'}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  billingInfo.subscription?.plan?.includes('pro') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {billingInfo.subscription?.status || 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-850 text-xs">
                <div>
                  <span className="text-slate-500 block">Billing Currency</span>
                  <span className="font-bold text-slate-200">{billingInfo.subscription?.currency || 'INR'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Amount</span>
                  <span className="font-bold text-slate-200">
                    {billingInfo.subscription?.currency === 'INR' ? '₹' : '$'}{billingInfo.subscription?.amount || '0'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Renewal / Expiry Date</span>
                  <span className="font-bold text-slate-200">
                    {billingInfo.subscription?.end_date ? new Date(billingInfo.subscription.end_date).toLocaleDateString() : 'Lifetime Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Transactions History */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Payment Transaction History</h3>
              {billingInfo.transactions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
                  <CreditCard className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No billing transactions found for your account yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Payment ID</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Currency</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {billingInfo.transactions.map((tx, idx) => (
                        <tr key={tx.id || idx} className="hover:bg-slate-850/50">
                          <td className="p-3.5 text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                          <td className="p-3.5 font-mono text-slate-300">{tx.gateway_payment_id || 'N/A'}</td>
                          <td className="p-3.5 font-bold text-white">{tx.amount}</td>
                          <td className="p-3.5 text-slate-400">{tx.currency}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
              <h3 className="font-bold text-white text-lg">Confirm Delete</h3>
              <p className="text-xs text-slate-400">Are you sure you want to delete this resume? This action cannot be undone.</p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteResume(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Gate Modal for PDF Download */}
        <AuthRequiredModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => handleDownloadPDF(pendingResumeToDownload)}
        />

        {/* Export Format Selector Modal (PDF / DOCX) */}
        <ExportFormatModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          resumeData={targetResumeForExport || activeResume}
          previewElementId="dashboard-resume-preview"
        />
      </main>
    </div>
  );
}
