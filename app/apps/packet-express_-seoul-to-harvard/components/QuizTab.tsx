import React, { useState } from 'react';
import { checkQuizAnswer } from '../services/geminiService';
import { HelpCircle, Check, X, Loader2 } from 'lucide-react';

interface QuizStep {
  id: string;
  text: string;
}

const QuizTab: React.FC = () => {
  const correctOrder = ["Splitting", "Routing", "Transmission", "Reassembly"];
  
  const [steps, setSteps] = useState<QuizStep[]>([
    { id: "Routing", text: "2. 라우터를 통해 최적의 경로 찾기" },
    { id: "Reassembly", text: "4. 도착지에서 순서대로 재조립하기" },
    { id: "Splitting", text: "1. 데이터를 작은 패킷으로 나누기" },
    { id: "Transmission", text: "3. 패킷을 목적지까지 전송하기" },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);
    setFeedback(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setFeedback(null);
    
    const userOrderString = steps.map(s => s.text).join(" -> ");
    const question = "데이터 전송 과정 순서 배열하기";
    
    // Check locally first for UI speed, but ask Gemini for the explanation
    const isCorrect = JSON.stringify(steps.map(s => s.id)) === JSON.stringify(correctOrder);
    
    // Get rich feedback from Gemini
    const geminiExplanation = await checkQuizAnswer(question, userOrderString);
    
    setFeedback(geminiExplanation);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">퀴즈: 순서를 맞춰라!</h2>
        <p className="text-slate-600">아래 단계들이 뒤섞여 있습니다. 화살표를 눌러 올바른 순서대로 배열해 보세요.</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center bg-white p-4 rounded-lg shadow border border-slate-200 animate-fade-in-up">
            <div className="mr-4 font-bold text-slate-400 text-xl w-8">
              {index + 1}
            </div>
            <div className="flex-1 font-medium text-slate-800">
              {step.text}
            </div>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveStep(index, 'up')}
                disabled={index === 0}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
              >
                ▲
              </button>
              <button 
                onClick={() => moveStep(index, 'down')}
                disabled={index === steps.length - 1}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <HelpCircle />}
          정답 확인하기
        </button>
      </div>

      {feedback && (
        <div className={`mt-8 p-6 rounded-xl border-l-4 shadow-md animate-fade-in ${feedback.includes("훌륭") || feedback.includes("정확") ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
          <div className="flex items-start gap-3">
            <div className="mt-1">
                {feedback.includes("훌륭") || feedback.includes("정확") ? <Check className="text-green-600"/> : <X className="text-orange-600"/>}
            </div>
            <div>
                <h4 className="font-bold text-lg mb-2">AI 코치의 피드백</h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
