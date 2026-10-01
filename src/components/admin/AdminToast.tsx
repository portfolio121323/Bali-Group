import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toast: (options: { title: string; message?: string; type?: 'success' | 'error' | 'info' | 'warning' }) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useAdminToast = () => useContext(ToastContext);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ title, message, type = 'success' }: { title: string; message?: string; type?: 'success' | 'error' | 'info' | 'warning' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-[12px] shadow-xl border text-sm transition-all duration-200 transform translate-y-0",
              t.type === 'success' && "bg-[#141719] text-white border-[#2B3034]",
              t.type === 'error' && "bg-[#141719] text-white border-[#5C2828]",
              t.type === 'warning' && "bg-[#141719] text-white border-[#2B3034]",
              t.type === 'info' && "bg-[#141719] text-white border-[#2B3034]"
            )}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#EFFF00] shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C55A5A] shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#EFFF00] shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#B9BDC1] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs tracking-wide uppercase text-white">{t.title}</p>
              {t.message && <p className="text-xs text-[#B9BDC1] mt-0.5">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-white/40 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
