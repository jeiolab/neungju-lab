import React, { useState, useRef } from 'react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { ImageAnalysisResult } from '../types';

interface ImageAnalyzerProps {
  onAnalyze: (label: string) => void;
}

const PRESETS = [
  { id: 'cat', src: 'https://picsum.photos/id/40/300/300', label: '고양이 사진' },
  { id: 'dog', src: 'https://picsum.photos/id/237/300/300', label: '강아지 사진' },
  { id: 'tech', src: 'https://picsum.photos/id/3/300/300', label: '기술/IT 사진' },
];

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onAnalyze }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert blob/url to base64 for Gemini
  const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.readAsDataURL(blob);
    });
  };

  const handlePresetSelect = async (img: typeof PRESETS[0]) => {
    setSelectedImage(img.src);
    setLoading(true);
    setResult(null);
    try {
      // Simulate network request for preset images to get base64
      // In a real app we might pass the URL directly if supported, but here we process bits
      const base64 = await getBase64FromUrl(img.src);
      const data = await analyzeImageWithGemini(base64);
      setResult(data);
      onAnalyze(img.label);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result as string;
      setSelectedImage(src);
      setLoading(true);
      setResult(null);
      try {
        const base64 = src.split(',')[1];
        const data = await analyzeImageWithGemini(base64);
        setResult(data);
        onAnalyze("사용자 업로드 이미지");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
       {/* Left Input Panel */}
       <div className="flex-1 glass-panel p-6 rounded-2xl flex flex-col">
        <h3 className="text-xl font-bold mb-4 text-slate-700">🖼️ 이미지 인식 (Computer Vision)</h3>
        <p className="text-sm text-slate-500 mb-6">
          비정형 데이터인 이미지를 선택하세요. 컴퓨터는 픽셀(Pixel) 데이터를 분석하여 특징(Feature)을 찾아냅니다.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p)}
              disabled={loading}
              className="relative group rounded-xl overflow-hidden aspect-square border-2 border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <img src={p.src} alt={p.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">{p.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
          <p className="text-slate-500 text-sm">또는 이미지를 클릭하여 업로드</p>
        </div>
      </div>

      {/* Right Output Panel */}
      <div className="flex-1 glass-panel p-6 rounded-2xl flex flex-col relative min-h-[400px]">
        {!selectedImage ? (
           <div className="absolute inset-0 flex items-center justify-center text-slate-400">
             <p>이미지를 선택하면 분석 결과가 나타납니다.</p>
           </div>
        ) : (
          <div className="h-full flex flex-col animate-fade-in">
             <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden mb-6 shrink-0 shadow-lg">
                <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
                {loading && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                     <div className="w-full max-w-[200px] h-1 bg-slate-700 rounded overflow-hidden">
                       <div className="h-full bg-blue-500 animate-[loading_1s_infinite]"></div>
                     </div>
                     <p className="text-white text-xs mt-2 animate-pulse">픽셀 특징 추출 중 (Feature Extraction)...</p>
                  </div>
                )}
             </div>

             {result && (
               <div className="flex-1 overflow-y-auto">
                 <div className="flex flex-wrap gap-2 mb-4">
                   {result.tags.map((tag, idx) => (
                     <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm shadow-sm animate-[pop_0.3s_ease-out_forwards]" style={{animationDelay: `${idx * 0.1}s`}}>
                       {tag}
                     </span>
                   ))}
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">📋 분석 설명</h4>
                      <p className="text-slate-600 text-sm">{result.description}</p>
                    </div>
                    
                    <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-indigo-500">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase mb-1">AI는 어떻게 보나요?</h4>
                      <p className="text-xs text-slate-600">
                        &ldquo;{result.features}&rdquo;
                        <br/>
                        <br/>
                        컴퓨터 비전 모델(CNN 등)은 이미지의 엣지(선), 텍스처, 모양을 숫자 행렬(Matrix)로 변환하여 학습된 패턴과 매칭합니다.
                      </p>
                    </div>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
