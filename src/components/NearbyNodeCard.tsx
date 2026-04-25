import React from 'react';
import { MapPin } from 'lucide-react';

export const NearbyNodeCard = ({ title, distance, isOpen, icon: Icon }: { title: string, distance: string, isOpen: boolean, icon: any }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-3 hover:shadow-md active:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-3 min-h-[64px]">
    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-800 truncate">{title}</h4>
      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
        <MapPin size={10} /> {distance}
      </p>
    </div>
    <div className="shrink-0 flex flex-col items-end gap-1">
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
        isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}>
        <span className={`w-1 h-1 rounded-full ${isOpen ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
        {isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  </div>
);
