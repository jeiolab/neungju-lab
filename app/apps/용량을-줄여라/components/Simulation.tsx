import React, { useState, useMemo } from 'react';
import { FileItem, MachineType, SimulationResult } from '../types';
import { INITIAL_FILES, TRANSFER_SPEED_MBPS } from '../constants';
import { 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Archive, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCcw,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SimulationProps {
  onTaskComplete: (xp: number) => void;
}

export const Simulation: React.FC<SimulationProps> = ({ onTaskComplete }) => {
  const [files] = useState<FileItem[]>(INITIAL_FILES);
  const [draggedFile, setDraggedFile] = useState<FileItem | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(50); // 1-100

  const handleDragStart = (file: FileItem) => {
    setDraggedFile(file);
    setResult(null); // Clear previous result
  };

  const handleDrop = (machineType: MachineType) => {
    if (!draggedFile) return;

    processCompression(draggedFile, machineType, compressionLevel);
    setDraggedFile(null);
  };

  const processCompression = (file: FileItem, machine: MachineType, level: number) => {
    let success = true;
    let message = "압축 성공!";
    let ratio = 0;
    let quality = 100;

    // Logic 1: Type Checking
    if (file.type === 'text' && machine === 'lossy') {
      success = false;
      message = "경고! 텍스트 파일은 손실 압축을 하면 내용이 손상되어 읽을 수 없게 됩니다!";
      quality = 0;
      ratio = 0;
    } else if (file.type === 'text' && machine === 'lossless') {
      ratio = 60; // Text compresses well losslessly
      quality = 100;
      message = "완벽합니다! ZIP 알고리즘으로 반복되는 문자를 효율적으로 줄였습니다.";
    } else if ((file.type === 'image' || file.type === 'audio') && machine === 'lossless') {
      ratio = 90; // Media doesn't compress much losslessly
      quality = 100;
      message = "품질 저하 없이 데이터를 정리했습니다. 다만 용량은 많이 줄지 않았네요.";
    } else if ((file.type === 'image' || file.type === 'audio') && machine === 'lossy') {
      // Logic: Higher compression level (slider) means LOWER size, LOWER quality
      // level is 0-100 (strength). 
      // ratio = compressed / original
      const compressionStrength = level / 100; 
      ratio = Math.max(10, 100 - (compressionStrength * 80)); // Can go down to 20% of original
      quality = Math.max(10, 100 - (compressionStrength * 60)); 
      message = `불필요한 데이터를 과감히 삭제했습니다! 용량이 ${(100-ratio).toFixed(0)}% 감소했습니다.`;
    }

    const compressedSize = (file.originalSizeKB * ratio) / 100;
    const transferTimeOriginal = (file.originalSizeKB * 8) / (TRANSFER_SPEED_MBPS * 1000); // bits / speed
    const transferTimeCompressed = (compressedSize * 8) / (TRANSFER_SPEED_MBPS * 1000);

    const newResult: SimulationResult = {
      fileId: file.id,
      machineType: machine,
      compressedSizeKB: compressedSize,
      compressionRatio: ratio,
      transferTimeOriginal,
      transferTimeCompressed,
      quality,
      success,
      message
    };

    setResult(newResult);
    if (success) {
      onTaskComplete(15);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-8 h-8 text-slate-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'audio': return <Music className="w-8 h-8 text-purple-500" />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  const chartData = useMemo(() => {
    if (!result || !result.success) return [];
    return [
      { name: '전송 시간(초)', value: result.transferTimeOriginal, type: '원본', color: '#94a3b8' },
      { name: '전송 시간(초)', value: result.transferTimeCompressed, type: '압축 후', color: '#4f46e5' },
    ];
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* LEFT: File Inventory */}
      <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5" /> 파일 보관함
        </h3>
        <p className="text-xs text-slate-500 mb-4">파일을 드래그하여 적절한 기계에 넣으세요.</p>
        <div className="space-y-3">
          {files.map(file => (
            <div
              key={file.id}
              draggable
              onDragStart={() => handleDragStart(file)}
              className="group cursor-grab active:cursor-grabbing p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all flex items-center gap-3"
            >
              {getFileIcon(file.type)}
              <div>
                <div className="font-medium text-slate-700 text-sm">{file.name}</div>
                <div className="text-xs text-slate-400">{file.originalSizeKB} KB</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: Machines */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        
        {/* Slider */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
            <span>압축 강도 설정 (손실 압축기용)</span>
            <span className="text-indigo-600 font-bold">{compressionLevel}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>약하게 (화질 보존)</span>
            <span>강하게 (용량 최소화)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Machine 1: Lossless */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('lossless')}
            className={`relative p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 h-64
              ${draggedFile ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50'}
            `}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
              <Archive className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-700">무손실 압축기</h4>
              <p className="text-xs text-slate-500 mt-1">원본을 완벽하게 복원합니다.<br/>(텍스트, 중요 문서용)</p>
            </div>
          </div>

          {/* Machine 2: Lossy */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('lossy')}
            className={`relative p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 h-64
              ${draggedFile ? 'border-orange-400 bg-orange-50' : 'border-slate-300 bg-slate-50'}
            `}
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
              <Cpu className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-700">손실 압축기</h4>
              <p className="text-xs text-slate-500 mt-1">데이터 일부를 제거합니다.<br/>(이미지, 영상, 소리용)</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> 처리 결과
        </h3>
        
        {!result ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm text-center">
            <RefreshCcw className="w-8 h-8 mb-2 opacity-50" />
            <p>압축을 실행하면<br/>결과가 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4">
            {/* Status Banner */}
            <div className={`p-3 rounded-lg flex items-start gap-3 ${result.success ? 'bg-indigo-50 text-indigo-900' : 'bg-red-50 text-red-900'}`}>
              {result.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{result.message}</p>
            </div>

            {result.success && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-xs text-slate-500">용량 변화</div>
                    <div className="font-bold text-slate-800">
                      {result.compressedSizeKB.toFixed(1)} KB
                      <span className="text-xs font-normal text-green-600 ml-1">
                        (-{(100 - result.compressionRatio).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-xs text-slate-500">품질 상태</div>
                    <div className="font-bold text-slate-800">
                      {result.quality}%
                    </div>
                  </div>
                </div>

                {/* Visual Simulation (Blur effect) */}
                {result.quality < 100 && (
                  <div className="mt-2">
                    <p className="text-xs font-bold text-slate-500 mb-1">화질 시뮬레이션</p>
                    <div className="relative w-full h-32 bg-slate-200 rounded overflow-hidden">
                       <img 
                        src="https://picsum.photos/400/300" 
                        alt="simulation" 
                        className="w-full h-full object-cover"
                        style={{ filter: `blur(${(100 - result.quality) / 10}px)` }}
                       />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">
                         미리보기
                       </div>
                    </div>
                  </div>
                )}

                {/* Chart */}
                <div className="h-40 mt-4">
                  <p className="text-xs font-bold text-slate-500 mb-2">전송 속도 비교</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="type" type="category" width={50} tick={{fontSize: 10}} />
                      <Tooltip 
                        contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        formatter={(value: number) => [`${value.toFixed(2)}초`, '시간']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-2">
                   <p className="text-xs text-green-800 flex items-center gap-2">
                     🌱 <strong>Tip:</strong> 데이터 전송량이 줄면 전력 소모도 줄어들어 탄소 배출을 감소시킬 수 있습니다!
                   </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
