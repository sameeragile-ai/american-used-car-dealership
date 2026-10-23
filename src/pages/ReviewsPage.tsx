import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, Check, ShieldCheck, Filter, MessageSquare, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SEO } from '../components/layout/SEO';

export const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useStore();

  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('Dallas, TX');
  const [newComment, setNewComment] = useState('');
  const [newSalesperson, setNewSalesperson] = useState('Marcus Vance');
  const [submitted, setSubmitted] = useState(false);

  // Filter approved reviews only
  const approvedReviews = useMemo(() => {
    return reviews.filter((r) => r.status === 'approved');
  }, [reviews]);

  // Overall average
  const averageRating = useMemo(() => {
    if (approvedReviews.length === 0) return '5.0';
    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / approvedReviews.length).toFixed(1);
  }, [approvedReviews]);

  // Rating breakdown counts (5, 4, 3, 2, 1)
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star]++;
    });
    return counts;
  }, [approvedReviews]);

  // Filtered displayed list
  const displayedReviews = useMemo(() => {
    if (selectedStarFilter === null) return approvedReviews;
    return approvedReviews.filter((r) => Math.round(r.rating) === selectedStarFilter);
  }, [approvedReviews, selectedStarFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newName || !newComment) return;

    addReview({
      customerName: newName,
      location: newLocation,
      rating: newRating,
      title: newTitle,
      comment: newComment,
      verifiedPurchase: true,
      salesperson: newSalesperson,
    });

    setSubmitted(true);
    setNewTitle('');
    setNewComment('');
  };

  return (
    <>
      <SEO
        title="Verified Client Reviews & Testimonials"
        description="Read transparent reviews from real Dallas-Fort Worth buyers. 4.9 average rating across 40+ verified luxury and performance vehicle transactions."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF8A00] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Verified Buyer Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Archivo'] tracking-tight">
            Client Testimonials & Ratings
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
            Real experiences from North Texas motorists who experienced our transparent, zero-pressure buying and home delivery process.
          </p>
        </div>

        {/* Rating Breakdown Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Average Score (4 cols) */}
          <div className="md:col-span-4 text-center md:border-r border-white/10 md:pr-8 space-y-2">
            <span className="text-5xl sm:text-6xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-1 text-[#FF8A00]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FF8A00]" />
              ))}
            </div>
            <p className="text-xs text-[#A1A1AA] font-mono">
              Based on {approvedReviews.length} verified client reviews
            </p>
          </div>

          {/* Breakdown Bars (8 cols) */}
          <div className="md:col-span-8 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star as keyof typeof ratingCounts] || 0;
              const percentage = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;

              return (
                <button
                  key={star}
                  onClick={() =>
                    setSelectedStarFilter(selectedStarFilter === star ? null : star)
                  }
                  className={`w-full flex items-center gap-3 text-xs group text-left p-1 rounded-lg transition-colors ${
                    selectedStarFilter === star ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="w-12 text-[#A1A1AA] flex items-center gap-1 font-mono">
                    <span>{star}</span>
                    <Star className="w-3 h-3 text-[#FF8A00] fill-[#FF8A00]" />
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-[#0A0B0F] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4D2E] to-[#FF8A00] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-white font-mono tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: Reviews Feed (8 cols) & Submit Form (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reviews List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white font-['Archivo']">
                {selectedStarFilter ? `${selectedStarFilter}-Star Reviews` : 'All Client Reviews'} (
                {displayedReviews.length})
              </h2>

              {selectedStarFilter && (
                <button
                  onClick={() => setSelectedStarFilter(null)}
                  className="text-xs text-[#FF8A00] hover:underline"
                >
                  Show All Stars
                </button>
              )}
            </div>

            <div className="space-y-4">
              {displayedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-[#12141A] border border-white/[0.08] space-y-4 hover:border-white/15 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating ? 'text-[#FF8A00] fill-[#FF8A00]' : 'text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <h3 className="text-base font-bold text-white font-['Archivo']">
                        "{rev.title}"
                      </h3>
                    </div>
                    <span className="text-xs text-[#71717A] font-mono shrink-0">{rev.date}</span>
                  </div>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">{rev.comment}</p>

                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{rev.customerName}</span>
                      <span className="text-[#71717A]">· {rev.location}</span>
                      {rev.salesperson && (
                        <span className="text-[11px] text-[#71717A]">
                          (Assisted by {rev.salesperson})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {rev.vehicleName && (
                        <span className="text-[10px] text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                          {rev.vehicleName}
                        </span>
                      )}
                      {rev.verifiedPurchase && (
                        <span className="text-[#22C55E] text-[11px] flex items-center gap-1 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.adminReply && (
                    <div className="mt-3 p-4 rounded-xl bg-[#0A0B0F] border border-white/5 text-xs text-[#A1A1AA] space-y-1">
                      <p className="font-semibold text-white flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF8A00]" />
                        <span>Response from {rev.adminReply.author}:</span>
                      </p>
                      <p className="text-[11px] leading-relaxed text-[#A1A1AA]">
                        {rev.adminReply.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leave a Review Sidebar Card */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6 lg:sticky lg:top-24">
            <div>
              <h3 className="text-lg font-bold text-white font-['Archivo']">
                Submit Your Experience
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Your feedback helps fellow motorists make informed decisions.
              </p>
            </div>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <p className="font-bold text-sm">Thanks, your review is awaiting approval!</p>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Our dealership moderator will verify your submission before publishing it to the site.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#FF8A00] underline"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'text-[#FF8A00] fill-[#FF8A00]' : 'text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. William H."
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    City / Metro
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Plano, TX"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Client Advisor Assisted By
                  </label>
                  <select
                    value={newSalesperson}
                    onChange={(e) => setNewSalesperson(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option>Marcus Vance</option>
                    <option>Sarah Chen</option>
                    <option>Derrick Hayes</option>
                    <option>Online Concierge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Flawless home delivery and honest pricing"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Review Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share specific details about the condition, inspection, or delivery..."
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-md shadow-[#FF4D2E]/20"
                >
                  Submit Review for Approval
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
