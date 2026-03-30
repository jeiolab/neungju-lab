'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, AlertTriangle, Shield, Eye, Coins, BrainCircuit, MessageSquare, Check, X, RefreshCw } from 'lucide-react';
import { generateQuizQuestion, getReflectionFeedback } from '../services/geminiService';

// --- Manual Tab ---
export const ManualTab: React.FC = () => (
  <div className="p-6 max-w-4xl mx-auto space-y-8 overflow-y-auto h-full">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-slate-800">가명 정보 가이드라인</h2>
      <p className="text-slate-600 mt-2">안전한 데이터 활용을 위한 필수 지식</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">개인정보 (Personal Data)</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">
          살아있는 개인에 관한 정보로서 성명, 주민등록번호 및 영상 등을 통하여 개인을 알아볼 수 있는 정보입니다.
          해당 정보만으로는 특정 개인을 알아볼 수 없더라도 다른 정보와 쉽게 결합하여 알아볼 수 있는 것을 포함합니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">가명정보 (Pseudonymized Data)</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">
          개인정보의 일부를 삭제하거나 일부 또는 전부를 대체하는 등의 방법으로 추가 정보 없이는 특정 개인을 알아볼 수 없도록 처리한 정보입니다.
          통계 작성, 과학적 연구, 공익적 기록 보존 등을 위해 정보주체의 동의 없이 활용 가능합니다.
        </p>
      </div>
    </div>

    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        주요 비식별 조치 기법
      </h3>
      <ul className="space-y-3">
        <li className="flex gap-3">
          <span className="font-bold min-w-[80px] text-slate-700">가명처리</span>
          <span className="text-slate-600">식별요소의 일부 또는 전부를 삭제하거나 대체 (홍길동 → 홍*동)</span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold min-w-[80px] text-slate-700">총계처리</span>
          <span className="text-slate-600">데이터의 총합, 평균 등 통계값만 보여줌 (개별 데이터 삭제)</span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold min-w-[80px] text-slate-700">데이터삭제</span>
          <span className="text-slate-600">분석에 불필요한 식별자(주민번호 등)를 완전히 제거</span>
        </li>
        <li className="flex gap-3">
          <span className="font-bold min-w-[80px] text-slate-700">범주화</span>
          <span className="text-slate-600">세세한 값을 구간으로 묶음 (35세 → 30대, 서울시 강남구 → 서울시)</span>
        </li>
      </ul>
    </div>
  </div>
);

// --- Market Tab ---
interface MarketProps {
  processedHistory: any[];
}
export const MarketTab: React.FC<MarketProps> = ({ processedHistory }) => (
  <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">데이터 마켓</h2>
        <p className="text-slate-600">가공된 데이터의 가치를 평가받는 곳입니다.</p>
      </div>
      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
        <Coins className="w-5 h-5" />
        Market Place
      </div>
    </div>

    {processedHistory.length === 0 ? (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <BrainCircuit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">아직 판매할 데이터가 없습니다.</p>
        <p className="text-slate-400">공작소 탭에서 미션을 완료해보세요.</p>
      </div>
    ) : (
      <div className="grid gap-4">
        {processedHistory.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow border border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">가공 데이터 #{idx + 1}</h3>
              <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4 text-sm">
               <div className="text-emerald-600 font-medium">안전성: {item.safetyScore}</div>
               <div className="text-blue-600 font-medium">유용성: {item.utilityScore}</div>
               <div className="text-orange-600 font-bold">가치: {Math.floor((item.safetyScore + item.utilityScore)/2)} 코인</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- Quiz Tab ---
export const QuizTab: React.FC<{onCorrect: () => void}> = ({onCorrect}) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState<string | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setAnswered(null);
    const q = await generateQuizQuestion();
    setQuiz(q);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleAnswer = (choice: "O" | "X") => {
    setAnswered(choice);
    if (choice === quiz.answer) {
        onCorrect();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
            <BrainCircuit className="w-6 h-6" /> 보안 상식 퀴즈
          </h2>
        </div>
        
        <div className="p-8">
          {loading || !quiz ? (
            <div className="flex flex-col items-center py-10">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
              <p>AI가 문제를 출제하고 있습니다...</p>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-slate-800 text-center mb-8 leading-relaxed">
                {quiz.question}
              </p>

              {!answered ? (
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAnswer("O")}
                    className="flex-1 py-4 text-2xl font-bold text-blue-600 border-2 border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex justify-center items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center">O</div>
                  </button>
                  <button 
                     onClick={() => handleAnswer("X")}
                    className="flex-1 py-4 text-2xl font-bold text-red-600 border-2 border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                  >
                     <div className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center">X</div>
                  </button>
                </div>
              ) : (
                <div className={`text-center p-4 rounded-lg ${answered === quiz.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <h3 className="text-xl font-bold mb-2">
                    {answered === quiz.answer ? "정답입니다!" : "틀렸습니다!"}
                  </h3>
                  <p className="text-sm">{quiz.explanation}</p>
                  <button 
                    onClick={fetchQuiz}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    다음 문제
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Reflection Tab ---
export const ReflectionTab: React.FC = () => {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const fb = await getReflectionFeedback(text);
    setFeedback(fb || null);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">생각해보기</h2>
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-6">
        <p className="font-medium text-slate-700 mb-4">
          "빅데이터 시대, 데이터 활용의 편의성과 개인 프라이버시 보호 중 무엇이 더 중요할까요? 그 균형은 어떻게 맞춰야 할까요?"
        </p>
        <textarea 
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder="자유롭게 생각을 작성해보세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            AI 피드백 받기
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 animate-fade-in">
          <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" /> AI 교수의 피드백
          </h3>
          <p className="text-slate-700 leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
};
