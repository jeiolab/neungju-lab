import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { MISSIONS } from '../constants';
import { ChartType, GalleryItem, Mission } from '../types';
import { Wand2, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { getMagicalHint } from '../services/geminiService';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

interface SimulationTabProps {
  onSaveGallery: (item: GalleryItem) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onSaveGallery }) => {
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  const mission = MISSIONS[currentMissionIndex];

  useEffect(() => {
    // Reset state when mission changes
    setSelectedChart(null);
    setFeedback(null);
    setIsSuccess(false);
  }, [currentMissionIndex]);

  const handleChartSelect = async (type: ChartType) => {
    setSelectedChart(type);
    
    if (type === mission.bestChart) {
      setIsSuccess(true);
      setFeedback("✨ 훌륭합니다! 데이터의 특성을 정확히 파악했군요. 완벽한 시각화 마법입니다!");
    } else {
      setIsSuccess(false);
      setGeminiLoading(true);
      setFeedback("잠시만요, 마법의 수정구가 분석 중입니다...");
      
      try {
        const hint = await getMagicalHint(mission.goal, type, mission.dataSet.description);
        setFeedback(hint);
      } catch (e) {
        setFeedback("이 차트는 적절하지 않은 것 같아요. 힌트를 확인해보세요: " + mission.hint);
      } finally {
        setGeminiLoading(false);
      }
    }
  };

  const handleNextMission = () => {
    if (currentMissionIndex < MISSIONS.length - 1) {
      setCurrentMissionIndex(prev => prev + 1);
    } else {
      alert("모든 미션을 완료했습니다! 당신은 진정한 차트 마법사입니다!");
      setCurrentMissionIndex(0);
    }
  };

  const saveToGallery = () => {
    if (!isSuccess || !selectedChart) return;
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      chartType: selectedChart,
      missionTitle: mission.title,
      dataSnapshot: mission.dataSet.data
    };
    onSaveGallery(newItem);
    alert("갤러리에 저장되었습니다!");
  };

  const renderChart = () => {
    if (!selectedChart) return <div className="flex items-center justify-center h-full text-slate-500">차트를 선택하면 미리보기가 나타납니다.</div>;

    const { data, xKey, yKey } = mission.dataSet;

    switch (selectedChart) {
      case ChartType.BAR:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey={yKey} fill="#8884d8" animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        );
      case ChartType.LINE:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#82ca9d" strokeWidth={3} animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        );
      case ChartType.PIE:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={yKey}
                nameKey={xKey}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case ChartType.SCATTER:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#334155" />
              <XAxis type="number" dataKey={xKey} name={xKey} unit={xKey === 'height' ? 'cm' : ''} stroke="#94a3b8" />
              <YAxis type="number" dataKey={yKey} name={yKey} unit={yKey === 'weight' ? 'kg' : ''} stroke="#94a3b8" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
              <Legend />
              <Scatter name={mission.dataSet.name} data={data} fill="#8884d8" animationDuration={1000} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      {/* Left Panel: Mission & Controls */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="bg-purple-600 text-xs font-bold px-2 py-1 rounded text-white">
              Mission {currentMissionIndex + 1}/{MISSIONS.length}
            </span>
            <span className="text-slate-400 text-sm">Wizard Mode</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{mission.title}</h2>
          <p className="text-purple-200 mb-6 bg-purple-900/30 p-4 rounded-lg border border-purple-500/20">
            "{mission.goal}"
          </p>

          <div className="space-y-4">
            <p className="text-sm text-slate-400 font-semibold uppercase">Choose Spell (Chart Type)</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ChartType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChartSelect(type)}
                  className={`p-3 rounded-lg text-sm font-bold transition-all border ${
                    selectedChart === type
                      ? isSuccess 
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-red-500/20 border-red-400 text-red-200'
                      : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feedback Section */}
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isSuccess ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-amber-900/20 border-amber-500/50'
              }`}
            >
              {isSuccess ? <CheckCircle className="text-emerald-400 shrink-0" /> : <AlertCircle className="text-amber-400 shrink-0" />}
              <div>
                <p className={`text-sm ${isSuccess ? 'text-emerald-200' : 'text-amber-200'}`}>
                  {feedback}
                </p>
                {isSuccess && (
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={saveToGallery}
                      className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors"
                    >
                      <Save size={14} /> 저장하기
                    </button>
                    <button 
                      onClick={handleNextMission}
                      className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded transition-colors text-white font-bold"
                    >
                      다음 미션 <Wand2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel: Chart Area */}
      <div className="lg:w-2/3 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 shadow-inner relative flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Visualization Canvas
          </h3>
          {isSuccess && <span className="text-emerald-400 text-xs font-bold animate-pulse">Live Rendering Active</span>}
        </div>
        
        <div className="flex-grow bg-slate-900/80 rounded-xl p-4 border border-slate-800 overflow-hidden relative">
          {/* Animated Background Grid */}
          {!selectedChart && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="grid grid-cols-6 gap-4 w-full h-full transform rotate-12 scale-150">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="bg-purple-500/20 rounded-lg"></div>
                ))}
              </div>
            </div>
          )}
          
          {renderChart()}
        </div>
        
        {/* Variables Display */}
        <div className="mt-4 flex gap-4 text-xs text-slate-400">
           <div className="px-3 py-1 bg-slate-700 rounded-full border border-slate-600">
             X축: <span className="text-purple-300 font-bold">{mission.dataSet.xKey}</span>
           </div>
           <div className="px-3 py-1 bg-slate-700 rounded-full border border-slate-600">
             Y축: <span className="text-purple-300 font-bold">{mission.dataSet.yKey}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
