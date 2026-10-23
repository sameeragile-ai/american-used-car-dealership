import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Scale,
  X,
  Plus,
  Check,
  ShoppingBag,
  ShieldCheck,
  Fuel,
  Gauge,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { SmartImage } from '../components/ui/SmartImage';
import { SEO } from '../components/layout/SEO';

export const ComparePage: React.FC = () => {
  const { compareIds, vehicles, removeFromCompare, clearCompare, addToCart } = useStore();
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  // Retrieve full vehicle records
  const comparedCars = useMemo(() => {
    return vehicles.filter((v) => compareIds.includes(v.id));
  }, [vehicles, compareIds]);

  // Determine best values for highlighting
  const bestPrice = useMemo(() => {
    if (comparedCars.length === 0) return 0;
    return Math.min(...comparedCars.map((c) => c.price));
  }, [comparedCars]);

  const bestMileage = useMemo(() => {
    if (comparedCars.length === 0) return 0;
    return Math.min(...comparedCars.map((c) => c.mileage));
  }, [comparedCars]);

  const bestMpgHwy = useMemo(() => {
    if (comparedCars.length === 0) return 0;
    return Math.max(...comparedCars.map((c) => c.mpgHwy));
  }, [comparedCars]);

  const bestYear = useMemo(() => {
    if (comparedCars.length === 0) return 0;
    return Math.max(...comparedCars.map((c) => c.year));
  }, [comparedCars]);

  const bestHp = useMemo(() => {
    if (comparedCars.length === 0) return 0;
    return Math.max(...comparedCars.map((c) => c.horsepower));
  }, [comparedCars]);

  // Comparison Rows Definitions
  const overviewRows = [
    {
      label: 'Price (USD)',
      getter: (c: typeof comparedCars[0]) => `$${c.price.toLocaleString()}`,
      isBest: (c: typeof comparedCars[0]) => c.price === bestPrice,
      hasDiff: comparedCars.some((c) => c.price !== comparedCars[0]?.price),
    },
    {
      label: 'Model Year',
      getter: (c: typeof comparedCars[0]) => c.year.toString(),
      isBest: (c: typeof comparedCars[0]) => c.year === bestYear,
      hasDiff: comparedCars.some((c) => c.year !== comparedCars[0]?.year),
    },
    {
      label: 'Odometer Mileage',
      getter: (c: typeof comparedCars[0]) => `${c.mileage.toLocaleString()} mi`,
      isBest: (c: typeof comparedCars[0]) => c.mileage === bestMileage,
      hasDiff: comparedCars.some((c) => c.mileage !== comparedCars[0]?.mileage),
    },
    {
      label: 'Body Style',
      getter: (c: typeof comparedCars[0]) => c.bodyType,
      hasDiff: comparedCars.some((c) => c.bodyType !== comparedCars[0]?.bodyType),
    },
    {
      label: 'Certified Pre-Owned',
      getter: (c: typeof comparedCars[0]) => (c.certified ? '150-Point Certified' : 'Safety Inspected'),
      hasDiff: comparedCars.some((c) => c.certified !== comparedCars[0]?.certified),
    },
  ];

  const performanceRows = [
    {
      label: 'Engine / Powertrain',
      getter: (c: typeof comparedCars[0]) => c.engine,
      hasDiff: comparedCars.some((c) => c.engine !== comparedCars[0]?.engine),
    },
    {
      label: 'Horsepower',
      getter: (c: typeof comparedCars[0]) => `${c.horsepower} HP`,
      isBest: (c: typeof comparedCars[0]) => c.horsepower === bestHp,
      hasDiff: comparedCars.some((c) => c.horsepower !== comparedCars[0]?.horsepower),
    },
    {
      label: 'Transmission',
      getter: (c: typeof comparedCars[0]) => c.transmission,
      hasDiff: comparedCars.some((c) => c.transmission !== comparedCars[0]?.transmission),
    },
    {
      label: 'Drivetrain',
      getter: (c: typeof comparedCars[0]) => c.drivetrain,
      hasDiff: comparedCars.some((c) => c.drivetrain !== comparedCars[0]?.drivetrain),
    },
    {
      label: 'Fuel Type',
      getter: (c: typeof comparedCars[0]) => c.fuelType,
      hasDiff: comparedCars.some((c) => c.fuelType !== comparedCars[0]?.fuelType),
    },
  ];

  const efficiencyRows = [
    {
      label: 'Highway Fuel Economy',
      getter: (c: typeof comparedCars[0]) => `${c.mpgHwy} MPG`,
      isBest: (c: typeof comparedCars[0]) => c.mpgHwy === bestMpgHwy,
      hasDiff: comparedCars.some((c) => c.mpgHwy !== comparedCars[0]?.mpgHwy),
    },
    {
      label: 'City Fuel Economy',
      getter: (c: typeof comparedCars[0]) => `${c.mpgCity} MPG`,
      hasDiff: comparedCars.some((c) => c.mpgCity !== comparedCars[0]?.mpgCity),
    },
  ];

  const ownershipRows = [
    {
      label: 'Previous Owners',
      getter: (c: typeof comparedCars[0]) => `${c.history.owners} Owner(s)`,
      hasDiff: comparedCars.some((c) => c.history.owners !== comparedCars[0]?.history.owners),
    },
    {
      label: 'Accident Record',
      getter: (c: typeof comparedCars[0]) =>
        c.history.accidents === 0 ? 'Zero Accidents' : `${c.history.accidents} Reported`,
      hasDiff: comparedCars.some((c) => c.history.accidents !== comparedCars[0]?.history.accidents),
    },
    {
      label: 'Documented Services',
      getter: (c: typeof comparedCars[0]) => `${c.history.serviceRecords} Records`,
      hasDiff: comparedCars.some((c) => c.history.serviceRecords !== comparedCars[0]?.history.serviceRecords),
    },
    {
      label: 'Exterior Color',
      getter: (c: typeof comparedCars[0]) => c.exteriorColor,
      hasDiff: comparedCars.some((c) => c.exteriorColor !== comparedCars[0]?.exteriorColor),
    },
  ];

  return (
    <>
      <SEO
        title="Side-by-Side Vehicle Comparison"
        description="Compare specs, prices, mileage, horsepower, and warranty coverage side-by-side for up to 4 pre-owned vehicles."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-1">
              <Scale className="w-4 h-4" />
              <span>Multi-Vehicle Evaluation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
              Side-by-Side Comparison Grid
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Show Diff Only Switch */}
            <label className="flex items-center gap-2 text-xs text-[#A1A1AA] cursor-pointer select-none px-3 py-2 rounded-xl bg-[#12141A] border border-white/10">
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                className="rounded border-white/20 text-[#FF8A00] focus:ring-0"
              />
              <span className="text-white font-medium">Show Differences Only</span>
            </label>

            {comparedCars.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#71717A] hover:text-white bg-white/5 border border-white/10"
              >
                Clear All ({comparedCars.length})
              </button>
            )}

            <Link
              to="/inventory"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-ignition shadow-md shadow-[#FF4D2E]/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </div>

        {comparedCars.length > 0 ? (
          <div className="relative overflow-x-auto rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Sticky Top Header with Car Cards */}
              <thead>
                <tr className="border-b border-white/10 bg-[#0A0B0F]/90 backdrop-blur-md">
                  <th className="p-4 sm:p-6 w-48 sm:w-64 sticky left-0 z-20 bg-[#0A0B0F] border-r border-white/10 text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Spec Metric
                  </th>

                  {comparedCars.map((car) => (
                    <th key={car.id} className="p-4 sm:p-6 min-w-[220px] max-w-[280px] align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#12141A] border border-white/10">
                          <SmartImage
                            src={car.images[0]}
                            alt={car.model}
                            aspectRatio="16/10"
                            className="w-full h-full"
                          />
                          <button
                            onClick={() => removeFromCompare(car.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white/80 hover:text-white hover:bg-black"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#A1A1AA] uppercase font-mono">
                            {car.year} · {car.trim}
                          </span>
                          <h3 className="text-base font-bold text-white font-['Archivo'] leading-snug line-clamp-1">
                            {car.make} {car.model}
                          </h3>
                          <p className="text-lg font-black text-white font-['Archivo'] tabular-nums mt-1">
                            ${car.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/vehicle/${car.slug}`}
                            className="flex-1 py-1.5 text-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                          >
                            Spec Page
                          </Link>
                          <button
                            onClick={() => addToCart(car)}
                            className="px-3 py-1.5 rounded-lg bg-ignition text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF4D2E]/20"
                            title="Reserve"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Empty Slot if under 4 */}
                  {Array.from({ length: 4 - comparedCars.length }).map((_, i) => (
                    <th key={`slot-${i}`} className="p-6 min-w-[200px] text-center align-middle">
                      <Link
                        to="/inventory"
                        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 transition-colors text-[#71717A] hover:text-white group"
                      >
                        <Plus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Add Another Car
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body Groups */}
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {/* 1. Overview */}
                <tr className="bg-white/[0.02]">
                  <td
                    colSpan={comparedCars.length + 1 + (4 - comparedCars.length)}
                    className="p-3 px-6 text-[11px] font-mono uppercase tracking-widest text-[#FF8A00] font-bold"
                  >
                    01. Vehicle Overview & Pricing
                  </td>
                </tr>
                {overviewRows
                  .filter((row) => !showDiffOnly || row.hasDiff)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#A1A1AA] sticky left-0 z-10 bg-[#12141A] border-r border-white/10">
                        {row.label}
                      </td>
                      {comparedCars.map((car) => {
                        const val = row.getter(car);
                        const isTop = row.isBest ? row.isBest(car) : false;
                        return (
                          <td key={car.id} className="p-4 sm:p-5">
                            <span
                              className={`tabular-nums ${
                                isTop
                                  ? 'text-[#FF8A00] font-bold text-sm bg-[#FF8A00]/10 px-2.5 py-1 rounded-md border border-[#FF8A00]/30 inline-block'
                                  : 'text-white'
                              }`}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedCars.length }).map((_, i) => (
                        <td key={`empty-td-${i}`} className="p-4 sm:p-5 text-[#71717A] text-center">
                          —
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* 2. Performance */}
                <tr className="bg-white/[0.02]">
                  <td
                    colSpan={comparedCars.length + 1 + (4 - comparedCars.length)}
                    className="p-3 px-6 text-[11px] font-mono uppercase tracking-widest text-[#3B82F6] font-bold"
                  >
                    02. Performance & Powertrain
                  </td>
                </tr>
                {performanceRows
                  .filter((row) => !showDiffOnly || row.hasDiff)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#A1A1AA] sticky left-0 z-10 bg-[#12141A] border-r border-white/10">
                        {row.label}
                      </td>
                      {comparedCars.map((car) => {
                        const val = row.getter(car);
                        const isTop = row.isBest ? row.isBest(car) : false;
                        return (
                          <td key={car.id} className="p-4 sm:p-5">
                            <span
                              className={`tabular-nums ${
                                isTop
                                  ? 'text-[#FF8A00] font-bold text-sm bg-[#FF8A00]/10 px-2.5 py-1 rounded-md border border-[#FF8A00]/30 inline-block'
                                  : 'text-white'
                              }`}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedCars.length }).map((_, i) => (
                        <td key={`empty-td-perf-${i}`} className="p-4 sm:p-5 text-[#71717A] text-center">
                          —
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* 3. Efficiency */}
                <tr className="bg-white/[0.02]">
                  <td
                    colSpan={comparedCars.length + 1 + (4 - comparedCars.length)}
                    className="p-3 px-6 text-[11px] font-mono uppercase tracking-widest text-[#22C55E] font-bold"
                  >
                    03. Efficiency & Economy
                  </td>
                </tr>
                {efficiencyRows
                  .filter((row) => !showDiffOnly || row.hasDiff)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#A1A1AA] sticky left-0 z-10 bg-[#12141A] border-r border-white/10">
                        {row.label}
                      </td>
                      {comparedCars.map((car) => {
                        const val = row.getter(car);
                        const isTop = row.isBest ? row.isBest(car) : false;
                        return (
                          <td key={car.id} className="p-4 sm:p-5">
                            <span
                              className={`tabular-nums ${
                                isTop
                                  ? 'text-[#22C55E] font-bold text-sm bg-[#22C55E]/10 px-2.5 py-1 rounded-md border border-[#22C55E]/30 inline-block'
                                  : 'text-white'
                              }`}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: 4 - comparedCars.length }).map((_, i) => (
                        <td key={`empty-td-eff-${i}`} className="p-4 sm:p-5 text-[#71717A] text-center">
                          —
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* 4. Ownership & CARFAX */}
                <tr className="bg-white/[0.02]">
                  <td
                    colSpan={comparedCars.length + 1 + (4 - comparedCars.length)}
                    className="p-3 px-6 text-[11px] font-mono uppercase tracking-widest text-[#A1A1AA] font-bold"
                  >
                    04. Vehicle History & Ownership
                  </td>
                </tr>
                {ownershipRows
                  .filter((row) => !showDiffOnly || row.hasDiff)
                  .map((row) => (
                    <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#A1A1AA] sticky left-0 z-10 bg-[#12141A] border-r border-white/10">
                        {row.label}
                      </td>
                      {comparedCars.map((car) => (
                        <td key={car.id} className="p-4 sm:p-5 text-white">
                          {row.getter(car)}
                        </td>
                      ))}
                      {Array.from({ length: 4 - comparedCars.length }).map((_, i) => (
                        <td key={`empty-td-own-${i}`} className="p-4 sm:p-5 text-[#71717A] text-center">
                          —
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-[#12141A] border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 text-[#71717A] mx-auto flex items-center justify-center">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Archivo']">
              Your Comparison Matrix is Empty
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
              Select "Compare" on any vehicle card in our inventory to evaluate up to 4 models side-by-side on pricing, horsepower, MPG, and provenance.
            </p>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ignition text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D2E]/25"
            >
              <span>Explore Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
