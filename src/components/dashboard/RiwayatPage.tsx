import React, { useMemo, useState } from 'react';
import { Droplets } from 'lucide-react';
import type { ActivityTransaction } from '../../hooks/useFirebaseLogic';

const FILTERS = ['Semua', 'April 2026', 'Maret 2026'] as const;
type Filter = (typeof FILTERS)[number];

const intFormatter = new Intl.NumberFormat('id-ID');
const oneDecimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface RiwayatPageProps {
  transactions: ActivityTransaction[];
}

export const RiwayatPage: React.FC<RiwayatPageProps> = ({ transactions }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('Semua');

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'Semua') return transactions;

    const targetMonth = activeFilter.split(' ')[0].toLowerCase();
    return transactions.filter((tx) => {
      if (!tx.createdAt) return false;
      const date =
        typeof tx.createdAt?.toDate === 'function'
          ? tx.createdAt.toDate()
          : new Date(tx.createdAt);
      const monthName = date
        .toLocaleDateString('id-ID', { month: 'long' })
        .toLowerCase();
      return monthName === targetMonth;
    });
  }, [transactions, activeFilter]);

  const totalLiters = transactions.reduce((sum, t) => {
    const match = t.subtitle.match(/([\d.]+)\s*L/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const totalPoin = transactions.reduce(
    (sum, t) => sum + Math.abs(t.pointsDelta),
    0,
  );
  const totalRupiah = totalPoin * 100;

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
          Riwayat Setoran
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Total {transactions.length} transaksi · {oneDecimalFormatter.format(totalLiters)} liter · {intFormatter.format(totalPoin)} poin
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <SummaryCard label="Total Disetor" value={`${oneDecimalFormatter.format(totalLiters)} L`} />
          <SummaryCard label="Total Poin" value={`${intFormatter.format(totalPoin)} Pts`} />
          <SummaryCard label="Total Rupiah" value={`Rp ${intFormatter.format(totalRupiah)}`} />
        </div>
      </header>

      {/* Filter pills */}
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
        {filteredTransactions.length === 0 ? (
          <li className="bg-white border border-[#E8DEC4] rounded-xl px-5 py-10 flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-amber-50 rounded-full p-4">
              <Droplets size={28} className="text-amber-400" />
            </div>
            <p className="font-semibold text-forest-900 text-sm">
              {transactions.length === 0
                ? 'Belum ada setoran'
                : `Tidak ada transaksi di ${activeFilter}`}
            </p>
            <p className="text-xs text-forest-900/60 max-w-[240px]">
              {transactions.length === 0
                ? 'Setor jelantahmu pertama kali dan mulai kumpulkan poin.'
                : 'Coba pilih filter lain untuk melihat transaksi.'}
            </p>
          </li>
        ) : (
          filteredTransactions.map((tx) => (
            <RiwayatRowFirestore key={tx.id} tx={tx} />
          ))
        )}
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

const RiwayatRowFirestore: React.FC<{ tx: ActivityTransaction }> = ({ tx }) => {
  const isPositive = tx.pointsDelta > 0;
  return (
    <li className="bg-white border border-[#E8DEC4] rounded-xl px-5 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center min-w-0">
        <div className="bg-amber-50 rounded-lg p-2 shrink-0">
          <Droplets size={20} className="text-amber-500" />
        </div>
        <div className="flex flex-col ml-3 min-w-0">
          <span className="font-semibold text-forest-900 text-sm truncate">
            {tx.title}
          </span>
          <span className="text-xs text-forest-900/65 truncate">
            {tx.subtitle}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={`font-bold text-sm tabular-nums ${
            isPositive ? 'text-forest-700' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {tx.pointsDelta} Pts
        </span>
        <StatusBadge status={tx.status} />
      </div>
    </li>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const className =
    status === 'Verified' || status === 'Completed'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-cream-200 text-forest-900/65';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
      {status}
    </span>
  );
};
