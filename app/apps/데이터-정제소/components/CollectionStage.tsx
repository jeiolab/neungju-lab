import React, { useState, useEffect } from 'react';
import { Globe, Thermometer, AlertCircle, CheckCircle2, ArrowLeft, Camera, Mic, MapPin, FileText } from 'lucide-react';
import { ScenarioType } from '../types';

interface Props {
  onComplete: (type: ScenarioType) => void;
  onBack: () => void;
}

interface ToolOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isCorrect: boolean;
  feedback: string;
}

interface ScenarioDef {
  type: ScenarioType;
  title: string;
  description: string;
  tools: ToolOption[];
}

const SCENARIOS: ScenarioDef[] = [
  {
    type: 'REVIEWS',
    title: '맛집 감성 분석 프로젝트',
    description: '인터넷에 있는 수많은 **맛집 리뷰 텍스트**를 모아서, 사람들이 식당을 좋아하는지 분석하는 AI를 만들고 싶어요.',
    tools: [
      {
        id: 'crawler',
        name: '웹 크롤러',
        description: '웹사이트를 방문하여 텍스트 데이터를 자동으로 수집합니다.',
        icon: Globe,
        isCorrect: true,
        feedback: "정답입니다! 텍스트 데이터를 수집하는 데는 크롤러가 제격이죠."
      },
      {
        id: 'sensor',
        name: '온도 센서',
        description: '물리적인 온도를 측정하여 기록합니다.',
        icon: Thermometer,
        isCorrect: false,
        feedback: "이런! 센서는 물리적인 환경 데이터(온도)만 측정할 수 있어요."
      }
    ]
  },
  {
    type: 'SMART_FARM',
    title: '스마트팜 자동화 프로젝트',
    description: '비닐하우스 안의 **온도와 습도**를 실시간으로 감시해서 농작물을 지키는 AI를 만들고 싶어요.',
    tools: [
      {
        id: 'iot_sensor',
        name: 'IoT 센서',
        description: '환경 데이터(온도, 습도 등)를 실시간으로 감지합니다.',
        icon: Thermometer,
        isCorrect: true,
        feedback: "정답입니다! 센서는 환경 변화를 실시간으로 수집하는 데 필수적입니다."
      },
      {
        id: 'crawler',
        name: '웹 크롤러',
        description: '웹사이트의 텍스트를 수집합니다.',
        icon: Globe,
        isCorrect: false,
        feedback: "웹 크롤러로는 비닐하우스의 실제 온도를 측정할 수 없어요!"
      }
    ]
  },
   {
    type: 'REVIEWS', // Reusing Review type but different wrong option for variety
    title: '영화 리뷰 분석 프로젝트',
    description: '개봉한 영화에 대한 관객들의 **리뷰 댓글**을 모아서 흥행을 예측하고 싶어요.',
    tools: [
      {
        id: 'crawler',
        name: '웹 크롤러',
        description: '커뮤니티와 포털 사이트의 댓글을 수집합니다.',
        icon: Globe,
        isCorrect: true,
        feedback: "좋아요! 웹상의 여론을 모으기 위해 크롤러를 사용했습니다."
      },
      {
        id: 'gps',
        name: 'GPS 추적기',
        description: '위치 정보를 실시간으로 추적합니다.',
        icon: MapPin,
        isCorrect: false,
        feedback: "GPS는 위치를 알 수 있지만, 영화 리뷰를 수집할 수는 없어요."
      }
    ]
  }
];

const CollectionStage: React.FC<Props> = ({ onComplete, onBack }) => {
  const [scenario, setScenario] = useState<ScenarioDef | null>(null);
  const [shuffledTools, setShuffledTools] = useState<ToolOption[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Pick random scenario
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setScenario(randomScenario);
    
    // Shuffle tools
    const tools = [...randomScenario.tools];
    for (let i = tools.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tools[i], tools[j]] = [tools[j], tools[i]];
    }
    setShuffledTools(tools);
  }, []);

  const handleSelect = (tool: ToolOption) => {
    setSelectedToolId(tool.id);
    if (tool.isCorrect) {
      setFeedback({
        type: 'success',
        message: tool.feedback
      });
      setTimeout(() => {
        if (scenario) onComplete(scenario.type);
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: tool.feedback
      });
    }
  };

  if (!scenario) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span>뒤로 가기</span>
      </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">1단계: 데이터 수집</h2>
        <div className="bg-blue-50 p-6 rounded-2xl max-w-2xl mx-auto border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{scenario.title}</h3>
            <p className="text-lg text-blue-800 word-keep-all leading-relaxed">
            {scenario.description.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-blue-600 bg-white px-1 rounded">{part}</strong> : part
            )}
            </p>
        </div>
        <p className="text-gray-500 mt-4">목표를 달성하기 위해 가장 적절한 도구를 선택하세요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {shuffledTools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedToolId === tool.id;
          const isSuccess = isSelected && tool.isCorrect;
          const isError = isSelected && !tool.isCorrect;

          let borderColor = 'border-gray-200';
          let bgColor = 'bg-white';
          if (isSuccess) {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-50';
          } else if (isError) {
            borderColor = 'border-red-500';
            bgColor = 'bg-red-50';
          }

          return (
            <div
              key={tool.id}
              onClick={() => handleSelect(tool)}
              className={`
                relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                ${borderColor} ${bgColor} hover:shadow-xl
              `}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${isSuccess ? 'bg-green-100 text-green-600' : isError ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{tool.name}</h3>
              <p className="text-gray-500 text-center word-keep-all">
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-bottom-2
          ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium word-keep-all">{feedback.message}</span>
        </div>
      )}
    </div>
  );
};

export default CollectionStage;
