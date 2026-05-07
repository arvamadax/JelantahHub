import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle } from 'lucide-react';

const PARTNERS = [
  { id: 'gopay', label: 'GoPay', accent: 'text-[#00AED6]' },
  { id: 'dana', label: 'DANA', accent: 'text-[#118EEA]' },
  { id: 'ovo', label: 'OVO', accent: 'text-[#4C2A86]' },
] as const;
type PartnerId = (typeof PARTNERS)[number]['id'];

const DENOMINATIONS = [
  { points: 200, rupiah: 20000 },
  { points: 500, rupiah: 50000 },
  { points: 1000, rupiah: 100000 },
] as const;

interface TukarRewardModalProps {
  open: boolean;
  currentPoints: number;
  onClose: () => void;
  onConfirm: (points: number, partnerLabel: string) => Promise<void> | void;
}

export const TukarRewardModal: React.FC<TukarRewardModalProps> = ({
  open,
  currentPoints,
  onClose,
  onConfirm,
}) => {
  const [partner, setPartner] = useState<PartnerId>('gopay');
  const [pointsAmount, setPointsAmount] = useState<number>(DENOMINATIONS[0].points);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, submitting]);

  useEffect(() => {
    if (open) {
      setPartner('gopay');
      setPointsAmount(DENOMINATIONS[0].points);
    }
  }, [open]);

  const insufficient = currentPoints < pointsAmount;
  const partnerLabel = PARTNERS.find((p) => p.id === partner)?.label ?? 'GoPay';
  const denomination = DENOMINATIONS.find((d) => d.points === pointsAmount) ?? DENOMINATIONS[0];

  const handleConfirm = async () => {
    if (insufficient) return;
    setSubmitting(true);
    try {
      await onConfirm(pointsAmount, partnerLabel);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-forest-900/55 backdrop-blur-sm flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={() => !submitting && onClose()}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tukar-modal-title"
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border shadow-[var(--shadow-lg)] flex flex-col max-h-[90vh]"
          >
            <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 id="tukar-modal-title" className="font-display font-extrabold text-xl text-forest-900">
                  Tukar Poin
                </h3>
                <p className="text-xs text-forest-900/60 mt-1">
                  Saldo poin saat ini:{' '}
                  <strong className="text-forest-900 tabular-nums">
                    {currentPoints.toLocaleString('id-ID')} Pts
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Tutup"
                className="shrink-0 w-9 h-9 rounded-full hover:bg-cream-100 flex items-center justify-center text-forest-900/70 disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 pb-2 space-y-4 overflow-y-auto">
              {/* Partner picker */}
              <div>
                <p className="text-xs font-semibold text-forest-900/65 uppercase tracking-wider mb-2">
                  Pilih e-wallet
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PARTNERS.map((p) => {
                    const active = p.id === partner;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPartner(p.id)}
                        disabled={submitting}
                        className={
                          active
                            ? 'relative rounded-xl border-2 border-amber-500 bg-amber-50 py-3 px-2 text-sm font-display font-extrabold text-forest-900 shadow-[var(--shadow-amber)] transition-all'
                            : 'rounded-xl border border-border bg-white py-3 px-2 text-sm font-display font-bold text-forest-900/70 hover:border-forest-200 hover:text-forest-900 transition-all'
                        }
                      >
                        {p.label}
                        {active && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-cream-50 flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Denomination */}
              <div>
                <p className="text-xs font-semibold text-forest-900/65 uppercase tracking-wider mb-2">
                  Nominal
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DENOMINATIONS.map((d) => {
                    const active = d.points === pointsAmount;
                    const cantAfford = currentPoints < d.points;
                    return (
                      <button
                        key={d.points}
                        type="button"
                        onClick={() => setPointsAmount(d.points)}
                        disabled={submitting || cantAfford}
                        className={
                          active
                            ? 'rounded-xl border-2 border-forest-700 bg-forest-50 py-3 px-2 text-center transition-all'
                            : cantAfford
                            ? 'rounded-xl border border-border bg-cream-50 py-3 px-2 text-center opacity-50 cursor-not-allowed transition-all'
                            : 'rounded-xl border border-border bg-white py-3 px-2 text-center hover:border-forest-200 transition-all'
                        }
                      >
                        <p
                          className={`font-display font-extrabold text-base tabular-nums ${
                            active ? 'text-forest-700' : 'text-forest-900/85'
                          }`}
                        >
                          {d.points} Pts
                        </p>
                        <p className="text-xs text-forest-900/60 mt-0.5">
                          Rp {d.rupiah.toLocaleString('id-ID')}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-cream-50 border border-border rounded-xl p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-forest-900/70">Kamu akan mendapat</span>
                  <span className="font-display font-extrabold text-xl text-forest-900 tabular-nums">
                    Rp {denomination.rupiah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3 mt-1.5">
                  <span className="text-xs text-forest-900/60">via {partnerLabel}</span>
                  <span className="text-xs text-amber-700 font-semibold tabular-nums">
                    -{pointsAmount.toLocaleString('id-ID')} Pts
                  </span>
                </div>
              </div>

              {insufficient && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2"
                >
                  <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="text-xs text-red-700 leading-relaxed">
                    Poin belum cukup. Setor jelantah lebih banyak untuk membuka nominal ini.
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-11 rounded-xl border border-border text-forest-900/80 font-semibold text-sm hover:bg-cream-50 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting || insufficient}
                className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-cream-50 font-bold text-sm shadow-[var(--shadow-amber)] transition-colors"
              >
                {submitting ? 'Memproses…' : `Tukar ke ${partnerLabel}`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
