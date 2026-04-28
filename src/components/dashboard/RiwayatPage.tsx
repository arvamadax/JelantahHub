import React, { useState } from 'react';
import { Droplets } from 'lucide-react';

type Status = 'Verified' | 'Pending';

interface RiwayatEntry {
  id: number;
  tanggal: string;
  lokasi: string;
  volume: number;
  poin: number;
  status: Status;
}

const mockRiwayat: RiwayatEntry[] = [
  { id: 1, tanggal: '24 Apr 2026', lokasi: 'Bank Sampah Melati', volume: 3.2, poin: 160, status: 'Verified' },
  { id: 2, tanggal: '21 Apr 2026', lokasi: 'Warung Bu Tejo', volume: 5.0, poin: 250, status: 'Verified' },
  { id: 3, tanggal: '18 Apr 2026', lokasi: 'Bank Sampah Melati', volume: 2.5, poin: 125, status: 'Verified' },
  { id: 4, tanggal: '14 Apr 2026', lokasi: 'Pos Kumpul RT 04', volume: 4.1, poin: 205, status: 'Verified' },
  { id: 5, tanggal: '10 Apr 2026', lokasi: 'Warung Bu Tejo', volume: 1.8, poin: 90, status: 'Verified' },
  { id: 6, tanggal: '06 Apr 2026', lokasi: 'Bank Sampah Melati', volume: 6.0, poin: 300, status: 'Verified' },
  { id: 7, tanggal: '01 Apr 2026', lokasi: 'Pos Kumpul RT 04', volume: 3.5, poin: 175, status: 'Pending' },
  { id: 8, tanggal: '27 Mar 2026', lokasi: 'Bank Sampah Melati', volume: 2.0, poin: 100, status: 'Verified' },
  { id: 9, tanggal: '22 Mar 2026', lokasi: 'Warung Bu Tejo', volume: 4.8, poin: 240, status: 'Verified' },
  { id: 10, tanggal: '17 Mar 2026', lokasi: 'Pos Kumpul RT 04', volume: 1.5, poin: 75, status: 'Verified' },
];

const FILTERS = ['Semua', 'April 2026', 'Maret 2026'] as const;
type Filter = (typeof FILTERS)[number];

// Indonesian number formatters
const intFormatter = new Intl.NumberFormat('id-ID');
const oneDecimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const totalLiters = mockRiwayat.reduce((sum, t) => sum + t.volume, 0);
const totalPoin = mockRiwayat.reduce((sum, t) => sum + t.poin, 0);
const totalRupiah = totalPoin * 100; // 1 poin = Rp 100

export const RiwayatPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('Semua');

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
          Riwayat Setoran
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Total {mockRiwayat.length} transaksi · {oneDecimalFormatter.format(totalLiters)} liter · {intFormatter.format(totalPoin)} poin
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <SummaryCard label="Total Disetor" value={`${oneDecimalFormatter.format(totalLiters)} L`} />
          <SummaryCard label="Total Poin" value={`${intFormatter.format(totalPoin)} Pts`} />
          <SummaryCard label="Total Rupiah" value={`Rp ${intFormatter.format(totalRupiah)}`} />
        </div>
      </header>

      {/* Filter pills (UI only — no actual filtering) */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={
                isActive
                  ? 'rounded-full px-4 py-1.5 text-sm font-semibold bg-forest-700 text-cream-50 transition-colors duration-150'
                  : 'rounded-full px-4 py-1.5 text-sm bg-white border border-[#E8DEC4] text-forest-900/70 hover:text-forest-900 hover:border-forest-200 transition-colors duration-150'
              }
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Transaction list */}
      <ul className="mt-6 flex flex-col gap-3">
        {mockRiwayat.map((tx) => (
          <RiwayatRow key={tx.id} tx={tx} />
        ))}
      </ul>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────

const SummaryCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white border border-[#E8DEC4] rounded-xl p-4">
    <p className="text-xs text-forest-900/65">{label}</p>
    <p className="font-display font-extrabold text-forest-900 text-[1.5rem] leading-tight tabular-nums mt-1">
      {value}
    </p>
  </div>
);

const RiwayatRow: React.FC<{ tx: RiwayatEntry }> = ({ tx }) => (
  <li className="bg-white border border-[#E8DEC4] rounded-xl px-5 py-4 flex items-center justify-between gap-3">
    {/* Left: icon + lokasi/meta */}
    <div className="flex items-center min-w-0">
      <div className="bg-amber-50 rounded-lg p-2 shrink-0">
        <Droplets size={20} className="text-amber-500" />
      </div>
      <div className="flex flex-col ml-3 min-w-0">
        <span className="font-semibold text-forest-900 text-sm truncate">
          {tx.lokasi}
        </span>
        <span className="text-xs text-forest-900/65 tabular-nums">
          {tx.tanggal} · {oneDecimalFormatter.format(tx.volume)} L
        </span>
      </div>
    </div>

    {/* Right: poin + status */}
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className="font-bold text-forest-700 text-sm tabular-nums">
        +{intFormatter.format(tx.poin)} Pts
      </span>
      <StatusBadge status={tx.status} />
    </div>
  </li>
);

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const className =
    status === 'Verified'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-cream-200 text-forest-900/50';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
      {status}
    </span>
  );
};
