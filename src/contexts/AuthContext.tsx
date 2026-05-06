import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../services/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserData {
  userId: string;
  email: string;
  name: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let unsubUserDoc: (() => void) | null = null;

    const unsubAuth = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      if (!db) {
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      let bootstrapTried = false;

      unsubUserDoc = onSnapshot(
        userRef,
        async (snap) => {
          if (snap.exists()) {
            setUserData(snap.data() as UserData);
            setLoading(false);
            return;
          }

          if (bootstrapTried) {
            setLoading(false);
            return;
          }
          bootstrapTried = true;

          const newUserData: UserData = {
            userId: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            points: 0,
          };
          try {
            await setDoc(userRef, {
              ...newUserData,
              createdAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
            setLoading(false);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const signIn = async () => {
    if (!auth || !googleProvider) {
      throw new Error('auth-not-configured');
    }
    await signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
