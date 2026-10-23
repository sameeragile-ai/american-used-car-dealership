import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Clock,
  User,
  Share2,
  Bookmark,
  Check,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { SmartImage } from '../components/ui/SmartImage';
import { SEO } from '../components/layout/SEO';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, showToast } = useStore();

  const post = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug);
  }, [blogPosts, slug]);

  // Reading Progress Bar State
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-sm text-[#A1A1AA] mb-8">The requested guide could not be located.</p>
        <Link
          to="/blog"
          className="px-6 py-3 rounded-xl bg-ignition text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  // Related posts in same category
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Article Link Copied',
        message: 'Direct URL copied to clipboard.',
      });
    }
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage}
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          image: [post.coverImage],
          datePublished: post.publishedAt,
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Apex Motor Co.',
          },
          description: post.excerpt,
        }}
      />

      {/* Reading Progress Bar pinned at top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/5 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#FF4D2E] via-[#FF8A00] to-[#FFC14D] transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="pt-24 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="text-xs text-[#A1A1AA] hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
            <span className="text-[#FF8A00] font-bold">{post.category}</span>
            <span>·</span>
            <span>{post.readTimeMinutes} min read</span>
            <span>·</span>
            <span>{post.publishedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Archivo'] tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Byline & Share Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#FF8A00]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{post.author}</p>
                <p className="text-xs text-[#71717A]">{post.authorRole}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-[#0A0B0F] border border-white/10 mb-12 shadow-2xl">
          <SmartImage
            src={post.coverImage}
            alt={post.title}
            aspectRatio="16/9"
            className="w-full h-full"
            priority
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[#D4D4D8] space-y-6">
          {post.body.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="text-xl sm:text-2xl font-black text-white font-['Archivo'] tracking-tight pt-6 pb-1 border-b border-white/10"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ');
              return (
                <ul key={index} className="space-y-2 pl-4 list-disc marker:text-[#FF8A00]">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-[#A1A1AA]">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\.\s/.test(paragraph)) {
              const items = paragraph.split(/\n\d+\.\s/);
              return (
                <ol key={index} className="space-y-2 pl-4 list-decimal marker:text-[#FF8A00]">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-[#A1A1AA]">
                      {item.replace(/^\d+\.\s/, '')}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={index} className="text-[#A1A1AA] leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase text-[#71717A] mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-[#12141A] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF8A00] shrink-0 border border-white/10">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-['Archivo']">
              About {post.author}
            </h4>
            <p className="text-xs text-[#FF8A00] font-mono mb-2">{post.authorRole} at Apex Motor Co.</p>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Leading technical evaluation and procurement of performance allocations across Texas. Committed to total automotive transparency, DME diagnostics, and zero-compromise mechanical standards.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <h3 className="text-2xl font-black text-white font-['Archivo'] tracking-tight mb-8">
              Related Market Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#0A0B0F]">
                    <SmartImage
                      src={rel.coverImage}
                      alt={rel.title}
                      aspectRatio="16/10"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#FF8A00]">{rel.category}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A00] transition-colors mt-1 font-['Archivo'] line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#71717A] mt-4 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span>{rel.readTimeMinutes} min read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};
