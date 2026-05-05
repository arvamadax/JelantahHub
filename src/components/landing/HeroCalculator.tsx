import React, { useState } from 'react';

const RP_PER_LITER = 5_000;
const KG_CO2_PER_LITER = 2.4;
const MIN_L = 1;
const MAX_L = 50;
const DEFAULT_L = 25;

const rpFormatter = new Intl.NumberFormat('id-ID');
const co2Formatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface HeroCalculatorProps {
  onCTA?: () => void;
}

export const HeroCalculator: React.FC<HeroCalculatorProps> = ({ onCTA }) => {
  const [liters, setLiters] = useState(DEFAULT_L);

  const rpPerMonth = liters * RP_PER_LITER;
  const kgCO2 = liters * KG_CO2_PER_LITER;
  const fillPct = ((liters - MIN_L) / (MAX_L - MIN_L)) * 100;

  return (
    <div className="relative bg-white rounded-3xl p-7 border border-[#E8DEC4] shadow-[var(--shadow-lg)]">
      {/* Subtle bridge to hero text on desktop */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-[#E8DEC4]"
      />
      {/* Scoped slider pseudo-element styles — native <input type="range">
          can't be styled via Tailwind utilities for ::thumb / ::track. */}
      <style>{`
        .hero-calc-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          /* Track fill is set via inline linear-gradient on background. */
        }
        .hero-calc-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }
        .hero-calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: var(--color-forest-700);
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.30);
          border: none;
          cursor: grab;
          margin-top: -9px; /* center 24px thumb on 6px track */
          transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hero-calc-slider:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.08);
        }
        .hero-calc-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.55);
        }
        .hero-calc-slider::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: transparent;
        }
        .hero-calc-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: var(--color-forest-700);
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.30);
          border: none;
          cursor: grab;
          transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hero-calc-slider:active::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.08);
        }
        .hero-calc-slider:focus-visible::-moz-range-thumb {
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.55);
        }
      `}</style>

      {/* 1. Overline */}
      <p className="text-xs font-bold tracking-[0.12em] uppercase text-amber-700">
        HITUNG DAMPAKMU
      </p>

      {/* 2. Question */}
      <p className="font-display font-semibold text-forest-900 text-[18px] mt-3">
        Berapa liter jelantahmu sebulan?
      </p>

      {/* 3. Slider */}
      <div className="mt-6">
        <input
          type="range"
          min={MIN_L}
          max={MAX_L}
          step={1}
          value={liters}
          onChange={(e) => setLiters(Number(e.target.value))}
          aria-label="Liter jelantah per bulan"
          aria-valuetext={`${liters} liter, sekitar Rp ${rpFormatter.format(
            rpPerMonth,
          )} per bulan`}
          className="hero-calc-slider"
          style={{
            background: `linear-gradient(to right,
              var(--color-amber-500) 0%,
              var(--color-amber-500) ${fillPct}%,
              var(--color-cream-300) ${fillPct}%,
              var(--color-cream-300) 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-forest-900/60 tabular-nums">
          <span>1 L</span>
          <span>25 L</span>
          <span>50 L</span>
        </div>
      </div>

      {/* 4. Output grid */}
      <div
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
      >
        {/* Saldo masuk */}
        <div className="bg-cream-50 border border-[#E8DEC4] rounded-xl p-4">
          <p className="text-[12px] text-forest-900/60">Saldo masuk</p>
          <p className="font-display font-extrabold tabular-nums text-[2rem] leading-none text-forest-700 mt-1">
            Rp {rpFormatter.format(rpPerMonth)}
          </p>
          <p className="text-xs text-forest-900/60 mt-1">/bulan</p>
        </div>

        {/* Karbon dihindari */}
        <div className="bg-cream-50 border border-[#E8DEC4] rounded-xl p-4">
          <p className="text-[12px] text-forest-900/60">Karbon dihindari</p>
          <p className="font-display font-extrabold tabular-nums text-[2rem] leading-none text-amber-600 mt-1">
            {co2Formatter.format(kgCO2)} kg CO₂
          </p>
          <p className="text-xs text-forest-900/60 mt-1">/bulan</p>
        </div>
      </div>

      {/* 5. Footer CTA */}
      <button
        type="button"
        onClick={onCTA}
        className="mt-6 inline-flex items-center text-amber-700 font-semibold text-sm hover:text-amber-800 transition-colors duration-150"
      >
        → Setor pertamamu, dapat +1.000 poin bonus
      </button>
    </div>
  );
};
