import React, { useState } from 'react';
import { Wallet, Leaf, Sparkles } from 'lucide-react';

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
  const [interacting, setInteracting] = useState(false);

  const rpPerMonth = liters * RP_PER_LITER;
  const kgCO2 = liters * KG_CO2_PER_LITER;
  const fillPct = ((liters - MIN_L) / (MAX_L - MIN_L)) * 100;

  return (
    <div className="relative bg-white rounded-3xl p-7 border border-border shadow-[var(--shadow-lg)]">
      <div
        aria-hidden="true"
        className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-border"
      />

      <style>{`
        .hero-calc-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          margin: 0;
        }
        .hero-calc-slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }
        .hero-calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: var(--color-forest-700);
          border: 3px solid var(--color-cream-50);
          box-shadow:
            0 0 0 5px rgba(217, 119, 6, 0.18),
            0 4px 14px -2px rgba(14, 59, 46, 0.35);
          cursor: grab;
          margin-top: -10px;
          transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 200ms ease;
        }
        .hero-calc-slider:hover::-webkit-slider-thumb {
          transform: scale(1.05);
          box-shadow:
            0 0 0 7px rgba(217, 119, 6, 0.22),
            0 6px 18px -2px rgba(14, 59, 46, 0.42);
        }
        .hero-calc-slider:active::-webkit-slider-thumb,
        .hero-calc-slider:focus-visible::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.12);
          box-shadow:
            0 0 0 9px rgba(217, 119, 6, 0.28),
            0 8px 22px -2px rgba(14, 59, 46, 0.50);
        }
        .hero-calc-slider::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }
        .hero-calc-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: var(--color-forest-700);
          border: 3px solid var(--color-cream-50);
          box-shadow:
            0 0 0 5px rgba(217, 119, 6, 0.18),
            0 4px 14px -2px rgba(14, 59, 46, 0.35);
          cursor: grab;
          transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 200ms ease;
        }
        .hero-calc-slider:hover::-moz-range-thumb {
          transform: scale(1.05);
        }
        .hero-calc-slider:active::-moz-range-thumb,
        .hero-calc-slider:focus-visible::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.12);
          box-shadow:
            0 0 0 9px rgba(217, 119, 6, 0.28),
            0 8px 22px -2px rgba(14, 59, 46, 0.50);
        }
        .hero-calc-bubble {
          transition: left 160ms ease, opacity 200ms ease,
            transform 200ms ease;
        }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold tracking-[0.12em] uppercase text-amber-700">
          HITUNG DAMPAKMU
        </p>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
          <Sparkles size={11} />
          Real-time
        </span>
      </div>

      <p className="font-display font-semibold text-forest-900 text-lg">
        Berapa liter jelantahmu sebulan?
      </p>

      <div className="mt-7">
        <div className="relative">
          <div
            aria-hidden="true"
            className={`hero-calc-bubble absolute -top-9 -translate-x-1/2 ${
              interacting ? 'opacity-100 -translate-y-0' : 'opacity-0 translate-y-1'
            }`}
            style={{ left: `${fillPct}%` }}
          >
            <span className="inline-block bg-forest-700 text-cream-50 text-xs font-bold tabular-nums px-2.5 py-1 rounded-md shadow-[var(--shadow-md)]">
              {liters} L
            </span>
            <span
              aria-hidden="true"
              className="block w-2 h-2 bg-forest-700 absolute left-1/2 -translate-x-1/2 -bottom-0.5 rotate-45"
            />
          </div>

          <input
            type="range"
            min={MIN_L}
            max={MAX_L}
            step={1}
            value={liters}
            onChange={(e) => setLiters(Number(e.target.value))}
            onMouseDown={() => setInteracting(true)}
            onMouseUp={() => setInteracting(false)}
            onMouseLeave={() => setInteracting(false)}
            onTouchStart={() => setInteracting(true)}
            onTouchEnd={() => setInteracting(false)}
            onFocus={() => setInteracting(true)}
            onBlur={() => setInteracting(false)}
            aria-label="Liter jelantah per bulan"
            aria-valuetext={`${liters} liter, sekitar Rp ${rpFormatter.format(
              rpPerMonth,
            )} per bulan`}
            className="hero-calc-slider"
            style={{
              background: `linear-gradient(to right,
                var(--color-amber-400) 0%,
                var(--color-amber-500) ${fillPct}%,
                var(--color-cream-200) ${fillPct}%,
                var(--color-cream-300) 100%)`,
            }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-forest-900/55 tabular-nums font-medium">
          <span>1 L</span>
          <span>25 L</span>
          <span>50 L</span>
        </div>
      </div>

      <div
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7"
      >
        <div className="relative bg-cream-50 border border-border rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-1.5 text-forest-700/80 mb-1">
            <Wallet size={14} aria-hidden="true" />
            <p className="text-xs font-semibold">Saldo masuk</p>
          </div>
          <p className="font-display font-extrabold tabular-nums text-[1.75rem] leading-none text-forest-700 mt-1.5 break-all">
            Rp {rpFormatter.format(rpPerMonth)}
          </p>
          <p className="text-xs text-forest-900/60 mt-1">/bulan</p>
        </div>

        <div className="relative bg-cream-50 border border-border rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-600/90 mb-1">
            <Leaf size={14} aria-hidden="true" />
            <p className="text-xs font-semibold text-forest-700/80">Karbon dihindari</p>
          </div>
          <p className="font-display font-extrabold tabular-nums text-[1.75rem] leading-none text-amber-600 mt-1.5">
            {co2Formatter.format(kgCO2)}{' '}
            <span className="text-base">kg CO₂</span>
          </p>
          <p className="text-xs text-forest-900/60 mt-1">/bulan</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCTA}
        className="group mt-6 inline-flex items-center gap-1 text-amber-700 font-semibold text-sm hover:text-amber-800 transition-colors duration-150"
      >
        <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        Setor pertamamu, dapat +1.000 poin bonus
      </button>
    </div>
  );
};
