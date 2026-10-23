import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { SEO } from '../components/layout/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="Page Not Found" description="The requested route does not exist." />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center select-none pt-20">
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl font-black text-white/5 font-['Archivo'] tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-ignition flex items-center justify-center text-white shadow-2xl shadow-[#FF4D2E]/40">
              <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
          Route Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mt-2 mb-8 leading-relaxed">
          The road ends here. The vehicle or page you are looking for has been moved, reconditioned, or already driven home.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/inventory"
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>Browse Active Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="px-6 py-3.5 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};
