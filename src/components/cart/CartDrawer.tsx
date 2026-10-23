import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DEALERSHIP } from '../../config/dealership';
import { SmartImage } from '../ui/SmartImage';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    toggleCartAddon,
  } = useStore();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  // Calculations
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
  const totalEstimatedPrice = vehicleSubtotal + addonsTotal + estimatedTax + docFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-y-0 right-0 max-w-lg w-full bg-[#12141A] border-l border-white/10 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Archivo']">
                    Reservation Cart
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    {cartItems.length} {cartItems.length === 1 ? 'vehicle' : 'vehicles'} held
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.vehicle.id}
                    className="p-4 rounded-xl bg-[#0A0B0F] border border-white/[0.08] space-y-4"
                  >
                    {/* Vehicle Header info */}
                    <div className="flex gap-3">
                      <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <SmartImage
                          src={item.vehicle.images[0]}
                          alt={item.vehicle.model}
                          aspectRatio="16/10"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-bold text-white font-['Archivo'] truncate">
                            {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.vehicle.id)}
                            className="text-[#71717A] hover:text-rose-400 p-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#A1A1AA] truncate">{item.vehicle.trim}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-semibold text-white tabular-nums">
                            ${item.vehicle.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-[#22C55E] font-medium font-mono">
                            ${DEALERSHIP.pricing.reservationDeposit} Refundable Hold
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Optional Add-ons Toggles */}
                    <div className="pt-3 border-t border-white/[0.08] space-y-2">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-[#A1A1AA]">
                        Optional Dealer Add-Ons
                      </p>
                      {DEALERSHIP.addons.map((addon) => {
                        const isSelected = item.selectedAddonIds.includes(addon.id);
                        return (
                          <label
                            key={addon.id}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors border ${
                              isSelected
                                ? 'bg-white/5 border-[#FF8A00]/40 text-white'
                                : 'bg-transparent border-white/5 text-[#A1A1AA] hover:border-white/15'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCartAddon(item.vehicle.id, addon.id)}
                              className="mt-0.5 rounded border-white/20 text-[#FF8A00] focus:ring-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between font-medium">
                                <span className="truncate">{addon.name}</span>
                                <span className="tabular-nums text-white shrink-0 ml-1">
                                  +${addon.price}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-[#A1A1AA] flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#71717A]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-white">Your reservation cart is empty</p>
                  <p className="text-xs text-[#71717A] max-w-xs mt-1">
                    Explore our inventory and reserve any certified vehicle with a 100% refundable $500 deposit.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-[#0A0B0F] border-t border-white/10 space-y-4">
                <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Vehicles Subtotal:</span>
                    <span className="text-white tabular-nums">${vehicleSubtotal.toLocaleString()}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Dealer Protection & Delivery Add-Ons:</span>
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
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                    <span>Total Purchase Value:</span>
                    <span className="tabular-nums">${totalEstimatedPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Due Today Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#22C55E]/15 to-[#3B82F6]/15 border border-[#22C55E]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#22C55E] font-bold block">
                      Refundable Deposit Due Today
                    </span>
                    <span className="text-[11px] text-[#A1A1AA]">
                      Holds vehicle exclusively for 48 hours
                    </span>
                  </div>
                  <span className="text-xl font-black text-white font-['Archivo'] tabular-nums">
                    ${totalDeposit.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <span>Proceed to Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>100% Refundable if you change your mind · No risk</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
