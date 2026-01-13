import React, { useState, useEffect, useRef } from 'react';
import { StreamSettings, SceneType, Resolution, FPS, GameResult } from '../types';
import { 
  Play, Square, Activity, Wifi, SignalHigh, AlertTriangle, MonitorPlay 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

interface StudioProps {
  onGameEnd: (result: GameResult) => void;
}

const BANDWIDTH_LIMIT = 5000; // kbps
const GAME_DURATION = 20; // seconds

const Studio: React.FC<StudioProps> = ({ onGameEnd }) => {
  const [isLive, setIsLive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bufferingCount, setBufferingCount] = useState(0);
  const [qualityScore, setQualityScore] = useState(100);
  const [dataPoints, setDataPoints] = useState<{time: number, bitrate: number}[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState<StreamSettings>({
    resolution: '720p',
    fps: 30,
    keyframeInterval: 2, // Standard
    scene: 'TALK'
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulation Logic
  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame(true);
            return 0;
          }
          return prev - 1;
        });

        // Calculate Bitrate for this second
        const baseBitrate = settings.resolution === '1080p' ? 3000 : 1500;
        const fpsMult = settings.fps === 60 ? 1.5 : 1.0;
        
        // Keyframe logic: Shorter interval = More I-Frames = Higher Quality but Higher Bitrate
        // Longer interval = Less I-Frames = Lower Bitrate but Lower Quality (artifacts)
        const keyframeFactor = 2 / settings.keyframeInterval; // normalized to 2s
        
        // Scene Logic: Exercise is harder to compress (P-frames are huge)
        let motionMult = settings.scene === 'EXERCISE' ? 2.5 : 0.8; 
        
        // Add randomness
        const randomFluctuation = 0.8 + Math.random() * 0.4;

        const currentBitrate = Math.round(baseBitrate * fpsMult * motionMult * keyframeFactor * randomFluctuation);

        setDataPoints(prev => {
          const newData = [...prev, { time: GAME_DURATION - timeLeft, bitrate: currentBitrate }];
          if (newData.length > 20) newData.shift();
          return newData;
        });

        // Check Constraints
        if (currentBitrate > BANDWIDTH_LIMIT) {
          setBufferingCount(prev => prev + 1);
        }

        // Quality Decay if bitrate is too low (simulating artifacts) OR if buffering
        // Also penalize extremely long keyframe intervals
        if (settings.keyframeInterval > 5) {
             setQualityScore(prev => Math.max(0, prev - 2));
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, timeLeft, settings]);

  // Check Game Over Conditions
  useEffect(() => {
    if (bufferingCount > 5) {
      endGame(false, "버퍼링이 너무 심해서 시청자가 떠났습니다.");
    }
  }, [bufferingCount]);

  const endGame = (success: boolean, msg?: string) => {
    setIsLive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    let message = msg;
    let subs = 0;

    if (success) {
      // Calculate final score
      if (qualityScore > 80) {
        message = "완벽한 방송! 화질과 안정성 모두 최고입니다.";
        subs = 500;
      } else if (qualityScore > 50) {
        message = "괜찮은 방송. 화질 저하가 조금 있었지만 볼만했습니다.";
        subs = 200;
      } else {
        message = "방송은 끝났지만 화질이 끔찍했습니다.";
        subs = 50;
      }
    } else {
      message = message || "방송 실패.";
      subs = 0;
    }

    onGameEnd({ success, message: message!, subscribersGained: subs });
  };

  const handleStart = () => {
    setIsLive(true);
    setTimeLeft(GAME_DURATION);
    setBufferingCount(0);
    setQualityScore(100);
    setDataPoints([]);
  };

  const handleStop = () => {
    endGame(false, "방송을 수동으로 중단했습니다.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-4 animate-fade-in">
      
      {/* LEFT: Controls */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Activity className="text-indigo-600" /> 인코더 설정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">방송 장면</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSettings(s => ({...s, scene: 'TALK'}))}
                  className={`p-2 rounded border text-sm font-bold ${settings.scene === 'TALK' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                >
                  토크 방송 (저)
                </button>
                <button 
                  onClick={() => setSettings(s => ({...s, scene: 'EXERCISE'}))}
                  className={`p-2 rounded border text-sm font-bold ${settings.scene === 'EXERCISE' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                >
                  운동 방송 (고)
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">움직임이 많으면 P-프레임 용량이 커집니다.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">해상도 (Resolution)</label>
              <select 
                value={settings.resolution}
                onChange={(e) => setSettings(s => ({...s, resolution: e.target.value as Resolution}))}
                className="w-full p-2 border rounded-md"
              >
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (FHD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">프레임 레이트 (FPS)</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={settings.fps === 30} onChange={() => setSettings(s => ({...s, fps: 30}))} /> 30 FPS
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={settings.fps === 60} onChange={() => setSettings(s => ({...s, fps: 60}))} /> 60 FPS
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                키프레임 간격: {settings.keyframeInterval}초
              </label>
              <input 
                type="range" min="1" max="10" step="1"
                value={settings.keyframeInterval}
                onChange={(e) => setSettings(s => ({...s, keyframeInterval: parseInt(e.target.value)}))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1초 (고화질, 고용량)</span>
                <span>10초 (저화질, 저용량)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            {!isLive ? (
              <button 
                onClick={handleStart}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-200"
              >
                <Play className="w-5 h-5" /> 방송 시작
              </button>
            ) : (
              <button 
                onClick={handleStop}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Square className="w-5 h-5 fill-current" /> 방송 중단
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Monitor */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Preview Window */}
        <div className="bg-black rounded-xl overflow-hidden relative aspect-video flex items-center justify-center border-4 border-gray-800 shadow-2xl">
          {isLive ? (
            <div className={`text-center transition-opacity duration-300 ${bufferingCount > 0 ? 'opacity-50' : 'opacity-100'}`}>
               <MonitorPlay className={`w-20 h-20 mx-auto mb-4 ${settings.scene === 'EXERCISE' ? 'animate-bounce text-orange-500' : 'text-green-500'}`} />
               <p className="text-white font-mono text-xl">{settings.scene === 'TALK' ? '토크 방송' : '운동 방송'} 송출 중</p>
               <p className="text-gray-400 text-sm">{settings.resolution} @ {settings.fps}FPS</p>
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <SignalHigh className="w-16 h-16 mb-2 opacity-20" />
              <p>오프라인</p>
            </div>
          )}

          {/* Buffering Overlay */}
          {isLive && dataPoints.length > 0 && dataPoints[dataPoints.length - 1].bitrate > BANDWIDTH_LIMIT && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center animate-pulse">
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-white">버퍼링 발생...</h3>
                  <p className="text-yellow-400">데이터 전송량 초과!</p>
                </div>
             </div>
          )}

          {/* Stats Overlay */}
          <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded text-xs font-mono">
            <div>남은 시간: {timeLeft}s</div>
            <div className={bufferingCount > 0 ? "text-red-400" : "text-green-400"}>
              프레임 드랍: {bufferingCount}
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-xs font-mono flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}></div>
            {isLive ? 'LIVE' : '준비'}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex-1 min-h-[250px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Wifi className="w-4 h-4" /> 대역폭 모니터
            </h3>
            <span className="text-xs text-gray-500">한도: {BANDWIDTH_LIMIT} kbps</span>
          </div>
          
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 8000]} />
                <Tooltip />
                <ReferenceLine y={BANDWIDTH_LIMIT} stroke="red" strokeDasharray="3 3" label="Bandwidth Limit" />
                <Line 
                  type="monotone" 
                  dataKey="bitrate" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Studio;