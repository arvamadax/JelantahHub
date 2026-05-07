import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, ChevronDown } from 'lucide-react';

interface NodeOption {
  id: string;
  nama: string;
}

interface SetorConfirmModalProps {
  open: boolean;
  defaultNodeName?: string;
  defaultLiters?: number;
  availableNodes?: NodeOption[];
  onClose: () => void;
  onConfirm: (volumeLiters: number, nodeName: string) => Promise<void> | void;
}

export const SetorConfirmModal: React.FC<SetorConfirmModalProps> = ({
  open,
  defaultNodeName = 'Bank Sampah Melati',
  defaultLiters = 5,
  availableNodes,
  onClose,
  onConfirm,
}) => {
  const [liters, setLiters] = useState(defaultLiters);
  const [submitting, setSubmitting] = useState(false);
  const [nodeName, setNodeName] = useState(defaultNodeName);
  const points = liters * 100;

  const nodeOptions = useMemo<NodeOption[]>(() => {
    if (availableNodes && availableNodes.length > 0) return availableNodes;
    return [{ id: 'default', nama: defaultNodeName }];
  }, [availableNodes, defaultNodeName]);

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
      setLiters(defaultLiters);
      setNodeName(defaultNodeName);
    }
  }, [open, defaultLiters, defaultNodeName]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(liters, nodeName);
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
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border shadow-[var(--shadow-lg)] flex flex-col"
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
                  var(--color-amber-400) 0%,
                  var(--color-amber-500) var(--fill, 25%),
                  var(--color-cream-200) var(--fill, 25%),
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
                box-shadow:
                  0 0 0 4px rgba(217, 119, 6, 0.20),
                  0 4px 10px -2px rgba(14, 59, 46, 0.30);
                cursor: grab;
                margin-top: -8px;
                transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              .setor-slider:active::-webkit-slider-thumb {
                cursor: grabbing;
                transform: scale(1.12);
              }
              .setor-slider::-moz-range-thumb {
                width: 22px;
                height: 22px;
                border-radius: 9999px;
                background: var(--color-forest-700);
                border: 3px solid var(--color-cream-50);
                box-shadow:
                  0 0 0 4px rgba(217, 119, 6, 0.20),
                  0 4px 10px -2px rgba(14, 59, 46, 0.30);
                cursor: grab;
                transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              .setor-slider:active::-moz-range-thumb {
                cursor: grabbing;
                transform: scale(1.12);
              }
            `}</style>

            <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 id="setor-modal-title" className="font-display font-extrabold text-xl text-forest-900">
                  Setor Jelantah
                </h3>
                <p className="text-xs text-forest-900/60 mt-1">
                  Pilih lokasi setor dan volume jelantah.
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

            <div className="px-6 pb-2 space-y-3">
              {/* Node picker */}
              <div className="bg-cream-50 border border-border rounded-xl p-4">
                <label
                  htmlFor="setor-node-select"
                  className="text-xs text-forest-900/60 font-medium flex items-center gap-1"
                >
                  <MapPin size={12} className="text-amber-600" aria-hidden="true" />
                  Lokasi setor
                </label>
                {nodeOptions.length > 1 ? (
                  <div className="relative mt-1.5">
                    <select
                      id="setor-node-select"
                      value={nodeName}
                      onChange={(e) => setNodeName(e.target.value)}
                      disabled={submitting}
                      className="w-full appearance-none bg-white border border-border rounded-lg px-3 py-2.5 pr-10 text-sm font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                    >
                      {nodeOptions.map((n) => (
                        <option key={n.id} value={n.nama}>
                          {n.nama}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/55 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <p className="font-display font-bold text-forest-900 text-base mt-1">
                    {nodeName}
                  </p>
                )}
              </div>

              {/* Volume slider */}
              <div className="bg-cream-50 border border-border rounded-xl p-4">
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

              {/* Reward preview */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
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
                className="flex-1 h-11 rounded-xl border border-border text-forest-900/80 font-semibold text-sm hover:bg-cream-50 disabled:opacity-50 transition-colors"
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
