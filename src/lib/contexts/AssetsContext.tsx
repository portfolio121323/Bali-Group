import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface SiteAsset {
  url: string;
  alt: string;
  mediaType?: 'image' | 'video';
  updatedAt?: any;
}

interface AssetsContextType {
  assets: Record<string, SiteAsset>;
  loading: boolean;
  getAssetUrl: (key: string, fallback: string) => string;
}

const AssetsContext = createContext<AssetsContextType>({
  assets: {},
  loading: false,
  getAssetUrl: (_, fallback) => fallback,
});

export function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Record<string, SiteAsset>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'site_assets'), 
        (snapshot) => {
          const newAssets: Record<string, SiteAsset> = {};
          snapshot.forEach(doc => {
            newAssets[doc.id] = doc.data() as SiteAsset;
          });
          setAssets(newAssets);
          setLoading(false);
        },
        (error) => {
          console.warn('[AssetsContext] site_assets subscription warning (using built-in media):', error.message || error);
          setLoading(false);
        }
      );

      return () => {
        try {
          unsubscribe();
        } catch (_) {}
      };
    } catch (err) {
      console.warn('[AssetsContext] Could not attach site_assets listener (using built-in media):', err);
      setLoading(false);
    }
  }, []);

  const getAssetUrl = (key: string, fallback: string) => {
    return assets[key]?.url || fallback;
  };

  return (
    <AssetsContext.Provider value={{ assets, loading, getAssetUrl }}>
      {children}
    </AssetsContext.Provider>
  );
}

export const useAssets = () => useContext(AssetsContext);
