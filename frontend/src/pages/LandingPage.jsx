import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Globe, Bot, ShieldCheck, Download, Eye, Zap, ArrowRight, CheckCircle2, Layers, Cpu, Award, Globe2, CreditCard, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { TEMPLATES } from '../templates/TemplateRegistry';
import ResumeTemplateRenderer from '../templates/TemplateRegistry';
import { sampleResume } from '../utils/sampleData';
import { REGIONS, getRegionConfig } from '../config/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import AuthRequiredModal from '../components/auth/AuthRequiredModal';
import PaymentSuccessModal from '../components/billing/PaymentSuccessModal';
import TestPaymentModal from '../components/billing/TestPaymentModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { addToast } = useToast();

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedRegion, setSelectedRegion] = useState('IN'); // 'IN' | 'US' | 'EU' | 'GB'
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessDetails, setPaymentSuccessDetails] = useState(null);
  const [testOrderModalData, setTestOrderModalData] = useState(null);

  const currentRegion = getRegionConfig(selectedRegion);
  const planKey = billingPeriod === 'yearly' ? 'pro_yearly' : 'pro_monthly';
  const planPricing = currentRegion.plans[planKey];

  // Dynamically load Razorpay Checkout Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeToPro = async () => {
    if (!user) {
      addToast('Please log in or create a free account to upgrade.', 'info');
      setAuthModalOpen(true);
      return;
    }

    setIsProcessingPayment(true);

    try {
      const token = await getToken();
      
      // 1. Create Payment Order on Backend
      const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: planKey,
          countryCode: selectedRegion
        })
      });

      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          addToast('Please log in or create a free account to upgrade.', 'info');
          setAuthModalOpen(true);
          return;
        }
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create payment order.');
      }

      const { order } = await orderRes.json();

      // Check if running in Test Sandbox mode (zero PAN required)
      if (order.isTestMode || order.keyId.includes('your_key') || order.id.startsWith('order_mock_')) {
        setTestOrderModalData(order);
        setIsProcessingPayment(false);
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        // Fallback for test environments without external script
        addToast('Processing payment verification...', 'info');
        await verifyAndActivatePayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
          planId: planKey,
          countryCode: selectedRegion
        }, token);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'AI Resume & Portfolio Builder',
        description: `Pro Subscription (${currentRegion.currency} ${planPricing.amount}/${billingPeriod})`,
        order_id: order.id,
        prefill: {
          email: user.email || '',
          name: user.user_metadata?.full_name || ''
        },
        theme: {
          color: '#2563EB'
        },
        handler: async (response) => {
          addToast('Verifying digital signature with payment gateway...', 'info');
          await verifyAndActivatePayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: planKey,
            countryCode: selectedRegion
          }, token);
        },
        modal: {
          ondismiss: () => {
            addToast('Payment cancelled.', 'info');
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('[Payment Error]:', err);
      addToast(err.message || 'Payment initiation failed.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const verifyAndActivatePayment = async (verificationData, token) => {
    try {
      const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(verificationData)
      });

      const data = await verifyRes.json();

      if (!verifyRes.ok || !data.success) {
        throw new Error(data.message || 'Payment verification failed.');
      }

      addToast('Payment verified successfully! Welcome to Pro 🎉', 'success');
      setPaymentSuccessDetails({
        plan: planKey,
        amount: planPricing.amount,
        currency: currentRegion.currency,
        paymentId: verificationData.razorpay_payment_id
      });
    } catch (err) {
      addToast(`Verification Error: ${err.message}`, 'error');
    }
  };

  const features = [
    { icon: Bot, title: 'AI Resume Generation', desc: 'Turn plain English into high-impact, professional resume phrasing powered by Gemini AI.' },
    { icon: ShieldCheck, title: 'ATS-Friendly Resumes', desc: 'Single & two-column layouts built to pass Applicant Tracking Systems effortlessly.' },
    { icon: Layers, title: '6 Working Templates', desc: 'Modern, Professional, Minimal, Executive, Creative, and Developer templates.' },
    { icon: Download, title: 'Instant PDF Download', desc: 'Generate high-resolution A4 vector PDFs with clickable links and crisp typography.' },
    { icon: Sparkles, title: 'AI Content Improvement', desc: 'Rewrite experience bullets, summaries, and projects with 1-click AI actions.' },
    { icon: Globe, title: 'Instant Portfolio Website', desc: 'Auto-generate a hosted personal portfolio website from your resume data.' },
    { icon: Eye, title: 'Real-Time Preview', desc: 'Instant split-screen live preview updates as you type or edit.' },
    { icon: Zap, title: 'Easy Step-by-Step Editor', desc: 'Guided 10-step wizard ensures you never miss important qualifications.' }
  ];

  const steps = [
    { num: '01', title: 'Enter Your Information', desc: 'Fill out personal info, experience, education, and skills in plain English.' },
    { num: '02', title: 'Let AI Improve Content', desc: 'Click "Improve with AI" to generate professional action verbs and ATS keywords.' },
    { num: '03', title: 'Choose Your Template', desc: 'Switch instantly between 6 design templates tailored for your industry.' },
    { num: '04', title: 'Preview & Audit ATS Score', desc: 'Review real-time A4 preview and run job description keyword matching.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-blue-400" /> Powered by Gemini AI & Supabase
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Build an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">ATS-Optimized Resume</span> & Portfolio Website in Minutes.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 leading-relaxed font-normal">
            Enter your details in plain English, let AI refine your bullet points, choose working templates, and generate a live hosted website automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/builder"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
            >
              Build My Resume Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 flex items-center justify-center gap-2 transition"
            >
              Explore 6 Templates
            </a>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% ATS Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High Quality A4 PDF</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-emerald-400" /> Hosted Personal Website</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Everything You Need to Land Your Next Job
          </h2>
          <p className="text-slate-400 text-lg">
            Complete suite of AI content enhancers, professional design templates, and portfolio publishing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How It Works in 4 Easy Steps
          </h2>
          <p className="text-slate-400 text-lg">
            From raw plain text to a polished PDF resume & personal website in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative">
              <span className="text-3xl font-black text-blue-500/30">{s.num}</span>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Template Showcase Section */}
      <section id="templates" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              6 Working Professional Templates
            </h2>
            <p className="text-slate-400 text-lg">
              Click any template below to test real live rendering against candidate data.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                  selectedTemplate === t.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {t.name} <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">{t.badge}</span>
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800 text-xs">
              <span className="font-bold text-white">
                Selected Template: {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </span>
              <button
                onClick={() => navigate('/builder')}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
              >
                Use This Template
              </button>
            </div>
            <div className="overflow-auto max-h-[600px] rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="transform scale-[0.85] origin-top">
                <ResumeTemplateRenderer templateId={selectedTemplate} data={sampleResume} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Currency Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Simple, Multi-Currency Pricing
          </h2>
          <p className="text-slate-400 text-lg">Support for Indian (INR) and International (USD, EUR, GBP) payments with native settlements.</p>

          {/* Region & Billing Controls */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            {/* Country Selector Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Globe2 className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Country:</span>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
              >
                {Object.keys(REGIONS).map(code => (
                  <option key={code} value={code} className="bg-slate-900 text-white">
                    {REGIONS[code].flag} {REGIONS[code].countryName} ({REGIONS[code].currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-lg transition ${billingPeriod === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-1.5 rounded-lg transition ${billingPeriod === 'yearly' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Yearly (Save 16%)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Free Starter Plan</h3>
              <div className="text-4xl font-extrabold text-white">
                {currentRegion.symbol}0 <span className="text-sm font-normal text-slate-400">/ forever</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Saved Resume</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 6 Working Templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standard AI Generations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High Quality PDF Download</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Published Portfolio Website</li>
              </ul>
            </div>
            <Link to="/builder" className="block text-center w-full py-3.5 rounded-xl border border-slate-700 text-slate-100 font-bold hover:bg-slate-800 transition">
              Start Building Free
            </Link>
          </div>

          {/* Pro Multi-Currency Tier */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-900/50 to-slate-900 border border-blue-500/50 relative space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                Pro Unlimited
              </span>
              <h3 className="text-xl font-bold text-white">Pro SaaS Plan</h3>
              <div className="text-4xl font-extrabold text-white">
                {currentRegion.symbol}{planPricing.amount} <span className="text-sm font-normal text-slate-400">/ {planPricing.period}</span>
              </div>
              <p className="text-xs text-slate-400">
                Supported Methods ({selectedRegion}): <span className="font-semibold text-slate-300">{currentRegion.paymentMethods.join(', ')}</span>
              </p>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Unlimited Resumes & Versioning</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Unlimited Gemini AI Enhancements</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> ATS Keyword Job Description Matcher</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Premium Portfolio Themes & Custom Domain</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Direct DOCX & Vector PDF Exports</li>
              </ul>
            </div>

            <button
              onClick={handleUpgradeToPro}
              disabled={isProcessingPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Initiating Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade to Pro ({currentRegion.symbol}{planPricing.amount})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Disclaimer Note */}
        <div className="text-center max-w-md mx-auto text-[11px] text-slate-500">
          "Final amount may vary based on applicable taxes, payment method, exchange rate and payment provider."
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center space-y-8">
        <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border border-blue-500/30 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to build a resume that gets noticed?
          </h2>
          <p className="text-slate-200 text-lg max-w-xl mx-auto">
            Join thousands of job seekers who landed interviews with AI-generated resumes and portfolio websites.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold bg-white text-slate-950 hover:bg-slate-100 transition shadow-xl transform hover:-translate-y-0.5"
          >
            Create My Resume Now <ArrowRight className="w-5 h-5 text-blue-600" />
          </Link>
        </div>
      </section>

      <Footer />

      {/* Auth Modal for Unauthenticated Upgrade Clicks */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          handleUpgradeToPro();
        }}
      />

      {/* Verified Payment Success Confirmation Modal */}
      <PaymentSuccessModal
        isOpen={Boolean(paymentSuccessDetails)}
        onClose={() => setPaymentSuccessDetails(null)}
        details={paymentSuccessDetails}
      />

      {/* Interactive Razorpay Test Mode Simulator (Zero PAN Required) */}
      <TestPaymentModal
        isOpen={Boolean(testOrderModalData)}
        onClose={() => setTestOrderModalData(null)}
        orderData={testOrderModalData}
        onSimulateSuccess={async (simData) => {
          const token = await getToken();
          await verifyAndActivatePayment({
            razorpay_order_id: simData.razorpay_order_id,
            razorpay_payment_id: simData.razorpay_payment_id,
            razorpay_signature: simData.razorpay_signature,
            planId: planKey,
            countryCode: selectedRegion
          }, token);
        }}
      />
    </div>
  );
}
