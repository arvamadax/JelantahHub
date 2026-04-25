import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, doc, writeBatch, serverTimestamp, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
}

export function useFirebaseLogic(user: User | null, userData: UserData | null) {
  const [transactions, setTransactions] = useState<ActivityTransaction[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const unsnapUser = onSnapshot(userRef, (snap) => {
      // Allow components or auth context to handle user updates
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    const q = query(
      collection(db, `users/${user.uid}/transactions`), 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ActivityTransaction[];
      setTransactions(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/transactions`);
    });

    return () => {
      unsnapUser();
      unsubscribe();
    };
  }, [user]);

  const handleSetor = async () => {
    if (!user || !userData) return;
    try {
      const newTxRef = doc(collection(db, `users/${user.uid}/transactions`));
      
      const batch = writeBatch(db);
      
      batch.set(newTxRef, {
        userId: user.uid,
        type: 'setor',
        title: 'Setor Jelantah',
        subtitle: 'Just now • Node Verification',
        pointsDelta: 500,
        status: 'Verified',
        createdAt: serverTimestamp()
      });
      
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        points: increment(500)
      });
      
      await batch.commit();
      // For immediate optimistic UI if context doesn't auto-update
      userData.points += 500;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/transactions`);
    }
  };

  const handleTukar = async () => {
    if (!user || !userData) return;
    if (userData.points < 200) {
      alert("Poin tidak cukup!");
      return;
    }
    try {
      const newTxRef = doc(collection(db, `users/${user.uid}/transactions`));
      const batch = writeBatch(db);
      
      batch.set(newTxRef, {
        userId: user.uid,
        type: 'tukar',
        title: 'Tukar Reward',
        subtitle: 'Just now • Voucher',
        pointsDelta: -200,
        status: 'Completed',
        createdAt: serverTimestamp()
      });
      
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        points: increment(-200)
      });
      
      await batch.commit();
      userData.points -= 200;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/transactions`);
    }
  };

  return {
    transactions,
    handleSetor,
    handleTukar,
  };
}
