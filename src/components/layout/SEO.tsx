import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEALERSHIP } from '../../config/dealership';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "Dallas' premier pre-owned luxury and performance vehicle dealership. 150-point certified inspection, 7-day returns, transparent pricing.",
  image = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  url,
  type = 'website',
  structuredData,
}) => {
  const fullTitle = title
    ? `${title} | ${DEALERSHIP.name}`
    : `${DEALERSHIP.name} — ${DEALERSHIP.tagline}`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : (url || 'https://apexmotor.com');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={DEALERSHIP.name} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
