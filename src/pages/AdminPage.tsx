import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  BookOpen,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  RotateCcw,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../store/useStore';
import { DEALERSHIP } from '../config/dealership';
import { SEO } from '../components/layout/SEO';
import { SmartImage } from '../components/ui/SmartImage';
import { Vehicle, VehicleStatus, BodyType, FuelType, Transmission, Drivetrain } from '../types/vehicle';
import { Review } from '../types/review';
import { BlogPost } from '../types/blog';
import { StaffUser } from '../types/admin';

export const AdminPage: React.FC = () => {
  const {
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus,
    reviews,
    approveReview,
    rejectReview,
    replyToReview,
    deleteReview,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    reservations,
    updateReservationStatus,
    staff,
    addStaff,
    removeStaff,
    activities,
    resetDemoData,
    showToast,
  } = useStore();

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'inventory' | 'reviews' | 'blog' | 'reservations' | 'users' | 'settings'
  >('dashboard');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState(DEALERSHIP.demoAdmin.email);
  const [loginPass, setLoginPass] = useState(DEALERSHIP.demoAdmin.defaultPass);

  // Inventory Modal State (Add/Edit)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    trim: '',
    year: 2023,
    price: 38900,
    mileage: 21000,
    bodyType: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: '3.0L Turbo',
    horsepower: 330,
    mpgCity: 20,
    mpgHwy: 28,
    exteriorColor: 'Obsidian Black Metallic',
    exteriorColorHex: '#18181B',
    interiorColor: 'Black Leather',
    vin: '1G1APEX99TX48102',
    stockNumber: 'APX-9000',
    features: ['Sunroof', 'Leather', 'Apple CarPlay'],
    certified: true,
    featured: false,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    ],
  });

  // Review Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Confirm delete dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'vehicle' | 'review' | 'post' | 'staff' | 'reset';
    id?: string;
    title: string;
  } | null>(null);

  // Search in inventory table
  const [inventorySearch, setInventorySearch] = useState('');

  // Review Status Filter Tab
  const [reviewTabFilter, setReviewTabFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // KPI Calculations
  const totalInventoryCount = vehicles.length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price, 0);
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const totalReservations = reservations.length;

  // Chart 1 Data: Weekly Views
  const viewsData = [
    { day: 'Mon', views: 1840 },
    { day: 'Tue', views: 2420 },
    { day: 'Wed', views: 2890 },
    { day: 'Thu', views: 3200 },
    { day: 'Fri', views: 4100 },
    { day: 'Sat', views: 5600 },
    { day: 'Sun', views: 3950 },
  ];

  // Chart 2 Data: Top Makes Distribution
  const makesData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [vehicles]);

  // Chart 3 Data: Body Types Donut
  const bodyTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      counts[v.bodyType] = (counts[v.bodyType] || 0) + 1;
    });
    const colors = ['#FF4D2E', '#FF8A00', '#FFC14D', '#3B82F6', '#22C55E', '#8B5CF6'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [vehicles]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(loginEmail, loginPass);
  };

  // Open Add Vehicle
  const handleOpenAddVehicle = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      make: '',
      model: '',
      trim: '',
      year: 2023,
      price: 39900,
      mileage: 24000,
      bodyType: 'SUV',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      drivetrain: 'AWD',
      engine: '3.0L Turbo',
      horsepower: 335,
      mpgCity: 20,
      mpgHwy: 28,
      exteriorColor: 'Obsidian Black Metallic',
      exteriorColorHex: '#18181B',
      interiorColor: 'Black Leather',
      vin: `1G1APEX${Math.floor(100000 + Math.random() * 900000)}`,
      stockNumber: `APX-${Math.floor(8900 + Math.random() * 1000)}`,
      features: ['Sunroof', 'Leather', 'Apple CarPlay', 'Adaptive Cruise'],
      certified: true,
      featured: false,
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      ],
    });
    setIsVehicleModalOpen(true);
  };

  // Open Edit Vehicle
  const handleOpenEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVehicleForm({ ...v });
    setIsVehicleModalOpen(true);
  };

  // Save Vehicle
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.price) return;

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, vehicleForm);
    } else {
      const slug = `${vehicleForm.year}-${vehicleForm.make}-${vehicleForm.model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const newCar: Vehicle = {
        id: `apex-${Date.now()}`,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        make: vehicleForm.make || 'Toyota',
        model: vehicleForm.model || 'RAV4',
        trim: vehicleForm.trim || 'Standard',
        year: vehicleForm.year || 2023,
        price: vehicleForm.price || 35000,
        mileage: vehicleForm.mileage || 20000,
        bodyType: (vehicleForm.bodyType as BodyType) || 'SUV',
        fuelType: (vehicleForm.fuelType as FuelType) || 'Gasoline',
        transmission: (vehicleForm.transmission as Transmission) || 'Automatic',
        drivetrain: (vehicleForm.drivetrain as Drivetrain) || 'AWD',
        engine: vehicleForm.engine || '2.5L 4-Cyl',
        horsepower: vehicleForm.horsepower || 203,
        mpgCity: vehicleForm.mpgCity || 25,
        mpgHwy: vehicleForm.mpgHwy || 33,
        exteriorColor: vehicleForm.exteriorColor || 'Obsidian Black',
        exteriorColorHex: vehicleForm.exteriorColorHex || '#18181B',
        interiorColor: vehicleForm.interiorColor || 'Black Leather',
        vin: vehicleForm.vin || '1G1APEX99TX48102',
        stockNumber: vehicleForm.stockNumber || 'APX-9000',
        features: vehicleForm.features || [],
        history: {
          owners: 1,
          accidents: 0,
          serviceRecords: 4,
          cleanTitle: true,
          lastServiceDate: new Date().toISOString().split('T')[0],
        },
        certified: vehicleForm.certified ?? true,
        featured: vehicleForm.featured ?? false,
        status: (vehicleForm.status as VehicleStatus) || 'Available',
        images: vehicleForm.images || [],
        dateAdded: new Date().toISOString().split('T')[0],
      };
      addVehicle(newCar);
    }
    setIsVehicleModalOpen(false);
  };

  // Confirm delete execution
  const executeDelete = () => {
    if (!deleteConfirmation) return;
    if (deleteConfirmation.type === 'vehicle' && deleteConfirmation.id) {
      deleteVehicle(deleteConfirmation.id);
    } else if (deleteConfirmation.type === 'review' && deleteConfirmation.id) {
      deleteReview(deleteConfirmation.id);
    } else if (deleteConfirmation.type === 'post' && deleteConfirmation.id) {
      deleteBlogPost(deleteConfirmation.id);
    } else if (deleteConfirmation.type === 'staff' && deleteConfirmation.id) {
      removeStaff(deleteConfirmation.id);
    } else if (deleteConfirmation.type === 'reset') {
      resetDemoData();
    }
    setDeleteConfirmation(null);
  };

  // If NOT authenticated, show Login Screen
  if (!isAdminAuthenticated) {
    return (
      <>
        <SEO title="Dealership Staff Portal Login" />
        <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 bg-[#0A0B0F]">
          <div className="w-full max-w-md p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-ignition text-white mx-auto flex items-center justify-center shadow-lg shadow-[#FF4D2E]/25">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white font-['Archivo'] tracking-tight">
                Dealership Staff Portal
              </h1>
              <p className="text-xs text-[#A1A1AA]">
                Protected management console for inventory, reviews & reservations.
              </p>
            </div>

            {/* Demo Credentials Box */}
            <div className="p-4 rounded-xl bg-[#0A0B0F] border border-white/10 space-y-1 text-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF8A00] font-bold block">
                Demo Credentials Provided:
              </span>
              <p className="text-[#A1A1AA]">
                Email: <span className="text-white font-mono">{DEALERSHIP.demoAdmin.email}</span>
              </p>
              <p className="text-[#A1A1AA]">
                Password: <span className="text-white font-mono">{DEALERSHIP.demoAdmin.defaultPass}</span>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                  Staff Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95"
              >
                Access Portal
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // Filtered inventory list for management table
  const filteredInventory = vehicles.filter((v) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return `${v.year} ${v.make} ${v.model} ${v.stockNumber} ${v.vin}`.toLowerCase().includes(q);
  });

  return (
    <>
      <SEO title="Dealership Management Portal" />

      <div className="pt-20 min-h-screen bg-[#0A0B0F] text-[#F4F4F5]">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
          {/* ========================================================================= */}
          {/* ADMIN SIDEBAR */}
          {/* ========================================================================= */}
          <aside className="lg:w-64 bg-[#12141A] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-ignition flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white font-['Archivo']">
                    Apex Control Hub
                  </h2>
                  <span className="text-[10px] text-[#22C55E] font-mono">Live Session</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'inventory', label: `Inventory (${vehicles.length})`, icon: Car },
                  {
                    id: 'reviews',
                    label: `Reviews ${pendingReviewsCount > 0 ? `(${pendingReviewsCount})` : ''}`,
                    icon: MessageSquare,
                    badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
                  },
                  { id: 'reservations', label: `Reservations (${reservations.length})`, icon: CalendarCheck },
                  { id: 'blog', label: `Articles (${blogPosts.length})`, icon: BookOpen },
                  { id: 'users', label: 'Staff Team', icon: Users },
                  { id: 'settings', label: 'Dealership Info', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-ignition text-white shadow-md shadow-[#FF4D2E]/20'
                          : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FF4D2E] text-white text-[10px] font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() =>
                  setDeleteConfirmation({
                    type: 'reset',
                    title: 'Reset all mock inventory, reviews, and blog posts to original defaults?',
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors border border-white/10"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 transition-colors border border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </button>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* MAIN ADMIN WORKSPACE */}
          {/* ========================================================================= */}
          <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 max-w-6xl">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                    Showroom Operations Analytics
                  </h1>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Real-time metrics, live floor allocations, and incoming reservation requests.
                  </p>
                </div>

                {/* 5 KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">Total Inventory</span>
                    <p className="text-2xl font-black text-white font-['Archivo'] tabular-nums">{totalInventoryCount}</p>
                    <span className="text-[10px] text-[#22C55E]">24 Active Listings</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">Floor Value</span>
                    <p className="text-2xl font-black text-white font-['Archivo'] tabular-nums">
                      ${(totalInventoryValue / 1000).toFixed(0)}k
                    </p>
                    <span className="text-[10px] text-[#3B82F6]">Avg. ${Math.round(totalInventoryValue / totalInventoryCount).toLocaleString()}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">Reservations</span>
                    <p className="text-2xl font-black text-white font-['Archivo'] tabular-nums">{totalReservations}</p>
                    <span className="text-[10px] text-[#22C55E]">$500 Holds Placed</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">Pending Reviews</span>
                    <p className="text-2xl font-black text-[#FF8A00] font-['Archivo'] tabular-nums">{pendingReviewsCount}</p>
                    <span className="text-[10px] text-[#A1A1AA]">Awaiting Approval</span>
                  </div>

                  <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold">Weekly Traffic</span>
                    <p className="text-2xl font-black text-white font-['Archivo'] tabular-nums">24.2k</p>
                    <span className="text-[10px] text-[#22C55E]">+14% vs last week</span>
                  </div>
                </div>

                {/* 3 Recharts Visualizations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Line Chart: Weekly Page Views (7 cols) */}
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-[#12141A] border border-white/10 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-white">
                        Weekly Showroom Traffic (Page Views)
                      </h3>
                      <span className="text-[10px] font-mono text-[#FF8A00]">Real-time Session Log</span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={viewsData}>
                          <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                          <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0A0B0F',
                              borderColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#FF8A00"
                            strokeWidth={3}
                            dot={{ fill: '#FF4D2E', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Donut Chart: Inventory by Body Type (5 cols) */}
                  <div className="lg:col-span-5 p-6 rounded-3xl bg-[#12141A] border border-white/10 shadow-xl space-y-4">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-white">
                      Inventory Allocation by Body Style
                    </h3>

                    <div className="h-64 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bodyTypeData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                          >
                            {bodyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0A0B0F',
                              borderColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] text-[#A1A1AA] justify-center">
                      {bodyTypeData.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>
                            {item.name} ({item.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="p-6 rounded-3xl bg-[#12141A] border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-white">
                    Live Dealership Activity Feed
                  </h3>
                  <div className="space-y-3">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-[#0A0B0F] border border-white/5 flex items-start justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{act.title}</p>
                          <p className="text-[#A1A1AA] mt-0.5">{act.description}</p>
                        </div>
                        <span className="text-[10px] text-[#71717A] font-mono whitespace-nowrap">
                          {act.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INVENTORY MANAGEMENT */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                      Inventory Catalog Management
                    </h1>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      Add, update specs, and manage public availability status.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddVehicle}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-ignition shadow-lg shadow-[#FF4D2E]/25 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>List New Vehicle</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search by make, model, stock# or VIN..."
                    className="w-full bg-[#12141A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                {/* Inventory Table */}
                <div className="rounded-2xl bg-[#12141A] border border-white/10 overflow-x-auto shadow-2xl">
                  <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#0A0B0F] text-[#A1A1AA] uppercase font-bold text-[10px]">
                        <th className="p-4">Vehicle</th>
                        <th className="p-4">Stock / VIN</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Mileage</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredInventory.map((car) => (
                        <tr key={car.id} className="hover:bg-white/[0.02]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#0A0B0F]">
                                <SmartImage
                                  src={car.images[0]}
                                  alt={car.model}
                                  aspectRatio="16/10"
                                  className="w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-white font-['Archivo']">
                                  {car.year} {car.make} {car.model}
                                </p>
                                <p className="text-[11px] text-[#A1A1AA]">{car.trim}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 font-mono text-[11px] text-[#A1A1AA]">
                            <div>#{car.stockNumber}</div>
                            <div className="text-[10px] text-[#71717A]">{car.vin}</div>
                          </td>

                          <td className="p-4 font-bold text-white tabular-nums">
                            ${car.price.toLocaleString()}
                          </td>

                          <td className="p-4 text-[#A1A1AA] tabular-nums">
                            {car.mileage.toLocaleString()} mi
                          </td>

                          <td className="p-4">
                            <select
                              value={car.status}
                              onChange={(e) =>
                                updateVehicleStatus(car.id, e.target.value as VehicleStatus)
                              }
                              className={`bg-[#0A0B0F] border rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none ${
                                car.status === 'Available'
                                  ? 'text-[#22C55E] border-[#22C55E]/30'
                                  : car.status === 'Reserved'
                                  ? 'text-[#FF8A00] border-[#FF8A00]/30'
                                  : 'text-[#71717A] border-white/10'
                              }`}
                            >
                              <option value="Available">Available</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Sold">Sold</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => updateVehicle(car.id, { featured: !car.featured })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                                car.featured
                                  ? 'bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/30'
                                  : 'bg-white/5 text-[#71717A]'
                              }`}
                            >
                              {car.featured ? 'Featured' : 'Standard'}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditVehicle(car)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                                title="Edit specs"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirmation({
                                    type: 'vehicle',
                                    id: car.id,
                                    title: `Delete ${car.year} ${car.make} ${car.model}?`,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                    Customer Reviews Moderation
                  </h1>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Approve genuine buyer testimonials or submit dealership responses.
                  </p>
                </div>

                {/* Tabs: Pending, Approved, Rejected */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  {(['pending', 'approved', 'rejected'] as const).map((tab) => {
                    const count = reviews.filter((r) => r.status === tab).length;
                    return (
                      <button
                        key={tab}
                        onClick={() => setReviewTabFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                          reviewTabFilter === tab
                            ? 'bg-ignition text-white'
                            : 'bg-white/5 text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {tab} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews
                    .filter((r) => r.status === reviewTabFilter)
                    .map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-white">{rev.customerName}</span>
                            <span className="text-xs text-[#71717A]"> · {rev.location} · {rev.date}</span>
                            <h4 className="text-sm font-bold text-white mt-1">"{rev.title}"</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => approveReview(rev.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold border border-[#22C55E]/30"
                              >
                                Approve
                              </button>
                            )}
                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => rejectReview(rev.id)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-[#A1A1AA] hover:text-white text-xs font-bold border border-white/10"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  type: 'review',
                                  id: rev.id,
                                  title: `Permanently delete review from ${rev.customerName}?`,
                                })
                              }
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-[#A1A1AA] leading-relaxed">{rev.comment}</p>

                        {/* Existing reply or reply button */}
                        {rev.adminReply ? (
                          <div className="p-3 bg-[#0A0B0F] rounded-xl border border-white/5 text-xs text-[#A1A1AA]">
                            <span className="text-white font-bold block mb-1">
                              Response from {rev.adminReply.author}:
                            </span>
                            <p className="text-[11px] leading-relaxed">{rev.adminReply.message}</p>
                          </div>
                        ) : replyingReviewId === rev.id ? (
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a professional dealership response..."
                              className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (!replyText) return;
                                  replyToReview(rev.id, replyText, 'Marcus Vance, Client Director');
                                  setReplyingReviewId(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-ignition text-white text-xs font-bold"
                              >
                                Publish Reply
                              </button>
                              <button
                                onClick={() => setReplyingReviewId(null)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[#A1A1AA]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setReplyText('');
                            }}
                            className="text-xs text-[#FF8A00] hover:underline"
                          >
                            + Add Official Dealership Response
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 4: RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                    Client Reservations Queue
                  </h1>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Online deposits ($500 hold) and customer handover requests.
                  </p>
                </div>

                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-6 rounded-2xl bg-[#12141A] border border-white/10 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
                        <div>
                          <span className="text-xs font-mono font-bold text-[#FF8A00]">
                            {res.reservationNumber}
                          </span>
                          <h3 className="text-lg font-bold text-white font-['Archivo']">
                            {res.customer.firstName} {res.customer.lastName}
                          </h3>
                          <span className="text-xs text-[#A1A1AA]">
                            {res.customer.email} · {res.customer.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={res.status}
                            onChange={(e) =>
                              updateReservationStatus(res.id, e.target.value as any)
                            }
                            className="bg-[#0A0B0F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A1A1AA]">
                        <div>
                          <span className="text-[#71717A] block">Reserved Vehicle:</span>
                          <span className="text-white font-semibold">
                            {res.vehicle.year} {res.vehicle.make} {res.vehicle.model} (Stock #{res.vehicle.stockNumber})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block">Deposit Paid Today:</span>
                          <span className="text-[#22C55E] font-mono font-bold">
                            ${res.pricingSummary.depositPaid} (Refundable Hold)
                          </span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block">Handover Preference:</span>
                          <span className="text-white capitalize">{res.customer.deliveryPreference}</span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block">Remaining Balance Due:</span>
                          <span className="text-white font-mono">
                            ${res.pricingSummary.balanceDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BLOG MANAGEMENT */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                      Articles & Technical Guides
                    </h1>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      Publish buyer advice, market trends, and technical guides.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-5 rounded-2xl bg-[#12141A] border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <SmartImage
                            src={post.coverImage}
                            alt={post.title}
                            aspectRatio="16/10"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#FF8A00]">{post.category}</span>
                          <h4 className="text-sm font-bold text-white font-['Archivo'] line-clamp-1">
                            {post.title}
                          </h4>
                          <span className="text-xs text-[#71717A]">
                            By {post.author} · {post.readTimeMinutes} min read
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white"
                          title="Preview post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'post',
                              id: post.id,
                              title: `Delete post "${post.title}"?`,
                            })
                          }
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: STAFF USERS */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                    Staff & Client Concierge Team
                  </h1>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Manage active advisors and showroom personnel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                          <SmartImage
                            src={member.avatar}
                            alt={member.name}
                            aspectRatio="1/1"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{member.name}</h4>
                          <p className="text-xs text-[#FF8A00] font-mono">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-xs text-[#71717A] space-y-1 pt-2 border-t border-white/5">
                        <p>{member.email}</p>
                        <p>{member.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                    Dealership Core Settings
                  </h1>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Centralized dealership parameters configured in src/config/dealership.ts.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#12141A] border border-white/10 space-y-4 text-xs">
                  <div>
                    <span className="text-[#71717A] block font-bold uppercase mb-1">
                      Dealership Name
                    </span>
                    <input
                      type="text"
                      disabled
                      value={DEALERSHIP.name}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[#71717A] block font-bold uppercase mb-1">
                      Showroom Address
                    </span>
                    <input
                      type="text"
                      disabled
                      value={`${DEALERSHIP.address}, ${DEALERSHIP.city}, ${DEALERSHIP.state} ${DEALERSHIP.zip}`}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[#71717A] block font-bold uppercase mb-1">
                        Main Phone
                      </span>
                      <input
                        type="text"
                        disabled
                        value={DEALERSHIP.phone}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[#71717A] block font-bold uppercase mb-1">
                        Texas Tax Rate
                      </span>
                      <input
                        type="text"
                        disabled
                        value={`${(DEALERSHIP.pricing.taxRate * 100).toFixed(2)}%`}
                        className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[#A1A1AA]">
                    To change dealership name, logo, tax rates, or add-ons permanently across the build, simply update <code className="text-[#FF8A00]">src/config/dealership.ts</code>.
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VEHICLE ADD/EDIT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isVehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVehicleModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#12141A] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xl font-bold text-white font-['Archivo']">
                  {editingVehicleId ? 'Edit Vehicle Specification' : 'List New Vehicle'}
                </h3>
                <button
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="p-1.5 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVehicle} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Make</label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.make || ''}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                      placeholder="e.g. BMW"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={vehicleForm.model || ''}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                      placeholder="e.g. 3 Series"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Trim</label>
                    <input
                      type="text"
                      value={vehicleForm.trim || ''}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, trim: e.target.value })}
                      placeholder="e.g. M340i xDrive"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Year</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.year || 2023}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, year: Number(e.target.value) })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.price || 35000}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, price: Number(e.target.value) })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Mileage (mi)</label>
                    <input
                      type="number"
                      required
                      value={vehicleForm.mileage || 20000}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: Number(e.target.value) })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Body Type</label>
                    <select
                      value={vehicleForm.bodyType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, bodyType: e.target.value as any })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>SUV</option>
                      <option>Sedan</option>
                      <option>Truck</option>
                      <option>Coupe</option>
                      <option>EV</option>
                      <option>Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Fuel Type</label>
                    <select
                      value={vehicleForm.fuelType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value as any })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>Gasoline</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                      <option>Plug-in Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">Drivetrain</label>
                    <select
                      value={vehicleForm.drivetrain}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, drivetrain: e.target.value as any })}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>AWD</option>
                      <option>FWD</option>
                      <option>RWD</option>
                      <option>4WD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={vehicleForm.images?.[0] || ''}
                    onChange={(e) => {
                      const newImages = [...(vehicleForm.images || [])];
                      newImages[0] = e.target.value;
                      setVehicleForm({ ...vehicleForm, images: newImages });
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  {vehicleForm.images?.[0] && (
                    <div className="w-24 h-16 rounded-lg overflow-hidden mt-2 border border-white/10">
                      <img
                        src={vehicleForm.images[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleForm.certified ?? true}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, certified: e.target.checked })}
                      className="rounded text-[#3B82F6] focus:ring-0"
                    />
                    <span>150-Point Certified</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicleForm.featured ?? false}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, featured: e.target.checked })}
                      className="rounded text-[#FF8A00] focus:ring-0"
                    />
                    <span>Featured on Homepage</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-md shadow-[#FF4D2E]/25"
                >
                  {editingVehicleId ? 'Update Vehicle Listing' : 'Publish Vehicle'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CONFIRMATION DELETE DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmation(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#12141A] border border-white/10 rounded-2xl shadow-2xl p-6 z-10 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h4 className="text-base font-bold text-white font-['Archivo']">Confirm Action</h4>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {deleteConfirmation.title}
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30"
                >
                  Confirm & Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
