import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';

interface SetorConfirmModalProps {
  open: boolean;
  defaultNodeName?: string;
  defaultLiters?: number;
  onClose: () => void;
  onConfirm: (volumeLiters: number, nodeName: string) => Promise<void> | void;
}

export const SetorConfirmModal: React.FC<SetorConfirmModalProps> = ({
  open,
  defaultNodeName = 'Bank Sampah Melati',
  defaultLiters = 5,
  onClose,
  onConfirm,
}) => {
  const [liters, setLiters] = useState(defaultLiters);
  const [submitting, setSubmitting] = useState(false);
  const points = liters * 100;

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
    if (open) setLiters(defaultLiters);
  }, [open, defaultLiters]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(liters, defaultNodeName);
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
            aria-labelledby="setor-modal-title"
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-[#E8DEC4] shadow-[var(--shadow-lg)] flex flex-col"
          >
            <style>{`
              .setor-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 9999px;
                outline: none;
                cursor: pointer;
                background: linear-gradient(to right,
                  var(--color-amber-500) 0%,
                  var(--color-amber-500) var(--fill, 25%),
                  var(--color-cream-300) var(--fill, 25%),
                  var(--color-cream-300) 100%);
              }
              .setor-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 22px;
                height: 22px;
                border-radius: 9999px;
                background: var(--color-forest-700);
                border: 3px solid var(--color-cream-50);
                box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.30);
                cursor: grab;
              }
              .setor-slider:active::-webkit-slider-thumb { cursor: grabbing; }
              .setor-slider::-moz-range-thumb {
                width: 22px;
                height: 22px;
                border-radius: 9999px;
                background: var(--color-forest-700);
                border: 3px solid var(--color-cream-50);
                box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.30);
                cursor: grab;
              }
            `}</style>

            <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 id="setor-modal-title" className="font-display font-extrabold text-xl text-forest-900">
                  Setor Jelantah
                </h3>
                <p className="text-xs text-forest-900/60 mt-1 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-600" aria-hidden="true" />
                  <span>Lokasi: <strong className="text-forest-900">{defaultNodeName}</strong></span>
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

            <div className="px-6 pb-2">
              <div className="bg-cream-50 border border-[#E8DEC4] rounded-xl p-4">
                <p className="text-xs text-forest-900/60 mb-1">Volume jelantah</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display font-extrabold text-3xl text-forest-900 tabular-nums">{liters}</p>
                  <p className="text-sm font-semibold text-forest-900/65">liter</p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={liters}
                  onChange={(e) => setLiters(Number(e.target.value))}
                  aria-label="Volume liter"
                  aria-valuetext={`${liters} liter, dapat ${points} poin`}
                  className="setor-slider w-full mt-3"
                  style={{ ['--fill' as string]: `${((liters - 1) / 19) * 100}%` }}
                />
                <div className="flex justify-between text-xs text-forest-900/55 mt-1 tabular-nums">
                  <span>1 L</span>
                  <span>10 L</span>
                  <span>20 L</span>
                </div>
              </div>

              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-800/80">Poin yang akan kamu terima</p>
                  <p className="font-display font-extrabold text-2xl text-amber-700 tabular-nums">
                    +{points.toLocaleString('id-ID')} Pts
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-3 py-1">
                  Rp {(points * 100).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-11 rounded-xl border border-[#E8DEC4] text-forest-900/80 font-semibold text-sm hover:bg-cream-50 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 h-11 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:opacity-70 disabled:cursor-not-allowed text-cream-50 font-bold text-sm shadow-[var(--shadow-forest)] transition-colors"
              >
                {submitting ? 'Menyimpan…' : 'Konfirmasi Setor'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
