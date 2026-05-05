import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthPageProps {
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { signIn } = useAuth();
  const [authStatus, setAuthStatus] = React.useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setAuthStatus('loading');
    setErrorMessage(null);
    try {
      await signIn();
    } catch (err) {
      const code = (err as { code?: string })?.code;
      let msg = 'Login gagal. Coba lagi atau hubungi tim support.';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthStatus('idle');
        return;
      }
      if (code === 'auth/popup-blocked') {
        msg = 'Browser memblokir popup login. Izinkan popup untuk situs ini lalu coba lagi.';
      } else if (code === 'auth/network-request-failed') {
        msg = 'Koneksi bermasalah. Periksa internet kamu lalu coba lagi.';
      }
      setAuthStatus('error');
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-cream-100 flex flex-col">
      <header className="sticky top-0 z-30 h-16 bg-cream-100/85 backdrop-blur-md border-b border-[#E8DEC4]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 h-full">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900 px-3 py-2 -ml-3 rounded-lg hover:bg-forest-50 transition-colors duration-150"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
          <div className="flex items-center gap-2.5">
            <img
              src="/logos/jelantahhub-256.png"
              alt="JelantahHub"
              className="w-10 h-10 object-contain"
              width={40}
              height={40}
            />
            <span className="font-display font-extrabold tracking-tight text-forest-900">
              JelantahHub
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-2xl border border-[#E8DEC4] shadow-[var(--shadow-lg)] p-8"
        >
          <div className="text-center">
            <img
              src="/logos/jelantahhub-256.png"
              alt="JelantahHub"
              className="w-20 h-20 object-contain mx-auto mb-6"
              width={80}
              height={80}
            />
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-forest-900">
              Masuk ke JelantahHub
            </h1>
            <p className="mt-2 text-sm text-forest-900/60">
              Lanjutkan perjalanan sirkularmu — gratis dan tanpa kartu kredit.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={authStatus === 'loading'}
              aria-busy={authStatus === 'loading'}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-forest-700 hover:bg-forest-800 active:bg-forest-900 disabled:opacity-70 disabled:cursor-not-allowed text-cream-50 font-bold rounded-xl shadow-[var(--shadow-forest)] transition-colors duration-150 min-h-[56px]"
            >
              {authStatus === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Menghubungkan…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                      fill="#FFC107"
                      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.92-2.26c-.81.54-1.84.86-3.03.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.32A9 9 0 0 0 9 18z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.3-1.72V4.96H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.04l3.03-2.32z"
                    />
                    <path
                      fill="#1976D2"
                      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .94 4.96l3.03 2.32C4.68 5.16 6.66 3.58 9 3.58z"
                    />
                  </svg>
                  Lanjutkan dengan Google
                </>
              )}
            </button>

            {authStatus === 'error' && errorMessage && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2"
              >
                <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs text-red-700 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#E8DEC4]" />
              <span className="text-xs text-forest-900/60">opsi lain</span>
              <div className="flex-1 h-px bg-[#E8DEC4]" />
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-cream-50 border border-dashed border-[#E8DEC4] text-forest-900/60 font-semibold rounded-xl cursor-not-allowed min-h-[56px]"
            >
              Login Nomor HP
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Segera Hadir
              </span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 justify-center text-xs text-forest-900/60">
            <ShieldCheck size={14} className="text-forest-700" aria-hidden="true" />
            Data kamu dienkripsi & tidak akan dibagikan.
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-amber-800">
              💰 Rata-rata pengguna aktif mendapat{' '}
              <strong>Rp 87.000/bulan</strong>
            </p>
          </div>

          <p className="mt-8 text-xs text-center text-forest-900/65 leading-relaxed">
            Dengan melanjutkan, kamu menyetujui Syarat Layanan dan Kebijakan Privasi
            JelantahHub.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
