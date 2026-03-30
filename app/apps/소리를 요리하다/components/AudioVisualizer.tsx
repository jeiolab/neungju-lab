import React, { useEffect, useRef } from 'react';
import { CompressionMode } from '../types';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  compressionMode: CompressionMode;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, compressionMode, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      if (isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback for idle state to show some "ghost" lines or flat line
        dataArray.fill(0);
      }

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = '#ffffff'; // White background
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = '#e2e8f0'; // slate-200
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=1; i<5; i++) {
          const y = (height / 5) * i;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
      }
      ctx.stroke();

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Calculate approx frequency of this bin
        // SampleRate ~48000 / 2 = 24000 Hz Max. Bin Count 1024. 
        // Resolution ~23Hz per bin.
        // i * 23 = freq.
        const freq = i * 23; 

        // Determine if this bar should be "visualized" as compressed/removed
        let isCut = false;
        let isMasked = false;

        // Logic for "cut" frequencies (High/Low)
        if (compressionMode === 'mp3' && freq > 16000) isCut = true;
        if (compressionMode === 'low_quality' && freq > 3500) isCut = true;
        
        // Logic for "masked" frequencies (Low volume bars)
        // In real MP3 this is complex psychoacoustics. Here we simulate visual feedback.
        // If mode is Heavy Compression, we treat small bars as "removed by masking" 
        // (even though simple LowPass doesn't do this, we visualize the concept)
        if (compressionMode === 'low_quality' && dataArray[i] < 50) isMasked = true;


        // Fill Style
        if (isCut) {
            // Ghost bar (Greyed out to show it's "there" in source but removed)
            ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'; // slate-400 with low opacity
        } else if (isMasked) {
             // Masked bar (Red tint or very faint to show removal of detail)
             ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; 
        } else {
            // Active Bar
            // Gradient based on frequency - brighter colors for white mode
            const hue = (i / bufferLength) * 360 + 200; // Blue to Pink range
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        }
        
        // Draw Bar
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Draw "Cut" indicator line if in MP3 mode
        if (compressionMode === 'mp3' && Math.abs(freq - 16000) < 100) {
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            
            // Text label
            if (i % 10 === 0) { // prevent drawing text every frame/pixel overlap
                ctx.fillStyle = '#ef4444';
                ctx.font = '10px "Inter", sans-serif';
                ctx.fillText('16kHz 절단', x + 5, 20);
            }
        }
         
        // Draw "Cut" indicator for Low Quality
        if (compressionMode === 'low_quality' && Math.abs(freq - 3500) < 50) {
            ctx.strokeStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();

             if (i % 10 === 0) {
                ctx.fillStyle = '#f59e0b';
                ctx.font = '10px "Inter", sans-serif';
                ctx.fillText('3.5kHz 절단', x + 5, 20);
            }
        }

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, compressionMode, isPlaying]);

  return (
    <div className="relative w-full h-64 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={256} 
        className="w-full h-full"
      />
      {/* Frequency Labels */}
      <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] text-slate-500 font-mono pointer-events-none">
        <span>20Hz</span>
        <span>1kHz</span>
        <span>5kHz</span>
        <span>10kHz</span>
        <span>20kHz</span>
      </div>
      
      {/* Legend Overlay */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none bg-white/95 backdrop-blur-sm border border-slate-200 p-2 rounded-lg shadow-sm text-xs">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span className="text-slate-700">들리는 소리 데이터</span>
          </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 rounded-sm border border-slate-400"></div>
              <span className="text-slate-600">제거됨 (주파수 컷)</span>
          </div>
          {compressionMode === 'low_quality' && (
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-red-300 rounded-sm border border-red-400"></div>
               <span className="text-slate-600">마스킹됨 (작은 소리)</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default AudioVisualizer;