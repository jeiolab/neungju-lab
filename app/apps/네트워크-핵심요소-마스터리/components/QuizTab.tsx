import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Difficulty, Question, UserState } from '../types';

interface Props {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
  onUpdateMastery: (id: string, delta: number) => void;
}

const QuizTab: React.FC<Props> = ({ userState, onUpdateState, onUpdateMastery }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // User inputs
  const [results, setResults] = useState<Record<string, boolean>>({}); // Grading results
  const [showFeedback, setShowFeedback] = useState(false);
  
  const filteredQuestions = QUIZ_DATA.filter(q => q.difficulty === difficulty);
  const currentQ = filteredQuestions[currentQIndex];

  const handleDifficultySelect = (d: Difficulty) => {
    setDifficulty(d);
    setCurrentQIndex(0);
    setAnswers({});
    setResults({});
    setShowFeedback(false);
  };

  const handleAnswer = (val: string) => {
    setAnswers({ ...answers, [currentQ.id]: val });
  };

  const checkAnswer = () => {
    if (!currentQ) return;
    
    let isCorrect = false;
    const userVal = answers[currentQ.id];

    if (currentQ.type === 'multiple') {
        isCorrect = parseInt(userVal) === currentQ.correctAnswer;
    } else if (currentQ.type === 'short') {
        const correctOptions = currentQ.correctAnswer as string[];
        isCorrect = correctOptions.some(ans => userVal?.trim().toLowerCase() === ans.toLowerCase());
    } else if (currentQ.type === 'narrative') {
        const keywords = currentQ.keywords || [];
        const presentKeywords = keywords.filter(k => userVal?.includes(k));
        isCorrect = presentKeywords.length >= 2 && (userVal?.length || 0) > 10;
    }

    setResults({ ...results, [currentQ.id]: isCorrect });
    setShowFeedback(true);

    // Update Scores
    if (isCorrect) {
        onUpdateMastery('general', 8); // Simplified concept mapping
        onUpdateState({ totalScore: userState.totalScore + 10 });
    } else {
        onUpdateMastery('general', -2);
        const wrongNote = {
            questionId: currentQ.id,
            timestamp: Date.now(),
            userAnswer: userVal || ''
        };
        onUpdateState({ wrongNotes: [...userState.wrongNotes, wrongNote] });
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    if (currentQIndex < filteredQuestions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
    } else {
        // Quiz Finished logic could go here
        alert("퀴즈 완료! 수고했어요.");
        setDifficulty(null);
    }
  };

  if (!difficulty) {
    return (
        <div className="flex flex-col items-center justify-center h-96 animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">도전! 네트워크 퀴즈</h2>
            <p className="text-slate-500">난이도를 선택하면 퀴즈가 시작됩니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl px-4">
                <button onClick={() => handleDifficultySelect('easy')} className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl hover:bg-green-100 hover:scale-105 transition-all text-center">
                    <span className="text-4xl block mb-2">🐣</span>
                    <span className="font-bold text-green-800">쉬움</span>
                    <p className="text-xs text-green-600 mt-2">기본 개념 확인하기</p>
                </button>
                <button onClick={() => handleDifficultySelect('medium')} className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 hover:scale-105 transition-all text-center">
                    <span className="text-4xl block mb-2">🏃</span>
                    <span className="font-bold text-blue-800">보통</span>
                    <p className="text-xs text-blue-600 mt-2">핵심 용어와 기능</p>
                </button>
                <button onClick={() => handleDifficultySelect('hard')} className="p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl hover:bg-purple-100 hover:scale-105 transition-all text-center">
                    <span className="text-4xl block mb-2">🧗</span>
                    <span className="font-bold text-purple-800">도전</span>
                    <p className="text-xs text-purple-600 mt-2">서술형과 심화 개념</p>
                </button>
            </div>
            
            {userState.wrongNotes.length > 0 && (
                <div className="mt-8 w-full max-w-2xl bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <h3 className="font-bold text-orange-800 mb-2">📝 오답 노트 ({userState.wrongNotes.length}개)</h3>
                    <div className="text-sm text-orange-700">
                        틀린 문제를 다시 풀어보고 마스터리를 올리세요!
                    </div>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setDifficulty(null)} className="text-slate-400 hover:text-slate-600 font-medium">← 난이도 선택</button>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                {currentQIndex + 1} / {filteredQuestions.length}
            </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Question Area */}
            <div className="p-8">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-4 
                    ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' : currentQ.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {currentQ.difficulty.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                    {currentQ.question}
                </h3>

                {/* Input Area */}
                {!showFeedback && (
                    <div className="space-y-4">
                        {currentQ.type === 'multiple' && currentQ.options?.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx.toString())}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all 
                                    ${answers[currentQ.id] === idx.toString() ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <span className="inline-block w-6 h-6 rounded-full bg-white border border-slate-300 text-center text-sm leading-5 mr-3 text-slate-400 shadow-sm">
                                    {idx + 1}
                                </span>
                                {opt}
                            </button>
                        ))}

                        {(currentQ.type === 'short' || currentQ.type === 'narrative') && (
                            <textarea 
                                value={answers[currentQ.id] || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                placeholder={currentQ.type === 'short' ? "정답을 입력하세요 (단답형)" : "서술형 답안을 입력하세요 (키워드 포함)"}
                                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 outline-none h-32 resize-none"
                            />
                        )}

                        <button 
                            onClick={checkAnswer}
                            disabled={!answers[currentQ.id]}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
                        >
                            정답 확인
                        </button>
                    </div>
                )}

                {/* Feedback Area */}
                {showFeedback && (
                    <div className={`mt-6 p-6 rounded-xl border-l-4 animate-slide-up ${results[currentQ.id] ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`text-3xl ${results[currentQ.id] ? 'text-green-500' : 'text-red-500'}`}>
                                {results[currentQ.id] ? '🎉' : '🤔'}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-lg mb-2 ${results[currentQ.id] ? 'text-green-800' : 'text-red-800'}`}>
                                    {results[currentQ.id] ? '정답입니다!' : '아쉽네요, 다시 생각해볼까요?'}
                                </h4>
                                <p className="text-slate-700 mb-3">{currentQ.explanation}</p>
                                {!results[currentQ.id] && (
                                    <div className="bg-white/50 p-3 rounded-lg text-sm text-slate-600 mb-3">
                                        💡 <strong>교정 팁:</strong> {currentQ.correction}
                                    </div>
                                )}
                                <button 
                                    onClick={nextQuestion}
                                    className="px-6 py-2 bg-white border border-slate-200 shadow-sm rounded-lg font-bold text-slate-700 hover:bg-slate-50"
                                >
                                    {currentQIndex < filteredQuestions.length - 1 ? '다음 문제 →' : '결과 보기'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default QuizTab;
