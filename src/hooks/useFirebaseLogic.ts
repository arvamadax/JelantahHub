import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, doc, writeBatch, serverTimestamp, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { User } from 'firebase/auth';

export interface UserData {
  userId: string;
  email: string;
  name: string;
  points: number;
}

export interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

export interface ActivityTransaction {
  id: string;
  type: 'setor' | 'tukar';
  title: string;
  subtitle: string;
  pointsDelta: number;
  status: string;
  createdAt: any;
  volumeLiters?: number;
  nodeName?: string;
}

export interface SetorOptions {
  nodeName?: string;
  volumeLiters?: number;
  pointsAwarded?: number;
}

export interface TukarResult {
  ok: boolean;
  reason?: 'insufficient_points' | 'unavailable' | 'firestore_error';
}

const POINTS_PER_LITER = 100;

export function useFirebaseLogic(user: User | null, userData: UserData | null) {
  const [transactions, setTransactions] = useState<ActivityTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactionsLoading(false);
      return;
    }

    if (!db) {
      setTransactionsLoading(false);
      return;
    }

    setTransactionsLoading(true);

    const q = query(
      collection(db, `users/${user.uid}/transactions`),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as ActivityTransaction[];
        setTransactions(data);
        setTransactionsLoading(false);
      },
      (error) => {
        setTransactionsLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/transactions`);
        } catch {
          /* swallow — error already logged inside handleFirestoreError */
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleSetor = async (opts: SetorOptions = {}): Promise<{ ok: boolean }> => {
    if (!user || !userData) return { ok: false };
    if (!db) return { ok: false };

    const volumeLiters = opts.volumeLiters ?? 5;
    const pointsAwarded = opts.pointsAwarded ?? volumeLiters * POINTS_PER_LITER;
    const nodeName = opts.nodeName ?? 'Node Mitra';

    try {
      const newTxRef = doc(collection(db, `users/${user.uid}/transactions`));
      const batch = writeBatch(db);

      batch.set(newTxRef, {
        userId: user.uid,
        type: 'setor',
        title: 'Setor Jelantah',
        subtitle: `${nodeName} • ${volumeLiters.toFixed(1)} L`,
        pointsDelta: pointsAwarded,
        status: 'Verified',
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        points: increment(pointsAwarded),
      });

      await batch.commit();
      return { ok: true };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/transactions`);
      } catch {
        /* swallow — error already logged inside handleFirestoreError */
      }
      return { ok: false };
    }
  };

  const handleTukar = async (cost = 200): Promise<TukarResult> => {
    if (!user || !userData) return { ok: false, reason: 'unavailable' };
    if (!db) return { ok: false, reason: 'unavailable' };

    if (userData.points < cost) {
      return { ok: false, reason: 'insufficient_points' };
    }

    try {
      const newTxRef = doc(collection(db, `users/${user.uid}/transactions`));
      const batch = writeBatch(db);

      batch.set(newTxRef, {
        userId: user.uid,
        type: 'tukar',
        title: 'Tukar Reward',
        subtitle: 'Voucher GoPay',
        pointsDelta: -cost,
        status: 'Completed',
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        points: increment(-cost),
      });

      await batch.commit();
      return { ok: true };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/transactions`);
      } catch {
        /* swallow — error already logged inside handleFirestoreError */
      }
      return { ok: false, reason: 'firestore_error' };
    }
  };

  return {
    transactions,
    transactionsLoading,
    handleSetor,
    handleTukar,
  };
}
