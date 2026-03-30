import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import { ScanEye, SplitSquareHorizontal } from 'lucide-react';

interface ComparisonViewProps {
  originalSrc: string;
  compressedSrc: string;
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
  isProcessing: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalSrc,
  compressedSrc,
  sliderPosition,
  setSliderPosition,
  isProcessing
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Handle resizing to keep magnifier accurate
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [originalSrc]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Clamp values
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    setMousePos({ x: clampedX, y: clampedY });
  };

  const handleSliderDrag = (e: MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Only drag if we are clicking on the slider handle logic, 
    // but typically a simple click/drag on container is easier for UX on web apps unless strictly defined.
    // Here we will use a range input overlaid or just simple calculation if user drags the handle.
    // For simplicity, we'll let the range input below handle the state, 
    // or implement a custom drag handler here if needed.
    // Let's implement click-to-move for the divider if convenient.
  };
  
  const handleDragDivider = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Magnifier Configuration
  const zoomLevel = 3;
  const magnifierSize = 150;
  
  // Determine which image to show in magnifier based on mouse side relative to slider
  const isMouseOnOriginal = (mousePos.x / containerSize.width) * 100 < sliderPosition;
  const magnifierImage = isMouseOnOriginal ? originalSrc : compressedSrc;

  // Calculate background position for zoom
  // bgPos % = (mousePos / containerSize) * 100
  // But we need to offset it to center the zoom
  const bgPosX = (mousePos.x / containerSize.width) * 100;
  const bgPosY = (mousePos.y / containerSize.height) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center text-slate-600 mb-1">
        <div className="flex items-center gap-2">
           <SplitSquareHorizontal size={20} />
           <span className="font-semibold text-sm uppercase tracking-wide">비교 뷰어 (Comparison)</span>
        </div>
        <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
           <ScanEye size={14} />
           <span>마우스 올려 확대</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 group cursor-crosshair select-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleDragDivider}
      >
        {/* Background Layer: Compressed (Right side logic) */}
        {/* Actually, standard practice: Bottom layer is Right Image, Top layer is Left Image clipped */}
        
        {/* Compressed Image (Full, sits at bottom) */}
        <img 
            src={compressedSrc} 
            alt="Compressed" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        />

        {/* Original Image (Top, Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={originalSrc} 
            alt="Original" 
            className="absolute inset-0 max-w-none h-full object-contain"
            style={{ width: `${containerSize.width}px` }} // Important: keep aspect ratio same as container width
          />
        </div>

        {/* Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center hover:bg-blue-400 transition-colors"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
          onMouseDown={(e) => {
             e.preventDefault();
             const moveHandler = (moveEvent: any) => handleDragDivider(moveEvent);
             const upHandler = () => {
               window.removeEventListener('mousemove', moveHandler);
               window.removeEventListener('mouseup', upHandler);
             };
             window.addEventListener('mousemove', moveHandler);
             window.addEventListener('mouseup', upHandler);
          }}
          onTouchStart={(e) => {
             const moveHandler = (moveEvent: any) => handleDragDivider(moveEvent);
             const upHandler = () => {
               window.removeEventListener('touchmove', moveHandler);
               window.removeEventListener('touchend', upHandler);
             };
             window.addEventListener('touchmove', moveHandler);
             window.addEventListener('touchend', upHandler);
          }}
        >
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-[-10px]"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-xs backdrop-blur-sm pointer-events-none">
          원본 (Original)
        </div>
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-xs backdrop-blur-sm pointer-events-none">
          압축본 (Compressed)
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
           <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-20">
               <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}

        {/* Magnifier */}
        {isHovering && !isProcessing && (
          <div
            className="absolute z-30 pointer-events-none rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white"
            style={{
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              left: `${mousePos.x - magnifierSize / 2}px`,
              top: `${mousePos.y - magnifierSize / 2}px`,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${magnifierImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${containerSize.width * zoomLevel}px ${containerSize.height * zoomLevel}px`,
                backgroundPosition: `${-mousePos.x * zoomLevel + magnifierSize / 2}px ${-mousePos.y * zoomLevel + magnifierSize / 2}px`,
                imageRendering: 'pixelated' // Key for showing artifacts
              }}
            />
            {/* Crosshair inside magnifier */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-2 h-0.5 bg-red-500"></div>
                <div className="h-2 w-0.5 bg-red-500 absolute"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Slider Control for mobile users who might find dragging hard */}
      <input 
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 md:hidden"
      />
    </div>
  );
};

export default ComparisonView;