import React, { useMemo, useState } from 'react';
import { Droplets } from 'lucide-react';
import type { ActivityTransaction } from '../../hooks/useFirebaseLogic';

const intFormatter = new Intl.NumberFormat('id-ID');
const oneDecimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });

const txDate = (tx: ActivityTransaction): Date | null => {
  if (!tx.createdAt) return null;
  if (typeof tx.createdAt?.toDate === 'function') return tx.createdAt.toDate();
  const d = new Date(tx.createdAt);
  return Number.isNaN(d.getTime()) ? null : d;
};

interface RiwayatPageProps {
  transactions: ActivityTransaction[];
  loading?: boolean;
}

export const RiwayatPage: React.FC<RiwayatPageProps> = ({ transactions, loading = false }) => {
  const availableFilters = useMemo(() => {
    const months: { label: string; key: string }[] = [];
    const seen = new Set<string>();
    for (const tx of transactions) {
      const d = txDate(tx);
      if (!d) continue;
      const label = monthFormatter.format(d);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      months.push({ label, key });
    }
    return ['Semua', ...months.map((m) => m.label)];
  }, [transactions]);

  const [activeFilter, setActiveFilter] = useState<string>('Semua');

  React.useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      setActiveFilter('Semua');
    }
  }, [availableFilters, activeFilter]);

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'Semua') return transactions;
    return transactions.filter((tx) => {
      const d = txDate(tx);
      if (!d) return false;
      return monthFormatter.format(d) === activeFilter;
    });
  }, [transactions, activeFilter]);

  const totalLiters = transactions.reduce((sum, t) => {
    if (typeof t.volumeLiters === 'number') return sum + t.volumeLiters;
    const match = t.subtitle.match(/([\d.]+)\s*L/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  const totalPoin = transactions.reduce(
    (sum, t) => (t.pointsDelta > 0 ? sum + t.pointsDelta : sum),
    0,
  );
  const totalRupiah = totalPoin * 100;

  return (
    <div>
      <header>
        <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
          Riwayat Setoran
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Total {transactions.length} transaksi · {oneDecimalFormatter.format(totalLiters)} liter · {intFormatter.format(totalPoin)} poin
        </p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <SummaryCard label="Total Disetor" value={`${oneDecimalFormatter.format(totalLiters)} L`} />
          <SummaryCard label="Poin Diterima" value={`${intFormatter.format(totalPoin)} Pts`} />
          <SummaryCard label="Setara Rupiah" value={`Rp ${intFormatter.format(totalRupiah)}`} />
        </div>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {availableFilters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
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

      <ul className="mt-6 flex flex-col gap-3" aria-label="Daftar transaksi">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : filteredTransactions.length === 0 ? (
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

const SkeletonRow: React.FC = () => (
  <li className="bg-white border border-[#E8DEC4] rounded-xl px-5 py-4 flex items-center justify-between gap-3 animate-pulse">
    <div className="flex items-center min-w-0 flex-1">
      <div className="bg-cream-200 rounded-lg w-10 h-10 shrink-0" />
      <div className="flex flex-col ml-3 min-w-0 flex-1 gap-2">
        <div className="h-3.5 w-2/3 bg-cream-200 rounded" />
        <div className="h-2.5 w-1/2 bg-cream-200/70 rounded" />
      </div>
    </div>
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <div className="h-3 w-16 bg-cream-200 rounded" />
      <div className="h-4 w-14 bg-cream-200 rounded-full" />
    </div>
  </li>
);

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
