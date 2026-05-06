import React from 'react';
import { MapPin } from 'lucide-react';

interface Pin {
  top: string;
  left: string;
  label: string;
  dist: string;
  delay?: string;
}

const DEFAULT_PINS: Pin[] = [
  { top: '24%', left: '28%', label: 'Bank Sampah Melati', dist: '1.2 km', delay: '0s' },
  { top: '48%', left: '60%', label: 'Pos Kumpul RT 04', dist: '0.8 km', delay: '0.6s' },
  { top: '70%', left: '40%', label: 'Warung Bu Tejo', dist: '3.5 km', delay: '1.2s' },
];

interface MapPreviewProps {
  pins?: Pin[];
  caption?: string;
  className?: string;
  showLiveBadge?: boolean;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  pins = DEFAULT_PINS,
  caption = 'Bandung · 12 titik aktif',
  className = '',
  showLiveBadge = true,
}) => {
  return (
    <div className={`relative bg-forest-50 border border-[#E8DEC4] rounded-2xl overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <pattern id="mapPreviewGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#A6CBB6" strokeOpacity="0.35" strokeWidth="0.6" />
          </pattern>
          <linearGradient id="mapPreviewSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBF6E9" stopOpacity="0" />
            <stop offset="100%" stopColor="#FBF6E9" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width="400" height="320" fill="#ECF5F0" />
        <rect width="400" height="320" fill="url(#mapPreviewGrid)" />
        <path d="M-20 90 Q120 70 200 120 T420 100" stroke="#A6CBB6" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M40 -10 Q100 120 60 220 T100 340" stroke="#A6CBB6" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M260 -10 Q220 140 320 200 T380 340" stroke="#A6CBB6" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-20 240 Q140 220 220 260 T420 230" stroke="#A6CBB6" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-20 180 Q100 200 200 170 T420 200" stroke="#7AB394" strokeOpacity="0.45" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect width="400" height="320" fill="url(#mapPreviewSheen)" />
      </svg>
      {pins.map((pin) => (
        <div
          key={pin.label}
          role="img"
          aria-label={`${pin.label}, ${pin.dist}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
          style={{ top: pin.top, left: pin.left }}
        >
          <span className="relative flex">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping"
              style={{ animationDelay: pin.delay }}
            />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 ring-2 ring-cream-50" />
          </span>
          <span className="bg-cream-50 text-forest-900 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-[var(--shadow-md)] whitespace-nowrap">
            {pin.label} · {pin.dist}
          </span>
        </div>
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
        <span className="bg-cream-50/90 backdrop-blur-sm text-forest-900 font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
          <MapPin size={12} className="text-amber-600" aria-hidden="true" />
          {caption}
        </span>
        {showLiveBadge && (
          <span className="bg-cream-50/90 backdrop-blur-sm text-forest-700 font-medium px-2.5 py-1 rounded-full">
            Live
          </span>
        )}
      </div>
    </div>
  );
};
