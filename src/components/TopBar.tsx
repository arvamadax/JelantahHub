import React, { useState } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardTab } from './BottomNav';

interface TopBarProps {
  onLogout: () => void;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onLogout, activeTab, onTabChange }) => {
  const { userData, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const navBtnClass = (tab: DashboardTab) =>
    activeTab === tab
      ? 'flex items-center gap-2 text-forest-700 font-bold transition-colors duration-150'
      : 'flex items-center gap-2 text-forest-900/50 hover:text-forest-700 transition-colors duration-150';
  
  return (
    <header className="absolute top-0 right-0 left-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 z-40 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-display font-bold text-lg">
          J
        </div>
        <h1 className="text-xl font-extrabold text-emerald-600 tracking-tighter leading-none hidden sm:block">JelantahHub</h1>
      </div>

      <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <button onClick={() => onTabChange?.('home')} className={navBtnClass('home')}>
          <span>Beranda</span>
        </button>
        <button onClick={() => onTabChange?.('map')} className={navBtnClass('map')}>
          <span>Map Node</span>
        </button>
        <button onClick={() => onTabChange?.('riwayat')} className={navBtnClass('riwayat')}>
          <span>Riwayat</span>
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center">
          <Bell size={20} />
          <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="flex items-center gap-2 rounded-full hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-emerald-500 p-1 min-h-[44px] min-w-[44px]"
          >
            <img 
              src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-emerald-100 object-cover"
            />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-sm font-bold text-slate-800">{userData?.name || 'User'}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Verified Eco-Member</p>
                </div>
                <button 
                  onClick={() => { setShowMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-500 hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm font-medium min-h-[44px]"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
