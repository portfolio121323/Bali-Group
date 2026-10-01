import React, { useState, useEffect } from 'react';
import { useAssets } from '@/lib/contexts/AssetsContext';

interface DynamicMediaProps {
  assetKey?: string;
  fallbackUrl: string;
  fallbackType?: 'image' | 'video';
  alt?: string;
  className?: string;
  allowDeviceUpload?: boolean; // Kept for interface backward-compatibility, but disabled on public site
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const EMERGENCY_FALLBACK = 'https://images.unsplash.com/photo-1588624135540-c3d5e2197dd1?q=80&w=2070&auto=format&fit=crop';

export function DynamicMedia({ 
  assetKey, 
  fallbackUrl, 
  fallbackType = 'image', 
  alt, 
  className,
  videoProps,
  imgProps
}: DynamicMediaProps) {
  const { assets } = useAssets();
  
  const asset = assetKey ? assets[assetKey] : undefined;
  
  // Intelligent resolution: prioritize custom uploaded image from site_assets
  const getResolvedUrl = () => {
    if (asset?.url && asset.url.trim()) {
      return asset.url;
    }
    if (fallbackUrl && fallbackUrl.trim()) {
      return fallbackUrl;
    }
    return EMERGENCY_FALLBACK;
  };

  const rawUrl = getResolvedUrl();
  const mediaType = asset?.mediaType || fallbackType;
  const altText = asset?.alt || alt || 'Bali Group industrial engineering';

  const [currentSrc, setCurrentSrc] = useState(rawUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(getResolvedUrl());
    setHasError(false);
  }, [asset?.url, fallbackUrl]);

  if (mediaType === 'video') {
    return (
      <video
        src={currentSrc}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        onError={() => {
          setCurrentSrc(fallbackUrl || EMERGENCY_FALLBACK);
        }}
        {...videoProps}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={altText}
      className={className}
      loading="lazy"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackUrl && fallbackUrl !== currentSrc ? fallbackUrl : EMERGENCY_FALLBACK);
        }
      }}
      {...imgProps}
    />
  );
}
