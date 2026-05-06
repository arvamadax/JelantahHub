import React, { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Landmark,
  ShoppingBag,
  Home,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNodes, type NodeStatus, type NodeTipe } from '../../hooks/useNodes';
import { MapPreview } from '../MapPreview';

const FILTERS = ['Semua', 'Bank Sampah', 'Warung', 'Pos RT'] as const;
type FilterPill = (typeof FILTERS)[number];

const FILTER_TO_TIPE: Record<FilterPill, NodeTipe | null> = {
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

interface TitikKumpulPageProps {
  onSetor?: (nodeName: string) => void;
}

export const TitikKumpulPage: React.FC<TitikKumpulPageProps> = ({ onSetor }) => {
  const { user } = useAuth();
  const { nodes } = useNodes(user);

  const [search, setSearch] = useState('');
  const [pill, setPill] = useState<FilterPill>('Semua');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const tipeFilter = FILTER_TO_TIPE[pill];
    return nodes.filter((t) => {
      if (tipeFilter && t.tipe !== tipeFilter) return false;
      if (q) {
        const inNama = t.nama.toLowerCase().includes(q);
        const inAlamat = t.alamat.toLowerCase().includes(q);
        if (!inNama && !inAlamat) return false;
      }
      return true;
    });
  }, [nodes, search, pill]);

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
          Titik Kumpul
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          {nodes.length} titik aktif di sekitarmu
        </p>

        <MapPreview
          className="mt-5 h-44 sm:h-52"
          caption={`Bandung · ${nodes.length} titik`}
        />

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
            <TitikCard key={t.id} titik={t} onSetor={onSetor} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

const TitikCard: React.FC<{
  titik: { id: string; nama: string; alamat: string; jarak: string; jam: string; hari: string; status: NodeStatus; tipe: NodeTipe };
  onSetor?: (nodeName: string) => void;
}> = ({ titik, onSetor }) => {
  const Icon = TIPE_ICON[titik.tipe];
  const isOpen = titik.status === 'open';

  return (
    <article className="bg-white border border-[#E8DEC4] rounded-xl p-5 hover:shadow-[var(--shadow-md)] transition-shadow duration-200 flex flex-col">
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

      <div className="border-t border-[#E8DEC4] my-4" />

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Jarak" value={titik.jarak} />
        <Stat label="Jam Buka" value={titik.jam} />
        <Stat label="Hari" value={titik.hari} />
      </div>

      <button
        type="button"
        onClick={() => isOpen && onSetor?.(titik.nama)}
        disabled={!isOpen}
        aria-disabled={!isOpen}
        className="mt-4 w-full inline-flex items-center justify-center gap-1 bg-forest-700 hover:bg-forest-800 active:bg-forest-900 disabled:bg-cream-200 disabled:text-forest-900/45 disabled:cursor-not-allowed text-cream-50 rounded-xl py-2.5 text-sm font-bold transition-colors duration-150"
      >
        {isOpen ? 'Setor di Sini →' : 'Sedang Tutup'}
      </button>
    </article>
  );
};

const StatusBadge: React.FC<{ status: NodeStatus }> = ({ status }) => {
  const className =
    status === 'open'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-cream-200 text-forest-900/60';
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
    <MapPin size={40} className="text-forest-900/30" aria-hidden="true" />
    <p className="text-forest-900/60 font-semibold mt-3">
      Titik kumpul tidak ditemukan
    </p>
    <p className="text-forest-900/45 text-sm mt-1">Coba kata kunci lain</p>
  </div>
);
