import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowDown,
  Droplets,
  Truck,
  Clock,
  Zap,
  Search,
  MapPin,
  Recycle,
  Wallet,
} from 'lucide-react';
import { HeroCalculator } from './landing/HeroCalculator';
import { AnimatePresence } from 'motion/react';
import { MapPreview } from './MapPreview';
import { Landmark, ShoppingBag, Home as HomeIcon } from 'lucide-react';

type ProofStat = {
  label: string;
  raw: number;
  suffix?: string;
  prefix?: string;
  sub: string;
  formatted?: boolean;
  context?: string;
};

const PROOF_STATS: ProofStat[] = [
  {
    label: 'Jelantah terkumpul',
    raw: 14832,
    suffix: ' L',
    sub: 'sejak Januari 2026',
  },
  {
    label: 'Diproses jadi biofuel',
    raw: 11865,
    suffix: ' L',
    sub: 'efisiensi 79,9%',
    context: '= 594 L solar setara',
  },
  {
    label: 'Karbon dihindari',
    raw: 31,
    suffix: ',4 ton CO₂',
    sub: 'setara 134 pohon/tahun',
    context: '≈ 7 mobil tak jalan setahun',
  },
  {
    label: 'Kembali ke warga',
    raw: 74160000,
    prefix: 'Rp ',
    sub: 'ke 1.386 keluarga aktif',
    formatted: true,
  },
];

const idFormatter = new Intl.NumberFormat('id-ID');

type Testimonial = {
  initials: string;
  name: string;
  meta: string;
  badge: string;
  color: string;
  textColor?: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'SR',
    name: 'Ibu Sari R.',
    meta: 'Bandung · Ibu Rumah Tangga',
    badge: '82 L disetor',
    color: 'bg-forest-700',
    quote:
      'Awalnya ragu, tapi setelah coba setor pertama langsung dapat poin bonus. Sekarang udah rutin tiap minggu, lumayan banget buat tambah saldo GoPay.',
  },
  {
    initials: 'BP',
    name: 'Pak Budi P.',
    meta: 'Malang · Pemilik Warung Makan',
    badge: '210 L disetor',
    color: 'bg-amber-500',
    quote:
      'Warung saya tiap hari ada sisa jelantah. Dulu dibuang begitu aja, sekarang malah jadi pemasukan tambahan. Proses jemputnya cepat, H+1 sudah diambil.',
  },
  {
    initials: 'DM',
    name: 'Dewi M.',
    meta: 'Surabaya · Mahasiswa',
    badge: '35 L disetor',
    color: 'bg-forest-200',
    textColor: 'text-forest-900',
    quote:
      'Yang paling suka itu bisa lihat dampak karbonnya langsung. Jadi lebih sadar betapa banyak yang bisa dikurangi dari hal kecil di dapur.',
  },
];

type CollectionNode = {
  name: string;
  addr: string;
  dist: string;
  open: boolean;
};

const SAMPLE_NODES: CollectionNode[] = [
  { name: 'Bank Sampah Melati', addr: 'Jl. Cijaura Hilir No. 12, Bandung', dist: '1.2 km', open: true },
  { name: 'Pos Kumpul RT 04 RW 02', addr: 'Perum Griya Asri Blok C, Bandung', dist: '0.8 km', open: true },
  { name: 'Warung Bu Tejo', addr: 'Jl. Terusan Buah Batu No. 45, Bandung', dist: '3.5 km', open: false },
];

const KOTA_LIST = ['Bandung', 'Malang', 'Surabaya', 'Jakarta', 'Yogyakarta', 'Semarang'];

function useCountUp(target: number, duration: number, trigger: boolean): number {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [trigger, target, duration]);
  return val;
}

const StatNumber: React.FC<{ stat: ProofStat; trigger: boolean }> = ({ stat, trigger }) => {
  const value = useCountUp(stat.raw, 1400, trigger);
  const display = stat.formatted ? idFormatter.format(value) : String(value);
  return (
    <p className="font-display font-extrabold tabular-nums text-[clamp(1.5rem,2vw+0.75rem,2.25rem)] leading-tight text-forest-900">
      {stat.prefix ?? ''}
      {display}
      {stat.suffix ?? ''}
    </p>
  );
};

const PetaTitikSetor: React.FC = () => {
  const [activeKota, setActiveKota] = React.useState<string>('Bandung');

  return (
    <section id="peta" className="py-20 md:py-24 bg-cream-100">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* LEFT: search + filter + nodes */}
          <div>
            <p className="text-amber-700 text-xs font-bold tracking-[0.12em] uppercase mb-3">
              TITIK SETOR DI SEKITARMU
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-forest-900">
              Cari titik setor terdekat.
            </h2>
            <p className="mt-3 text-forest-900/70 max-w-prose">
              Bank sampah, pos kumpul, atau warung mitra — cek mana yang paling
              dekat dengan rumahmu.
            </p>

            {/* Search */}
            <div className="mt-6 relative">
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-900/40"
              />
              <input
                type="search"
                placeholder="Cari berdasarkan nama atau alamat…"
                aria-label="Cari titik setor"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8DEC4] rounded-xl text-sm text-forest-900 placeholder:text-forest-900/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            {/* Kota chips (cosmetic) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {KOTA_LIST.map((kota) => {
                const active = kota === activeKota;
                return (
                  <button
                    key={kota}
                    type="button"
                    onClick={() => setActiveKota(kota)}
                    className={
                      active
                        ? 'px-3 py-1.5 rounded-full text-xs font-semibold bg-forest-700 text-cream-50 transition-colors duration-150'
                        : 'px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E8DEC4] text-forest-900/70 hover:border-forest-200 transition-colors duration-150'
                    }
                  >
                    {kota}
                  </button>
                );
              })}
            </div>

            {/* Node list */}
            <ul className="mt-6 space-y-3">
              {SAMPLE_NODES.map((node) => (
                <li
                  key={node.name}
                  className="flex items-start justify-between gap-4 bg-white border border-[#E8DEC4] rounded-xl p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-900 text-[15px] truncate">
                      {node.name}
                    </p>
                    <p className="text-[13px] text-forest-900/60 mt-0.5">
                      {node.addr}
                    </p>
                    <p className="text-xs text-forest-900/60 mt-1">
                      {node.dist} dari kamu
                    </p>
                  </div>
                  <span
                    className={
                      node.open
                        ? 'shrink-0 bg-forest-50 text-forest-700 text-xs font-bold px-2.5 py-1 rounded-full tracking-wide'
                        : 'shrink-0 bg-cream-200 text-forest-900/60 text-xs font-bold px-2.5 py-1 rounded-full tracking-wide'
                    }
                  >
                    {node.open ? 'BUKA' : 'TUTUP'}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#mitra"
              className="mt-5 inline-flex items-center gap-1 text-amber-700 font-semibold text-sm hover:text-amber-800 transition-colors duration-150"
            >
              Tidak ada di kotamu? Daftar jadi Mitra Node
              <ArrowRight size={14} />
            </a>
          </div>

          {/* RIGHT: stylized map preview */}
          <MapPreview className="h-full min-h-[320px]" />

        </div>
      </div>
    </section>
  );
};

interface LandingPageProps {
  onNavigateAuth: () => void;
}

type LegalModal = null | 'privasi' | 'syarat' | 'tentang';

const LEGAL_CONTENT: Record<Exclude<LegalModal, null>, { title: string; body: React.ReactNode }> = {
  tentang: {
    title: 'Tentang JelantahHub',
    body: (
      <>
        <p>
          JelantahHub adalah platform eco-fintech sirkular yang menghubungkan rumah tangga,
          warung, dan UMKM dengan jaringan titik kumpul jelantah serta kilang biofuel mitra.
          Setiap liter minyak goreng bekas yang disetor diubah jadi poin yang dapat dicairkan
          ke saldo digital.
        </p>
        <p>
          Misi kami: mengurangi pencemaran air akibat jelantah yang dibuang sembarangan,
          sekaligus memberi nilai ekonomi bagi keluarga Indonesia.
        </p>
        <p className="text-xs text-forest-900/60">
          MVP dibangun untuk IYREF 2026 Hackathon. Versi 1.0.0.
        </p>
      </>
    ),
  },
  privasi: {
    title: 'Kebijakan Privasi',
    body: (
      <>
        <p>
          JelantahHub menghormati privasi data Anda. Kami hanya menyimpan informasi minimum
          yang diperlukan untuk menjalankan layanan: nama, email, dan riwayat setoran.
        </p>
        <p>
          <strong className="text-forest-900">Data tidak dijual</strong> dan tidak dibagikan
          ke pihak ketiga di luar mitra operasional (kilang biofuel, payment gateway untuk
          pencairan poin).
        </p>
        <p>
          Anda dapat meminta penghapusan akun kapan saja dengan menghubungi
          <a href="mailto:halo@jelantahhub.id" className="text-amber-700 font-semibold"> halo@jelantahhub.id</a>.
        </p>
        <p className="text-xs text-forest-900/60">Diperbarui terakhir: April 2026.</p>
      </>
    ),
  },
  syarat: {
    title: 'Syarat Layanan',
    body: (
      <>
        <p>
          Dengan mendaftar di JelantahHub, Anda setuju untuk hanya menyetor jelantah yang
          berasal dari konsumsi rumah tangga atau usaha legal Anda sendiri. Penyetoran
          minyak hasil curian, daur ulang ilegal, atau substansi non-jelantah dilarang.
        </p>
        <p>
          Poin yang diberikan setelah verifikasi titik kumpul bersifat final. Pencairan ke
          saldo digital dilakukan dalam batas wajar untuk mencegah penyalahgunaan.
        </p>
        <p>
          JelantahHub dapat menangguhkan akun yang melanggar ketentuan tanpa pemberitahuan
          terlebih dahulu.
        </p>
        <p className="text-xs text-forest-900/60">Diperbarui terakhir: April 2026.</p>
      </>
    ),
  },
};

const JourneyNode: React.FC<{ icon: React.ReactNode; label: string; tone: 'amber' | 'forest' }> = ({ icon, label, tone }) => (
  <div className="flex items-center gap-2 shrink-0">
    <span
      className={
        tone === 'amber'
          ? 'w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center'
          : 'w-9 h-9 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center'
      }
    >
      {icon}
    </span>
    <span className="text-xs font-semibold text-forest-900/75 uppercase tracking-wider">{label}</span>
  </div>
);

const JourneyConnector: React.FC = () => (
  <span className="flex-1 flex items-center justify-center">
    <span className="block h-px w-full bg-gradient-to-r from-amber-200 via-forest-200 to-amber-200" />
  </span>
);

const LegalModalView: React.FC<{ active: LegalModal; onClose: () => void }> = ({ active, onClose }) => {
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, onClose]);

  if (!active) return null;
  const content = LEGAL_CONTENT[active];

  return (
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
        aria-labelledby="legal-modal-title"
        className="bg-cream-100 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E8DEC4] shadow-[var(--shadow-lg)] max-h-[85vh] flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 border-b border-[#E8DEC4]">
          <h3 id="legal-modal-title" className="font-display font-extrabold text-xl text-forest-900">
            {content.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 w-9 h-9 rounded-full hover:bg-cream-200 flex items-center justify-center text-forest-900/70 hover:text-forest-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex flex-col gap-3 text-sm text-forest-900/85 leading-relaxed">
          {content.body}
        </div>
        <div className="px-6 py-4 border-t border-[#E8DEC4]">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center h-11 px-5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 font-bold text-sm transition-colors duration-150"
          >
            Mengerti
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth }) => {
  const dampakRef = React.useRef<HTMLDivElement | null>(null);
  const [dampakTriggered, setDampakTriggered] = React.useState(false);
  const [legalModal, setLegalModal] = React.useState<LegalModal>(null);
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'submitted'>('idle');

  React.useEffect(() => {
    const node = dampakRef.current;
    if (!node || dampakTriggered) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDampakTriggered(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: '-80px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [dampakTriggered]);

  return (
    <div className="min-h-[100dvh] w-full bg-cream-100 text-forest-900 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 h-16 bg-cream-100/85 backdrop-blur-md border-b border-[#E8DEC4]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 h-full">
          <div className="flex items-center gap-2.5">
            <img
              src="/logos/jelantahhub-256.png"
              alt="JelantahHub"
              className="w-10 h-10 object-contain"
              width={40}
              height={40}
            />
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
                className="inline-flex items-center gap-2 text-amber-700 text-xs font-bold tracking-[0.12em] uppercase mb-6"
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

              {/* Social proof badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
                className="mt-4 inline-flex items-center gap-2 bg-white border border-[#E8DEC4] rounded-full px-4 py-2 text-[13px] text-forest-900/70 shadow-[var(--shadow-md)]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>
                  <strong className="text-forest-900">1.386 keluarga</strong> sudah bergabung bulan ini
                </span>
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
                  className="h-8 w-auto max-w-[110px] object-contain"
                />
                <img
                  src="/logos/pertamina-nre.jpg"
                  alt="Pertamina NRE"
                  className="h-8 w-auto max-w-[110px] object-contain"
                />
                <img
                  src="/logos/iyref.webp"
                  alt="IYREF 2026"
                  className="h-8 w-auto max-w-[90px] object-contain"
                />
              </motion.div>
            </div>

            {/* RIGHT: Journey strip + Interactive calculator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="md:col-span-5"
            >
              <div
                aria-hidden="true"
                className="hidden md:flex items-center justify-between gap-2 px-4 mb-4 text-forest-900/65"
              >
                <JourneyNode icon={<Droplets size={16} />} label="Setor" tone="amber" />
                <JourneyConnector />
                <JourneyNode icon={<Recycle size={16} />} label="Daur" tone="forest" />
                <JourneyConnector />
                <JourneyNode icon={<Wallet size={16} />} label="Cair" tone="amber" />
              </div>
              <HeroCalculator onCTA={onNavigateAuth} />
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

          <div className="grid grid-cols-1 md:grid-cols-[1fr_32px_1fr_32px_1fr] gap-6 md:gap-0">
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

            {/* Arrow connector 1→2 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-8">
                <div className="h-px w-full bg-amber-200" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent border-l-amber-400" />
              </div>
            </div>

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

            {/* Arrow connector 2→3 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-8">
                <div className="h-px w-full bg-amber-200" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent border-l-amber-400" />
              </div>
            </div>

            {/* Card 3 — Cairkan Poin (UNIFIED, AMBER-OUTLINED) */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="relative overflow-hidden bg-white border-2 border-amber-500 rounded-2xl p-7 min-h-[320px] flex flex-col shadow-[var(--shadow-amber)]"
            >
              <span className="absolute top-5 right-6 font-display font-black text-[88px] leading-none text-amber-200/60 select-none pointer-events-none">
                03
              </span>
              <div className="relative grid grid-cols-2 gap-2 mb-5">
                {['GoPay', 'DANA', 'OVO', 'BSI'].map((label) => (
                  <div
                    key={label}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-center text-forest-900 text-sm font-semibold tracking-tight"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <h3 className="relative font-display font-extrabold text-xl text-forest-900 mb-2">
                Cairkan Poin
              </h3>
              <p className="relative text-sm text-forest-900/70 leading-relaxed">
                Tukar ke saldo digital, pulsa, atau donasi sosial.
                <span className="text-amber-600 font-semibold">
                  {' '}Minimal Rp 10.000.
                </span>
              </p>
              <div className="relative mt-auto pt-4 border-t border-[#E8DEC4] flex items-center gap-2 text-forest-700/60 text-[13px]">
                <Zap size={14} />
                {'Cair dalam < 5 menit'}
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Mitra section */}
      <section id="mitra" className="py-16 md:py-20 bg-white border-t border-[#E8DEC4]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-amber-700 text-xs font-bold tracking-[0.12em] uppercase mb-3">
              UNTUK MITRA
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-forest-900">
              Bank sampah, RT, atau warung? Daftar jadi titik setor.
            </h2>
            <p className="mt-4 text-forest-900/70 max-w-prose mx-auto">
              Dapatkan komisi per liter terkumpul + alat pengukur gratis. Onboarding 3 hari kerja.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                Icon: Landmark,
                role: 'Bank Sampah',
                tagline: 'Komisi 10% per liter',
                detail: 'Dashboard kelola pickup + alat pengukur volume gratis untuk operasional rutin.',
              },
              {
                Icon: ShoppingBag,
                role: 'Warung Mitra',
                tagline: 'Pemasukan tambahan',
                detail: 'Sisa minyak dapur jadi sumber kas. Cocok untuk warung makan, bakso, gorengan.',
              },
              {
                Icon: HomeIcon,
                role: 'RT / RW',
                tagline: 'Program eco-warga',
                detail: 'Insentif komunal untuk pengurus + branding lingkungan untuk komplek perumahan.',
              },
            ].map((card) => (
              <article
                key={card.role}
                className="bg-cream-50 border border-[#E8DEC4] rounded-2xl p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <card.Icon size={20} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-forest-900">
                  {card.role}
                </h3>
                <p className="text-amber-700 text-sm font-semibold mt-1">
                  {card.tagline}
                </p>
                <p className="text-sm text-forest-900/70 leading-relaxed mt-3">
                  {card.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="mailto:mitra@jelantahhub.id"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 font-bold shadow-[var(--shadow-forest)] transition-colors duration-150"
            >
              Hubungi Tim Mitra
              <ArrowRight size={16} />
            </a>
            <p className="mt-3 text-xs text-forest-900/55">
              Atau email ke{' '}
              <a href="mailto:mitra@jelantahhub.id" className="text-amber-700 font-semibold hover:text-amber-800">
                mitra@jelantahhub.id
              </a>
            </p>
          </div>
        </div>
      </section>

      <PetaTitikSetor />

      {/* Impact Proof */}
      <section id="dampak" className="py-16 md:py-20 pb-10 md:pb-14 bg-cream-100 border-t border-[#E8DEC4]">
        <div ref={dampakRef} className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-amber-700 text-xs font-bold tracking-[0.12em] uppercase mb-3">
              DAMPAK NYATA, BUKAN JANJI
            </p>
            <h2 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,3vw+0.5rem,2.75rem)] tracking-tight leading-[1.08]">
              Setiap tetes terhitung.
            </h2>
          </div>

          {/* Target progress bar */}
          <div className="mt-12 mb-10 bg-white border border-[#E8DEC4] rounded-2xl p-6">
            <div className="flex justify-between items-baseline mb-3">
              <p className="text-sm text-forest-900/60">
                Target 2026:{' '}
                <strong className="text-forest-900">50.000 L</strong> jelantah
                terkumpul
              </p>
              <span className="text-amber-600 font-bold text-sm">29,7%</span>
            </div>
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '29.7%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-forest-900/60 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Diperbarui real-time · 14.832 L dari 50.000 L
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <StatNumber stat={stat} trigger={dampakTriggered} />
                <p className="text-[13px] text-forest-900/50 mt-1">
                  {stat.sub}
                </p>
                {stat.context && (
                  <p className="text-xs text-amber-700 font-semibold mt-2">
                    {stat.context}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonial" className="bg-white border-y border-[#E8DEC4] pt-14 md:pt-16 pb-20 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-amber-700 text-xs font-bold tracking-[0.12em] uppercase mb-3">
              KATA PENGGUNA
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-forest-900">
              Cerita dari dapur, warung, dan kos.
            </h2>
            <p className="mt-3 text-amber-700 font-semibold text-sm">
              ★★★★★ 4.8/5 · 1.200+ ulasan
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="bg-cream-50 border border-[#E8DEC4] rounded-2xl p-6 flex flex-col"
              >
                <p className="text-forest-900/80 text-[15px] leading-relaxed italic">
                  “{t.quote}”
                </p>
                <div className="mt-5 pt-5 border-t border-[#E8DEC4] flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full font-bold ${t.textColor ?? 'text-cream-50'} text-sm flex items-center justify-center ${t.color}`}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-forest-900 text-sm truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-forest-900/65 truncate">
                      {t.meta}
                    </p>
                  </div>
                  <span className="shrink-0 bg-forest-50 text-forest-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    {t.badge}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Mini-CTA banner */}
      <div className="bg-forest-700 py-12 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-cream-50 mb-2">
            Mulai setor hari ini — gratis, tanpa ribet.
          </h2>
          <p className="text-cream-50/60 text-sm mb-6">
            Daftar 2 menit. Tidak perlu kartu kredit. Langsung dapat +1.000 poin
            bonus.
          </p>
          <button
            onClick={onNavigateAuth}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-cream-50 font-bold shadow-[var(--shadow-amber)] transition-colors duration-150"
          >
            Daftar Gratis Sekarang <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <footer className="border-t border-[#E8DEC4] bg-cream-100 py-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-8">
            {/* Col 1 — Logo + tagline + social */}
            <div>
              <div className="flex items-center gap-2.5">
                <img
                  src="/logos/jelantahhub-256.png"
                  alt="JelantahHub"
                  className="w-10 h-10 object-contain"
                  width={40}
                  height={40}
                />
                <span className="font-display font-extrabold text-lg tracking-tight text-forest-900">
                  JelantahHub
                </span>
              </div>
              <p className="text-sm text-forest-900/60 mt-2">
                Sirkular dari dapur ke kilang.
              </p>
              <div className="mt-4 flex gap-2">
                {/* TODO: update dengan URL resmi */}
                <a
                  href="https://instagram.com/jelantahhub"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram JelantahHub"
                  className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* TODO: update dengan URL resmi */}
                <a
                  href="https://tiktok.com/@jelantahhub"
                  target="_blank"
                  rel="noopener"
                  aria-label="TikTok JelantahHub"
                  className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                  </svg>
                </a>
                {/* TODO: update dengan URL resmi */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener"
                  aria-label="WhatsApp JelantahHub"
                  className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Produk */}
            <nav aria-label="Produk" className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-bold tracking-[0.12em] uppercase text-forest-900/50 mb-1">
                PRODUK
              </p>
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
            </nav>

            {/* Col 3 — Perusahaan */}
            <nav aria-label="Perusahaan" className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-bold tracking-[0.12em] uppercase text-forest-900/50 mb-1">
                PERUSAHAAN
              </p>
              <button
                type="button"
                onClick={() => setLegalModal('tentang')}
                className="w-fit text-left text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Tentang
              </button>
              <a href="#mitra" className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150">
                Mitra
              </a>
              <a
                href="mailto:halo@jelantahhub.id"
                className="w-fit text-forest-900/70 hover:text-forest-900 transition-colors duration-150"
              >
                Kontak
              </a>
            </nav>

            {/* Col 4 — Newsletter */}
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-bold tracking-[0.12em] uppercase text-forest-900/50 mb-1">
                UPDATE BULANAN
              </p>
              <p className="text-forest-900/60 text-[13px]">
                Cerita dampak & insight sirkular ekonomi, langsung ke inboxmu.
              </p>
              {newsletterStatus === 'idle' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewsletterStatus('submitted');
                  }}
                  className="mt-2 flex gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="email@kamu.com"
                    aria-label="Email untuk update bulanan"
                    className="flex-1 min-w-0 bg-white border border-[#E8DEC4] rounded-lg px-3 py-2 text-sm text-forest-900 placeholder:text-forest-900/30 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-cream-50 rounded-lg px-3 py-2 text-sm font-bold transition-colors duration-150"
                  >
                    Ikut
                  </button>
                </form>
              ) : (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-amber-800 font-semibold">
                  ✓ Terima kasih! Update bulanan akan dikirim ke inbox kamu.
                </div>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-8 pt-6 border-t border-[#E8DEC4] flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-[13px] text-forest-900/50">
            <p>© 2026 PT JelantahHub Indonesia. Sirkular untuk semua.</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLegalModal('privasi')}
                className="hover:text-forest-900 transition-colors duration-150"
              >
                Privasi
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setLegalModal('syarat')}
                className="hover:text-forest-900 transition-colors duration-150"
              >
                Syarat
              </button>
              <span aria-hidden="true">·</span>
              <a href="mailto:halo@jelantahhub.id" className="hover:text-forest-900 transition-colors duration-150">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {legalModal && (
          <LegalModalView active={legalModal} onClose={() => setLegalModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
