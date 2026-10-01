import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import { Layout } from '../components/layout';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication error. Please check your credentials or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#F6F6F4] min-h-screen pt-36 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="bg-white p-8 md:p-10 border border-[#E9EAEC] shadow-sm text-center">
            
            <div className="w-12 h-12 bg-[#0B0B0B] text-[#F4FF00] flex items-center justify-center mb-6 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#0B0B0B] uppercase block mb-1">
              PERSONNEL ACCESS GATEWAY
            </span>
            <h1 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tight mb-2">
              Bali Group Admin
            </h1>
            <p className="text-[#303236] text-xs leading-relaxed mb-8">
              Authorized engineering management, lead dispatch, and media library controls.
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-mono mb-6 text-left flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-[#0B0B0B] text-white px-8 py-4 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? 'Authenticating...' : 'Sign in with Corporate Google Account'}
            </button>

            <div className="mt-8 pt-6 border-t border-[#E9EAEC] text-[10px] font-mono text-[#A8AFB8]">
              INTERNAL SYSTEM // UNAUTHORIZED ATTEMPTS ARE LOGGED
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
