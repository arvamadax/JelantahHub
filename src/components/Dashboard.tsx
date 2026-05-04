import React, { useState } from 'react';
import { Store, Utensils, ArrowUpRight, QrCode, Droplets } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseLogic } from '../hooks/useFirebaseLogic';
import { TopBar } from './TopBar';
import { ActivityItem } from './ActivityItem';
import { NearbyNodeCard } from './NearbyNodeCard';
import { BottomNav, type DashboardTab } from './BottomNav';
import { RiwayatPage } from './dashboard/RiwayatPage';
import { TitikKumpulPage } from './dashboard/TitikKumpulPage';

interface NodeProps {
  id: string;
  name: string;
  distance: string;
  isOpen: boolean;
  icon: 'Store' | 'Utensils';
}

export const Dashboard: React.FC = () => {
  const { user, userData, logOut } = useAuth();
  const { transactions, handleSetor, handleTukar } = useFirebaseLogic(user, userData);

  const [tab, setTab] = useState<DashboardTab>('home');

  const [nodes] = useState<NodeProps[]>([
    { id: '1', name: 'Bank Sampah Melati', distance: '1.2 km', isOpen: true, icon: 'Store' },
    { id: '2', name: 'Warung Bu Tejo', distance: '3.5 km', isOpen: false, icon: 'Utensils' },
  ]);

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] w-full bg-cream-100 flex flex-col">
      <TopBar onLogout={logOut} activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-24 md:pb-12 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {tab === 'riwayat' ? (
            <RiwayatPage transactions={transactions} />
          ) : tab === 'map' ? (
            <TitikKumpulPage />
          ) : (
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
            {/* Left Column */}
            <div className="md:col-span-7 space-y-6">
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-forest-700 rounded-3xl p-6 md:p-8 text-cream-50 overflow-hidden shadow-sm"
              >
                <div className="relative z-10">
                  <p className="text-xs font-medium text-cream-50/70 mb-1">Total Saldo Poin</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h2 className="text-5xl font-extrabold font-display leading-none text-amber-400 tabular-nums">
                      {userData?.points?.toLocaleString() || 0}
                    </h2>
                    <span className="text-xl font-medium text-cream-50/70">Pts</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSetor}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-cream-50 text-sm font-bold rounded-xl transition-colors duration-150 text-center min-h-[44px]"
                    >
                      Setor
                    </button>
                    <button
                      onClick={handleTukar}
                      className="flex-1 py-3 bg-transparent border border-cream-50/30 hover:border-cream-50/60 text-cream-50 text-sm font-bold rounded-xl transition-colors duration-150 text-center min-h-[44px]"
                    >
                      Tukar
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* QR Widget Mini */}
              <section className="bg-white rounded-2xl border border-[#E8DEC4] p-4 shadow-sm flex items-center justify-between active:bg-cream-50 transition-colors min-h-[44px] cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-forest-50 p-2 rounded-lg text-forest-700">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-forest-900">Tampilkan QR</p>
                    <p className="text-xs text-forest-900/60">
                      ID: JH-{user.uid.substring(0, 4).toUpperCase()}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-forest-900/45" />
              </section>
            </div>

            {/* Right Column */}
            <div className="md:col-span-5 space-y-6">
              {/* Nearby Nodes */}
              <section>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-base font-bold text-forest-900 font-display">Titik Kumpul</h3>
                  <button
                    onClick={() => setTab('map')}
                    className="text-amber-700 hover:text-amber-800 text-xs font-bold p-1 rounded min-h-[30px] min-w-[30px] transition-colors duration-150"
                  >
                    Lihat Peta
                  </button>
                </div>

                <div className="space-y-2">
                  {nodes.map((node) => (
                    <NearbyNodeCard
                      key={node.id}
                      title={node.name}
                      distance={node.distance}
                      isOpen={node.isOpen}
                      icon={node.icon === 'Store' ? Store : Utensils}
                    />
                  ))}
                </div>
              </section>

              {/* Transactions */}
              <section className="pb-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-base font-bold text-forest-900 font-display">Riwayat</h3>
                </div>
                <div className="bg-white rounded-2xl border border-[#E8DEC4] shadow-sm overflow-hidden">
                  <ul className="divide-y divide-[#E8DEC4]">
                    {transactions.length > 0 ? (
                      transactions.slice(0, 3).map((tx) => (
                        <ActivityItem
                          key={tx.id}
                          type={tx.type as 'setor' | 'tukar'}
                          title={tx.title}
                          subtitle={tx.subtitle}
                          points={tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : `${tx.pointsDelta}`}
                          status={tx.status}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="bg-amber-50 rounded-full p-3">
                          <Droplets size={24} className="text-amber-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-forest-900">
                            Belum ada setoran
                          </p>
                          <p className="text-xs text-forest-900/60 mt-1">
                            Tekan tombol <strong>Setor</strong> untuk mulai kumpulkan poin.
                          </p>
                        </div>
                      </div>
                    )}
                  </ul>
                  {transactions.length > 0 && (
                    <div className="p-3 bg-cream-50 text-center border-t border-[#E8DEC4]">
                      <button
                        onClick={() => setTab('riwayat')}
                        className="text-amber-700 hover:text-amber-800 text-xs font-bold min-h-[30px] px-4 transition-colors duration-150"
                      >
                        Lihat Semua Transaksi
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
          )}
        </div>
      </main>

      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
};
