import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Check,
  Award,
  Send,
  Building,
} from 'lucide-react';
import { DEALERSHIP } from '../config/dealership';
import { useStore } from '../store/useStore';
import { SEO } from '../components/layout/SEO';
import { SmartImage } from '../components/ui/SmartImage';

export const AboutPage: React.FC = () => {
  const { staff, showToast } = useStore();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setContactSent(true);
    showToast({
      type: 'success',
      title: 'Message Transmitted to Concierge',
      message: 'A client advisor will respond within 1 business hour.',
    });
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <>
      <SEO
        title="About Apex Motor Co. & Dallas Showroom"
        description="Learn about our 150-point certified reconditioning process, leadership team, and Dallas showroom location on West Airport Freeway."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF8A00] mb-2">
            <Building className="w-4 h-4" />
            <span>Dallas, Texas · Established 2018</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Archivo'] tracking-tight">
            Pre-owned. Fully trusted.
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 leading-relaxed">
            Apex Motor Co. was founded in Dallas with a singular objective: to bring high-end automotive craftsmanship, diagnostic transparency, and direct-to-door convenience to pre-owned car buying.
          </p>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-[#12141A] border border-white/10 shadow-2xl">
            <SmartImage
              src="/src/assets/images/apex_hero_car_1792775142281.jpg"
              alt="Apex Motor Dallas Showroom"
              aspectRatio="16/10"
              className="w-full h-full"
            />
          </div>

          <div className="space-y-5 text-sm text-[#A1A1AA] leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
              An Agency Approach to Automotive Retail
            </h2>
            <p>
              We believe pre-owned vehicles shouldn't come with mysteries. Every car in our showroom undergoes a comprehensive 150-point diagnostic inspection conducted on high-speed lifts, including digital ultrasonic paint thickness verification, electronic control unit (ECU) overrev audits, and laboratory oil fluid analysis.
            </p>
            <p>
              Unlike conventional dealerships with high-pressure finance offices and mystery add-ons, our prices are fixed, fair, and completely transparent. What you see is what you pay—backed by our unconditional 7-day money-back guarantee and Texas flatbed delivery.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-2xl font-black text-white font-['Archivo'] block">150</span>
                <span className="text-[#71717A] uppercase font-mono">Certified Points</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-['Archivo'] block">7 Days</span>
                <span className="text-[#71717A] uppercase font-mono">Full Return Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership & Staff Cards */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A00]">
              The People Behind The Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight mt-1">
              Leadership & Client Specialists
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-[#12141A] border border-white/10 text-center space-y-3"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-white/10 bg-[#0A0B0F]">
                  <SmartImage
                    src={member.avatar}
                    alt={member.name}
                    aspectRatio="1/1"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Archivo']">{member.name}</h3>
                  <p className="text-xs text-[#FF8A00] font-mono">{member.role}</p>
                </div>
                <p className="text-xs text-[#71717A]">{member.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map Placeholder Card & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Showroom Map Card (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Archivo']">
                Dallas Flagship Showroom
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Centrally located along West Airport Freeway, 10 minutes from DFW International Airport.
              </p>
            </div>

            {/* Stylized Dark Automotive Map Placeholder */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0B0F] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
              {/* Map grid lines simulation */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 rounded-full bg-ignition text-white mx-auto flex items-center justify-center shadow-lg shadow-[#FF4D2E]/30 animate-pulse">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white font-['Archivo']">
                  {DEALERSHIP.name}
                </h4>
                <p className="text-xs text-[#A1A1AA]">
                  {DEALERSHIP.address}, {DEALERSHIP.city}, {DEALERSHIP.state} {DEALERSHIP.zip}
                </p>
                <div className="pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(DEALERSHIP.name + ' ' + DEALERSHIP.address + ' ' + DEALERSHIP.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#A1A1AA] pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF8A00]" />
                <span>Weekdays: {DEALERSHIP.hours.weekdays}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF8A00]" />
                <a href={`tel:${DEALERSHIP.phone}`} className="hover:text-white">
                  {DEALERSHIP.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF8A00]" />
                <a href={`mailto:${DEALERSHIP.email}`} className="hover:text-white">
                  {DEALERSHIP.email}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Concierge Form (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Archivo']">
                Contact Our Concierge Desk
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Have a question about specific vehicle provenance, trade-ins, or transport?
              </p>
            </div>

            {contactSent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <p className="font-bold text-sm">Message Sent Successfully</p>
                <p className="text-[#A1A1AA]">
                  Thank you for reaching out. A dedicated advisor will review your request and get in touch promptly.
                </p>
                <button
                  onClick={() => setContactSent(false)}
                  className="mt-2 text-xs font-bold text-[#FF8A00] underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="rachel@domain.com"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(214) 000-0000"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Your Inquiry or Vehicle of Interest
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what you are looking for..."
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-lg shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
