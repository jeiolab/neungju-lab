import React, { useState } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { CheckCircle2, XCircle, Award, AlertCircle } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "RLE(Run-Length Encoding)는 어떤 데이터에 효과적인가요?", options: ["모든 글자가 다른 텍스트", "같은 문자가 연속해서 반복되는 텍스트", "사전에 없는 단어가 많은 텍스트", "매우 짧은 텍스트"], correctIndex: 1, explanation: "RLE는 'AAAA'를 'A4'로 줄이는 방식이므로 연속 반복이 많아야 효율적입니다.", relatedConcept: "RLE" },
  { id: 2, question: "Lempel-Ziv 알고리즘의 핵심 원리는?", options: ["문자의 빈도수에 따라 비트 할당", "연속된 문자 개수 세기", "이전에 등장한 문자열 패턴 참조", "데이터를 손실시켜 용량 줄이기"], correctIndex: 2, explanation: "LZ는 이전에 나온 단어를 사전(Dictionary)처럼 참조하여 위치와 길이로 표현합니다.", relatedConcept: "Lempel-Ziv" },
  { id: 3, question: "다음 중 '무손실 압축'이 반드시 필요한 경우는?", options: ["유튜브 동영상 스트리밍", "비밀번호가 적힌 텍스트 파일", "친구에게 보낼 셀카 사진", "음악 스트리밍 서비스"], correctIndex: 1, explanation: "텍스트나 비밀번호는 한 글자만 바뀌어도 의미가 완전히 달라지므로 100% 복구 가능한 무손실 압축이 필수입니다.", relatedConcept: "압축 종류" },
  { id: 4, question: "'ABCDE'라는 문자열을 RLE로 압축하면 효율은?", options: ["매우 좋다", "변화 없다", "오히려 용량이 커질 수 있다", "알 수 없다"], correctIndex: 2, explanation: "반복이 없는데 RLE를 쓰면 'A1B1C1D1E1'처럼 되어 오히려 데이터가 늘어납니다.", relatedConcept: "오버헤드" },
  { id: 5, question: "허프만 코딩에서 가장 빈도수가 높은 문자는 어떤 코드를 받나요?", options: ["가장 긴 비트", "가장 짧은 비트", "중간 길이 비트", "항상 0"], correctIndex: 1, explanation: "자주 쓰는 걸 짧게 줄여야 전체 용량이 줄어들겠죠?", relatedConcept: "허프만 코딩" },
  { id: 6, question: "JPEG 이미지는 어떤 압축 방식인가요?", options: ["무손실 압축", "손실 압축", "압축하지 않음", "RLE 전용"], correctIndex: 1, explanation: "JPEG는 눈에 잘 안 보이는 색상 정보를 제거하는 손실 압축입니다.", relatedConcept: "압축 종류" },
  { id: 7, question: "LZ77 알고리즘에서 <5, 3>이 의미하는 것은?", options: ["5번째 글자부터 3글자", "5칸 뒤로 가서 3글자 복사", "5번 반복하고 3번 쉼", "5와 3이라는 숫자 저장"], correctIndex: 1, explanation: "현재 위치에서 5칸 뒤(과거)로 가서 3글자를 가져오라는 뜻입니다.", relatedConcept: "Lempel-Ziv" },
  { id: 8, question: "압축률을 계산하는 올바른 식은?", options: ["(압축크기/원본크기) * 100", "1 - (압축크기/원본크기)", "원본크기 - 압축크기", "(원본크기/압축크기)"], correctIndex: 1, explanation: "얼마나 줄었는지를 비율로 보려면 1에서 압축된 비율을 빼야 합니다.", relatedConcept: "효율성" },
  { id: 9, question: "다음 중 사전 기반 압축 알고리즘이 아닌 것은?", options: ["LZ77", "LZW", "RLE", "LZMA"], correctIndex: 2, explanation: "RLE는 반복 횟수 기반이며, 나머지는 사전(패턴) 기반입니다.", relatedConcept: "알고리즘 분류" },
  { id: 10, question: "비밀 쪽지 전달 시 압축을 하는 주된 이유는?", options: ["보안을 위해", "데이터 전송 시간을 줄이고 들킬 확률을 낮추기 위해", "글씨체를 예쁘게 하려고", "종이를 아끼려고"], correctIndex: 1, explanation: "데이터가 작을수록 빨리 보내고 숨기기 쉽습니다.", relatedConcept: "미션 목표" },
];

const ExamTab: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    wrongAnswers: [],
    isFinished: false,
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    const isCorrect = selectedOption === QUESTIONS[state.currentQuestionIndex].correctIndex;
    
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      wrongAnswers: isCorrect ? prev.wrongAnswers : [...prev.wrongAnswers, QUESTIONS[prev.currentQuestionIndex].id],
      isFinished: prev.currentQuestionIndex >= QUESTIONS.length - 1,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
    setSelectedOption(null);
    setShowExplanation(false);

    if (state.currentQuestionIndex >= QUESTIONS.length - 1) {
        // Exam finished, update global XP based on final score
        const finalScore = (selectedOption === QUESTIONS[state.currentQuestionIndex].correctIndex) ? state.score + 10 : state.score;
        onScoreUpdate(finalScore); 
    }
  };

  if (state.isFinished) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10">
        <Award size={64} className="text-yellow-400" />
        <h2 className="text-3xl font-bold text-white">시험 종료!</h2>
        <div className="text-xl text-slate-300">
            총점: <span className="text-green-400 font-bold">{state.score}</span> / 100
        </div>
        
        {state.wrongAnswers.length > 0 && (
            <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-lg border border-red-500/30">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <AlertCircle size={20} /> 오답 노트
                </h3>
                <div className="space-y-4">
                    {state.wrongAnswers.map(id => {
                        const q = QUESTIONS.find(q => q.id === id);
                        return q ? (
                            <div key={id} className="bg-slate-900 p-4 rounded border-l-2 border-red-500">
                                <p className="text-slate-200 font-medium text-sm mb-1">Q. {q.question}</p>
                                <p className="text-slate-400 text-xs">정답: {q.options[q.correctIndex]}</p>
                                <p className="text-green-400 text-xs mt-1">💡 {q.explanation}</p>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
        )}

        <button 
            onClick={() => setState({ currentQuestionIndex: 0, score: 0, wrongAnswers: [], isFinished: false })}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold transition-colors"
        >
            재시험 응시
        </button>
      </div>
    );
  }

  const currentQ = QUESTIONS[state.currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">승급 시험</h2>
        <span className="text-slate-400 font-mono">문제 {state.currentQuestionIndex + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg min-h-[400px] flex flex-col justify-between">
         <div>
            <h3 className="text-xl text-white font-medium mb-6 leading-relaxed">
                {currentQ.question}
            </h3>

            <div className="space-y-3">
                {currentQ.options.map((opt, idx) => (
                    <button
                        key={idx}
                        disabled={showExplanation}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left p-4 rounded border transition-all ${
                            showExplanation 
                                ? idx === currentQ.correctIndex 
                                    ? 'bg-green-900/50 border-green-500 text-green-200' 
                                    : idx === selectedOption 
                                        ? 'bg-red-900/50 border-red-500 text-red-200'
                                        : 'bg-slate-700/50 border-slate-700 text-slate-500'
                                : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-mono opacity-50">{idx + 1}.</span>
                            {opt}
                            {showExplanation && idx === currentQ.correctIndex && <CheckCircle2 className="ml-auto text-green-500" size={20}/>}
                            {showExplanation && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="ml-auto text-red-500" size={20}/>}
                        </div>
                    </button>
                ))}
            </div>
         </div>

         {showExplanation && (
             <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                 <div className="bg-slate-900 p-4 rounded border-l-4 border-yellow-500 mb-4">
                     <p className="text-yellow-400 font-bold text-sm mb-1">선배의 팁:</p>
                     <p className="text-slate-300 text-sm">{currentQ.explanation}</p>
                 </div>
                 <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                 >
                    다음 문제
                 </button>
             </div>
         )}
      </div>
    </div>
  );
};

export default ExamTab;