import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { SpeedometerLoader } from './components/ui/SpeedometerLoader';
import { CompareTray } from './components/vehicle/CompareTray';
import { CartDrawer } from './components/cart/CartDrawer';
import { TestDriveModal } from './components/modals/TestDriveModal';
import { PreApprovalModal } from './components/modals/PreApprovalModal';
import { useStore } from './store/useStore';

// Code-split pages for performance
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const InventoryPage = lazy(() =>
  import('./pages/InventoryPage').then((m) => ({ default: m.InventoryPage }))
);
const VehicleDetailPage = lazy(() =>
  import('./pages/VehicleDetailPage').then((m) => ({ default: m.VehicleDetailPage }))
);
const ComparePage = lazy(() =>
  import('./pages/ComparePage').then((m) => ({ default: m.ComparePage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const ReviewsPage = lazy(() =>
  import('./pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage }))
);
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage }))
);
const FinancingPage = lazy(() =>
  import('./pages/FinancingPage').then((m) => ({ default: m.FinancingPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Route scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

// Route Suspense Fallback
const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF8A00] border-t-transparent animate-spin" />
      <span className="text-xs font-mono uppercase tracking-widest text-[#71717A]">
        Loading Apex Showroom...
      </span>
    </div>
  </div>
);

export default function App() {
  const { theme } = useStore();

  // Sync html element class with theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SpeedometerLoader />

        <div className="min-h-screen flex flex-col bg-[#0A0B0F] text-[#F4F4F5] selection:bg-[#FF4D2E] selection:text-white transition-colors duration-200">
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/vehicle/:slug" element={<VehicleDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/financing" element={<FinancingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {/* Global Floating Affordances & Drawers */}
          <CompareTray />
          <CartDrawer />
          <TestDriveModal />
          <PreApprovalModal />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
