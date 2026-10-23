import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  Lock,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DEALERSHIP } from '../config/dealership';
import { SmartImage } from '../components/ui/SmartImage';
import { SEO } from '../components/layout/SEO';
import { Reservation } from '../types/cart';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, toggleCartAddon, addReservation, clearCart } = useStore();

  // Multi-step Checkout State
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'confirmation'>('cart');

  // Customer Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('4200 Oak Lawn Ave');
  const [city, setCity] = useState('Dallas');
  const [state, setState] = useState('TX');
  const [zip, setZip] = useState('75219');
  const [deliveryPreference, setDeliveryPreference] = useState<'pickup' | 'delivery'>('pickup');

  // Mock Payment Details
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('911');
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Totals calculations
  const totalDeposit = cartItems.length * DEALERSHIP.pricing.reservationDeposit;
  const vehicleSubtotal = cartItems.reduce((acc, item) => acc + item.vehicle.price, 0);

  const addonsTotal = cartItems.reduce((acc, item) => {
    const itemAddonTotal = item.selectedAddonIds.reduce((sum, addonId) => {
      const addon = DEALERSHIP.addons.find((a) => a.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return acc + itemAddonTotal;
  }, 0);

  const estimatedTax = Math.round(vehicleSubtotal * DEALERSHIP.pricing.taxRate);
  const docFee = cartItems.length > 0 ? DEALERSHIP.pricing.docFee : 0;
  const totalPurchasePrice = vehicleSubtotal + addonsTotal + estimatedTax + docFee;

  // Complete Reservation Handler
  const handleCompleteReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const primaryVehicle = cartItems[0].vehicle;
    const selectedAddonObjects = cartItems[0].selectedAddonIds.map((id) => {
      const a = DEALERSHIP.addons.find((item) => item.id === id);
      return { id, name: a?.name || id, price: a?.price || 0 };
    });

    const resNumber = `APX-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: resNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      vehicle: primaryVehicle,
      selectedAddons: selectedAddonObjects,
      pricingSummary: {
        vehiclePrice: primaryVehicle.price,
        addonsTotal,
        salesTax: estimatedTax,
        docFee,
        totalPrice: totalPurchasePrice,
        depositPaid: totalDeposit,
        balanceDue: totalPurchasePrice - totalDeposit,
      },
      customer: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        deliveryPreference,
      },
      paymentDetails: {
        lastFour: '4242',
        cardBrand: 'Visa',
        demoNote: 'Demo hold simulated with $500 pre-authorization',
      },
    };

    addReservation(newRes);
    setCreatedReservation(newRes);
    clearCart();
    setCheckoutStep('confirmation');
  };

  return (
    <>
      <SEO
        title="Vehicle Reservation & Checkout"
        description="Secure your pre-owned vehicle reservation with a 100% refundable $500 deposit hold. Transparent pricing and Texas buyer protection."
      />

      <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12 text-xs font-mono">
          <div
            className={`flex items-center gap-2 ${
              checkoutStep === 'cart' ? 'text-[#FF8A00] font-bold' : 'text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Review Items</span>
          </div>
          <span className="text-white/20">——</span>
          <div
            className={`flex items-center gap-2 ${
              checkoutStep === 'details' ? 'text-[#FF8A00] font-bold' : 'text-[#71717A]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Delivery & Details</span>
          </div>
          <span className="text-white/20">——</span>
          <div
            className={`flex items-center gap-2 ${
              checkoutStep === 'payment' ? 'text-[#FF8A00] font-bold' : 'text-[#71717A]'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Deposit Hold</span>
          </div>
        </div>

        {/* STEP 1: CART ITEMS & ADD-ONS */}
        {checkoutStep === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Archivo'] tracking-tight">
                  Reservation Queue ({cartItems.length})
                </h1>
                <Link
                  to="/inventory"
                  className="text-xs text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Continue Browsing
                </Link>
              </div>

              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.vehicle.id}
                    className="p-6 rounded-3xl bg-[#12141A] border border-white/10 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-56 aspect-[16/10] rounded-2xl overflow-hidden shrink-0 border border-white/10">
                        <SmartImage
                          src={item.vehicle.images[0]}
                          alt={item.vehicle.model}
                          aspectRatio="16/10"
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[11px] font-mono text-[#A1A1AA] uppercase">
                                Stock #{item.vehicle.stockNumber} · {item.vehicle.drivetrain}
                              </span>
                              <h3 className="text-xl font-bold text-white font-['Archivo'] mt-0.5">
                                {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                              </h3>
                              <p className="text-xs text-[#A1A1AA]">{item.vehicle.trim}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.vehicle.id)}
                              className="text-[#71717A] hover:text-rose-400 p-2"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#A1A1AA] mt-3">
                            <span>{item.vehicle.mileage.toLocaleString()} mi</span>
                            <span>·</span>
                            <span>{item.vehicle.engine}</span>
                            <span>·</span>
                            <span className="text-[#3B82F6]">
                              {item.vehicle.certified ? '150-Point Certified' : 'Inspected'}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-baseline justify-between">
                          <div>
                            <span className="text-xs text-[#71717A] block">Vehicle Price</span>
                            <span className="text-xl font-black text-white font-['Archivo'] tabular-nums">
                              ${item.vehicle.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-[#22C55E] font-mono block">
                              ${DEALERSHIP.pricing.reservationDeposit} Refundable Hold
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add-on Toggles */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] block">
                        Customize Protection & Delivery
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DEALERSHIP.addons.map((addon) => {
                          const isSelected = item.selectedAddonIds.includes(addon.id);
                          return (
                            <div
                              key={addon.id}
                              onClick={() => toggleCartAddon(item.vehicle.id, addon.id)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-white/5 border-[#FF8A00]/50 text-white'
                                  : 'bg-[#0A0B0F] border-white/5 text-[#A1A1AA] hover:border-white/15'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-semibold">{addon.name}</span>
                                <span className="text-xs font-mono text-white tabular-nums shrink-0">
                                  +${addon.price}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#71717A] mt-1 line-clamp-2 leading-relaxed">
                                {addon.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 rounded-3xl bg-[#12141A] border border-white/10 text-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-[#71717A] mx-auto opacity-50" />
                  <h3 className="text-xl font-bold text-white font-['Archivo']">
                    No vehicles in reservation cart
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Choose a vehicle from our certified showroom inventory to lock in pricing and reserve with a refundable deposit.
                  </p>
                  <Link
                    to="/inventory"
                    className="inline-block px-6 py-3 rounded-xl bg-ignition text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D2E]/25"
                  >
                    Browse Vehicles
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar Summary Column */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
                <h3 className="text-base font-bold text-white font-['Archivo']">
                  Purchase Valuation Summary
                </h3>

                <div className="space-y-2 text-xs text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Vehicle Base Price:</span>
                    <span className="text-white tabular-nums">${vehicleSubtotal.toLocaleString()}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Protection & Delivery Add-Ons:</span>
                      <span className="text-white tabular-nums">+${addonsTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Est. Texas Sales Tax (8.25%):</span>
                    <span className="text-white tabular-nums">${estimatedTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dealer Documentation Fee:</span>
                    <span className="text-white tabular-nums">${docFee}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Total Purchase Value:</span>
                    <span className="tabular-nums">${totalPurchasePrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Due Today Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#22C55E]/15 to-[#3B82F6]/15 border border-[#22C55E]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#22C55E] font-bold block">
                      Refundable Deposit Due Today
                    </span>
                    <span className="text-[11px] text-[#A1A1AA]">
                      Holds vehicle exclusively for 48 hours
                    </span>
                  </div>
                  <span className="text-2xl font-black text-white font-['Archivo'] tabular-nums">
                    ${totalDeposit.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Continue to Client Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-[#71717A]">
                  <div className="flex items-center gap-1.5 text-[#22C55E]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Refundable Deposit · No obligation</span>
                  </div>
                  <p>
                    Deposits are refunded immediately if you cancel before final delivery or signing.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CONTACT & DELIVERY DETAILS */}
        {checkoutStep === 'details' && (
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-2xl font-black text-white font-['Archivo'] tracking-tight">
                Client & Handover Details
              </h2>
              <button
                onClick={() => setCheckoutStep('cart')}
                className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cart</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCheckoutStep('payment');
              }}
              className="space-y-4"
            >
              {/* Delivery method toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryPreference('pickup')}
                  className={`p-4 rounded-2xl border text-left transition-colors flex items-center gap-3 ${
                    deliveryPreference === 'pickup'
                      ? 'bg-white/10 border-[#FF8A00] text-white'
                      : 'bg-[#0A0B0F] border-white/10 text-[#A1A1AA]'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-[#FF8A00] shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Dallas Showroom Pickup</span>
                    <span className="text-[10px] text-[#71717A]">4500 W Airport Fwy</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryPreference('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-colors flex items-center gap-3 ${
                    deliveryPreference === 'delivery'
                      ? 'bg-white/10 border-[#FF8A00] text-white'
                      : 'bg-[#0A0B0F] border-white/10 text-[#A1A1AA]'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#3B82F6] shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">White-Glove Flatbed</span>
                    <span className="text-[10px] text-[#71717A]">Direct to your driveway</span>
                  </div>
                </button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Liam"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="liam@example.com"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(214) 000-0000"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">ZIP</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Reservation Deposit (${totalDeposit})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: MOCK PAYMENT HOLD FORM */}
        {checkoutStep === 'payment' && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white font-['Archivo'] tracking-tight">
                  Authorize Refundable Deposit
                </h2>
                <p className="text-xs text-[#22C55E] mt-0.5">
                  Demo Payment Gateway · No Real Card Charged
                </p>
              </div>
              <button
                onClick={() => setCheckoutStep('details')}
                className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {/* Deposit notice */}
            <div className="p-4 rounded-2xl bg-[#0A0B0F] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A1A1AA] block">Authorization Amount</span>
                <span className="text-2xl font-black text-white font-['Archivo'] tabular-nums">
                  ${totalDeposit.toLocaleString()}.00 USD
                </span>
              </div>
              <span className="text-xs text-[#22C55E] font-semibold bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
                100% Refundable
              </span>
            </div>

            <form onSubmit={handleCompleteReservation} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                  Card Number (Demo Preset)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-[#A1A1AA] mb-1">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-[#A1A1AA] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>
                  Demo transaction mode. Submitting this form creates a simulated reservation record visible in the admin portal.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Authorize ${totalDeposit} Deposit Hold</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: TASTEFUL CONFIRMATION SCREEN */}
        {checkoutStep === 'confirmation' && createdReservation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#12141A] border border-white/10 shadow-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#22C55E] font-bold">
                Reservation Confirmed · Vehicle Held Exclusively
              </span>
              <h2 className="text-3xl font-black text-white font-['Archivo'] tracking-tight mt-1">
                Your Vehicle is Locked In
              </h2>
              <p className="text-xs text-[#A1A1AA] mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, {createdReservation.customer.firstName}. Your reservation voucher has been generated and sent to {createdReservation.customer.email}.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-6 rounded-2xl bg-[#0A0B0F] border border-white/10 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-[#A1A1AA] uppercase font-bold">Reservation Voucher</span>
                <span className="text-sm font-mono font-bold text-[#FF8A00]">
                  {createdReservation.reservationNumber}
                </span>
              </div>

              <div className="flex gap-4">
                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <SmartImage
                    src={createdReservation.vehicle.images[0]}
                    alt={createdReservation.vehicle.model}
                    aspectRatio="16/10"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white font-['Archivo']">
                    {createdReservation.vehicle.year} {createdReservation.vehicle.make} {createdReservation.vehicle.model}
                  </h4>
                  <p className="text-xs text-[#A1A1AA]">{createdReservation.vehicle.trim}</p>
                  <p className="text-xs text-[#22C55E] font-mono mt-1">
                    Deposit Paid: ${createdReservation.pricingSummary.depositPaid} (Refundable)
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-[#71717A]">
                <div>
                  <span className="block text-[#A1A1AA]">Handover Preference</span>
                  <span className="text-white capitalize">{createdReservation.customer.deliveryPreference}</span>
                </div>
                <div>
                  <span className="block text-[#A1A1AA]">Dallas Concierge</span>
                  <span className="text-white">{DEALERSHIP.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/inventory"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider"
              >
                Back to Inventory
              </Link>
              <Link
                to="/admin"
                className="px-6 py-3 rounded-xl bg-ignition text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF4D2E]/20"
              >
                View in Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};
