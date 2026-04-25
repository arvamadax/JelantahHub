import React from 'react';
import { motion } from 'motion/react';
import {
  Leaf,
  ArrowRight,
  Trash2,
  Truck,
  Wallet,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateAuth: () => void;
}

const STEPS = [
  {
    icon: Trash2,
    title: 'Kumpulkan',
    description:
      'Simpan minyak jelantah bekas pakai dari rumah atau dapurmu di wadah tertutup.',
    accent: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: Truck,
    title: 'Setor',
    description:
      'Antar ke titik kumpul terdekat atau jadwalkan penjemputan lewat mitra JelantahHub.',
    accent: 'from-teal-400 to-teal-600',
  },
  {
    icon: Wallet,
    title: 'Cairkan Poin',
    description:
      'Tukarkan poinmu jadi saldo digital, pulsa, atau donasi sosial — semua dari satu app.',
    accent: 'from-emerald-500 to-teal-700',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-display font-black text-lg shadow-md shadow-emerald-500/30">
              J
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
              JelantahHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#impact" className="hover:text-emerald-600 transition-colors">
              Cara Kerja
            </a>
            <a href="#why" className="hover:text-emerald-600 transition-colors">
              Kenapa Kami
            </a>
          </nav>

          <button
            onClick={onNavigateAuth}
            className="px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
          >
            Masuk / Daftar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] bg-emerald-400/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
        <div className="absolute top-40 -left-24 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6 border border-emerald-100"
              >
                <Sparkles size={14} />
                Platform Eco-Fintech Sirkular
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05] text-slate-900"
              >
                Ubah Limbah <br className="hidden md:block" />
                Menjadi{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Berkah
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-6 text-base md:text-lg text-slate-600 max-w-xl leading-relaxed"
              >
                Setor minyak jelantah bekas pakaimu, daur ulang menjadi biofuel
                ramah lingkungan, dan dapatkan poin yang bisa langsung dicairkan.
                Satu tetes kebaikan untuk bumi, satu langkah untuk dompetmu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={onNavigateAuth}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all min-h-[56px]"
                >
                  Mulai Sekarang
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
                <a
                  href="#impact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold rounded-2xl shadow-sm transition-all min-h-[56px]"
                >
                  Pelajari Cara Kerja
                </a>
              </motion.div>

              <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Terverifikasi Mitra Daur Ulang
                </div>
                <div className="flex items-center gap-2">
                  <Leaf size={16} className="text-emerald-600" />
                  Dampak Karbon Terukur
                </div>
              </div>
            </div>

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-5"
            >
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-500/30 overflow-hidden">
                <div className="absolute -top-20 -right-16 w-56 h-56 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <p className="text-xs font-medium text-emerald-100 mb-2">
                    Dampak Bulan Ini
                  </p>
                  <h3 className="font-display font-extrabold text-5xl leading-none mb-1">
                    12,480 L
                  </h3>
                  <p className="text-sm text-emerald-50/90">
                    Jelantah berhasil didaur ulang dari komunitas
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                      <p className="text-2xl font-display font-extrabold">
                        3.2K
                      </p>
                      <p className="text-[11px] text-emerald-100">Anggota Aktif</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                      <p className="text-2xl font-display font-extrabold">
                        85+
                      </p>
                      <p className="text-[11px] text-emerald-100">Titik Kumpul</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact / How it works */}
      <section id="impact" className="bg-white border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-20 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 text-sm font-bold tracking-wide uppercase mb-3">
              Bagaimana Cara Kerjanya
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-slate-900">
              Tiga langkah, satu dampak besar.
            </h2>
            <p className="mt-4 text-slate-600">
              Dari dapurmu ke kilang biofuel — JelantahHub menyederhanakan rantai
              daur ulang minyak goreng bekas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-3xl p-7 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center text-white shadow-md mb-5`}
                  >
                    <Icon size={26} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-600">
                      0{idx + 1}
                    </span>
                    <span className="h-px flex-1 bg-emerald-100" />
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section id="why" className="bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-20 md:py-24">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-10 md:p-14 text-white shadow-xl shadow-emerald-500/20">
            <div className="absolute -top-16 -right-10 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-tight">
                  Siap mengubah jelantah jadi penghasilan?
                </h2>
                <p className="mt-4 text-emerald-50/90 max-w-md">
                  Bergabung gratis. Dapatkan poin pertamamu hari ini dan jadi
                  bagian dari ekonomi sirkular Indonesia.
                </p>
              </div>
              <div className="flex md:justify-end">
                <button
                  onClick={onNavigateAuth}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-emerald-700 font-bold rounded-2xl shadow-lg transition-all min-h-[56px]"
                >
                  Mulai Sekarang
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-emerald-600" />
            <span>© {new Date().getFullYear()} JelantahHub. Sirkular untuk semua.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Privasi
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Syarat
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Kontak
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
