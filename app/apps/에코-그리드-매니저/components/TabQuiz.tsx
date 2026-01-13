import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const questions: QuizQuestion[] = [
  { id: 1, question: "2D 그리드의 특정 셀에 접근하려면 몇 개의 인덱스가 필요한가요?", options: ["1개", "2개", "3개", "0개"], correctIndex: 1, explanation: "2D 그리드는 행(Row)과 열(Column), 총 2개의 인덱스가 필요합니다." },
  { id: 2, question: "array[2][4]에서 숫자 '2'는 보통 무엇을 나타낼까요?", options: ["열(Column)", "값(Value)", "행(Row)", "높이(Height)"], correctIndex: 2, explanation: "일반적인 표기법은 [행][열] 순서입니다." },
  { id: 3, question: "2D 지도에 '시간'이라는 차원을 추가하면 몇 차원이 될까요?", options: ["1D", "2D", "3D", "4D"], correctIndex: 2, explanation: "시간이 3번째 차원 역할을 하여 2D 지도들이 시간 순서대로 쌓이는 3D 구조가 됩니다." },
  { id: 4, question: "3개의 층이 있고 각 층에 5개의 교실이 있는 학교를 표현하기 가장 적합한 데이터 구조는?", options: ["Array[15]", "Array[3][5]", "Array[5][3]", "Array[3]"], correctIndex: 1, explanation: "[3]개의 층이 있고, 각 층마다 [5]개의 교실이 있으므로 Array[3][5]가 적합합니다." },
  { id: 5, question: "서로 충돌하는 두 가지 목표(예: 속도 vs 품질) 사이에서 균형을 찾는 것을 무엇이라 하나요?", options: ["버그 (Bug)", "트레이드오프 (Trade-off)", "루프 (Loop)", "문법 오류 (Syntax Error)"], correctIndex: 1, explanation: "트레이드오프는 하나를 얻기 위해 다른 하나를 희생하거나 균형을 맞추는 것을 의미합니다." },
  { id: 6, question: "grid[0][0]은 보통 어디를 가리키나요?", options: ["마지막 셀", "가운데 셀", "왼쪽 상단 셀", "정의되지 않음"], correctIndex: 2, explanation: "인덱스 0,0은 시작점인 원점, 즉 보통 왼쪽 상단을 의미합니다." },
  { id: 7, question: "쓰레기 수거 앱에서 모든 쓰레기를 하나도 빠짐없이 줍는다면 어떤 결과가 나올까요?", options: ["시간 점수가 낮아짐", "환경 점수가 낮아짐", "속도가 빨라짐", "시스템 다운"], correctIndex: 0, explanation: "모든 것을 줍는 데 시간이 오래 걸리므로 시간/속도 점수가 낮아집니다." },
  { id: 8, question: "3D 좌표를 표현할 때 주로 사용하는 방식은?", options: ["(x, y)", "(x, y, z)", "(x)", "[x, y]"], correctIndex: 1, explanation: "X, Y, Z는 각각 가로, 세로, 높이(깊이)를 나타냅니다." },
  { id: 9, question: "map[1][2] = 5 라고 할 때, 숫자 5는 우리 앱에서 무엇을 의미할까요?", options: ["행 인덱스", "열 인덱스", "쓰레기의 양", "층 수"], correctIndex: 2, explanation: "해당 좌표에 저장된 값은 실제 데이터, 즉 쓰레기의 양을 나타냅니다." },
  { id: 10, question: "배열(Array)을 사용하는 이유는 무엇인가요?", options: ["코드를 느리게 하려고", "데이터를 효율적으로 구조화하기 위해", "사용자를 헷갈리게 하려고", "원을 그리기 위해"], correctIndex: 1, explanation: "배열을 사용하면 인덱스를 이용해 체계적으로 데이터에 접근하고 관리할 수 있습니다." },
];

const TabQuiz: React.FC<{onComplete: (score: number) => void}> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === questions[currentQ].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === questions[currentQ].correctIndex ? 0 : 0)); // Score already updated
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">퀴즈 완료!</h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">{score} / {questions.length}</div>
            <p className="text-gray-500 mb-6">
                {score > 7 ? "훌륭한 데이터 설계자시군요!" : "차원 개념을 조금 더 연습해보세요!"}
            </p>
            <button 
                onClick={() => {
                    setCurrentQ(0);
                    setScore(0);
                    setShowResult(false);
                    setIsAnswered(false);
                    setSelectedOption(null);
                }}
                className="flex items-center gap-2 mx-auto px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
                <RefreshCw size={18} /> 다시 풀기
            </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-400">문제 {currentQ + 1} / {questions.length}</span>
            <span className="text-sm font-bold text-green-600">점수: {score}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-6 min-h-[60px]">{q.question}</h3>
        
        <div className="space-y-3">
            {q.options.map((opt, idx) => {
                let btnClass = "w-full p-4 rounded-lg border text-left transition-all ";
                if (isAnswered) {
                    if (idx === q.correctIndex) btnClass += "bg-green-100 border-green-500 text-green-800";
                    else if (idx === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800";
                    else btnClass += "bg-gray-50 border-gray-200 opacity-50";
                } else {
                    btnClass += "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50";
                }

                return (
                    <button 
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        className={btnClass}
                        disabled={isAnswered}
                    >
                        <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {isAnswered && idx === q.correctIndex && <CheckCircle size={20} className="text-green-600"/>}
                            {isAnswered && idx === selectedOption && idx !== q.correctIndex && <XCircle size={20} className="text-red-600"/>}
                        </div>
                    </button>
                )
            })}
        </div>

        {isAnswered && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                    <strong>해설:</strong> {q.explanation}
                </div>
                <button 
                    onClick={handleNext}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black"
                >
                    {currentQ === questions.length - 1 ? "결과 보기" : "다음 문제"}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;