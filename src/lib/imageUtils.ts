/**
 * Helper utility to process and optimize image files uploaded from the user's PC or device.
 * Scales images to a web-optimized resolution and compresses them into a compact Data URL
 * suitable for Firestore and local caching.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  fileName: string;
  sizeBytes: number;
  width: number;
  height: number;
  format: string;
}

export function processDeviceImage(
  file: File,
  options?: {
    maxDimension?: number;
    quality?: number;
  }
): Promise<ProcessedImageResult> {
  const maxDimension = options?.maxDimension || 1200;
  const quality = options?.quality || 0.78;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WebP, SVG, AVIF).'));
      return;
    }

    // For SVGs, read as text/dataURL directly without canvas rasterization
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          fileName: file.name,
          sizeBytes: file.size,
          width: 800,
          height: 600,
          format: 'svg',
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file from device.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio if larger than maxDimension
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas rendering context could not be created.'));
          return;
        }

        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, fallback to JPEG
        let mime = 'image/webp';
        let dataUrl = canvas.toDataURL(mime, quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          mime = 'image/jpeg';
          dataUrl = canvas.toDataURL(mime, quality);
        }

        // Calculate approximate size in bytes
        const sizeBytes = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          fileName: file.name,
          sizeBytes,
          width,
          height,
          format: mime.split('/')[1] || 'jpeg',
        });
      };

      img.onerror = () => {
        reject(new Error('Unable to decode image from device. Please try another photo.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image from device.'));
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
