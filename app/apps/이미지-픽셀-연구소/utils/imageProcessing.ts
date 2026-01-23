import { ImageStats, ColorData } from '../types';

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getImageStats = async (src: string): Promise<ImageStats> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      // Estimate size from base64 if needed, though usually we track blob size separately
      // Base64 is ~1.33x larger than binary, plus header
      const base64Length = src.length - (src.indexOf(',') + 1);
      const sizeBytes = Math.floor((base64Length * 3) / 4);
      
      resolve({
        width: img.width,
        height: img.height,
        sizeBytes: sizeBytes,
        uniqueColors: 0 // Will be calculated separately to avoid blocking main thread too long
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const compressImage = async (
  imgElement: HTMLImageElement,
  quality: number
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(imgElement.src);
      return;
    }
    ctx.drawImage(imgElement, 0, 0);
    // quality is 0.0 to 1.0 for image/jpeg
    const q = quality / 100; 
    const dataUrl = canvas.toDataURL('image/jpeg', q);
    resolve(dataUrl);
  });
};

export const analyzeColors = (imgElement: HTMLImageElement): ColorData[] => {
  const canvas = document.createElement('canvas');
  // Resize for performance during analysis
  const scale = Math.min(1, 150 / Math.max(imgElement.width, imgElement.height));
  canvas.width = Math.floor(imgElement.width * scale);
  canvas.height = Math.floor(imgElement.height * scale);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const colorMap = new Map<string, number>();
  
  // Sample pixels (step 1 to avoid iterating every single pixel if resized is still big)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Quantize slightly to group very similar colors
    const key = `${Math.floor(r/5)*5},${Math.floor(g/5)*5},${Math.floor(b/5)*5}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Convert to chart data
  const result: ColorData[] = [];
  // We want to show "Color Diversity". 
  // Let's bucket them into Red-ish, Green-ish, Blue-ish, Grey-ish for the chart
  let rCount = 0, gCount = 0, bCount = 0, greyCount = 0;

  for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
          greyCount++;
      } else if (r > g && r > b) {
          rCount++;
      } else if (g > r && g > b) {
          gCount++;
      } else {
          bCount++;
      }
  }

  const total = data.length / 4;
  return [
    { name: '붉은색 계열', value: rCount, fill: '#ef4444' },
    { name: '초록색 계열', value: gCount, fill: '#22c55e' },
    { name: '푸른색 계열', value: bCount, fill: '#3b82f6' },
    { name: '무채색 계열', value: greyCount, fill: '#94a3b8' },
  ];
};

export const countUniqueColors = (imgElement: HTMLImageElement): number => {
    const canvas = document.createElement('canvas');
    const maxSize = 100;
    const scale = Math.min(1, maxSize / Math.max(imgElement.width, imgElement.height));
    canvas.width = Math.floor(imgElement.width * scale);
    canvas.height = Math.floor(imgElement.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = new Set<string>();
    for (let i = 0; i < data.length; i+=4) {
        colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);
    }
    return colors.size;
}