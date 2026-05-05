import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { User } from 'firebase/auth';

export type NodeTipe = 'bank_sampah' | 'warung' | 'pos_rt';
export type NodeStatus = 'open' | 'closed';

export interface CollectionNode {
  id: string;
  nama: string;
  alamat: string;
  jarak: string;
  jam: string;
  hari: string;
  status: NodeStatus;
  tipe: NodeTipe;
  lat?: number;
  lng?: number;
}

const FALLBACK_NODES: CollectionNode[] = [
  { id: 'n1',  nama: 'Bank Sampah Melati',         alamat: 'Jl. Cijaura Hilir No. 12, Bandung',          jarak: '1.2 km',  jam: '08.00 – 17.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah', lat: -6.9417, lng: 107.6539 },
  { id: 'n2',  nama: 'Warung Bu Tejo',             alamat: 'Jl. Terusan Buah Batu No. 45, Bandung',      jarak: '3.5 km',  jam: '07.00 – 15.00', hari: 'Sen–Jum',  status: 'closed', tipe: 'warung',      lat: -6.9533, lng: 107.6320 },
  { id: 'n3',  nama: 'Pos Kumpul RT 04 RW 02',     alamat: 'Perum Griya Asri Blok C, Bandung',           jarak: '0.8 km',  jam: '09.00 – 16.00', hari: 'Sen–Ming', status: 'open',   tipe: 'pos_rt',      lat: -6.9240, lng: 107.6090 },
  { id: 'n4',  nama: 'Bank Sampah Berseri',        alamat: 'Jl. Margahayu Raya No. 88, Bandung',         jarak: '4.1 km',  jam: '08.00 – 15.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah', lat: -6.9678, lng: 107.6398 },
  { id: 'n5',  nama: 'Toko Hijau Nusantara',       alamat: 'Jl. Soekarno Hatta No. 221, Bandung',        jarak: '5.3 km',  jam: '09.00 – 18.00', hari: 'Sen–Ming', status: 'open',   tipe: 'warung',      lat: -6.9444, lng: 107.6111 },
  { id: 'n6',  nama: 'Pos Kumpul RT 07 RW 05',     alamat: 'Jl. Derwati No. 3, Bandung',                 jarak: '2.9 km',  jam: '08.00 – 14.00', hari: 'Sen–Sab',  status: 'closed', tipe: 'pos_rt',      lat: -6.9700, lng: 107.6700 },
  { id: 'n7',  nama: 'Bank Sampah Harapan',        alamat: 'Jl. Kopo Permai No. 17, Bandung',            jarak: '6.2 km',  jam: '08.00 – 16.00', hari: 'Sen–Jum',  status: 'open',   tipe: 'bank_sampah', lat: -6.9555, lng: 107.5832 },
  { id: 'n8',  nama: 'Warung Pak Harto',           alamat: 'Jl. Moch. Toha No. 56, Bandung',             jarak: '7.0 km',  jam: '06.00 – 14.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'warung',      lat: -6.9381, lng: 107.6076 },
  { id: 'n9',  nama: 'Pos Kumpul RT 11 RW 08',     alamat: 'Jl. Panyileukan No. 9, Bandung',             jarak: '8.4 km',  jam: '09.00 – 15.00', hari: 'Sen–Ming', status: 'closed', tipe: 'pos_rt',      lat: -6.9342, lng: 107.7128 },
  { id: 'n10', nama: 'Bank Sampah Lestari',        alamat: 'Jl. Gedebage Selatan No. 33, Bandung',       jarak: '9.1 km',  jam: '08.00 – 17.00', hari: 'Sen–Sab',  status: 'open',   tipe: 'bank_sampah', lat: -6.9682, lng: 107.6862 },
  { id: 'n11', nama: 'Minimarket Segar',           alamat: 'Jl. AH Nasution No. 100, Bandung',           jarak: '10.2 km', jam: '07.00 – 22.00', hari: 'Sen–Ming', status: 'open',   tipe: 'warung',      lat: -6.8919, lng: 107.6850 },
  { id: 'n12', nama: 'Pos Kumpul RT 02 RW 11',     alamat: 'Jl. Ujung Berung Indah No. 4, Bandung',      jarak: '11.8 km', jam: '08.00 – 14.00', hari: 'Sab–Ming', status: 'open',   tipe: 'pos_rt',      lat: -6.9100, lng: 107.7050 },
];

export function useNodes(user: User | null) {
  const [nodes, setNodes] = useState<CollectionNode[]>(FALLBACK_NODES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !db) return;
    setLoading(true);

    const unsub = onSnapshot(
      collection(db, 'nodes'),
      (snap) => {
        if (!snap.empty) {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CollectionNode[];
          setNodes(data);
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  return { nodes, loading };
}
