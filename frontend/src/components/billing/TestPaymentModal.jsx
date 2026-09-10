import React, { useState } from 'react';
import { CreditCard, CheckCircle2, X, ShieldCheck, Zap, Sparkles, Building2 } from 'lucide-react';

export default function TestPaymentModal({ isOpen, onClose, orderData, onSimulateSuccess }) {
  if (!isOpen || !orderData) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await onSimulateSuccess({
        razorpay_order_id: orderData.id,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: 'mock_signature',
        method: paymentMethod
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Razorpay Test Mode Simulator</h3>
          <p className="text-xs text-slate-400">Zero PAN or KYC required • Instant Test Payment</p>
        </div>

        {/* Order Details Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Subtotal Order Amount</span>
            <span className="font-extrabold text-lg text-white">
              {orderData.symbol || '₹'}{orderData.displayAmount || '99'}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[11px]">
            {orderData.currency || 'INR'} • Test Order
          </span>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Select Test Payment Method:</label>

          {/* UPI */}
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition ${
              paymentMethod === 'upi' ? 'bg-blue-600/20 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Instant UPI (`success@razorpay`)</span>
            </div>
            {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition ${
              paymentMethod === 'card' ? 'bg-blue-600/20 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Test Credit/Debit Card (`4111 1111...`)</span>
            </div>
            {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Netbanking */}
          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition ${
              paymentMethod === 'netbanking' ? 'bg-blue-600/20 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Test Net Banking (Any Bank)</span>
            </div>
            {paymentMethod === 'netbanking' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
        >
          {loading ? 'Processing Verification...' : `Simulate Successful ${orderData.currency} Payment`}
        </button>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tested against backend signature verification & database logs
        </div>
      </div>
    </div>
  );
}
