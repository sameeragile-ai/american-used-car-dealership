import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Car, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DEALERSHIP } from '../../config/dealership';

export const TestDriveModal: React.FC = () => {
  const { isTestDriveOpen, testDriveVehicle, closeTestDrive, vehicles, showToast } = useStore();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    testDriveVehicle ? testDriveVehicle.id : (vehicles[0]?.id || '')
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasLicense, setHasLicense] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Sync selectedVehicleId if testDriveVehicle changes
  React.useEffect(() => {
    if (testDriveVehicle) {
      setSelectedVehicleId(testDriveVehicle.id);
    }
  }, [testDriveVehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !date) return;

    setSubmitted(true);
    showToast({
      type: 'success',
      title: 'Test Drive Scheduled',
      message: `Your VIP appointment is confirmed at our Dallas showroom.`,
    });
  };

  const handleClose = () => {
    setSubmitted(false);
    closeTestDrive();
  };

  if (!isTestDriveOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#12141A] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#FF8A00]">
                  Concierge Test Drive
                </span>
              </div>

              <h3 className="text-2xl font-black text-white font-['Archivo'] tracking-tight">
                Experience Behind the Wheel
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Zero sales pressure. Take a 30-minute private test loop on DFW tollway & dynamic roads.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Vehicle Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                    Select Desired Vehicle
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} {v.trim} (${v.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FF8A00]" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF8A00]" />
                      <span>Preferred Time</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF8A00]"
                    >
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>1:00 PM</option>
                      <option>2:30 PM</option>
                      <option>4:00 PM</option>
                      <option>5:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Contact info */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Jonathan Sterling"
                    className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A1A1AA] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(214) 000-0000"
                      className="w-full bg-[#0A0B0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs text-[#A1A1AA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="rounded border-white/20 text-[#FF8A00] focus:ring-0"
                    required
                  />
                  <span>I possess a valid US Driver's License and active personal auto insurance</span>
                </label>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-ignition hover:opacity-95 shadow-xl shadow-[#FF4D2E]/25 transition-transform active:scale-95"
                >
                  Confirm Test Drive Appointment
                </button>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white font-['Archivo']">
                Appointment Confirmed
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{fullName}</span>. Your private drive is booked for{' '}
                <span className="text-white font-medium">{date} at {time}</span> at our Dallas showroom ({DEALERSHIP.address}).
              </p>
              <div className="p-3 bg-white/5 rounded-xl text-xs text-[#3B82F6] flex items-center justify-center gap-2 border border-white/10">
                <ShieldCheck className="w-4 h-4" />
                <span>A confirmation calendar invite has been sent to {email}.</span>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
