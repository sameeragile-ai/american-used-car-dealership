import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SmartImage } from '../components/ui/SmartImage';
import { SEO } from '../components/layout/SEO';
import { BlogCategory } from '../types/blog';

export const BlogPage: React.FC = () => {
  const { blogPosts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedPosts = useMemo(() => {
    return blogPosts.filter((p) => p.status === 'published');
  }, [blogPosts]);

  const categories: ('all' | BlogCategory)[] = [
    'all',
    'Buying Tips',
    'Market Trends',
    'Financing',
    'Dealership News',
    'Maintenance',
  ];

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return publishedPosts;
    return publishedPosts.filter((p) => p.category === selectedCategory);
  }, [publishedPosts, selectedCategory]);

  const featuredPost = publishedPosts[0];
  const regularPosts = selectedCategory === 'all' ? filteredPosts.slice(1) : filteredPosts;

  return (
    <>
      <SEO
        title="Automotive Market Insights & Buying Guides"
        description="Expert guides on pre-owned performance vehicles, 150-point inspection checklists, financing strategies, and Texas automotive market analysis."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF8A00] mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Apex Automotive Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Archivo'] tracking-tight">
            Market Guides & Technical Insights
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
            Unbiased market valuation analyses, powertrain maintenance protocols, and buyer advice written by certified automotive specialists.
          </p>
        </div>

        {/* Category Filter Pills / Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-ignition text-white border-transparent shadow-md shadow-[#FF4D2E]/25'
                  : 'bg-[#12141A] text-[#A1A1AA] border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Featured Post Card (Shown when 'all' is selected) */}
        {selectedCategory === 'all' && featuredPost && (
          <div className="mb-14">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group rounded-3xl bg-[#12141A] border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-white/25 transition-all shadow-2xl"
            >
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-[#0A0B0F]">
                <SmartImage
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  aspectRatio="16/10"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-3">
                    <span className="text-[#FF8A00] font-bold">{featuredPost.category}</span>
                    <span>·</span>
                    <span>{featuredPost.readTimeMinutes} min read</span>
                    <span>·</span>
                    <span>Featured Insight</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#FF8A00] transition-colors font-['Archivo'] tracking-tight leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#A1A1AA] mt-3 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#71717A]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF8A00]" />
                    <span className="text-white font-medium">{featuredPost.author}</span>
                    <span>· {featuredPost.authorRole}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[#FF8A00] font-bold">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
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

                  <p className="text-xs text-[#A1A1AA] mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#71717A]">
                  <span>{post.author}</span>
                  <span className="flex items-center gap-1 text-white group-hover:text-[#FF8A00] font-semibold transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
