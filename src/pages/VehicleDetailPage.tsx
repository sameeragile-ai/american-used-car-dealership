import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Heart,
  Scale,
  ShoppingBag,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Star,
  FileCheck2,
  DollarSign,
  Fuel,
  Gauge,
  Zap,
  Clock,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEALERSHIP } from '../config/dealership';
import { SEO } from '../components/layout/SEO';
import { SmartImage } from '../components/ui/SmartImage';
import { VehicleCard } from '../components/vehicle/VehicleCard';

export const VehicleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    vehicles,
    reviews,
    addReview,
    addToCart,
    compareIds,
    addToCompare,
    removeFromCompare,
    favoriteIds,
    toggleFavorite,
    openTestDrive,
    openPreApproval,
    showToast,
  } = useStore();

  // Find vehicle by slug
  const vehicle = useMemo(() => {
    return vehicles.find((v) => v.slug === slug);
  }, [vehicles, slug]);

  // Gallery Active Index & Lightbox
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Live Payment Calculator
  const [downPayment, setDownPayment] = useState(8000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [apr, setApr] = useState(5.99);

  // Review Submission State
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('Dallas, TX');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState(false);

  if (!vehicle) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Vehicle Not Found</h1>
        <p className="text-sm text-[#A1A1AA] mb-8">
          The requested vehicle may have already been reserved or re-allocated.
        </p>
        <Link
          to="/inventory"
          className="px-6 py-3 rounded-xl bg-ignition text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Inventory
        </Link>
      </div>
    );
  }

  // Monthly Payment Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const principal = Math.max(0, vehicle.price - downPayment);
  const monthlyRate = apr / 100 / 12;
  const estimatedMonthlyPayment =
    monthlyRate > 0
      ? Math.round(
          (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) /
            (Math.pow(1 + monthlyRate, loanTerm) - 1)
        )
      : Math.round(principal / loanTerm);

  // Reviews for this vehicle or related
  const vehicleReviews = reviews.filter(
    (r) => (r.vehicleId === vehicle.id || r.vehicleName?.includes(vehicle.model)) && r.status === 'approved'
  );

  const averageRating = vehicleReviews.length > 0
    ? (vehicleReviews.reduce((sum, r) => sum + r.rating, 0) / vehicleReviews.length).toFixed(1)
    : (vehicle.rating?.toFixed(1) || '4.9');

  // Similar vehicles (same body type or make, excluding this one)
  const similarVehicles = vehicles
    .filter((v) => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.make === vehicle.make))
    .slice(0, 4);

  const isCompared = compareIds.includes(vehicle.id);
  const isFavorite = favoriteIds.includes(vehicle.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle || !newReviewName || !newReviewComment) return;

    addReview({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      customerName: newReviewName,
      location: newReviewLocation,
      rating: newReviewRating,
      title: newReviewTitle,
      comment: newReviewComment,
      verifiedPurchase: true,
    });

    setReviewSubmittedNotice(true);
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Vehicle URL copied to clipboard.',
      });
    }
  };

  return (
    <>
      <SEO
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`}
        description={`${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage.toLocaleString()} miles. ${vehicle.engine}, ${vehicle.drivetrain}. Dallas TX certified pre-owned.`}
        image={vehicle.images[0]}
        type="product"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Car',
          name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`,
          image: vehicle.images,
          vehicleIdentificationNumber: vehicle.vin,
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'SMI',
          },
          fuelType: vehicle.fuelType,
          vehicleTransmission: vehicle.transmission,
          vehicleEngine: {
            '@type': 'EngineSpecification',
            name: vehicle.engine,
          },
          offers: {
            '@type': 'Offer',
            price: vehicle.price,
            priceCurrency: 'USD',
            availability: vehicle.status === 'Available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            seller: {
              '@type': 'AutoDealer',
              name: DEALERSHIP.name,
            },
          },
        }}
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <Link to="/inventory" className="hover:text-white transition-colors flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Inventory</span>
            </Link>
            <span>/</span>
            <span>{vehicle.make}</span>
            <span>/</span>
            <span className="text-white font-medium">{vehicle.model}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleFavorite(vehicle.id)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isFavorite ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 hover:bg-white/10 text-[#A1A1AA]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => (isCompared ? removeFromCompare(vehicle.id) : addToCompare(vehicle.id))}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isCompared ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-white/5 hover:bg-white/10 text-[#A1A1AA]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Gallery (Left) & Contiguous Purchase Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================= */}
          {/* LEFT: INTERACTIVE IMAGE GALLERY (7 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0B0F] border border-white/10 group shadow-2xl">
              <SmartImage
                src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                aspectRatio="16/10"
                className="w-full h-full object-cover"
                priority
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Fullscreen Lightbox Trigger */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 text-white backdrop-blur-md hover:bg-black transition-colors"
                title="Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Certified Badge Overlay */}
              {vehicle.certified && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-[#3B82F6] text-xs font-semibold border border-[#3B82F6]/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Apex 150-Point Certified</span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#FF8A00] scale-98 shadow-md shadow-[#FF8A00]/20'
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <SmartImage
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    aspectRatio="16/10"
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* CARFAX & Vehicle History Section */}
            <div className="p-6 rounded-2xl bg-[#12141A] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#22C55E]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Verified Vehicle History Record
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                  Clean Title Guaranteed
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-[#0A0B0F] rounded-xl border border-white/5">
                  <p className="text-2xl font-black text-white font-['Archivo']">
                    {vehicle.history.owners}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                    Previous {vehicle.history.owners === 1 ? 'Owner' : 'Owners'}
                  </p>
                </div>
                <div className="p-3 bg-[#0A0B0F] rounded-xl border border-white/5">
                  <p className="text-2xl font-black text-[#22C55E] font-['Archivo']">
                    {vehicle.history.accidents}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                    Accidents Reported
                  </p>
                </div>
                <div className="p-3 bg-[#0A0B0F] rounded-xl border border-white/5">
                  <p className="text-2xl font-black text-white font-['Archivo']">
                    {vehicle.history.serviceRecords}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-0.5">
                    Documented Services
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#71717A] leading-relaxed">
                Full CARFAX audit verified on {vehicle.dateAdded}. Zero structural damage, odometer rollback flags, or frame alterations detected during our multi-point inspection.
              </p>
            </div>

            {/* Standard & Optional Features Checklist */}
            <div className="p-6 rounded-2xl bg-[#12141A] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Vehicle Equipment & Installed Options
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicle.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                    <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: CONTIGUOUS PURCHASE MODULE (5 Cols - Sticky) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
              {/* Header Title */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#A1A1AA] uppercase tracking-wider font-mono mb-1">
                  <span>Stock #{vehicle.stockNumber}</span>
                  <span className="text-[#3B82F6]">{vehicle.bodyType}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-sm text-[#A1A1AA] mt-0.5">{vehicle.trim}</p>
              </div>

              {/* Price & Monthly Estimate */}
              <div className="p-4 rounded-2xl bg-[#0A0B0F] border border-white/[0.08] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#A1A1AA] block uppercase font-bold tracking-wider">
                    Online Transparent Price
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#22C55E] font-medium font-mono block">
                    est. ${estimatedMonthlyPayment}/mo
                  </span>
                  <span className="text-[10px] text-[#71717A]">
                    {loanTerm} mo @ {apr}% APR
                  </span>
                </div>
              </div>

              {/* Primary Action CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => addToCart(vehicle)}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve Vehicle (${DEALERSHIP.pricing.reservationDeposit} Refundable)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openTestDrive(vehicle)}
                    className="py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#FF8A00]" />
                    <span>Book Test Drive</span>
                  </button>

                  <button
                    onClick={() => openPreApproval()}
                    className="py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Get Pre-Approved</span>
                  </button>
                </div>
              </div>

              {/* Key Specs Matrix */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#A1A1AA] block">
                  Mechanical & Exterior Specifications
                </span>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-[#71717A] block">Mileage</span>
                    <span className="text-white font-semibold tabular-nums">{vehicle.mileage.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Drivetrain</span>
                    <span className="text-white font-semibold">{vehicle.drivetrain}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Engine</span>
                    <span className="text-white font-semibold truncate block">{vehicle.engine}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Output</span>
                    <span className="text-white font-semibold">{vehicle.horsepower} HP</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Transmission</span>
                    <span className="text-white font-semibold">{vehicle.transmission}</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Fuel Economy</span>
                    <span className="text-white font-semibold tabular-nums">{vehicle.mpgCity} / {vehicle.mpgHwy} MPG</span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Exterior Color</span>
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: vehicle.exteriorColorHex }} />
                      <span className="truncate">{vehicle.exteriorColor}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#71717A] block">Interior</span>
                    <span className="text-white font-semibold truncate block">{vehicle.interiorColor}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between font-mono text-[11px]">
                    <span className="text-[#71717A]">VIN: {vehicle.vin}</span>
                    <span className="text-[#71717A]">Status: {vehicle.status}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                  <span>The Apex Buyer Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Includes 7-day or 250-mile return policy, 3-month complimentary limited powertrain protection, and 1 year of roadside concierge assistance.
                </p>
              </div>
            </div>

            {/* Interactive Live Payment Calculator */}
            <div className="p-6 rounded-3xl bg-[#12141A] border border-white/10 space-y-4">
              <h3 className="text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                Live Finance & Payment Customizer
              </h3>

              {/* Down payment slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A1A1AA]">Cash Down Payment</span>
                  <span className="text-white font-mono font-bold">${downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(30000, vehicle.price)}
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#FF8A00] cursor-pointer"
                />
              </div>

              {/* Loan Term Selection */}
              <div className="space-y-1.5">
                <span className="text-xs text-[#A1A1AA] block">Loan Term Duration</span>
                <div className="grid grid-cols-4 gap-2">
                  {[36, 48, 60, 72].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border ${
                        loanTerm === term
                          ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                          : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/10'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* APR Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A1A1AA]">Estimated APR</span>
                  <span className="text-white font-mono font-bold">{apr.toFixed(2)}%</span>
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

              <div className="p-3 bg-[#0A0B0F] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#A1A1AA]">Calculated Payment:</span>
                <span className="text-base font-bold text-[#22C55E] font-['Archivo'] tabular-nums">
                  ${estimatedMonthlyPayment} / month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CUSTOMER REVIEWS FOR THIS VEHICLE LISTING */}
        {/* ========================================================= */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                  Owner Reviews & Driver Feedback
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-[#FF8A00]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF8A00]" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white font-mono">{averageRating} out of 5</span>
                  <span className="text-xs text-[#71717A]">({vehicleReviews.length} reviews for this model)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const formEl = document.getElementById('write-review-section');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/15 self-start"
              >
                Write a Review
              </button>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {vehicleReviews.length > 0 ? (
                vehicleReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#12141A] border border-white/[0.08] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'text-[#FF8A00] fill-[#FF8A00]' : 'text-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="text-sm font-bold text-white font-['Archivo']">{rev.title}</h4>
                      </div>
                      <span className="text-xs text-[#71717A] font-mono">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#A1A1AA] leading-relaxed">{rev.comment}</p>

                    <div className="pt-2 flex items-center justify-between text-xs text-[#71717A]">
                      <span>{rev.customerName} · {rev.location}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[#22C55E] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Verified Buyer
                        </span>
                      )}
                    </div>

                    {rev.adminReply && (
                      <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-[#A1A1AA]">
                        <p className="font-semibold text-white mb-0.5">Response from {rev.adminReply.author}:</p>
                        <p className="text-[11px] leading-relaxed">{rev.adminReply.message}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] text-center text-xs text-[#A1A1AA]">
                  Be the first to leave a review for this {vehicle.year} {vehicle.make} {vehicle.model}!
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div id="write-review-section" className="p-6 rounded-3xl bg-[#12141A] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-['Archivo']">
                Review This Vehicle
              </h3>
              <p className="text-xs text-[#A1A1AA]">
                Share your ownership or test drive experience with future prospective buyers.
              </p>

              {reviewSubmittedNotice ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                  <Check className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">Thanks, your review is awaiting approval.</p>
                    <p className="text-[#A1A1AA] mt-0.5">
                      To prevent spam, dealership moderators review submissions before they appear live on listings.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1.5">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-white hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReviewRating ? 'text-[#FF8A00] fill-[#FF8A00]' : 'text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="e.g. Michael T."
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newReviewLocation}
                        onChange={(e) => setNewReviewLocation(e.target.value)}
                        placeholder="e.g. Dallas, TX"
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Incomparable performance and pristine interior"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                      Your Comments
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell us about the driving dynamics, comfort, transaction experience..."
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-md shadow-[#FF4D2E]/20"
                  >
                    Submit Review for Moderation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Vehicles Carousel */}
        {similarVehicles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight mb-8">
              Similar Vehicles in Inventory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-5xl w-full max-h-[85vh] relative flex items-center justify-center">
              <img
                src={vehicle.images[activeImageIndex]}
                alt="Fullscreen View"
                className="max-h-[85vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Action Bar (Price + Reserve + Compare) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#0A0B0F]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">Reserve Spec</span>
          <span className="text-lg font-black text-white font-['Archivo'] tabular-nums">
            ${vehicle.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (isCompared ? removeFromCompare(vehicle.id) : addToCompare(vehicle.id))}
            className={`p-2.5 rounded-xl border text-xs font-semibold ${
              isCompared
                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                : 'bg-white/5 border-white/10 text-white'
            }`}
            title="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToCart(vehicle)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-ignition shadow-lg shadow-[#FF4D2E]/25"
          >
            Reserve ($500)
          </button>
        </div>
      </div>
    </>
  );
};
