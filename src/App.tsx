import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

type PublicRoute = 'landing' | 'auth';

export default function App() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState<PublicRoute>('landing');

  useEffect(() => {
    if (!user) {
      setRoute('landing');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center">
          <img
            src="/logos/jelantahhub-256.png"
            alt="JelantahHub"
            width={80}
            height={80}
            className="w-20 h-20 object-contain animate-pulse"
          />
          <p className="font-display font-extrabold text-forest-700 mt-4 tracking-tight">
            JelantahHub
          </p>
          <p className="text-xs text-forest-900/55 mt-1">Memuat…</p>
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
