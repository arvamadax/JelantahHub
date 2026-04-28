import React from 'react';
import { MapPin } from 'lucide-react';

export const NearbyNodeCard = ({ title, distance, isOpen, icon: Icon }: { title: string, distance: string, isOpen: boolean, icon: any }) => (
  <div className="bg-white rounded-xl border border-[#E8DEC4] p-3 hover:shadow-md active:bg-cream-50 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-3 min-h-[64px]">
    <div className="w-10 h-10 rounded-lg bg-cream-50 flex items-center justify-center text-forest-700 shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-forest-900 truncate">{title}</h4>
      <p className="text-xs text-forest-900/60 flex items-center gap-1 mt-0.5">
        <MapPin size={10} /> {distance}
      </p>
    </div>
    <div className="shrink-0 flex flex-col items-end gap-1">
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
        isOpen ? 'bg-amber-50 text-amber-700' : 'bg-cream-200 text-forest-900/40'
      }`}>
        <span className={`w-1 h-1 rounded-full ${isOpen ? 'bg-amber-500' : 'bg-forest-900/30'}`}></span>
        {isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  </div>
);
