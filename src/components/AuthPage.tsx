import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthPageProps {
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { signIn } = useAuth();

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 h-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 -ml-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-display font-black text-sm shadow-md shadow-emerald-500/30">
              J
            </div>
            <span className="font-display font-extrabold tracking-tight text-slate-900">
              JelantahHub
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-display font-black text-3xl mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              J
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
              Masuk ke JelantahHub
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Lanjutkan perjalanan sirkularmu — gratis dan tanpa kartu kredit.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={signIn}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all min-h-[56px]"
            >
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
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 justify-center text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            Data kamu dienkripsi & tidak akan dibagikan.
          </div>

          <p className="mt-8 text-[11px] text-center text-slate-400 leading-relaxed">
            Dengan melanjutkan, kamu menyetujui{' '}
            <a href="#" className="text-emerald-700 hover:underline">
              Syarat Layanan
            </a>{' '}
            dan{' '}
            <a href="#" className="text-emerald-700 hover:underline">
              Kebijakan Privasi
            </a>{' '}
            JelantahHub.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
