import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const PreApprovalModal: React.FC = () => {
  const { isPreApprovalOpen, closePreApproval, showToast } = useStore();

  const [income, setIncome] = useState('95,000');
  const [creditTier, setCreditTier] = useState('Excellent (740+)');
  const [downPayment, setDownPayment] = useState('8,000');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setSubmitted(true);
    showToast({
      type: 'success',
      title: 'Pre-Approval Pre-Qualified',
      message: 'Tier 1 Prime Rate 5.99% locked for 30 days.',
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    closePreApproval();
  };

  if (!isPreApprovalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#12141A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#3B82F6]">
                  Soft Credit Inquiry Only
                </span>
              </div>

              <h3 className="text-2xl font-black text-white font-['Archivo'] tracking-tight">
                Get Pre-Approved in Seconds
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Zero impact on your FICO credit score. Lock in competitive Tier 1 rates before your visit.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Estimated Credit Tier
                    </label>
                    <select
                      value={creditTier}
                      onChange={(e) => setCreditTier(e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                    >
                      <option>Excellent (740+)</option>
                      <option>Very Good (700-739)</option>
                      <option>Good (660-699)</option>
                      <option>Fair (620-659)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Annual Gross Income
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-[#71717A]">$</span>
                      <input
                        type="text"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl pl-6 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                    Planned Cash Down Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#71717A]">$</span>
                    <input
                      type="text"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl pl-6 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Katherine Miller"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="katherine@example.com"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(214) 000-0000"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#71717A]">
                  <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>256-bit bank-grade encryption. No Social Security Number required for pre-qualification.</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95"
                >
                  Check Instant Pre-Approval
                </button>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white font-['Archivo']">
                Pre-Approval Qualified!
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
                Congratulations, <span className="text-white font-medium">{name}</span>. Based on your profile, you are pre-qualified for up to{' '}
                <span className="text-white font-bold text-sm">$85,000</span> at{' '}
                <span className="text-[#22C55E] font-bold text-sm">5.99% APR</span> for up to 60 months.
              </p>
              <div className="p-3 bg-white/5 rounded-xl text-xs text-[#3B82F6] flex items-center justify-center gap-2 border border-white/10">
                <ShieldCheck className="w-4 h-4" />
                <span>Certificate #APX-FIN-9204 sent to {email}. Valid for 30 days.</span>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider"
              >
                Close & Browse Inventory
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
