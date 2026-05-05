import React from 'react';
import { Home, MapPin, PlusCircle, History, User as UserIcon } from 'lucide-react';

export type DashboardTab = 'home' | 'map' | 'riwayat' | 'profil';

interface BottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onQuickSetor?: () => void;
}

const tabBaseClass =
  'flex flex-col items-center p-2 rounded-lg transition-colors min-w-[64px] min-h-[44px]';

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onQuickSetor }) => {
  const tabClass = (tab: DashboardTab) =>
    `${tabBaseClass} ${
      activeTab === tab
        ? 'text-forest-700'
        : 'text-forest-900/40 hover:text-forest-700 active:bg-cream-200'
    }`;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-[#E8DEC4] pb-safe pt-2 px-6 flex justify-between items-center z-50 md:hidden">
      <button onClick={() => onTabChange('home')} className={tabClass('home')}>
        <Home size={22} className="mb-1" />
        <span className="text-[10px] font-bold">Beranda</span>
      </button>
      <button onClick={() => onTabChange('map')} className={tabClass('map')}>
        <MapPin size={22} className="mb-1" />
        <span className="text-[10px] font-bold">Map Node</span>
      </button>

      <div className="relative -top-6">
        <button
          type="button"
          onClick={onQuickSetor}
          aria-label="Setor cepat"
          className="w-14 h-14 bg-forest-700 rounded-full shadow-[var(--shadow-forest)] flex items-center justify-center text-cream-50 hover:bg-forest-800 active:bg-forest-900 transition-colors outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40"
        >
          <PlusCircle size={28} />
        </button>
      </div>

      <button onClick={() => onTabChange('riwayat')} className={tabClass('riwayat')}>
        <History size={22} className="mb-1" />
        <span className="text-[10px] font-bold">Riwayat</span>
      </button>
      <button onClick={() => onTabChange('profil')} className={tabClass('profil')}>
        <UserIcon size={22} className="mb-1" />
        <span className="text-[10px] font-bold">Profil</span>
      </button>
    </nav>
  );
};
