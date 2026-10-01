import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth, 
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        },
        (error) => {
          console.warn('[AdminRoute] Auth listener error:', error);
          setLoading(false);
        }
      );
      
      // Safety timeout: Never stay stuck in permanent loading state
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3500);

      return () => {
        clearTimeout(timer);
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (err) {
      console.warn('[AdminRoute] Failed to attach auth listener:', err);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#F4FF00]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
