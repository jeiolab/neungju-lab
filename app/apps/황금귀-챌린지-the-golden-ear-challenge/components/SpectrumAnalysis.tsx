import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { Bitrate } from '../types';

const SpectrumAnalysis: React.FC = () => {
  const [selectedBitrate, setSelectedBitrate] = useState<Bitrate>(Bitrate.LOW);

  const data = useMemo(() => {
    const points = [];
    // Generate spectral data from 20Hz to 20kHz
    for (let f = 20; f <= 22050; f += 500) { // Steps of 500Hz for performance
      const originalAmp = Math.max(0, 100 - (Math.log10(f) * 20)); // Natural decay of music energy

      let compressedAmp = originalAmp;

      // Simulate MP3 Cutoffs
      if (selectedBitrate === Bitrate.LOW) {
        // 128kbps typically cuts hard around 16kHz
        if (f > 16000) compressedAmp = 0;
        // And adds noise/wobble in high mids
        else if (f > 10000) compressedAmp = originalAmp * 0.8; 
      } else if (selectedBitrate === Bitrate.HIGH) {
        // 320kbps typically cuts around 20kHz
        if (f > 20000) compressedAmp = 0;
      }
      // FLAC matches Original

      points.push({
        freq: f,
        Original: originalAmp.toFixed(1),
        Compressed: compressedAmp.toFixed(1),
      });
    }
    return points;
  }, [selectedBitrate]);

  return (
    <div className="h-full flex flex-col bg-studio-800 rounded-lg shadow-2xl border border-studio-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-studio-accent flex items-center gap-2">
          <Activity className="w-6 h-6" /> 스펙트럼 분석 (Spectrum Analysis)
        </h2>
        <select 
            className="bg-studio-900 text-white border border-studio-600 rounded p-2 text-sm focus:outline-none focus:border-studio-accent"
            value={selectedBitrate}
            onChange={(e) => setSelectedBitrate(Number(e.target.value) as Bitrate)}
        >
            <option value={Bitrate.LOW}>MP3 128kbps (저음질)</option>
            <option value={Bitrate.HIGH}>MP3 320kbps (고음질)</option>
            <option value={Bitrate.FLAC}>FLAC (무손실)</option>
        </select>
      </div>

      <div className="flex-1 min-h-[300px] w-full bg-studio-900 rounded-lg p-4 border border-studio-600 relative">
        <div className="absolute top-4 right-4 z-10 bg-black/60 p-2 rounded text-xs">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-studio-500 opacity-50 block"></span> 원본 소스
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-studio-accent block"></span> 현재 출력
            </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#666666" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCompressed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
                dataKey="freq" 
                tick={{fill: '#666', fontSize: 10}} 
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                label={{ value: '주파수 (Hz)', position: 'insideBottomRight', offset: -5, fill: '#666' }}
            />
            <YAxis tick={{fill: '#666', fontSize: 10}} label={{ value: '진폭 (dB)', angle: -90, position: 'insideLeft', fill: '#666' }}/>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                labelFormatter={(label) => `${label} Hz`}
            />
            
            {/* Visual Guide for 16k Cutoff */}
            {selectedBitrate === Bitrate.LOW && (
                <ReferenceLine x={16000} stroke="#ff0055" strokeDasharray="3 3" label={{ position: 'top', value: '16kHz 컷오프', fill: '#ff0055', fontSize: 10 }} />
            )}

            <Area 
                type="monotone" 
                dataKey="Original" 
                stroke="#666666" 
                fillOpacity={1} 
                fill="url(#colorOriginal)" 
            />
            <Area 
                type="monotone" 
                dataKey="Compressed" 
                stroke="#00f0ff" 
                fillOpacity={1} 
                fill="url(#colorCompressed)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-400 font-mono bg-studio-900 p-3 rounded border border-studio-600">
        <strong className="text-white">분석:</strong> 
        {selectedBitrate === Bitrate.LOW && " 16kHz 이상의 고주파수 영역에서 심각한 데이터 손실이 발생했습니다. 이로 인해 공간감과 공기감(Air)이 사라져 믹스가 답답하게 들릴 수 있습니다."}
        {selectedBitrate === Bitrate.HIGH && " 20kHz 근처에서 아주 미세한 롤오프가 있습니다. 레퍼런스 모니터 스피커가 아니라면 대부분의 사람은 차이를 구분하기 어렵습니다."}
        {selectedBitrate === Bitrate.FLAC && " 전체 주파수 대역이 완벽하게 보존되었습니다. 아날로그 파형을 디지털로 가장 정확하게 재현합니다."}
      </div>
    </div>
  );
};

export default SpectrumAnalysis;