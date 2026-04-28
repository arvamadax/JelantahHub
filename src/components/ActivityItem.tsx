import React from 'react';
import { Droplets, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export const ActivityItem = ({ type, title, subtitle, points, status }: { type: 'setor' | 'tukar', title: string, subtitle: string, points: string, status: string }) => (
  <motion.li 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 flex items-center justify-between hover:bg-cream-50 active:bg-cream-200 transition-colors cursor-pointer group min-h-[64px]"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        type === 'setor' ? 'bg-amber-50 text-amber-500' : 'bg-orange-100 text-orange-600'
      }`}>
        {type === 'setor' ? <Droplets size={20} /> : <Gift size={20} />}
      </div>
      <div>
        <p className="text-sm font-bold text-forest-900 leading-tight">{title}</p>
        <p className="text-xs text-forest-900/60">{subtitle}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-sm font-bold ${type === 'setor' ? 'text-forest-700' : 'text-orange-600'}`}>
        {points}
      </p>
      <span className={`inline-block px-1.5 py-0.5 text-xs font-bold rounded-md mt-1 border ${
        status === 'Verified' ? 'bg-forest-50 text-forest-700 border-forest-100' : 
        status === 'Completed' ? 'bg-forest-50 text-forest-700 border-forest-100' :
        status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
        'bg-cream-200 text-forest-900/70 border-[#E8DEC4]'
      }`}>
        {status}
      </span>
    </div>
  </motion.li>
);
