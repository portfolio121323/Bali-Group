import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { processDeviceImage, formatFileSize, ProcessedImageResult } from '@/lib/imageUtils';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedDimensions?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  className?: string;
  onFileInfoChange?: (info: ProcessedImageResult | null) => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Primary Image',
  recommendedDimensions = '1200 x 800 px',
  aspectRatio = 'video',
  className,
  onFileInfoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<ProcessedImageResult | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError(null);
    setIsProcessing(true);

    try {
      const result = await processDeviceImage(file, {
        maxDimension: 1400,
        quality: 0.85,
      });
      setFileDetails(result);
      if (onFileInfoChange) onFileInfoChange(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process image from device.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so same file can be picked again if desired
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    onChange('');
    setFileDetails(null);
    if (onFileInfoChange) onFileInfoChange(null);
  };

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'wide' ? 'aspect-[21/9]' : 'h-52';

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-white block">
            {label}
          </label>
          {recommendedDimensions && (
            <span className="text-[10px] text-[#8A9097] font-mono">
              Recommended: {recommendedDimensions}
            </span>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-semibold text-[#EFFF00] hover:underline flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Upload New from PC</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
        onChange={onInputChange}
        className="hidden"
      />

      {/* Image Preview or Upload Dropzone */}
      {value ? (
        <div className="relative rounded-[12px] border border-[#2B3034] bg-[#101214] overflow-hidden group">
          <div className={cn("w-full relative overflow-hidden bg-[#0B0D0E]", aspectClass)}>
            <img
              src={value}
              alt="Uploaded Asset Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              onError={() => setError('Image failed to display. Please re-upload from device.')}
            />

            {/* Overlay controls on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#EFFF00] text-[#0B0D0E] font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md hover:bg-white transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New from PC</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-[#1B1F22] border border-[#2B3034] text-white hover:text-[#C55A5A] font-semibold text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Image Status Bar */}
          <div className="p-3 bg-[#141719] border-t border-[#2B3034] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#B9BDC1]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#EFFF00] shrink-0" />
              <span className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">
                {fileDetails ? fileDetails.fileName : (value.startsWith('data:') ? 'Uploaded from Device' : 'Active Image')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#8A9097] font-mono">
              {fileDetails && (
                <>
                  <span>{fileDetails.width}×{fileDetails.height}px</span>
                  <span>•</span>
                  <span>{formatFileSize(fileDetails.sizeBytes)}</span>
                  <span>•</span>
                </>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#EFFF00] font-sans font-medium hover:underline ml-1"
              >
                Change File
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "p-6 sm:p-8 rounded-[12px] border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3",
            isDragging 
              ? "border-[#EFFF00] bg-[#EFFF00]/5" 
              : "border-[#2B3034] hover:border-[#EFFF00]/50 bg-[#141719]/50 hover:bg-[#141719]"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-[#1B1F22] border border-[#2B3034] flex items-center justify-center text-[#EFFF00] shadow-sm">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#EFFF00]" />
            ) : (
              <HardDrive className="w-6 h-6 text-[#EFFF00]" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-1">
              {isProcessing ? 'Processing image from device...' : 'Upload Image from PC or Device'}
            </p>
            <p className="text-xs text-[#8A9097] max-w-sm mx-auto">
              Drag & drop any image file from your computer here, or click to browse files from your device.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="bg-[#0B0D0E] border border-[#2B3034] text-white hover:text-[#EFFF00] font-semibold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#EFFF00]" />
              <span>Browse Photos from PC / Device</span>
            </span>
          </div>

          <p className="text-[10px] text-[#6B7280] font-mono mt-1">
            PNG, JPG, WebP, SVG, AVIF supported • Automatically optimized for high-speed cloud delivery
          </p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-2.5 rounded-lg bg-[#1B1F22] border border-[#5C2828] text-xs text-[#C55A5A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
