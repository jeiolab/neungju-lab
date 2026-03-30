import React, { useState } from 'react';
import { ScenarioCard, EncryptionCategory, UserState } from '../types';
import { SCENARIOS } from '../constants';
import { evaluateReasoning } from '../services/geminiService';
import { Shield, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface GameTabProps {
  userState: UserState;
  updateScore: (points: number) => void;
  recordMisconception: (scenario: string, userCat: string, correctCat: string) => void;
  completeScenario: (id: string) => void;
}

const GameTab: React.FC<GameTabProps> = ({ userState, updateScore, recordMisconception, completeScenario }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<EncryptionCategory | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter out scenarios that might be completed if we wanted a "deck" system, 
  // but for now let's just cycle through them or randomize. 
  // Here we just show them in order.
  const card = SCENARIOS[currentCardIndex];

  const handleSubmit = async () => {
    if (!selectedCategory) return;
    setIsProcessing(true);
    setFeedback({ msg: '분석 중...', type: null });

    const isCategoryCorrect = selectedCategory === card.category;

    if (!isCategoryCorrect) {
      setFeedback({ msg: `틀렸습니다! 이것은 ${selectedCategory}가 아닙니다.`, type: 'error' });
      recordMisconception(card.title, selectedCategory, card.category);
      setIsProcessing(false);
      return;
    }

    // Category is correct, check reasoning
    const result = await evaluateReasoning(
      card.title,
      selectedCategory,
      card.category,
      reasoning,
      card.keywords
    );

    if (result.isCorrect) {
      const points = result.bonus ? 20 : 10;
      updateScore(points);
      completeScenario(card.id);
      setFeedback({ 
        msg: `정답입니다! ${result.feedback} (+${points}점)`, 
        type: 'success' 
      });
    } else {
      setFeedback({ msg: result.feedback, type: 'error' });
    }
    setIsProcessing(false);
  };

  const nextCard = () => {
    setSelectedCategory(null);
    setReasoning('');
    setFeedback({ msg: '', type: null });
    setCurrentCardIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Scenario Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            상황 카드 #{currentCardIndex + 1}
          </h2>
          <span className={`px-2 py-1 rounded text-xs ${card.difficulty === 'easy' ? 'bg-green-500' : 'bg-red-500'}`}>
            {card.difficulty === 'easy' ? '쉬움' : '어려움'}
          </span>
        </div>
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h3>
          <p className="text-lg text-slate-600 leading-relaxed">{card.description}</p>
        </div>
      </div>

      {/* Inputs Area */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="font-semibold text-slate-700 mb-3">1. 암호 방식 선택</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {Object.values(EncryptionCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              disabled={!!feedback.type && feedback.type === 'success'}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h4 className="font-semibold text-slate-700 mb-2">2. 근거 작성 (선택)</h4>
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="왜 그렇게 생각했나요? (핵심 키워드를 포함하면 보너스 점수!)"
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
          rows={2}
          disabled={!!feedback.type && feedback.type === 'success'}
        />

        {/* Action & Feedback */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            {feedback.msg && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{feedback.msg}</span>
              </div>
            )}
          </div>
          
          {feedback.type === 'success' ? (
            <button
              onClick={nextCard}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold transition-all w-full md:w-auto"
            >
              다음 문제
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || isProcessing}
              className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all w-full md:w-auto justify-center ${
                !selectedCategory || isProcessing 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
              }`}
            >
              {isProcessing ? '판별 중...' : '판별하기'} <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTab;