import React from 'react';
import { Home, MapPin, PlusCircle, History, User as UserIcon } from 'lucide-react';

export const BottomNav = () => (
  <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 md:hidden">
    <button className="flex flex-col items-center p-2 text-emerald-600 min-w-[64px] min-h-[44px]">
      <Home size={22} className="mb-1" />
      <span className="text-[9px] font-bold">Beranda</span>
    </button>
    <button className="flex flex-col items-center p-2 text-slate-400 hover:text-emerald-500 active:bg-slate-100 rounded-lg transition-colors min-w-[64px] min-h-[44px]">
      <MapPin size={22} className="mb-1" />
      <span className="text-[9px] font-bold">Map Node</span>
    </button>
    
    <div className="relative -top-6">
      <button className="w-14 h-14 bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white hover:bg-emerald-700 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-200">
        <PlusCircle size={28} />
      </button>
    </div>
    
    <button className="flex flex-col items-center p-2 text-slate-400 hover:text-emerald-500 active:bg-slate-100 rounded-lg transition-colors min-w-[64px] min-h-[44px]">
      <History size={22} className="mb-1" />
      <span className="text-[9px] font-bold">Riwayat</span>
    </button>
    <button className="flex flex-col items-center p-2 text-slate-400 hover:text-emerald-500 active:bg-slate-100 rounded-lg transition-colors min-w-[64px] min-h-[44px]">
      <UserIcon size={22} className="mb-1" />
      <span className="text-[9px] font-bold">Profil</span>
    </button>
  </nav>
);
