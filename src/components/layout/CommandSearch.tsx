import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Car, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SmartImage } from '../ui/SmartImage';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { vehicles } = useStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Can be toggled externally
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles.slice(0, 4); // Show first 4 recommended when empty

    return vehicles
      .filter((v) => {
        const fullString = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.bodyType} ${v.fuelType} ${v.exteriorColor} ${v.features.join(' ')}`.toLowerCase();
        return fullString.includes(q);
      })
      .slice(0, 6);
  }, [vehicles, query]);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/vehicle/${slug}`);
  };

  const handleSearchInventory = () => {
    onClose();
    navigate(`/inventory?search=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#12141A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10">
            <Search className="w-5 h-5 text-[#A1A1AA] mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleSearchInventory();
                }
              }}
              placeholder="Search make, model, body type (e.g., Porsche, SUV, Electric)..."
              className="w-full bg-transparent text-white placeholder-[#71717A] text-base focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#A1A1AA] hover:text-white mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[#71717A] bg-white/5 rounded border border-white/10 font-mono">
              ESC
            </kbd>
          </div>

          {/* Quick Filters / Results */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="text-xs uppercase tracking-wider text-[#71717A] font-semibold mb-3 px-2 flex justify-between">
              <span>{query ? 'Vehicles Found' : 'Featured Inventory'}</span>
              <span>{results.length} results</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {results.length > 0 ? (
                results.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleSelect(car.slug)}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <SmartImage
                        src={car.images[0]}
                        alt={car.model}
                        aspectRatio="16/10"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-[#FF8A00] transition-colors truncate">
                        {car.year} {car.make} {car.model} {car.trim}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mt-0.5">
                        <span>{car.mileage.toLocaleString()} mi</span>
                        <span>·</span>
                        <span>{car.drivetrain}</span>
                        <span>·</span>
                        <span className="text-[#3B82F6]">{car.certified ? 'Certified' : 'Inspected'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white tabular-nums">
                        ${car.price.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#A1A1AA] tabular-nums">
                        ${Math.round(car.price / 60)}/mo
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <Car className="w-10 h-10 text-[#71717A] mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-white font-medium">No matching vehicles found</p>
                  <p className="text-xs text-[#71717A] mt-1">
                    Try searching for Toyota, BMW, Electric, SUV, or a broader keyword.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-[#0A0B0F] border-t border-white/10 flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Press Enter to view all filtered inventory</span>
            <button
              onClick={handleSearchInventory}
              className="flex items-center gap-1.5 text-[#FF8A00] hover:text-[#FFC14D] font-semibold transition-colors"
            >
              <span>Explore All Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
