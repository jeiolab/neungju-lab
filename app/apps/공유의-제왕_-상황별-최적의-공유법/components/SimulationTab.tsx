import React, { useState, useEffect } from 'react';
import { ToolType, Scenario } from '../types';
import { Send, Wifi, WifiOff, MapPin, HardDrive } from 'lucide-react';

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    description: "4K 영상 (10GB) 원본을 옆 짝꿍에게 줘야 해. 근데 지금 학교 인터넷이 먹통이야!",
    fileSize: "10GB (초대용량)",
    distance: "Nearby",
    network: "Unavailable",
    bestTool: ToolType.USB,
    explanation: "인터넷이 없으면 클라우드나 메일은 불가능해. 블루투스는 10GB 보내려면 하루 종일 걸릴걸? USB가 가장 빠르고 확실해!"
  },
  {
    id: 2,
    description: "수행평가 PPT(50MB)를 집에서 작업 중인 팀원 3명에게 보내야 해. 모두가 동시에 수정하면 좋겠어.",
    fileSize: "50MB",
    distance: "Remote",
    network: "Available",
    bestTool: ToolType.CLOUD,
    explanation: "여러 명이 동시에 편집하고 원거리에 있다면 클라우드 링크(SaaS)가 정답이야. 이메일은 버전 관리가 엉망이 돼."
  },
  {
    id: 3,
    description: "현장학습에서 찍은 사진 5장(총 15MB)을 바로 옆에 있는 친구 아이폰으로 보내달래.",
    fileSize: "15MB",
    distance: "Nearby",
    network: "Available",
    bestTool: ToolType.BLUETOOTH,
    explanation: "가까운 거리, 아이폰끼리라면 AirDrop(블루투스+Wi-Fi Direct)이 가장 간편하고 데이터도 안 써."
  },
  {
    id: 4,
    description: "교수님께 최종 보고서 PDF(3MB)를 정식으로 제출해야 해.",
    fileSize: "3MB",
    distance: "Remote",
    network: "Available",
    bestTool: ToolType.EMAIL,
    acceptableTools: [ToolType.CLOUD],
    explanation: "공식적인 제출이나 기록을 남겨야 할 때는 이메일이 표준이야. 클라우드 링크도 괜찮지만 권한 설정을 잊으면 안 돼."
  }
];

interface SimulationTabProps {
  onScoreUpdate: (points: number, mistakeType?: string) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onScoreUpdate }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });
  const [isFinished, setIsFinished] = useState(false);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const handleToolSelect = (tool: ToolType) => {
    if (feedback.type !== null) return; // Prevent double clicking

    const isBest = tool === currentScenario.bestTool;
    const isAcceptable = currentScenario.acceptableTools?.includes(tool);

    if (isBest || isAcceptable) {
      setFeedback({
        msg: `✅ 전송 완료! ${currentScenario.explanation}`,
        type: 'success'
      });
      onScoreUpdate(isBest ? 20 : 10);
    } else {
      let mistake = "Other";
      if (currentScenario.network === 'Unavailable' && (tool === ToolType.CLOUD || tool === ToolType.EMAIL)) {
        mistake = "Network Ignored";
      } else if (currentScenario.fileSize.includes("GB") && tool === ToolType.EMAIL) {
        mistake = "Size Limit";
      } else if (currentScenario.fileSize.includes("GB") && tool === ToolType.BLUETOOTH) {
        mistake = "Speed/Time Ignored";
      }

      setFeedback({
        msg: `❌ 전송 실패/비효율! ${currentScenario.explanation}`,
        type: 'error'
      });
      onScoreUpdate(0, mistake);
    }
  };

  const nextScenario = () => {
    setFeedback({ msg: '', type: null });
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentScenarioIndex(0);
    setIsFinished(false);
    setFeedback({ msg: '', type: null });
  };

  if (isFinished) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl shadow-xl animate-fade-in">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">🎉 미션 클리어!</h2>
        <p className="text-gray-600 mb-8">모든 상황을 해결했어. 이제 넌 우리 조의 진정한 '공유의 제왕'이야!</p>
        <button
          onClick={restart}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${((currentScenarioIndex + 1) / SCENARIOS.length) * 100}%` }}
          />
        </div>

        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded mb-3 mt-2">
          SITUATION {currentScenarioIndex + 1}/{SCENARIOS.length}
        </span>

        <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          "{currentScenario.description}"
        </h3>

        <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <HardDrive className="w-4 h-4" /> {currentScenario.fileSize}
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <MapPin className="w-4 h-4" /> {currentScenario.distance}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentScenario.network === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {currentScenario.network === 'Available' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {currentScenario.network === 'Available' ? '인터넷 O' : '인터넷 X'}
          </div>
        </div>

        {feedback.type === null ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.values(ToolType).map((tool) => (
              <button
                key={tool}
                onClick={() => handleToolSelect(tool)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-gray-700 flex flex-col items-center justify-center gap-2 h-32"
              >
                <div className="bg-white p-2 rounded-full shadow-sm">
                  {tool === ToolType.USB && <HardDrive className="w-6 h-6 text-gray-600" />}
                  {tool === ToolType.CLOUD && <Send className="w-6 h-6 text-blue-500" />}
                  {tool === ToolType.BLUETOOTH && <Wifi className="w-6 h-6 text-purple-500" />}
                  {tool === ToolType.EMAIL && <span className="text-lg font-bold text-yellow-600">@</span>}
                </div>
                {tool}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-6 rounded-xl text-center animate-bounce-in ${feedback.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-lg font-bold mb-3 ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {feedback.msg.split('!')[0]}!
            </p>
            <p className="text-gray-700 mb-6 text-sm">{feedback.msg.split('!')[1]}</p>
            <button
              onClick={nextScenario}
              className="bg-indigo-600 text-white px-8 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-md"
            >
              다음 상황으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;
