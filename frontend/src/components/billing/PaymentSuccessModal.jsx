import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, CreditCard, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccessModal({ isOpen, onClose, details }) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const planName = details?.plan === 'pro_yearly' ? 'Pro Yearly Plan' : 'Pro Monthly Plan';
  const currencySymbol = details?.currency === 'INR' ? '₹' : details?.currency === 'EUR' ? '€' : details?.currency === 'GBP' ? '£' : '$';
  const amountFormatted = `${currencySymbol}${details?.amount || '799'}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-center">
        
        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/25">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-2xl font-extrabold text-white">Welcome to Pro 🎉</h3>
          <p className="text-xs text-slate-400">Your Pro Plan subscription has been successfully verified & activated!</p>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <span className="text-slate-400">Subscription Plan</span>
            <span className="font-bold text-emerald-400">{planName}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <span className="text-slate-400">Amount Paid</span>
            <span className="font-bold text-white">{amountFormatted}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <span className="text-slate-400">Payment Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
            </span>
          </div>
          {details?.paymentId && (
            <div className="flex justify-between items-center pt-0.5 text-[11px]">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-slate-300 truncate max-w-[180px]">{details.paymentId}</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => { onClose(); navigate('/builder'); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
          >
            <span>Create Pro Resume Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => { onClose(); navigate('/dashboard'); }}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Go to Dashboard</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secured & Processed via Official Payment Gateway
        </div>
      </div>
    </div>
  );
}
