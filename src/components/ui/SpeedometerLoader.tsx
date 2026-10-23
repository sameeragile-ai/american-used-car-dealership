import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DEALERSHIP } from '../../config/dealership';

interface SpeedometerLoaderProps {
  onComplete?: () => void;
}

export const SpeedometerLoader: React.FC<SpeedometerLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    // Check sessionStorage
    const hasSeenLoader = sessionStorage.getItem('apex_has_seen_loader');
    if (hasSeenLoader) {
      onComplete?.();
      return;
    }

    setIsVisible(true);

    // Animate speedometer value 0 -> 100
    const start = performance.now();
    const duration = 1200; // 1.2s sweep

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setSpeed(Math.round(eased * 100));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Complete sweep, fade and wipe out
        setTimeout(() => {
          sessionStorage.setItem('apex_has_seen_loader', 'true');
          setIsVisible(false);
          onComplete?.();
        }, 350);
      }
    };

    const animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  if (!isVisible) return null;

  // Gauge angles: -120 deg to +120 deg (total 240 deg arc)
  const angle = -120 + (speed / 100) * 240;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="apex-loader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0B0F] select-none pointer-events-auto"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FF4D2E]/10 blur-[120px] pointer-events-none" />

          {/* Speedometer SVG */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                strokeDasharray="360"
                strokeDashoffset="120"
                strokeLinecap="round"
              />
              {/* Gradient Arc */}
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="url(#ignition-gauge)"
                strokeWidth="10"
                strokeDasharray="360"
                strokeDashoffset={360 - (speed / 100) * 240}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
              <defs>
                <linearGradient id="ignition-gauge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4D2E" />
                  <stop offset="55%" stopColor="#FF8A00" />
                  <stop offset="100%" stopColor="#FFC14D" />
                </linearGradient>
              </defs>
            </svg>

            {/* Needle Pivot & Needle */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="w-1.5 h-24 bg-gradient-to-t from-white to-[#FF8A00] rounded-full shadow-[0_0_12px_rgba(255,138,0,0.8)] -translate-y-12" />
            </div>

            {/* Center Gauge Digital Readout */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tighter tabular-nums">
                {speed}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A1A1AA] font-mono">
                MPH
              </span>
            </div>
          </div>

          {/* Dealership Logo & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#FF4D2E] via-[#FF8A00] to-[#FFC14D] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#0A0B0F] rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Archivo']">
                {DEALERSHIP.name}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              {DEALERSHIP.tagline}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
