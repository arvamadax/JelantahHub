import React, { useState } from 'react';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { AvatarFallback } from './AvatarFallback';
import type { DashboardTab } from './BottomNav';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  isNew: boolean;
}

interface TopBarProps {
  onLogout: () => void;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  notifications?: NotificationItem[];
}

const FALLBACK_NOTIF: NotificationItem[] = [
  {
    id: 'welcome',
    title: 'Selamat datang di JelantahHub!',
    body: 'Setor pertamamu untuk dapat +1.000 poin bonus.',
    time: 'Baru saja',
    isNew: true,
  },
];

export const TopBar: React.FC<TopBarProps> = ({ onLogout, activeTab, onTabChange, notifications }) => {
  const { userData, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  React.useEffect(() => {
    if (!showMenu && !showNotif) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-topbar-popover]')) {
        setShowMenu(false);
        setShowNotif(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [showMenu, showNotif]);

  const navBtnClass = (tab: DashboardTab) =>
    activeTab === tab
      ? 'flex items-center gap-2 text-forest-700 font-bold transition-colors duration-150'
      : 'flex items-center gap-2 text-forest-900/50 hover:text-forest-700 transition-colors duration-150';

  const notifList = notifications && notifications.length > 0 ? notifications : FALLBACK_NOTIF;
  const newCount = notifList.filter((n) => n.isNew).length;

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-cream-100/85 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <img
          src="/logos/jelantahhub-256.png"
          alt="JelantahHub"
          className="w-9 h-9 object-contain"
          width={36}
          height={36}
        />
        <h1 className="text-xl font-extrabold text-forest-900 tracking-tighter leading-none hidden sm:block">JelantahHub</h1>
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
        {/* Notification */}
        <div className="relative" data-topbar-popover>
          <button
            type="button"
            onClick={() => { setShowNotif((s) => !s); setShowMenu(false); }}
            aria-label="Notifikasi"
            aria-expanded={showNotif}
            className="p-2 text-forest-900/60 hover:bg-cream-200 rounded-full active:bg-cream-300 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bell size={20} />
            {newCount > 0 && (
              <span className="absolute top-[10px] right-[10px] w-2 h-2 bg-amber-500 rounded-full border-2 border-cream-100" />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-[var(--shadow-lg)] border border-border overflow-hidden origin-top-right"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <p className="text-sm font-bold text-forest-900">Notifikasi</p>
                  {newCount > 0 && (
                    <span className="text-xs text-forest-700 font-semibold bg-forest-50 px-2 py-0.5 rounded-full">
                      {newCount} baru
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-border max-h-80 overflow-y-auto">
                  {notifList.slice(0, 6).map((item) => (
                    <li key={item.id} className="px-4 py-3 hover:bg-cream-50">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            item.isNew ? 'bg-amber-500' : 'bg-forest-900/20'
                          }`}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-forest-900 truncate">{item.title}</p>
                          <p className="text-xs text-forest-900/65 mt-0.5 line-clamp-2">{item.body}</p>
                          <p className="text-xs text-forest-900/45 mt-1">{item.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-cream-50 transition-colors"
                  onClick={() => setShowNotif(false)}
                >
                  Tutup
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile menu */}
        <div className="relative" data-topbar-popover>
          <button
            onClick={() => { setShowMenu((s) => !s); setShowNotif(false); }}
            aria-label="Menu profil"
            aria-expanded={showMenu}
            className="flex items-center gap-2 rounded-full hover:bg-cream-50 transition-colors focus:ring-2 focus:ring-amber-500 p-1 min-h-[44px] min-w-[44px]"
          >
            <AvatarFallback
              name={userData?.name || user?.displayName || null}
              photoURL={user?.photoURL ?? null}
              size={32}
              className="border-2 border-forest-100"
            />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-[var(--shadow-lg)] border border-border py-2 origin-top-right"
              >
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-bold text-forest-900 truncate">{userData?.name || 'Pengguna'}</p>
                  <p className="text-xs text-forest-900/55 truncate">{userData?.email || ''}</p>
                  <p className="text-xs text-forest-700 font-medium mt-0.5">Anggota Eco Terverifikasi</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onTabChange?.('profil');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-forest-900/80 hover:text-forest-900 hover:bg-cream-50 active:bg-cream-200 transition-colors text-sm font-medium min-h-[44px]"
                >
                  <UserIcon size={16} />
                  Profil
                </button>
                <button
                  onClick={() => { setShowMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors text-sm font-medium min-h-[44px]"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
