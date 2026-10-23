import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  ShieldCheck,
  RotateCcw,
  BadgeDollarSign,
  Truck,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Award,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEALERSHIP } from '../config/dealership';
import { SEO } from '../components/layout/SEO';
import { SmartImage } from '../components/ui/SmartImage';
import { VehicleCard } from '../components/vehicle/VehicleCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, reviews, blogPosts, openTestDrive } = useStore();

  // Quick Search States
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState('70000');
  const [selectedBodyType, setSelectedBodyType] = useState('');

  // Available Makes & Models for Cascading Quick Search
  const availableMakes = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.make))).sort();
  }, [vehicles]);

  const availableModelsForMake = useMemo(() => {
    if (!selectedMake) return [];
    return Array.from(
      new Set(vehicles.filter((v) => v.make === selectedMake).map((v) => v.model))
    ).sort();
  }, [vehicles, selectedMake]);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedMake) params.append('make', selectedMake);
    if (selectedModel) params.append('model', selectedModel);
    if (selectedBodyType) params.append('bodyType', selectedBodyType);
    if (selectedMaxPrice && Number(selectedMaxPrice) < 70000) {
      params.append('maxPrice', selectedMaxPrice);
    }
    navigate(`/inventory?${params.toString()}`);
  };

  // Featured Vehicles
  const featuredVehicles = useMemo(() => {
    return vehicles.filter((v) => v.featured).slice(0, 8);
  }, [vehicles]);

  // Approved Reviews for Marquee
  const approvedReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'approved').slice(0, 8);
  }, [reviews]);

  // Latest 3 published blog posts
  const latestPosts = useMemo(() => {
    return blogPosts.filter((p) => p.status === 'published').slice(0, 3);
  }, [blogPosts]);

  // Carousel scroll handler
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = dir === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Body Type Categories
  const bodyTypes = [
    {
      type: 'SUV',
      count: vehicles.filter((v) => v.bodyType === 'SUV').length,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    {
      type: 'Sedan',
      count: vehicles.filter((v) => v.bodyType === 'Sedan').length,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    },
    {
      type: 'Truck',
      count: vehicles.filter((v) => v.bodyType === 'Truck').length,
      image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    },
    {
      type: 'Coupe',
      count: vehicles.filter((v) => v.bodyType === 'Coupe').length,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    },
    {
      type: 'EV',
      count: vehicles.filter((v) => v.bodyType === 'EV').length,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    },
    {
      type: 'Luxury',
      count: vehicles.filter((v) => v.bodyType === 'Luxury').length,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Brand Wordmarks Strip
  const brandList = [
    'PORSCHE',
    'BMW',
    'MERCEDES-BENZ',
    'AUDI',
    'LEXUS',
    'TESLA',
    'FORD PERFORMANCE',
    'CHEVROLET',
    'JEEP',
  ];

  return (
    <>
      <SEO
        title="Pre-owned. Fully trusted."
        description="Dallas' premier pre-owned luxury and performance vehicle dealership. 150-point certified inspection, 7-day money-back guarantee, zero hidden dealer fees."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AutoDealer',
          name: DEALERSHIP.name,
          description: DEALERSHIP.tagline,
          address: {
            '@type': 'PostalAddress',
            streetAddress: DEALERSHIP.address,
            addressLocality: DEALERSHIP.city,
            addressRegion: DEALERSHIP.state,
            postalCode: DEALERSHIP.zip,
            addressCountry: DEALERSHIP.country,
          },
          telephone: DEALERSHIP.phone,
          openingHours: 'Mo-Fr 09:00-19:00, Sa 09:00-18:00',
          priceRange: '$$$$',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: reviews.length.toString(),
          },
        }}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#0A0B0F]">
        {/* Background Image with Cinematic Ken Burns Zoom & Measured Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src="/src/assets/images/apex_hero_car_1792775142281.jpg"
            alt="Porsche in modern architectural showroom"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradients to guarantee 4.5:1 WCAG contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0F] via-[#0A0B0F]/70 to-[#0A0B0F]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0F]/90 via-[#0A0B0F]/50 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-5">
            {/* Location & Certification Trust Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2E]" />
              <span>Dallas, Texas</span>
              <span>·</span>
              <span className="text-[#3B82F6] font-semibold">150-Point Certified</span>
              <span>·</span>
              <span>7-Day Return Guarantee</span>
            </div>

            {/* Headline with Staggered Word Reveal and Ignition Gradient */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] font-['Archivo'] text-balance">
              Engineered for passion.{' '}
              <span className="text-ignition">Fully trusted.</span>
            </h1>

            {/* Subheadline with real value proposition */}
            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl">
              Dallas' premier pre-owned luxury and performance showroom. Every vehicle passes a meticulous 150-point diagnostic audit, backed by transparent pricing, a 7-day money-back guarantee, and Texas flatbed delivery.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/inventory"
                className="px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Browse {vehicles.length} Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => openTestDrive()}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all active:scale-95"
              >
                Schedule Showroom Test Drive
              </button>
            </div>
          </div>

          {/* Quick-Search Filter Bar in Glass Card */}
          <div className="mt-10 sm:mt-12 w-full max-w-5xl">
            <form
              onSubmit={handleQuickSearchSubmit}
              className="p-3 sm:p-4 rounded-2xl bg-[#12141A]/90 backdrop-blur-xl border border-white/10 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              {/* Make Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] mb-1">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel('');
                  }}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                >
                  <option value="">All Makes</option>
                  {availableMakes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selector (Cascades from Make) */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] mb-1">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00] disabled:opacity-40"
                >
                  <option value="">{selectedMake ? 'All Models' : 'Select Make First'}</option>
                  {availableModelsForMake.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] mb-1">
                  Body Type
                </label>
                <select
                  value={selectedBodyType}
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                >
                  <option value="">All Body Styles</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="EV">Electric / EV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] mb-1">
                  Max Price: <span className="text-white font-mono">${Number(selectedMaxPrice).toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="15000"
                  max="70000"
                  step="2500"
                  value={selectedMaxPrice}
                  onChange={(e) => setSelectedMaxPrice(e.target.value)}
                  className="w-full accent-[#FF8A00] cursor-pointer mt-1"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-lg shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Animated Stat Counters Strip */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-6 border-t border-white/[0.08]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
                1,200+
              </p>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Vehicles Delivered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tabular-nums tracking-tight flex items-center justify-center gap-1">
                <span>4.9</span>
                <Star className="w-5 h-5 text-[#FF8A00] fill-[#FF8A00]" />
              </p>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Average Rating</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tabular-nums tracking-tight text-[#3B82F6]">
                150-Point
              </p>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Safety & DME Audit</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tabular-nums tracking-tight text-[#22C55E]">
                7-Day
              </p>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mt-0.5">Money-Back Return</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BRAND WORDMARKS STRIP */}
      {/* ========================================================================= */}
      <section className="py-6 bg-[#0E1015] border-y border-white/[0.06] overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8 overflow-x-auto text-xs font-black tracking-widest text-[#71717A] opacity-75 font-['Archivo']">
          {brandList.map((brand) => (
            <span key={brand} className="whitespace-nowrap hover:text-white transition-colors cursor-default">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED VEHICLES CAROUSEL */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF8A00] mb-1">
              <Award className="w-4 h-4" />
              <span>Curated Showroom Arrivals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
              Featured Pre-Owned Allocation
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-3 rounded-xl bg-[#12141A] hover:bg-white/10 text-white border border-white/10 transition-colors"
              aria-label="Previous cars"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-3 rounded-xl bg-[#12141A] hover:bg-white/10 text-white border border-white/10 transition-colors"
              aria-label="Next cars"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              to="/inventory"
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="w-[320px] sm:w-[360px] shrink-0 snap-start"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOP BY BODY TYPE */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0E1015] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
              Categorized Inventory
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight mt-1">
              Shop by Body Style
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2">
              From executive long-wheelbase sedans to performance 4x4 trucks and cutting-edge electric powertrains.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bodyTypes.map((item) => (
              <Link
                key={item.type}
                to={`/inventory?bodyType=${item.type}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#12141A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-end p-4"
              >
                <div className="absolute inset-0 z-0">
                  <SmartImage
                    src={item.image}
                    alt={item.type}
                    aspectRatio="auto"
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0F] via-[#0A0B0F]/50 to-transparent" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-black text-white font-['Archivo'] group-hover:text-[#FF8A00] transition-colors">
                    {item.type}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5 font-mono">
                    {item.count} in stock
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY BUY FROM US (4 TRUST POINTS) */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A00]">
            The Apex Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight mt-1">
            Why Discerning Drivers Choose Apex Motor
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
            We built Apex Motor Co. to eliminate every frustration of traditional car buying. Total transparency, verified mechanical integrity, and zero games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trust Point 1 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center mb-5 border border-[#3B82F6]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Archivo'] mb-2">
              150-Point Certified Audit
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Every vehicle undergoes full chassis ultrasound paint scanning, DME ignition overrev diagnostics, and mechanical stress testing. No compromises.
            </p>
          </div>

          {/* Trust Point 2 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center mb-5 border border-[#22C55E]/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Archivo'] mb-2">
              7-Day / 250-Mile Return
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Take the car home, drive your routine commutes, and test it in your garage. If it doesn't fit your life, return it for a 100% refund without restocking fees.
            </p>
          </div>

          {/* Trust Point 3 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/15 text-[#FF8A00] flex items-center justify-center mb-5 border border-[#FF8A00]/30">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Archivo'] mb-2">
              Zero Hidden Dealer Fees
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              The price on the screen is the final transaction price. No mandatory GPS add-ons, fake nitrogen fees, or inflated preparation charges.
            </p>
          </div>

          {/* Trust Point 4 */}
          <div className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF4D2E]/15 text-[#FF4D2E] flex items-center justify-center mb-5 border border-[#FF4D2E]/30">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Archivo'] mb-2">
              White-Glove Texas Delivery
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Flatbed delivery straight to your driveway across Dallas, Fort Worth, Plano, Frisco, and Southlake. Includes title signing and orientation.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINANCING CALCULATOR TEASER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0E1015] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#12141A] via-[#1A1D25] to-[#12141A] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#22C55E]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span>Tier 1 Rates from 5.99% APR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
                Transparent Financing on Your Terms
              </h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Estimate your monthly investment, test term durations from 36 to 72 months, and get pre-qualified online in under 2 minutes with zero impact on your FICO credit score.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/financing"
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-lg shadow-[#FF4D2E]/25 transition-all flex items-center gap-1.5"
                >
                  <span>Launch Payment Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/financing#pre-approval"
                  className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Apply for Pre-Approval
                </Link>
              </div>
            </div>

            {/* Teaser Metric Card */}
            <div className="w-full lg:w-96 p-6 rounded-2xl bg-[#0A0B0F]/90 border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                <span>Sample Vehicle ($45,000)</span>
                <span className="text-[#3B82F6] font-mono">60 Mos @ 5.99%</span>
              </div>
              <div>
                <p className="text-3xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
                  $742 <span className="text-xs font-normal text-[#A1A1AA]">/ month</span>
                </p>
                <p className="text-xs text-[#71717A] mt-1">Based on $8,000 down payment or trade equity.</p>
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex justify-between text-xs text-[#A1A1AA]">
                <span>Down Payment: $8,000</span>
                <span>APR: 5.99% Fixed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VERIFIED BUYER REVIEWS MARQUEE */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF8A00] mb-1">
              <Star className="w-4 h-4 fill-[#FF8A00]" />
              <span>4.9 / 5.0 Star Rating · 40+ Verified Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
              What North Texas Drivers Say
            </h2>
          </div>
          <Link
            to="/reviews"
            className="text-xs font-bold uppercase tracking-wider text-[#FF8A00] hover:text-[#FFC14D] transition-colors flex items-center gap-1"
          >
            <span>Read All Verified Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-[#FF8A00] fill-[#FF8A00]' : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="text-base font-bold text-white font-['Archivo'] line-clamp-1">
                  "{review.title}"
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mt-2 line-clamp-4">
                  {review.comment}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{review.customerName}</p>
                  <p className="text-[11px] text-[#71717A]">{review.location}</p>
                </div>
                {review.vehicleName && (
                  <span className="text-[10px] text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                    {review.vehicleName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LATEST BLOG ARTICLES */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0E1015] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA]">
                Market Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight mt-1">
                Latest Insights & Guides
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-xs font-bold uppercase tracking-wider text-[#FF8A00] hover:text-[#FFC14D] transition-colors flex items-center gap-1"
            >
              <span>Explore All Articles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 overflow-hidden flex flex-col justify-between transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#0A0B0F]">
                  <SmartImage
                    src={post.coverImage}
                    alt={post.title}
                    aspectRatio="16/10"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#A1A1AA] uppercase tracking-wider font-mono">
                      <span className="text-[#FF8A00]">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A00] transition-colors mt-2 tracking-tight font-['Archivo'] line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#71717A]">
                    <span>By {post.author}</span>
                    <span className="flex items-center gap-1 text-white group-hover:text-[#FF8A00] font-semibold transition-colors">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CTA BAND WITH IGNITION GRADIENT BACKGROUND */}
      {/* ========================================================================= */}
      <section className="relative py-20 overflow-hidden bg-ignition">
        {/* Dark radial blend pattern */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-black/70 font-black">
            Ready to Experience the Difference?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-['Archivo'] tracking-tight text-white leading-tight">
            Reserve your pre-owned vehicle online in minutes.
          </h2>
          <p className="text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Every vehicle on our floor is backed by a 150-point inspection and 7-day money-back guarantee. Hold your spec with a fully refundable $500 deposit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/inventory"
              className="px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-black bg-white hover:bg-white/90 shadow-2xl transition-transform active:scale-95"
            >
              Browse Complete Inventory
            </Link>
            <button
              onClick={() => openTestDrive()}
              className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-black/40 hover:bg-black/60 border border-white/20 transition-transform active:scale-95"
            >
              Book Showroom Visit
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
