import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ArrowRight, Check } from 'lucide-react';
import { DEALERSHIP } from '../../config/dealership';
import { useStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSubscribed(true);
    showToast({
      type: 'success',
      title: 'Subscribed to Private Alerts',
      message: 'You will receive priority access when fresh off-lease allocations arrive.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-[#0A0B0F] border-t border-white/[0.08] text-[#A1A1AA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 12-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/[0.08]">
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF4D2E] via-[#FF8A00] to-[#FFC14D] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#0A0B0F] rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-['Archivo']">
                {DEALERSHIP.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#A1A1AA] max-w-sm">
              Dallas' premier boutique dealership specializing in meticulously reconditioned, low-mileage performance and luxury motorcars. Pre-owned. Fully trusted.
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <span>{DEALERSHIP.address}, {DEALERSHIP.city}, {DEALERSHIP.state} {DEALERSHIP.zip}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <a href={`tel:${DEALERSHIP.phone}`} className="hover:text-white transition-colors">
                  {DEALERSHIP.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <a href={`mailto:${DEALERSHIP.email}`} className="hover:text-white transition-colors">
                  {DEALERSHIP.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Inventory</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/inventory?bodyType=SUV" className="hover:text-white transition-colors">
                  SUVs & Crossovers
                </Link>
              </li>
              <li>
                <Link to="/inventory?bodyType=Sedan" className="hover:text-white transition-colors">
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link to="/inventory?bodyType=Coupe" className="hover:text-white transition-colors">
                  Coupes & Sports Cars
                </Link>
              </li>
              <li>
                <Link to="/inventory?bodyType=Truck" className="hover:text-white transition-colors">
                  Trucks & 4x4s
                </Link>
              </li>
              <li>
                <Link to="/inventory?bodyType=EV" className="hover:text-white transition-colors">
                  Electric & Hybrids
                </Link>
              </li>
              <li>
                <Link to="/inventory?certified=true" className="hover:text-[#3B82F6] transition-colors">
                  Certified Pre-Owned
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Services (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Services & Trust</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/financing" className="hover:text-white transition-colors">
                  Online Financing & Pre-Approval
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Side-by-Side Comparison Grid
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">
                  Verified Buyer Reviews
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Automotive Market Insights
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  150-Point Inspection Standards
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/60 hover:text-[#FF8A00] transition-colors flex items-center gap-1">
                  <span>Dealership Portal</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-mono">Staff</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Hours & Private Alerts (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-bold flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Showroom Hours</span>
              </h4>
              <p className="text-xs text-[#A1A1AA]">Mon – Fri: {DEALERSHIP.hours.weekdays}</p>
              <p className="text-xs text-[#A1A1AA]">Sat: {DEALERSHIP.hours.saturday}</p>
              <p className="text-xs text-[#71717A] mt-0.5">{DEALERSHIP.hours.sunday}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-2">
                Priority Inbound Alerts
              </h4>
              <p className="text-xs text-[#A1A1AA] mb-3 leading-relaxed">
                Receive instant notifications when fresh off-lease allocations match your criteria.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00] flex-1"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-ignition text-white text-xs font-bold shrink-0 hover:opacity-90 flex items-center justify-center shadow-md shadow-[#FF4D2E]/20"
                >
                  {isSubscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-[#22C55E]">
              <ShieldCheck className="w-4 h-4" />
              <span>Texas Motor Vehicle Commission Licensed Dealer #TX-48192</span>
            </span>
            <span>·</span>
            <span>All vehicles subjected to 150-Point Mechanical & Safety Certification</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Sale</Link>
            <span>© {new Date().getFullYear()} {DEALERSHIP.name}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
