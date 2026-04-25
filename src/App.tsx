import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

type PublicRoute = 'landing' | 'auth';

export default function App() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState<PublicRoute>('landing');

  // Reset to landing whenever the user logs out, so a fresh visit lands there.
  useEffect(() => {
    if (!user) {
      setRoute('landing');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50 text-emerald-600">
        <div className="animate-pulse flex flex-col items-center">
          <Leaf size={40} className="mb-4" />
          <p className="font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  // ProtectedRoute: only show the dashboard when authenticated.
  if (user) {
    return <Dashboard />;
  }

  if (route === 'auth') {
    return <AuthPage onBack={() => setRoute('landing')} />;
  }

  return <LandingPage onNavigateAuth={() => setRoute('auth')} />;
}
