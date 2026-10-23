import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SmartImage } from '../ui/SmartImage';

export const CompareTray: React.FC = () => {
  const location = useLocation();
  const { compareIds, vehicles, removeFromCompare, clearCompare } = useStore();

  // If already on /compare page or no items, hide the floating tray
  if (compareIds.length === 0 || location.pathname === '/compare') {
    return null;
  }

  const comparedVehicles = vehicles.filter((v) => compareIds.includes(v.id));

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Vehicle comparison tray"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-[#12141A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 sm:p-4 text-white"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Header info */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30">
              <Scale className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Compare Grid</p>
              <p className="text-[11px] text-[#A1A1AA]">{comparedVehicles.length} of 4 vehicles selected</p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {comparedVehicles.map((car) => (
              <div
                key={car.id}
                className="relative group w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#0A0B0F]"
              >
                <SmartImage
                  src={car.images[0]}
                  alt={car.model}
                  aspectRatio="16/10"
                  className="w-full h-full"
                />
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            ))}

            {/* Empty Slots up to 4 */}
            {Array.from({ length: 4 - comparedVehicles.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg border border-dashed border-white/15 flex items-center justify-center text-[10px] text-[#71717A] shrink-0"
              >
                +Slot
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearCompare}
              className="hidden md:inline-block text-xs text-[#71717A] hover:text-white px-2 py-1"
            >
              Clear
            </button>

            <Link
              to="/compare"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#3B82F6] hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all whitespace-nowrap"
            >
              <span>Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
