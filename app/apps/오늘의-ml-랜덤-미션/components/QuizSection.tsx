import React, { useState } from 'react';
import { QuizQuestion, WrongNote } from '../types';
import { generateQuiz } from '../services/geminiService';

interface Props {
  weakTags: string[];
  onQuizComplete: (score: number, wrongNotes: WrongNote[]) => void;
}

const QuizSection: React.FC<Props> = ({ weakTags, onQuizComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{score: number, wrong: WrongNote[]} | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const qData = await generateQuiz(difficulty, weakTags);
      setQuestions(qData);
      setStarted(true);
      setAnswers(new Array(qData.length).fill(-1));
    } catch (e) {
      alert("퀴즈 생성 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    const wrong: WrongNote[] = [];
    const today = new Date().toISOString().split('T')[0];

    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score += 10; // 10 points per question
      } else {
        wrong.push({
          questionId: q.id || `q-${Math.random()}`,
          question: q.question,
          selectedAnswer: q.options[answers[idx]] || "선택 안함",
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          date: today,
          tag: q.tag
        });
      }
    });

    setResults({ score, wrong });
    setFinished(true);
    onQuizComplete(score, wrong);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-600 font-medium">AI가 맞춤형 퀴즈를 생성하고 있습니다...</p>
    </div>
  );

  if (!started) return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">📝 데일리 ML 퀴즈</h2>
      <p className="text-slate-600 mb-6">하루 10문제로 실력을 점검하세요.</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">난이도 선택</label>
        <div className="flex justify-center space-x-2">
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-full border ${difficulty === d ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button onClick={startQuiz} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
        퀴즈 시작하기
      </button>
    </div>
  );

  if (finished && results) return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">결과 리포트</h2>
        <div className="text-5xl font-extrabold text-indigo-600 mb-2">{results.score}점</div>
        <p className="text-slate-500">10문제 중 {results.score / 10}문제 정답</p>
      </div>

      {results.wrong.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg text-rose-600 mb-3">오답 노트 ({results.wrong.length})</h3>
          <div className="space-y-4">
            {results.wrong.map((w, i) => (
              <div key={i} className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <p className="font-medium text-slate-800 mb-1">Q. {w.question}</p>
                <div className="text-sm flex flex-col gap-1">
                  <span className="text-rose-700">❌ 내 답: {w.selectedAnswer}</span>
                  <span className="text-emerald-700">✅ 정답: {w.correctAnswer}</span>
                  <p className="text-slate-600 text-xs mt-2 bg-white p-2 rounded">{w.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => { setStarted(false); setFinished(false); }} className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold">
        돌아가기
      </button>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 flex flex-col min-h-[500px]">
      <div className="bg-slate-100 px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <span className="font-bold text-slate-700">Question {currentIdx + 1} / {questions.length}</span>
        <span className="text-sm px-2 py-1 bg-white rounded border border-slate-300 text-slate-500">{q.tag}</span>
      </div>

      <div className="p-8 flex-1">
        <h3 className="text-xl font-medium text-slate-900 mb-6 leading-relaxed">{q.question}</h3>
        
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[currentIdx] === idx 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-medium' 
                : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="inline-block w-6 font-bold text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={answers[currentIdx] === -1}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {currentIdx === questions.length - 1 ? '제출하기' : '다음 문제'}
        </button>
      </div>
    </div>
  );
};

export default QuizSection;
