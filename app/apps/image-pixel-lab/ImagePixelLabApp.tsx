'use client'

import React, { useState, useEffect, useRef } from 'react';
import ComparisonView from './components/ComparisonView';
import InfoPanel from './components/InfoPanel';
import ImageUploader from './components/ImageUploader';
import ColorAnalysis from './components/ColorAnalysis';
import { compressImage, getImageStats, analyzeColors, countUniqueColors } from './utils/imageProcessing';
import { ImageStats, ColorData } from './types';
import { Settings } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

function ImagePixelLabApp() {
  const [originalSrc, setOriginalSrc] = useState<string>(DEFAULT_IMAGE);
  const [compressedSrc, setCompressedSrc] = useState<string>('');
  const [quality, setQuality] = useState<number>(60);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const [originalStats, setOriginalStats] = useState<ImageStats>({ sizeBytes: 0, width: 0, height: 0, uniqueColors: 0 });
  const [compressedStats, setCompressedStats] = useState<ImageStats>({ sizeBytes: 0, width: 0, height: 0, uniqueColors: 0 });
  const [originalColors, setOriginalColors] = useState<ColorData[]>([]);
  const [compressedColors, setCompressedColors] = useState<ColorData[]>([]);

  // Debounce ref
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial Load
  useEffect(() => {
    handleImageLoad(originalSrc);
  }, [originalSrc]);

  // Handle Quality Change
  useEffect(() => {
    if (!originalSrc) return;
    
    // Clear existing timeout to debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsProcessing(true);
    
    timeoutRef.current = setTimeout(async () => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = originalSrc;
        await new Promise((resolve) => { img.onload = resolve; });

        const compressedDataUrl = await compressImage(img, quality);
        setCompressedSrc(compressedDataUrl);

        // Stats calculation
        const cStats = await getImageStats(compressedDataUrl);
        const cColors = analyzeColors(img); // Actually needs to analyze the compressed one
        
        // Analyze compressed colors
        const compImg = new Image();
        compImg.src = compressedDataUrl;
        await new Promise(r => compImg.onload = r);
        const realCColors = analyzeColors(compImg);
        const realCUnique = countUniqueColors(compImg);

        setCompressedStats({...cStats, uniqueColors: realCUnique});
        setCompressedColors(realCColors);
      } catch (error) {
        console.error("Compression failed", error);
      } finally {
        setIsProcessing(false);
      }
    }, 300); // 300ms debounce

    return () => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [quality, originalSrc]);

  const handleImageLoad = async (src: string) => {
    setIsProcessing(true);
    try {
      const stats = await getImageStats(src);
      
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const colors = analyzeColors(img);
      const unique = countUniqueColors(img);
      
      setOriginalStats({ ...stats, uniqueColors: unique });
      setOriginalColors(colors);
      
      // Trigger initial compression
      const compressedUrl = await compressImage(img, quality);
      setCompressedSrc(compressedUrl);
      
      // Calculate initial compressed stats in the effect hook primarily, 
      // but we do a quick pass here to avoid empty state if effect lags
      const cStats = await getImageStats(compressedUrl);
      setCompressedStats({...cStats}); // Unique colors update in effect

    } catch (err) {
      console.error("Failed to load image", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `compressed_${quality}.jpg`;
    link.href = compressedSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setOriginalSrc(DEFAULT_IMAGE);
                  setCompressedSrc('');
                  setQuality(60);
                  setSliderPosition(50);
                }} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">이미지 픽셀 연구소</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">실시간 비교, 줌 확대, 데이터 분석 기능을 통해 이미지 손실 압축 원리를 이해하는 대화형 교육 도구입니다.</p>
                </div>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            
            {/* Left Column: Visuals */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <ComparisonView 
                originalSrc={originalSrc}
                compressedSrc={compressedSrc}
                sliderPosition={sliderPosition}
                setSliderPosition={setSliderPosition}
                isProcessing={isProcessing}
              />
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                          <Settings className="text-slate-400" size={20} />
                          <h2 className="font-bold text-slate-700">압축 설정 (Compression Settings)</h2>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{quality}%</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium uppercase tracking-wide">
                      <span>저화질 (작은 용량)</span>
                      <span>고화질 (큰 용량)</span>
                  </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                 <h3 className="font-bold text-blue-900 mb-2">생각해볼 문제 (Think about it)</h3>
                 <div className="space-y-2 text-sm text-blue-800">
                     <p>• <strong>SNS:</strong> 플랫폼들은 이미지를 자동으로 압축합니다. 70-80% 품질의 JPG면 충분하며 데이터를 절약할 수 있습니다.</p>
                     <p>• <strong>인쇄:</strong> 항상 95-100% 품질을 목표로 하세요. 손실 압축의 흔적(Artifact)은 화면보다 종이에서 더 눈에 띕니다.</p>
                 </div>
              </div>
            </div>

            {/* Right Column: Data & Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ImageUploader onImageSelected={setOriginalSrc} />
              
              <InfoPanel 
                originalStats={originalStats}
                compressedStats={compressedStats}
                quality={quality}
                onDownload={handleDownload}
              />

              <ColorAnalysis 
                originalColors={originalColors}
                compressedColors={compressedColors}
                originalUniqueCount={originalStats.uniqueColors}
                compressedUniqueCount={compressedStats.uniqueColors}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ImagePixelLabApp;

