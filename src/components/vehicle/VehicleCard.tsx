import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Scale, ShieldCheck, Gauge, Fuel, Zap } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { useStore } from '../../store/useStore';
import { SmartImage } from '../ui/SmartImage';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  viewMode = 'grid',
}) => {
  const {
    compareIds,
    addToCompare,
    removeFromCompare,
    favoriteIds,
    toggleFavorite,
    addToCart,
  } = useStore();

  const isCompared = compareIds.includes(vehicle.id);
  const isFavorite = favoriteIds.includes(vehicle.id);
  const estMonthly = Math.round(vehicle.price / 60);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(vehicle.id);
    } else {
      addToCompare(vehicle.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id);
  };

  const handleReserveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(vehicle);
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Image Column */}
        <Link
          to={`/vehicle/${vehicle.slug}`}
          className="relative md:w-80 shrink-0 overflow-hidden bg-[#0A0B0F]"
        >
          <SmartImage
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            aspectRatio="16/10"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            fallbackTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
          {vehicle.certified && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#3B82F6] text-xs font-semibold border border-[#3B82F6]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified</span>
            </div>
          )}
        </Link>

        {/* Content Column */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-mono">
                  {vehicle.bodyType} · Stock #{vehicle.stockNumber}
                </span>
                <Link to={`/vehicle/${vehicle.slug}`}>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FF8A00] transition-colors mt-0.5 tracking-tight font-['Archivo']">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                </Link>
                <p className="text-sm text-[#A1A1AA] mt-0.5">{vehicle.trim}</p>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-2xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
                  ${vehicle.price.toLocaleString()}
                </span>
                <p className="text-xs text-[#A1A1AA] tabular-nums">
                  est. ${estMonthly}/mo · 60mo
                </p>
              </div>
            </div>

            {/* Spec Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/[0.08] text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#FF8A00]" />
                <span>{vehicle.mileage.toLocaleString()} miles</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-[#FF8A00]" />
                <span>{vehicle.engine}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF8A00]" />
                <span>{vehicle.horsepower} HP · {vehicle.drivetrain}</span>
              </div>
              <div>
                <span>{vehicle.mpgCity} City / {vehicle.mpgHwy} Hwy MPG</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCompareClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isCompared
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Compared' : 'Compare'}</span>
              </button>

              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  isFavorite
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
                aria-label="Save vehicle"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/vehicle/${vehicle.slug}`}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                View Details
              </Link>
              <button
                onClick={handleReserveClick}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-ignition hover:opacity-90 shadow-md shadow-[#FF4D2E]/20 transition-all"
              >
                Reserve ($500)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode (Default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl bg-[#12141A] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0B0F]">
        <Link to={`/vehicle/${vehicle.slug}`}>
          <SmartImage
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            aspectRatio="16/10"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            fallbackTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
        </Link>

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-black/40 pointer-events-none" />

        {/* Status / Certified Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {vehicle.certified && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#3B82F6] text-[11px] font-semibold border border-[#3B82F6]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified 150-Pt</span>
            </div>
          )}
          {vehicle.status === 'Reserved' && (
            <div className="px-2.5 py-1 rounded-md bg-amber-500/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
              Reserved
            </div>
          )}
        </div>

        {/* Floating Quick Action Overlay Buttons (Slide in on hover) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 transform sm:translate-y-1 group-hover:translate-y-0">
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isCompared
                ? 'bg-[#3B82F6] text-white'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
            title={isFavorite ? 'Remove from Saved' : 'Save Vehicle'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA] uppercase tracking-wider font-mono">
            <span>{vehicle.bodyType}</span>
            <span>·</span>
            <span>{vehicle.fuelType}</span>
            <span>·</span>
            <span>{vehicle.drivetrain}</span>
          </div>

          {/* Title */}
          <Link to={`/vehicle/${vehicle.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A00] transition-colors mt-1 tracking-tight font-['Archivo'] line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </Link>
          <p className="text-xs text-[#A1A1AA] truncate mt-0.5">{vehicle.trim}</p>

          {/* Quick specs strip */}
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] mt-4 pt-3 border-t border-white/[0.08]">
            <span className="tabular-nums font-medium">{vehicle.mileage.toLocaleString()} mi</span>
            <span>·</span>
            <span className="truncate max-w-[120px]">{vehicle.engine}</span>
            <span>·</span>
            <span className="tabular-nums">{vehicle.mpgHwy} Hwy MPG</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-white font-['Archivo'] tabular-nums tracking-tight">
              ${vehicle.price.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#A1A1AA] tabular-nums">
              est. ${estMonthly}/mo
            </div>
          </div>

          <Link
            to={`/vehicle/${vehicle.slug}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            View Spec
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
