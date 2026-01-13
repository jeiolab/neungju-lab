import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 인간이 AI보다 더 강점을 가지는 영역은?",
    options: ["대규모 데이터 연산", "반복적인 패턴 인식", "윤리적 판단 및 책임", "24시간 무중단 작업"],
    correctAnswer: 2,
    explanation: "AI는 데이터 처리에 능하지만, 윤리적 가치 판단과 그 결과에 대해 책임지는 것은 인간의 고유 영역입니다."
  },
  {
    id: 2,
    question: "반도체 공정에서 AI가 가장 활약하기 좋은 단계는?",
    options: ["프로젝트 목표 설정", "웨이퍼 결함 이미지 고속 분류", "공장 설립 부지 결정", "팀원 간의 갈등 중재"],
    correctAnswer: 1,
    explanation: "이미지 인식 기술을 활용한 결함 분류는 AI가 인간보다 훨씬 빠르고 정확하게 수행할 수 있는 대표적인 영역입니다."
  },
  {
    id: 3,
    question: "'협업(Collaboration)'의 올바른 예시가 아닌 것은?",
    options: ["AI가 초안을 작성하고 인간이 수정한다.", "인간이 질문하고 AI가 답변한다.", "AI에게 전권을 위임하고 인간은 결과만 확인한다.", "AI의 분석 결과를 토대로 인간이 의사결정을 내린다."],
    correctAnswer: 2,
    explanation: "전권을 위임하고 결과만 확인하는 것은 '협업'보다는 '방임'이나 과도한 '의존'에 가깝습니다. 협업은 상호작용이 필수적입니다."
  },
  {
    id: 4,
    question: "다음 중 '인간 소외' 현상과 가장 관련 깊은 AI 도입 사례는?",
    options: ["의사의 진단을 돕는 의료 AI", "위험한 화재 현장에 투입되는 로봇", "상담원을 완전히 대체한 챗봇으로 인한 고용 불안", "학생 맞춤형 문제를 추천하는 교육 AI"],
    correctAnswer: 2,
    explanation: "노동 대체로 인한 고용 불안은 AI 도입 시 고려해야 할 대표적인 사회적 문제입니다."
  },
  {
    id: 5,
    question: "프로젝트 매니저(PM)가 AI 도구를 사용할 때 가장 경계해야 할 태도는?",
    options: ["AI의 제안을 비판적으로 검토하기", "AI의 오류 가능성을 항상 염두에 두기", "AI의 결과를 맹목적으로 신뢰하기", "AI를 단순 도구로 인식하고 활용하기"],
    correctAnswer: 2,
    explanation: "AI 환각(Hallucination) 현상 등이 있을 수 있으므로, 맹목적인 신뢰는 프로젝트의 큰 리스크가 됩니다."
  },
];

const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    const correct = selectedOption === QUESTIONS[currentQIndex].correctAnswer;
    if (correct) setScore(score + 1);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="text-center py-12 animate-fade-in bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">퀴즈 종료!</h2>
        <div className="text-6xl mb-6">
            {score >= 4 ? '🎉' : score >= 2 ? '🙂' : '📚'}
        </div>
        <p className="text-xl text-gray-700 mb-8">
          당신의 점수는 <span className="font-bold text-blue-600 text-2xl">{score} / {QUESTIONS.length}</span> 점입니다.
        </p>
        <button 
          onClick={resetQuiz}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
            Question {currentQIndex + 1}
          </span>
          <span className="text-gray-400 text-sm">
            {QUESTIONS.length}문제 중 {currentQIndex + 1}번
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";
            
            if (showResult) {
              if (idx === question.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption && idx !== question.correctAnswer) {
                buttonClass += "border-red-300 bg-red-50 text-red-800 opacity-60";
              } else {
                buttonClass += "border-gray-100 text-gray-400";
              }
            } else {
              if (selectedOption === idx) {
                buttonClass += "border-blue-500 bg-blue-50 text-blue-800 shadow-sm";
              } else {
                buttonClass += "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={buttonClass}
              >
                <span>{option}</span>
                {showResult && idx === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showResult && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-slide-up">
            <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-blue-800 mb-1">해설</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
                </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                selectedOption !== null 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 shadow-md transition-colors"
            >
              {currentQIndex < QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;