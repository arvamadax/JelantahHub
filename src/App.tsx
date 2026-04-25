import React, { useState } from 'react';
import { 
  Leaf, 
  Store, 
  Utensils, 
  ArrowUpRight,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { useFirebaseLogic } from './hooks/useFirebaseLogic';
import { TopBar } from './components/TopBar';
import { ActivityItem } from './components/ActivityItem';
import { NearbyNodeCard } from './components/NearbyNodeCard';
import { BottomNav } from './components/BottomNav';

// --- Shared Types ---

interface NodeProps {
  id: string;
  name: string;
  distance: string;
  isOpen: boolean;
  icon: 'Store' | 'Utensils';
}

// --- Main Page ---


export default function App() {
  const { user, userData, loading, signIn, logOut } = useAuth();
  
  // Use Decoupled Firebase Hook
  const { transactions, handleSetor, handleTukar } = useFirebaseLogic(user, userData);

  const [nodes] = useState<NodeProps[]>([
    { id: '1', name: 'Bank Sampah Melati', distance: '1.2 km', isOpen: true, icon: 'Store' },
    { id: '2', name: 'Warung Bu Tejo', distance: '3.5 km', isOpen: false, icon: 'Utensils' }
  ]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto h-screen flex items-center justify-center bg-surface-bg text-emerald-600">
        <div className="animate-pulse flex flex-col items-center">
          <Leaf size={40} className="mb-4" />
          <p className="font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-surface-bg p-6 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl mix-blend-multiply"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl w-full shadow-2xl border border-white relative z-10 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-display font-black text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            J
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tighter mb-2">JelantahHub</h1>
          <p className="text-slate-500 mb-8 text-sm">Platform Sirkular Masa Depan</p>
          <button 
            onClick={signIn}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 min-h-[56px]"
          >
            Masuk dengan Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    // Mobile Wrapper Constraint
    <div className="max-w-md mx-auto h-[100dvh] bg-surface-bg relative overflow-hidden flex flex-col shadow-2xl">
      <TopBar onLogout={logOut} />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-20 pb-24 px-4 custom-scrollbar">
        <div className="space-y-6">
          
          {/* Stats Card */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 text-white overflow-hidden shadow-lg shadow-emerald-500/20"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <p className="text-xs font-medium text-emerald-100 mb-1">Total Saldo Poin</p>
              <div className="flex items-baseline gap-2 mb-6">
                <h2 className="text-5xl font-extrabold font-display leading-none">
                  {userData?.points?.toLocaleString() || 0}
                </h2>
                <span className="text-xl font-medium opacity-80">Pts</span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleSetor}
                  className="flex-1 py-3 bg-white text-emerald-700 text-sm font-bold rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all text-center min-h-[44px]"
                >
                  Setor
                </button>
                <button 
                  onClick={handleTukar}
                  className="flex-1 py-3 border border-emerald-300/50 text-white text-sm font-bold rounded-xl active:bg-white/10 active:scale-95 transition-all text-center min-h-[44px]"
                >
                  Tukar
                </button>
              </div>
            </div>
          </motion.section>

          {/* QR Widget Mini */}
          <section className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between active:bg-slate-50 transition-colors min-h-[44px] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                <QrCode size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Tampilkan QR</p>
                <p className="text-[10px] text-slate-500">ID: JH-{user.uid.substring(0, 4).toUpperCase()}</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-slate-400" />
          </section>

          {/* Nearby Nodes */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-base font-bold text-slate-800 font-display">Titik Kumpul</h3>
              <button className="text-emerald-600 text-[11px] font-bold p-1 rounded min-h-[30px] min-w-[30px] active:bg-emerald-50">
                Lihat Peta
              </button>
            </div>
            
            <div className="space-y-2">
              {nodes.map(node => (
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
              <h3 className="text-base font-bold text-slate-800 font-display">Riwayat</h3>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <ul className="divide-y divide-slate-50">
                {transactions.length > 0 ? transactions.slice(0, 3).map(tx => (
                  <ActivityItem 
                    key={tx.id}
                    type={tx.type as 'setor'|'tukar'}
                    title={tx.title}
                    subtitle={tx.subtitle}
                    points={tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : `${tx.pointsDelta}`}
                    status={tx.status}
                  />
                )) : (
                  <div className="p-6 text-center text-slate-400 text-sm">Belum ada transaksi.</div>
                )}
              </ul>
              {transactions.length > 0 && (
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                  <button className="text-emerald-700 text-xs font-bold active:text-emerald-800 min-h-[30px] px-4">Lihat Semua Transaksi</button>
                </div>
              )}
            </div>
          </section>
          
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
