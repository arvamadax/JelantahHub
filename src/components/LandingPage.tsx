import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowDown,
  Droplets,
  Truck,
  Clock,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { HeroCalculator } from './landing/HeroCalculator';

const PROOF_STATS = [
  {
    label: 'Jelantah terkumpul',
    number: '14.832 L',
    sub: 'sejak Januari 2026',
  },
  {
    label: 'Diproses jadi biofuel',
    number: '11.865 L',
    sub: 'efisiensi 79,9%',
  },
  {
    label: 'Karbon dihindari',
    number: '31,4 ton CO₂',
    sub: 'setara 134 pohon/tahun',
  },
  {
    label: 'Kembali ke warga',
    number: 'Rp 74.160.000',
    sub: 'ke 1.386 keluarga aktif',
  },
];

interface LandingPageProps {
  onNavigateAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth }) => {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 h-16 bg-cream-100/85 backdrop-blur-md border-b border-[#E8DEC4]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 h-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center font-display font-black text-lg">
              J
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-forest-900">
              JelantahHub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-forest-700/70">
            <a href="#cara-kerja" className="hover:text-forest-700 transition-colors duration-150">
              Cara Kerja
            </a>
            <a href="#dampak" className="hover:text-forest-700 transition-colors duration-150">
              Dampak
            </a>
            <a href="#mitra" className="hover:text-forest-700 transition-colors duration-150">
              Mitra
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onNavigateAuth}
              className="hidden sm:inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900 px-3 py-2 rounded-lg transition-colors duration-150"
            >
              Masuk
            </button>
            <button
              onClick={onNavigateAuth}
              className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-cream-50 font-bold text-sm shadow-[var(--shadow-forest)] transition-colors duration-150"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-cream-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            {/* LEFT: Text */}
            <div className="md:col-span-7">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42 }}
                className="inline-flex items-center gap-2 text-amber-700 text-[12px] font-bold tracking-[0.12em] uppercase mb-6"
              >
                <span className="h-px w-8 bg-amber-500 inline-block" />
                ECO-FINTECH PLATFORM SIRKULAR
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.06 }}
                className="font-display font-extrabold text-[clamp(2.5rem,5vw+1rem,4.5rem)] leading-[1.02] tracking-[-0.03em] text-forest-900 max-w-[14ch]"
              >
                Jelantahmu, <span className="text-amber-500">rupiahmu</span>.
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.12 }}
                className="mt-6 text-[clamp(1rem,0.5vw+0.875rem,1.125rem)] leading-[1.6] text-forest-900/70 max-w-[52ch]"
              >
                Setor minyak goreng bekas pakaimu, daur ulang jadi biofuel,
                dan cairkan poin ke GoPay, DANA, atau OVO.
                <span className="font-semibold text-forest-900">
                  {' '}Setiap 5 liter = Rp 25.000 + 12 kg CO₂ dihindari.
                </span>
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.2 }}
                className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
              >
                <button
                  onClick={onNavigateAuth}
                  className="group inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-cream-50 font-display font-bold shadow-[var(--shadow-amber)] transition-colors duration-150"
                >
                  Mulai Setor Sekarang
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform duration-150"
                  />
                </button>

                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-sm hover:text-amber-800 transition-colors duration-150"
                >
                  Lihat cara kerja
                  <ArrowDown size={14} />
                </a>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              >
                <span className="text-forest-900/60 text-[13px]">
                  Mitra resmi:
                </span>
                <img
                  src="/logos/klhk.png"
                  alt="KLHK"
                  className="h-6 opacity-70 mix-blend-multiply"
                />
                <img
                  src="/logos/pertamina-nre.jpg"
                  alt="Pertamina NRE"
                  className="h-6 opacity-70 mix-blend-multiply"
                />
                <img
                  src="/logos/iyref.webp"
                  alt="IYREF 2026"
                  className="h-6 opacity-70 mix-blend-multiply"
                />
              </motion.div>
            </div>

            {/* RIGHT: Interactive calculator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="md:col-span-5"
            >
              <HeroCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact / How it works */}
      <section id="cara-kerja" className="bg-white border-y border-[#E8DEC4]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-20 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-amber-700 text-sm font-bold tracking-wide uppercase mb-3">
              Bagaimana Cara Kerjanya
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-forest-900">
              Tiga langkah, satu dampak besar.
            </h2>
            <p className="mt-4 text-forest-900/70">
              Dari dapurmu ke kilang biofuel — JelantahHub menyederhanakan rantai
              daur ulang minyak goreng bekas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Kumpulkan (AMBER) */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0 }}
              className="relative overflow-hidden bg-amber-50 border border-amber-200 rounded-2xl p-7 min-h-[320px] flex flex-col"
            >
              <span className="absolute top-5 right-6 font-display font-black text-[88px] leading-none text-amber-200/60 select-none pointer-events-none">
                01
              </span>
              <Droplets size={40} className="text-amber-500 mb-5 relative" />
              <h3 className="relative font-display font-extrabold text-xl text-amber-900 mb-2">
                Kumpulkan
              </h3>
              <p className="relative text-sm text-amber-900/75 leading-relaxed">
                Simpan jelantah dapurmu di jerigen tertutup.{' '}
                <span className="font-semibold">Minimal 1 liter.</span>
              </p>
              <div className="relative mt-auto pt-4 border-t border-amber-200/70 flex items-center gap-2 text-amber-700 text-[13px]">
                <Clock size={14} />
                Cukup 30 detik per minggu
              </div>
            </motion.article>

            {/* Card 2 — Setor (FOREST) */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative overflow-hidden bg-forest-50 border border-forest-200 rounded-2xl p-7 min-h-[320px] flex flex-col"
            >
              <span className="absolute top-5 right-6 font-display font-black text-[88px] leading-none text-forest-200/70 select-none pointer-events-none">
                02
              </span>
              <Truck size={40} className="text-forest-500 mb-5 relative" />
              <h3 className="relative font-display font-extrabold text-xl text-forest-900 mb-2">
                Setor
              </h3>
              <p className="relative text-sm text-forest-800/80 leading-relaxed">
                Antar ke titik kumpul terdekat atau{' '}
                <span className="font-semibold">jadwalkan jemput motor</span>{' '}
                (gratis, radius 5 km).
              </p>
              <div className="relative mt-auto pt-4 border-t border-forest-200 flex items-center gap-2 text-forest-700 text-[13px]">
                <Truck size={14} />
                Jemput H+1 jam kerja
              </div>
            </motion.article>

            {/* Card 3 — Cairkan Poin (DARK) */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="relative overflow-hidden bg-ink-900 text-cream-50 rounded-2xl p-7 min-h-[320px] flex flex-col"
            >
              <span className="absolute top-5 right-6 font-display font-black text-[88px] leading-none text-cream-50/10 select-none pointer-events-none">
                03
              </span>
              <div className="relative grid grid-cols-2 gap-2 mb-5">
                {['GoPay', 'DANA', 'OVO', 'BSI'].map((label) => (
                  <div
                    key={label}
                    className="bg-cream-50/5 border border-cream-50/10 rounded-lg p-3 flex items-center justify-center text-cream-50 text-sm font-semibold tracking-tight"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <h3 className="relative font-display font-extrabold text-xl text-cream-50 mb-2">
                Cairkan Poin
              </h3>
              <p className="relative text-sm text-cream-50/75 leading-relaxed">
                Tukar ke saldo digital, pulsa, atau donasi sosial.
                <span className="text-amber-400 font-semibold">
                  {' '}Minimal Rp 10.000.
                </span>
              </p>
              <div className="relative mt-auto pt-4 border-t border-cream-50/15 flex items-center gap-2 text-cream-50/70 text-[13px]">
                <Zap size={14} />
                {'Cair dalam < 5 menit'}
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Impact Proof */}
      <section id="dampak" className="py-20 md:py-24 bg-cream-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-amber-700 text-[12px] font-bold tracking-[0.12em] uppercase mb-3">
              DAMPAK NYATA, BUKAN JANJI
            </p>
            <h2 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,3vw+0.5rem,2.75rem)] tracking-tight leading-[1.08]">
              Setiap tetes terhitung.
            </h2>
          </div>

          {/* Chain */}
          <div className="mt-12 grid md:grid-cols-4 gap-4">
            {PROOF_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.42, delay: idx * 0.06 }}
                className="relative rounded-xl bg-white border border-[#E8DEC4] p-6 text-center"
              >
                <p className="text-[13px] text-forest-900/50 font-medium mb-2">
                  {stat.label}
                </p>
                <p className="font-display font-extrabold tabular-nums text-[clamp(1.5rem,2vw+0.75rem,2.25rem)] leading-tight text-forest-900">
                  {stat.number}
                </p>
                <p className="text-[13px] text-forest-900/50 mt-1">
                  {stat.sub}
                </p>

                {/* Chevron connector — between cards on desktop only */}
                {idx < PROOF_STATS.length - 1 && (
                  <ChevronRight
                    size={20}
                    aria-hidden="true"
                    className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[-18px] text-forest-300 z-10"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E8DEC4] bg-cream-100 py-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Col 1 — Logo + tagline */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center font-display font-black text-lg">
                  J
                </div>
                <span className="font-display font-extrabold text-lg tracking-tight text-forest-900">
                  JelantahHub
                </span>
              </div>
              <p className="text-sm text-forest-900/60 mt-2">
                Sirkular dari dapur ke kilang.
              </p>
            </div>

            {/* Col 2 — Links */}
            <nav aria-label="Tautan footer" className="flex flex-col gap-2 text-sm">
              <a
                href="#cara-kerja"
                className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Cara Kerja
              </a>
              <a
                href="#dampak"
                className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Dampak
              </a>
              <a
                href="#mitra"
                className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Mitra
              </a>
              <a
                href="#"
                className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Blog
              </a>
            </nav>

            {/* Col 3 — Kontak */}
            <div className="flex flex-col gap-2 text-sm text-forest-900/70">
              <a
                href="https://instagram.com/jelantahhub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit hover:text-forest-900 transition-colors duration-150"
              >
                @jelantahhub
              </a>
              <a
                href="mailto:halo@jelantahhub.id"
                className="w-fit hover:text-forest-900 transition-colors duration-150"
              >
                halo@jelantahhub.id
              </a>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-8 pt-6 border-t border-[#E8DEC4] flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-[13px] text-forest-900/50">
            <p>© 2026 PT JelantahHub Indonesia. Sirkular untuk semua.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-forest-900 transition-colors duration-150">
                Privasi
              </a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-forest-900 transition-colors duration-150">
                Syarat
              </a>
              <span aria-hidden="true">·</span>
              <a href="#" className="hover:text-forest-900 transition-colors duration-150">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
