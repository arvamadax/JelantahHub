import React, { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Landmark,
  ShoppingBag,
  Home,
} from 'lucide-react';

type Tipe = 'bank_sampah' | 'warung' | 'pos_rt';
type Status = 'open' | 'closed';

interface Titik {
  id: number;
  nama: string;
  alamat: string;
  jarak: string;
  jam: string;
  hari: string;
  status: Status;
  tipe: Tipe;
}

const mockTitikKumpul: Titik[] = [
  { id: 1,  nama: 'Bank Sampah Melati',         alamat: 'Jl. Cijaura Hilir No. 12, Bandung',          jarak: '1.2 km',  jam: '08.00 – 17.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah' },
  { id: 2,  nama: 'Warung Bu Tejo',             alamat: 'Jl. Terusan Buah Batu No. 45, Bandung',      jarak: '3.5 km',  jam: '07.00 – 15.00', hari: 'Sen–Jum',  status: 'closed', tipe: 'warung' },
  { id: 3,  nama: 'Pos Kumpul RT 04 RW 02',     alamat: 'Perum Griya Asri Blok C, Bandung',           jarak: '0.8 km',  jam: '09.00 – 16.00', hari: 'Sen–Ming', status: 'open',   tipe: 'pos_rt' },
  { id: 4,  nama: 'Bank Sampah Berseri',        alamat: 'Jl. Margahayu Raya No. 88, Bandung',         jarak: '4.1 km',  jam: '08.00 – 15.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah' },
  { id: 5,  nama: 'Toko Hijau Nusantara',       alamat: 'Jl. Soekarno Hatta No. 221, Bandung',        jarak: '5.3 km',  jam: '09.00 – 18.00', hari: 'Sen–Ming', status: 'open',   tipe: 'warung' },
  { id: 6,  nama: 'Pos Kumpul RT 07 RW 05',     alamat: 'Jl. Derwati No. 3, Bandung',                 jarak: '2.9 km',  jam: '08.00 – 14.00', hari: 'Sen–Sab',  status: 'closed', tipe: 'pos_rt' },
  { id: 7,  nama: 'Bank Sampah Harapan',        alamat: 'Jl. Kopo Permai No. 17, Bandung',            jarak: '6.2 km',  jam: '08.00 – 16.00', hari: 'Sen–Jum',  status: 'open',   tipe: 'bank_sampah' },
  { id: 8,  nama: 'Warung Pak Harto',           alamat: 'Jl. Moch. Toha No. 56, Bandung',             jarak: '7.0 km',  jam: '06.00 – 14.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'warung' },
  { id: 9,  nama: 'Pos Kumpul RT 11 RW 08',     alamat: 'Jl. Panyileukan No. 9, Bandung',             jarak: '8.4 km',  jam: '09.00 – 15.00', hari: 'Sen–Ming', status: 'closed', tipe: 'pos_rt' },
  { id: 10, nama: 'Bank Sampah Lestari',        alamat: 'Jl. Gedebage Selatan No. 33, Bandung',       jarak: '9.1 km',  jam: '08.00 – 17.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah' },
  { id: 11, nama: 'Minimarket Segar',           alamat: 'Jl. AH Nasution No. 100, Bandung',           jarak: '10.2 km', jam: '07.00 – 22.00', hari: 'Sen–Ming', status: 'open',   tipe: 'warung' },
  { id: 12, nama: 'Pos Kumpul RT 02 RW 11',     alamat: 'Jl. Ujung Berung Indah No. 4, Bandung',      jarak: '11.8 km', jam: '08.00 – 14.00', hari: 'Sab–Ming', status: 'open',   tipe: 'pos_rt' },
];

const FILTERS = ['Semua', 'Bank Sampah', 'Warung', 'Pos RT'] as const;
type FilterPill = (typeof FILTERS)[number];

const FILTER_TO_TIPE: Record<FilterPill, Tipe | null> = {
  'Semua': null,
  'Bank Sampah': 'bank_sampah',
  'Warung': 'warung',
  'Pos RT': 'pos_rt',
};

const TIPE_ICON = {
  bank_sampah: Landmark,
  warung: ShoppingBag,
  pos_rt: Home,
} as const;

export const TitikKumpulPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pill, setPill] = useState<FilterPill>('Semua');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const tipeFilter = FILTER_TO_TIPE[pill];
    return mockTitikKumpul.filter((t) => {
      if (tipeFilter && t.tipe !== tipeFilter) return false;
      if (q) {
        const inNama = t.nama.toLowerCase().includes(q);
        const inAlamat = t.alamat.toLowerCase().includes(q);
        if (!inNama && !inAlamat) return false;
      }
      return true;
    });
  }, [search, pill]);

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
          Titik Kumpul
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          {mockTitikKumpul.length} titik aktif di sekitarmu
        </p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-900/40 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau alamat..."
            aria-label="Cari titik kumpul"
            className="w-full bg-white border border-[#E8DEC4] rounded-xl pl-10 pr-4 py-3 text-sm text-forest-900 placeholder:text-forest-900/40 focus:outline-none focus:border-forest-300 focus:ring-2 focus:ring-amber-500/20 transition-colors duration-150"
          />
        </div>

        {/* Filter pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const isActive = f === pill;
            return (
              <button
                key={f}
                onClick={() => setPill(f)}
                className={
                  isActive
                    ? 'rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap bg-forest-700 text-cream-50 transition-colors duration-150'
                    : 'rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap bg-white border border-[#E8DEC4] text-forest-900/70 hover:text-forest-900 hover:border-forest-200 transition-colors duration-150'
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </header>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <TitikCard key={t.id} titik={t} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────

const TitikCard: React.FC<{ titik: Titik }> = ({ titik }) => {
  const Icon = TIPE_ICON[titik.tipe];

  return (
    <article className="bg-white border border-[#E8DEC4] rounded-xl p-5 hover:shadow-[var(--shadow-md)] transition-shadow duration-200 flex flex-col">
      {/* ROW 1: identity + status */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start min-w-0 flex-1">
          <div className="bg-amber-50 text-amber-600 rounded-lg p-2 w-9 h-9 flex items-center justify-center shrink-0">
            <Icon size={18} />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <h3 className="font-display font-bold text-forest-900 text-[15px] leading-tight">
              {titik.nama}
            </h3>
            <p className="text-xs text-forest-900/65 mt-0.5 leading-snug">
              {titik.alamat}
            </p>
          </div>
        </div>
        <StatusBadge status={titik.status} />
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#E8DEC4] my-4" />

      {/* ROW 2: meta grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Jarak" value={titik.jarak} />
        <Stat label="Jam Buka" value={titik.jam} />
        <Stat label="Hari" value={titik.hari} />
      </div>

      {/* CTA */}
      <button
        className="mt-4 w-full inline-flex items-center justify-center gap-1 bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-cream-50 rounded-xl py-2.5 text-sm font-bold transition-colors duration-120"
        type="button"
      >
        Setor di Sini →
      </button>
    </article>
  );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const className =
    status === 'open'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-cream-200 text-forest-900/40';
  const label = status === 'open' ? '● BUKA' : '● TUTUP';
  return (
    <span
      className={`shrink-0 whitespace-nowrap text-xs font-bold px-2.5 py-1 rounded-full ${className}`}
    >
      {label}
    </span>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-forest-900/60">{label}</p>
    <p className="font-semibold text-forest-900 text-[13px] mt-0.5">{value}</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="mt-12 flex flex-col items-center text-center">
    <MapPin size={40} className="text-forest-900/20" aria-hidden="true" />
    <p className="text-forest-900/40 font-semibold mt-3">
      Titik kumpul tidak ditemukan
    </p>
    <p className="text-forest-900/30 text-sm mt-1">Coba kata kunci lain</p>
  </div>
);
