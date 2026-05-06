import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  uid?: string | null;
  userName?: string | null;
}

export const QRModal: React.FC<QRModalProps> = ({ open, onClose, uid, userName }) => {
  const memberCode = uid ? `JH-${uid.substring(0, 8).toUpperCase()}` : 'JH-DEMO';
  const qrPayload = uid
    ? `https://jelantah-hub.vercel.app/m/${uid}`
    : 'https://jelantah-hub.vercel.app';

  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(memberCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* clipboard not available */
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
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            className="bg-cream-100 w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border border-[#E8DEC4] shadow-[var(--shadow-lg)] flex flex-col"
          >
            <div className="px-6 pt-6 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 id="qr-modal-title" className="font-display font-extrabold text-xl text-forest-900">
                  QR Member
                </h3>
                <p className="text-xs text-forest-900/60 mt-1">
                  Tunjukkan QR ini ke petugas titik kumpul untuk verifikasi setoran.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="shrink-0 w-9 h-9 rounded-full hover:bg-cream-200 flex items-center justify-center text-forest-900/70"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 pb-4 flex flex-col items-center">
              <div className="bg-cream-50 border border-[#E8DEC4] rounded-2xl p-5 shadow-[var(--shadow-md)]">
                <QRCode
                  value={qrPayload}
                  size={208}
                  bgColor="#FBF6E9"
                  fgColor="#0E3B2E"
                  level="M"
                  style={{ height: 'auto', maxWidth: '100%', width: '208px' }}
                />
              </div>

              {userName && (
                <p className="mt-4 text-sm font-semibold text-forest-900 truncate max-w-full">
                  {userName}
                </p>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="mt-3 inline-flex items-center gap-2 bg-white border border-[#E8DEC4] rounded-full px-4 py-2 text-sm font-bold text-forest-700 hover:bg-cream-50 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={14} className="text-amber-600" aria-hidden="true" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" />
                    {memberCode}
                  </>
                )}
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
                💡 Petugas titik kumpul akan scan QR ini, masukkan volume jelantah, dan poin
                otomatis masuk ke akunmu setelah verifikasi.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
