import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  ShieldCheck,
  ChevronDown,
  Calculator,
  Lock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEALERSHIP } from '../config/dealership';
import { SEO } from '../components/layout/SEO';

export const FinancingPage: React.FC = () => {
  const { openPreApproval } = useStore();

  // Calculator State
  const [vehiclePrice, setVehiclePrice] = useState(48000);
  const [downPayment, setDownPayment] = useState(10000);
  const [tradeValue, setTradeValue] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60);
  const [apr, setApr] = useState(5.99);

  // Amortization calculation
  const netFinanced = Math.max(0, vehiclePrice - downPayment - tradeValue);
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0 && loanTerm > 0
      ? Math.round(
          (netFinanced * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
            (Math.pow(1 + monthlyRate, loanTerm) - 1)
        )
      : Math.round(netFinanced / loanTerm);

  const totalFinancePayments = monthlyPayment * loanTerm;
  const totalInterestPaid = Math.max(0, totalFinancePayments - netFinanced);

  // Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will checking my pre-approval impact my credit score?',
      a: 'No. Our initial online pre-qualification utilizes a soft credit inquiry algorithm that does not impact your FICO score or appear on your public credit history report.',
    },
    {
      q: 'What credit score is required for Tier 1 interest rates?',
      a: 'Credit scores of 740 and above qualify for our Tier 1 Prime rates (starting at 5.99% APR for terms up to 60 months). We work with 18 credit unions and institutional lenders to secure competitive financing across all credit profiles.',
    },
    {
      q: 'How does Texas sales tax apply if I have a trade-in vehicle?',
      a: 'In Texas, you receive an immediate sales tax credit on your trade-in allowance. For example, if you purchase a $50,000 vehicle and trade in a car worth $20,000, you only pay Texas sales tax (8.25%) on the remaining $30,000 difference—saving you $1,650 in state taxes.',
    },
    {
      q: 'Can I pay off my loan early without prepayment penalties?',
      a: 'Yes, 100% of our financing contracts are simple interest loans with zero prepayment penalties. You can make accelerated principal payments or refinance at any time without fees.',
    },
    {
      q: 'Can I bring my own financing or pre-approval from my local credit union?',
      a: 'Absolutely. We regularly coordinate directly with USAA, Navy Federal, EECU, and all Texas credit unions. We provide your loan officer with the exact buyer order and title specs for seamless funding.',
    },
  ];

  return (
    <>
      <SEO
        title="Automotive Financing & Pre-Approval"
        description="Calculate estimated monthly payments and apply for instant online pre-approval. Competitive rates from 5.99% APR with Texas credit unions and zero hidden fees."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#22C55E] mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Transparent Rates · Zero Markups</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Archivo'] tracking-tight">
            Automotive Financing Made Simple
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
            Customize terms, simulate down payments, and secure prime rates from 5.99% APR with full transparency before stepping onto our showroom floor.
          </p>
        </div>

        {/* 2-Column Split: Calculator (7 cols) + Summary & Pre-Approval CTA (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Calculator Controls */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Calculator className="w-5 h-5 text-[#FF8A00]" />
              <h2 className="text-base font-bold text-white font-['Archivo'] uppercase tracking-wider">
                Interactive Payment Calculator
              </h2>
            </div>

            {/* Vehicle Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-wider">Target Vehicle Price</span>
                <span className="text-white font-mono font-bold text-sm">${vehiclePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="15000"
                max="85000"
                step="1000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-[#FF8A00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
                <span>$15,000</span>
                <span>$85,000+</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-wider">Cash Down Payment</span>
                <span className="text-white font-mono font-bold text-sm">${downPayment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={vehiclePrice}
                step="500"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-[#FF8A00] cursor-pointer"
              />
            </div>

            {/* Trade-in Allowance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-wider">Estimated Trade-In Equity</span>
                <span className="text-white font-mono font-bold text-sm">${tradeValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30000"
                step="500"
                value={tradeValue}
                onChange={(e) => setTradeValue(Number(e.target.value))}
                className="w-full accent-[#FF8A00] cursor-pointer"
              />
            </div>

            {/* Term Selection */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] block">
                Financing Term Duration
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[36, 48, 60, 72].map((term) => (
                  <button
                    key={term}
                    onClick={() => setLoanTerm(term)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-colors border ${
                      loanTerm === term
                        ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                        : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/10 hover:text-white'
                    }`}
                  >
                    {term} Months
                  </button>
                ))}
              </div>
            </div>

            {/* APR Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#A1A1AA] font-bold uppercase tracking-wider">Interest Rate (APR)</span>
                <span className="text-white font-mono font-bold text-sm">{apr.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="3.99"
                max="12.99"
                step="0.25"
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="w-full accent-[#FF8A00] cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary & Pre-Approval Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6 lg:sticky lg:top-24">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#A1A1AA] block">
                Estimated Monthly Investment
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
                  ${monthlyPayment.toLocaleString()}
                </span>
                <span className="text-xs text-[#A1A1AA]">/ month</span>
              </div>
              <span className="text-xs text-[#22C55E] font-mono mt-1 block">
                {loanTerm} monthly installments @ {apr}% APR
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0B0F] border border-white/[0.08] space-y-2 text-xs text-[#A1A1AA]">
              <div className="flex justify-between">
                <span>Total Amount Financed:</span>
                <span className="text-white font-mono font-semibold">${netFinanced.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest Cost:</span>
                <span className="text-white font-mono font-semibold">${totalInterestPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-white">
                <span>Total Loan Payments:</span>
                <span className="font-mono">${totalFinancePayments.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openPreApproval()}
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Check Instant Pre-Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
                <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Soft inquiry only · No SSN needed · Zero FICO impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
              Frequently Asked Financing Questions
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Clear answers on rates, trade credits, and dealer transparency.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#12141A] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white font-['Archivo']"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#FF8A00] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs text-[#A1A1AA] leading-relaxed border-t border-white/5 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
