import React, { useState, useCallback } from 'react';
import { Store, Utensils, ArrowUpRight, QrCode, Droplets, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseLogic, type ActivityTransaction } from '../hooks/useFirebaseLogic';
import { TopBar } from './TopBar';
import { ActivityItem } from './ActivityItem';
import { NearbyNodeCard } from './NearbyNodeCard';
import { BottomNav, type DashboardTab } from './BottomNav';
import { RiwayatPage } from './dashboard/RiwayatPage';
import { TitikKumpulPage } from './dashboard/TitikKumpulPage';
import { SetorConfirmModal } from './dashboard/SetorConfirmModal';
import { QRModal } from './dashboard/QRModal';
import { AvatarFallback } from './AvatarFallback';

interface NodeProps {
  id: string;
  name: string;
  distance: string;
  isOpen: boolean;
  icon: 'Store' | 'Utensils';
}

type ToastKind = 'success' | 'error' | 'info';

interface ToastState {
  kind: ToastKind;
  message: string;
}

const Toast: React.FC<{ toast: ToastState | null; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-8 z-[70] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-[var(--shadow-lg)] ${
              toast.kind === 'success'
                ? 'bg-forest-700 border-forest-800 text-cream-50'
                : toast.kind === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {toast.kind === 'success' ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <p className="text-sm font-semibold leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Tutup notifikasi"
              className="shrink-0 -m-1 p-1 opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showLogo?: boolean;
  labelledById?: string;
}> = ({ open, onClose, title, subtitle, children, showLogo = false, labelledById = 'info-modal-title' }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-forest-900/55 backdrop-blur-sm flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledById}
            className="bg-cream-100 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E8DEC4] shadow-[var(--shadow-lg)] max-h-[85vh] flex flex-col"
          >
            <div className="px-6 pt-6 pb-3 border-b border-[#E8DEC4] flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {showLogo && (
                  <img
                    src="/logos/jelantahhub-256.png"
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h3 id={labelledById} className="font-display font-extrabold text-xl text-forest-900">
                    {title}
                  </h3>
                  {subtitle && <p className="text-xs text-forest-900/60">{subtitle}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="shrink-0 w-9 h-9 rounded-full hover:bg-cream-200 flex items-center justify-center text-forest-900/70"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex flex-col gap-3 text-sm text-forest-900/85 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara setor jelantah?',
    a: 'Tekan tombol Setor di beranda, pilih volume liter, lalu konfirmasi. Atau buka tab Map Node, pilih titik kumpul terdekat, dan tekan "Setor di Sini".',
  },
  {
    q: 'Kapan poin masuk ke akun saya?',
    a: 'Poin langsung masuk setelah konfirmasi setoran. Untuk setoran dengan verifikasi node, status akan berubah menjadi Verified dalam waktu maksimal 1×24 jam.',
  },
  {
    q: 'Bagaimana cara menukar poin?',
    a: 'Buka beranda, tekan tombol Tukar 200 Pts. Voucher GoPay akan masuk dalam waktu kurang dari 5 menit. Minimum penukaran 200 poin.',
  },
  {
    q: 'Apakah jelantah saya benar-benar diolah jadi biofuel?',
    a: 'Ya. Semua jelantah yang terkumpul dikirim ke kilang biofuel mitra resmi. Kamu bisa cek dampak agregat di section Dampak halaman utama.',
  },
  {
    q: 'Berapa banyak yang bisa saya setor?',
    a: 'Tidak ada batas atas. Rata-rata pengguna aktif menyetor 5–25 liter per bulan. Pemilik warung biasanya 30–200 liter per bulan.',
  },
];

const SkeletonRow: React.FC = () => (
  <li className="bg-white border border-[#E8DEC4] rounded-xl p-4 flex items-center gap-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-cream-200" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-2/3 bg-cream-200 rounded" />
      <div className="h-2.5 w-1/2 bg-cream-200/70 rounded" />
    </div>
    <div className="h-3 w-12 bg-cream-200 rounded" />
  </li>
);

const ProfilPage: React.FC<{
  onLogout: () => void;
  onAbout: () => void;
  onFAQ: () => void;
  onComingSoon: () => void;
  onShowQR: () => void;
}> = ({ onLogout, onAbout, onFAQ, onComingSoon, onShowQR }) => {
  const { user, userData } = useAuth();
  const memberCode = user?.uid ? `JH-${user.uid.substring(0, 4).toUpperCase()}` : 'JH-----';

  return (
    <div className="space-y-4">
      <h1 className="font-display font-extrabold text-forest-900 text-[clamp(1.75rem,2vw+1rem,2.25rem)] leading-tight tracking-tight">
        Profil
      </h1>

      <div className="bg-white border border-[#E8DEC4] rounded-2xl p-6 flex items-center gap-4">
        <AvatarFallback
          name={userData?.name || user?.displayName || null}
          photoURL={user?.photoURL ?? null}
          size={64}
          className="border-2 border-amber-200"
        />
        <div className="min-w-0">
          <p className="font-display font-bold text-forest-900 text-lg truncate">
            {userData?.name || 'Pengguna'}
          </p>
          <p className="text-sm text-forest-900/60 truncate">{userData?.email || ''}</p>
          <span className="inline-block mt-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
            Anggota Eco Terverifikasi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#E8DEC4] rounded-2xl p-4 text-center">
          <p className="font-display font-extrabold text-2xl text-amber-500 tabular-nums">
            {userData?.points?.toLocaleString('id-ID') || 0}
          </p>
          <p className="text-xs text-forest-900/60 mt-1">Total Poin</p>
        </div>
        <div className="bg-white border border-[#E8DEC4] rounded-2xl p-4 text-center">
          <p className="font-display font-extrabold text-lg text-forest-700 tabular-nums tracking-wide">
            {memberCode}
          </p>
          <p className="text-xs text-forest-900/60 mt-1">Kode Member</p>
        </div>
      </div>

      <div className="bg-white border border-[#E8DEC4] rounded-2xl overflow-hidden divide-y divide-[#E8DEC4]">
        {[
          { label: 'Tampilkan QR Code', sub: `ID: ${memberCode}`, action: onShowQR },
          { label: 'Notifikasi', sub: 'Atur preferensi notifikasi', action: onComingSoon },
          { label: 'Bantuan & FAQ', sub: 'Pertanyaan yang sering ditanyakan', action: onFAQ },
          { label: 'Tentang JelantahHub', sub: 'Versi 1.0.0', action: onAbout },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-50 active:bg-cream-200 transition-colors text-left min-h-[56px]"
          >
            <div>
              <p className="text-sm font-semibold text-forest-900">{item.label}</p>
              <p className="text-xs text-forest-900/60">{item.sub}</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-forest-900/60 shrink-0"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-[#E8DEC4] rounded-2xl text-red-500 font-semibold text-sm hover:bg-red-50 active:bg-red-100 transition-colors min-h-[56px]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Keluar dari Akun
      </button>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, userData, logOut } = useAuth();
  const { transactions, transactionsLoading, handleSetor, handleTukar } = useFirebaseLogic(user, userData);

  const [tab, setTab] = useState<DashboardTab>('home');
  const [setorOpen, setSetorOpen] = useState(false);
  const [setorNodeName, setSetorNodeName] = useState<string>('Bank Sampah Melati');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [faqOpen, setFAQOpen] = useState(false);
  const [qrOpen, setQROpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToast({ kind, message });
  }, []);

  const openSetor = useCallback((nodeName?: string) => {
    setSetorNodeName(nodeName ?? 'Bank Sampah Melati');
    setSetorOpen(true);
  }, []);

  const handleConfirmSetor = useCallback(
    async (volumeLiters: number, nodeName: string) => {
      const result = await handleSetor({ volumeLiters, nodeName });
      setSetorOpen(false);
      if (result.ok) {
        showToast(
          'success',
          `Setoran ${volumeLiters} L di ${nodeName} tersimpan. +${(volumeLiters * 100).toLocaleString('id-ID')} poin masuk.`,
        );
      } else {
        showToast('error', 'Gagal menyimpan setoran. Coba lagi sebentar.');
      }
    },
    [handleSetor, showToast],
  );

  const handleTukarClick = useCallback(async () => {
    const result = await handleTukar(200);
    if (result.ok) {
      showToast('success', '200 poin berhasil ditukar dengan voucher GoPay.');
    } else {
      if (result.reason === 'insufficient_points') {
        showToast('error', 'Poin belum cukup. Setor lebih banyak untuk tukar reward.');
      } else {
        showToast('error', 'Gagal menukar poin. Coba lagi sebentar.');
      }
    }
  }, [handleTukar, showToast]);

  const [nodes] = useState<NodeProps[]>([
    { id: '1', name: 'Bank Sampah Melati', distance: '1.2 km', isOpen: true, icon: 'Store' },
    { id: '2', name: 'Warung Bu Tejo', distance: '3.5 km', isOpen: false, icon: 'Utensils' },
  ]);

  if (!user) return null;

  return (
    <div className="min-h-[100dvh] w-full bg-cream-100 flex flex-col">
      <TopBar onLogout={logOut} activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-28 md:pb-12 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {tab === 'riwayat' ? (
            <RiwayatPage transactions={transactions} loading={transactionsLoading} />
          ) : tab === 'map' ? (
            <TitikKumpulPage onSetor={openSetor} />
          ) : tab === 'profil' ? (
            <ProfilPage
              onLogout={logOut}
              onAbout={() => setAboutOpen(true)}
              onFAQ={() => setFAQOpen(true)}
              onComingSoon={() => showToast('info', 'Fitur ini sedang dalam pengembangan.')}
              onShowQR={() => setQROpen(true)}
            />
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
                  <p className="text-sm font-semibold text-cream-50/70 mb-1">Total Saldo Poin</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h2 className="text-5xl font-extrabold font-display leading-none text-amber-400 tabular-nums">
                      {userData?.points?.toLocaleString('id-ID') || 0}
                    </h2>
                    <span className="text-xl font-medium text-cream-50/70">Pts</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => openSetor()}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-cream-50 text-sm font-bold rounded-xl transition-colors duration-150 text-center min-h-[44px]"
                    >
                      Setor
                    </button>
                    <button
                      type="button"
                      onClick={handleTukarClick}
                      className="flex-1 py-3 bg-transparent border border-cream-50/30 hover:border-cream-50/60 text-cream-50 text-sm font-bold rounded-xl transition-colors duration-150 text-center min-h-[44px]"
                    >
                      Tukar 200 Pts
                    </button>
                  </div>
                </div>
              </motion.section>

              <button
                type="button"
                onClick={() => setQROpen(true)}
                className="w-full bg-white rounded-2xl border border-[#E8DEC4] p-4 shadow-sm flex items-center justify-between hover:bg-cream-50 active:bg-cream-100 transition-colors min-h-[44px] text-left"
              >
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
              </button>
            </div>

            <div className="md:col-span-5 space-y-6">
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

              <section className="pb-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-base font-bold text-forest-900 font-display">Riwayat</h3>
                </div>
                <div className="bg-white rounded-2xl border border-[#E8DEC4] shadow-sm overflow-hidden">
                  {transactionsLoading ? (
                    <ul className="divide-y divide-[#E8DEC4]">
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </ul>
                  ) : (
                    <ul className="divide-y divide-[#E8DEC4]">
                      {transactions.length > 0 ? (
                        transactions.slice(0, 3).map((tx: ActivityTransaction) => (
                          <ActivityItem
                            key={tx.id}
                            type={tx.type}
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
                  )}
                  {!transactionsLoading && transactions.length > 0 && (
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

      <BottomNav
        activeTab={tab}
        onTabChange={setTab}
        onQuickSetor={() => openSetor()}
      />

      <SetorConfirmModal
        open={setorOpen}
        defaultNodeName={setorNodeName}
        onClose={() => setSetorOpen(false)}
        onConfirm={handleConfirmSetor}
      />

      <InfoModal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="Tentang JelantahHub"
        subtitle="Versi 1.0.0 · MVP"
        showLogo
        labelledById="about-modal-title"
      >
        <p>
          JelantahHub adalah platform eco-fintech sirkular yang menghubungkan rumah tangga,
          warung, dan UMKM dengan jaringan titik kumpul jelantah serta kilang biofuel mitra.
        </p>
        <p>
          Misi kami: mengurangi pencemaran air akibat jelantah yang dibuang sembarangan,
          sekaligus memberi nilai ekonomi bagi keluarga Indonesia.
        </p>
        <p className="text-xs text-forest-900/60">
          Dibangun untuk IYREF 2026 Hackathon.
        </p>
      </InfoModal>

      <InfoModal
        open={faqOpen}
        onClose={() => setFAQOpen(false)}
        title="Bantuan & FAQ"
        subtitle="Pertanyaan yang sering ditanyakan"
        labelledById="faq-modal-title"
      >
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={item.q}
            className="bg-white border border-[#E8DEC4] rounded-xl px-4 py-3 group"
            {...(idx === 0 ? { open: true } : {})}
          >
            <summary className="font-semibold text-forest-900 text-sm cursor-pointer flex items-start justify-between gap-3 list-none">
              <span className="flex-1">{item.q}</span>
              <span className="shrink-0 text-amber-600 mt-0.5 transition-transform group-open:rotate-180">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <p className="mt-2 text-sm text-forest-900/75 leading-relaxed">{item.a}</p>
          </details>
        ))}
        <p className="text-xs text-forest-900/60 mt-2">
          Tidak menemukan jawabanmu? Hubungi <a href="mailto:halo@jelantahhub.id" className="text-amber-700 font-semibold">halo@jelantahhub.id</a>.
        </p>
      </InfoModal>

      <QRModal
        open={qrOpen}
        onClose={() => setQROpen(false)}
        uid={user.uid}
        userName={userData?.name}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
