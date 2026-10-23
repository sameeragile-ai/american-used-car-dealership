import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { SEO } from '../components/layout/SEO';

export const InventoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { vehicles, favoriteIds } = useStore();

  // Mobile Filter Drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial skeleton pulse simulation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Filter States synced from URL
  const search = searchParams.get('search') || '';
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const bodyType = searchParams.get('bodyType') || '';
  const fuelType = searchParams.get('fuelType') || '';
  const transmission = searchParams.get('transmission') || '';
  const drivetrain = searchParams.get('drivetrain') || '';
  const certifiedOnly = searchParams.get('certified') === 'true';
  const savedOnly = searchParams.get('saved') === 'true';
  const minPrice = Number(searchParams.get('minPrice')) || 10000;
  const maxPrice = Number(searchParams.get('maxPrice')) || 75000;
  const minYear = Number(searchParams.get('minYear')) || 2017;
  const maxYear = Number(searchParams.get('maxYear')) || 2024;
  const maxMileage = Number(searchParams.get('maxMileage')) || 100000;
  const selectedColor = searchParams.get('color') || '';
  const selectedFeatures = searchParams.getAll('feature');
  const sort = searchParams.get('sort') || 'price-asc';
  const viewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';

  // Helper to update URL params
  const updateParams = (updates: Record<string, string | string[] | null | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        nextParams.delete(key);
      } else if (Array.isArray(val)) {
        nextParams.delete(key);
        val.forEach((item) => nextParams.append(key, item));
      } else {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Distinct Options
  const allMakes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))).sort(), [vehicles]);
  const modelsForMake = useMemo(() => {
    if (!make) return [];
    return Array.from(new Set(vehicles.filter((v) => v.make === make).map((v) => v.model))).sort();
  }, [vehicles, make]);

  const bodyTypes = ['SUV', 'Sedan', 'Truck', 'Coupe', 'EV', 'Luxury'];
  const fuelTypes = ['Gasoline', 'Hybrid', 'Electric', 'Plug-in Hybrid'];
  const drivetrains = ['AWD', 'FWD', 'RWD', '4WD'];

  const allFeaturesList = [
    'Sunroof',
    'Panoramic Sunroof',
    'Leather',
    'Heated Seats',
    'Ventilated Seats',
    'Apple CarPlay',
    'Adaptive Cruise',
    '360 Camera',
    'Head-Up Display',
    'Premium Audio',
    'Third Row',
    'Tow Package',
  ];

  const colorSwatches = [
    { label: 'Black', hex: '#0F172A' },
    { label: 'White', hex: '#F8FAFC' },
    { label: 'Grey', hex: '#4B5563' },
    { label: 'Blue', hex: '#1E3A8A' },
    { label: 'Red', hex: '#DC2626' },
    { label: 'Green', hex: '#14532D' },
  ];

  // Filtering Logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (savedOnly && !favoriteIds.includes(v.id)) return false;
        if (certifiedOnly && !v.certified) return false;
        if (make && v.make.toLowerCase() !== make.toLowerCase()) return false;
        if (model && v.model.toLowerCase() !== model.toLowerCase()) return false;
        if (bodyType && v.bodyType.toLowerCase() !== bodyType.toLowerCase()) return false;
        if (fuelType && v.fuelType.toLowerCase() !== fuelType.toLowerCase()) return false;
        if (transmission && v.transmission.toLowerCase() !== transmission.toLowerCase()) return false;
        if (drivetrain && v.drivetrain.toLowerCase() !== drivetrain.toLowerCase()) return false;
        if (v.price < minPrice || v.price > maxPrice) return false;
        if (v.year < minYear || v.year > maxYear) return false;
        if (v.mileage > maxMileage) return false;

        if (selectedColor) {
          const cName = v.exteriorColor.toLowerCase();
          if (!cName.includes(selectedColor.toLowerCase())) return false;
        }

        if (selectedFeatures.length > 0) {
          const carFeaturesLower = v.features.map((f) => f.toLowerCase());
          const hasAllFeatures = selectedFeatures.every((f) =>
            carFeaturesLower.some((cf) => cf.includes(f.toLowerCase()))
          );
          if (!hasAllFeatures) return false;
        }

        if (search) {
          const q = search.toLowerCase();
          const target = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.bodyType} ${v.fuelType} ${v.features.join(' ')}`.toLowerCase();
          if (!target.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'year-desc') return b.year - a.year;
        if (sort === 'mileage-asc') return a.mileage - b.mileage;
        if (sort === 'rating-desc') return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [
    vehicles,
    savedOnly,
    favoriteIds,
    certifiedOnly,
    make,
    model,
    bodyType,
    fuelType,
    transmission,
    drivetrain,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    selectedColor,
    selectedFeatures,
    search,
    sort,
  ]);

  // Active filter count
  const activeFiltersCount = [
    make,
    model,
    bodyType,
    fuelType,
    transmission,
    drivetrain,
    certifiedOnly ? 'certified' : '',
    savedOnly ? 'saved' : '',
    selectedColor,
    search,
    maxPrice < 75000 ? 'maxPrice' : '',
    minYear > 2017 ? 'minYear' : '',
    maxMileage < 100000 ? 'maxMileage' : '',
    ...selectedFeatures,
  ].filter(Boolean).length;

  // Toggle a feature in feature list
  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      updateParams({ feature: selectedFeatures.filter((f) => f !== feat) });
    } else {
      updateParams({ feature: [...selectedFeatures, feat] });
    }
  };

  return (
    <>
      <SEO
        title="Certified Pre-Owned Inventory"
        description="Search our inventory of certified pre-owned Porsche, BMW, Mercedes, Audi, Lexus, Tesla, and trucks in Dallas TX. 150-point inspection and 7-day returns."
      />

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A1A1AA] mb-1">
              <span>Dallas Showroom</span>
              <span>·</span>
              <span className="text-[#3B82F6] font-semibold">150-Point Certified</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Archivo'] tracking-tight">
              Pre-Owned Vehicle Inventory
            </h1>
          </div>

          {/* Quick Stats or Saved Count */}
          <div className="flex items-center gap-2">
            {savedOnly && (
              <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                Viewing Saved Vehicles ({filteredVehicles.length})
              </span>
            )}
            <span className="text-xs text-[#A1A1AA] font-mono">
              Showing <span className="text-white font-bold">{filteredVehicles.length}</span> of {vehicles.length} units
            </span>
          </div>
        </div>

        {/* Toolbar: Search, View Mode, Sort, Mobile Filter Button */}
        <div className="p-4 rounded-2xl bg-[#12141A] border border-white/10 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParams({ search: e.target.value })}
              placeholder="Search by make, model, trim, or feature (e.g., M340i, Sunroof)..."
              className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
            />
            {search && (
              <button
                onClick={() => updateParams({ search: '' })}
                className="absolute right-3 top-2.5 text-[#71717A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10"
            >
              <Filter className="w-4 h-4 text-[#FF8A00]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF4D2E] text-white text-[10px] font-mono flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A1A1AA] whitespace-nowrap hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>

            {/* Grid / List Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0A0B0F] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => updateParams({ view: 'grid' })}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-[#71717A] hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateParams({ view: 'list' })}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white/15 text-white' : 'text-[#71717A] hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#A1A1AA] font-mono uppercase tracking-wider text-[11px] mr-1">
              Active Filters:
            </span>

            {make && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Make: {make}</span>
                <button onClick={() => updateParams({ make: '', model: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {model && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Model: {model}</span>
                <button onClick={() => updateParams({ model: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {bodyType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Body: {bodyType}</span>
                <button onClick={() => updateParams({ bodyType: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {fuelType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Fuel: {fuelType}</span>
                <button onClick={() => updateParams({ fuelType: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {drivetrain && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Drivetrain: {drivetrain}</span>
                <button onClick={() => updateParams({ drivetrain: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {certifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6]">
                <span>Certified Only</span>
                <button onClick={() => updateParams({ certified: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {savedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400">
                <span>Saved Only</span>
                <button onClick={() => updateParams({ saved: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxPrice < 75000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Under ${maxPrice.toLocaleString()}</span>
                <button onClick={() => updateParams({ maxPrice: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxMileage < 100000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Under {maxMileage.toLocaleString()} mi</span>
                <button onClick={() => updateParams({ maxMileage: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedColor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                <span>Color: {selectedColor}</span>
                <button onClick={() => updateParams({ color: '' })} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFeatures.map((feat) => (
              <span
                key={feat}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                <span>{feat}</span>
                <button onClick={() => toggleFeature(feat)} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-[#FF8A00] hover:text-[#FFC14D] font-bold text-xs underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 2-Column Layout: Sticky Sidebar (Desktop) + Vehicle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FF8A00]" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Filters
                  </span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#71717A] hover:text-white"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Certified Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Certified 150-Pt</span>
                  <span className="text-[11px] text-[#A1A1AA]">Factory & multi-point tested</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateParams({ certified: certifiedOnly ? '' : 'true' })}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    certifiedOnly ? 'bg-[#3B82F6]' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      certifiedOnly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Make & Model */}
              <div className="space-y-3">
                <label className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Make & Model
                </label>
                <select
                  value={make}
                  onChange={(e) => updateParams({ make: e.target.value, model: '' })}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                >
                  <option value="">All Makes</option>
                  {allMakes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {make && (
                  <select
                    value={model}
                    onChange={(e) => updateParams({ model: e.target.value })}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="">All Models for {make}</option>
                    {modelsForMake.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="uppercase font-bold tracking-wider text-[#A1A1AA]">Max Price</span>
                  <span className="text-white font-mono font-bold">${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="75000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value })}
                  className="w-full accent-[#FF8A00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
                  <span>$15,000</span>
                  <span>$75,000+</span>
                </div>
              </div>

              {/* Mileage Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="uppercase font-bold tracking-wider text-[#A1A1AA]">Max Mileage</span>
                  <span className="text-white font-mono font-bold">{maxMileage.toLocaleString()} mi</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={maxMileage}
                  onChange={(e) => updateParams({ maxMileage: e.target.value })}
                  className="w-full accent-[#FF8A00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#71717A] font-mono">
                  <span>10,000 mi</span>
                  <span>100,000 mi</span>
                </div>
              </div>

              {/* Body Type Filter */}
              <div className="space-y-2">
                <span className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Body Style
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {bodyTypes.map((b) => {
                    const isSelected = bodyType.toLowerCase() === b.toLowerCase();
                    return (
                      <button
                        key={b}
                        onClick={() => updateParams({ bodyType: isSelected ? '' : b })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors border ${
                          isSelected
                            ? 'bg-white/10 text-white border-[#FF8A00]'
                            : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/5 hover:border-white/15'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <span className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Powertrain / Fuel
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {fuelTypes.map((f) => {
                    const isSelected = fuelType.toLowerCase() === f.toLowerCase();
                    return (
                      <button
                        key={f}
                        onClick={() => updateParams({ fuelType: isSelected ? '' : f })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors border ${
                          isSelected
                            ? 'bg-white/10 text-white border-[#FF8A00]'
                            : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/5 hover:border-white/15'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drivetrain */}
              <div className="space-y-2">
                <span className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Drivetrain
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {drivetrains.map((d) => {
                    const isSelected = drivetrain.toLowerCase() === d.toLowerCase();
                    return (
                      <button
                        key={d}
                        onClick={() => updateParams({ drivetrain: isSelected ? '' : d })}
                        className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border ${
                          isSelected
                            ? 'bg-white/10 text-white border-[#FF8A00]'
                            : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/5 hover:border-white/15'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exterior Color Swatches */}
              <div className="space-y-2">
                <span className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Exterior Color
                </span>
                <div className="flex items-center gap-2">
                  {colorSwatches.map((color) => {
                    const isSelected = selectedColor.toLowerCase() === color.label.toLowerCase();
                    return (
                      <button
                        key={color.label}
                        onClick={() => updateParams({ color: isSelected ? '' : color.label })}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          isSelected ? 'scale-110 border-[#FF8A00]' : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Must-Have Features */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="block text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Key Features
                </span>
                <div className="space-y-1.5">
                  {allFeaturesList.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <label
                        key={feat}
                        className="flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-white cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFeature(feat)}
                          className="rounded border-white/20 text-[#FF8A00] focus:ring-0"
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results Column */}
          <main className="lg:col-span-3">
            {isLoading ? (
              /* Skeleton Loader */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#12141A] border border-white/10 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-white/5" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                      <div className="h-6 bg-white/10 rounded w-4/5" />
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                      <div className="h-8 bg-white/5 rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                <AnimatePresence>
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <div className="p-12 rounded-3xl bg-[#12141A] border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 text-[#71717A] mx-auto flex items-center justify-center">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Archivo']">
                  No matching vehicles found
                </h3>
                <p className="text-xs text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                  We could not find any vehicles matching all selected criteria. Try adjusting your price range, clearing body style filters, or broadening your search keywords.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-md shadow-[#FF4D2E]/20"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-[#12141A] border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FF8A00]" />
                  <span className="text-base font-bold text-white font-['Archivo']">
                    Filter Inventory
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="p-5 overflow-y-auto space-y-6 flex-1">
                {/* Make selector */}
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Make</label>
                  <select
                    value={make}
                    onChange={(e) => updateParams({ make: e.target.value, model: '' })}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">All Makes</option>
                    {allMakes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Body Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {bodyTypes.map((b) => (
                      <button
                        key={b}
                        onClick={() => updateParams({ bodyType: bodyType === b ? '' : b })}
                        className={`p-2 rounded-xl text-xs font-semibold border ${
                          bodyType === b
                            ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                            : 'bg-[#0A0B0F] text-[#A1A1AA] border-white/10'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#A1A1AA] font-bold">Max Price</span>
                    <span className="text-white font-mono">${maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="75000"
                    step="2500"
                    value={maxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value })}
                    className="w-full accent-[#FF8A00]"
                  />
                </div>

                {/* Certified Only */}
                <label className="flex items-center justify-between text-xs font-semibold text-white cursor-pointer">
                  <span>Certified 150-Point Only</span>
                  <input
                    type="checkbox"
                    checked={certifiedOnly}
                    onChange={(e) => updateParams({ certified: e.target.checked ? 'true' : '' })}
                    className="rounded text-[#3B82F6] focus:ring-0"
                  />
                </label>
              </div>

              {/* Drawer Apply Button */}
              <div className="p-4 bg-[#0A0B0F] border-t border-white/10">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition shadow-lg shadow-[#FF4D2E]/25"
                >
                  Apply Filters ({filteredVehicles.length} results)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
