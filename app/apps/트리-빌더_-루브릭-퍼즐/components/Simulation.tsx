import React, { useState, useMemo } from 'react';
import { Question, StudentWork } from '../types';
import { QUESTIONS, STUDENT_DATA } from '../constants';
import { PlusCircle, Trash2, Play, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const Simulation: React.FC = () => {
  // 사용자가 선택한 질문들의 순서 (최대 3개로 제한하여 Depth 조절)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [simulationResult, setSimulationResult] = useState<{ accuracy: number; complexity: number } | null>(null);

  // 질문 추가
  const addQuestion = (question: Question) => {
    if (selectedQuestions.length >= 3) {
      alert("트리가 너무 깊어지면 과대적합(Overfitting) 위험이 있어요! 최대 3개까지만 골라보세요.");
      return;
    }
    if (selectedQuestions.find(q => q.id === question.id)) return;
    setSelectedQuestions([...selectedQuestions, question]);
    setSimulationResult(null); // 리셋
  };

  // 질문 삭제
  const removeQuestion = (index: number) => {
    const newQuestions = [...selectedQuestions];
    newQuestions.splice(index, 1);
    setSelectedQuestions(newQuestions);
    setSimulationResult(null);
  };

  // 시뮬레이션 실행 (결정트리 로직)
  const runSimulation = () => {
    if (selectedQuestions.length === 0) return;

    let correctCount = 0;

    STUDENT_DATA.forEach(student => {
      // 리프 노드에 도달하기 위한 로직
      // 실제 트리는 복잡하지만, 여기서는 "Priority List" 모델을 사용하여
      // 위에서부터 질문을 통과하며 예/아니오에 따라 점수를 부여하거나 그룹핑하는 단순화된 로직을 사용하지 않고
      // 교육적 목적을 위해 각 분기마다 데이터가 쪼개지는 것을 시뮬레이션 합니다.
      
      // 편의상 시각적/논리적 복잡도를 줄이기 위해 '규칙 기반 채점'으로 시뮬레이션 합니다.
      // 사용자가 고른 질문들이 모두 '참'이어야 A, 하나라도 '거짓'이면... 식의 단순 로직보다는
      // 실제 의사결정트리처럼 분기한다고 가정하고, 
      // 리프 노드(최종 상태)에서의 다수결(Majority Vote)로 예측값을 정합니다.
      
      const predicted = predictGrade(student, selectedQuestions);
      if (predicted === student.trueGrade) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / STUDENT_DATA.length) * 100);
    // 복잡도 페널티: 질문 개수 * 5%
    const complexity = selectedQuestions.length * 5; 
    
    setSimulationResult({ accuracy, complexity });
  };

  // 단순화된 결정트리 예측 함수 (교육용 시뮬레이션)
  // 이 함수는 실제 학습된 트리가 아니라, 데이터 분포를 보고 리프 노드의 값을 결정하는 "학습 + 예측" 과정을 동시에 수행합니다.
  const predictGrade = (student: StudentWork, questions: Question[]): string => {
    // 현재 학생이 떨어질 리프 노드의 '경로'를 찾음 (예: True -> False -> True)
    // 그 경로에 있는 다른 모든 학습 데이터를 찾음
    // 그 데이터들의 다수결(Mode)이 예측값이 됨
    
    const pathSignature = questions.map(q => student[q.field] ? 'T' : 'F').join('-');

    // 같은 경로를 가진 훈련 데이터 찾기
    const neighbors = STUDENT_DATA.filter(s => {
      const sSignature = questions.map(q => s[q.field] ? 'T' : 'F').join('-');
      return sSignature === pathSignature;
    });

    if (neighbors.length === 0) return 'B'; // 데이터가 없으면 중간값인 B로 찍음

    // 다수결 투표
    const counts = { A: 0, B: 0, C: 0 };
    neighbors.forEach(n => counts[n.trueGrade]++);

    // 최빈값 찾기
    if (counts.A >= counts.B && counts.A >= counts.C) return 'A';
    if (counts.B >= counts.A && counts.B >= counts.C) return 'B';
    return 'C';
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4">
      {/* 왼쪽: 질문 선택 패널 */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
          질문 카드 고르기
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          수행평가를 채점할 때 가장 중요하다고 생각하는 기준을 순서대로 골라보세요.
        </p>
        <div className="space-y-3">
          {QUESTIONS.map(q => {
            const isSelected = selectedQuestions.find(sq => sq.id === q.id);
            return (
              <button
                key={q.id}
                onClick={() => !isSelected && addQuestion(q)}
                disabled={!!isSelected}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center group ${
                  isSelected 
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-md active:scale-95'
                }`}
              >
                <span className="font-medium">{q.text}</span>
                {!isSelected && <PlusCircle className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 중앙: 트리 시각화 및 결과 */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* 트리 빌더 영역 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
            나만의 루브릭 트리
          </h3>
          
          <div className="flex flex-col items-center space-y-4">
            {selectedQuestions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl w-full">
                <p>왼쪽에서 질문을 추가하여 트리를 만들어보세요!</p>
              </div>
            ) : (
              selectedQuestions.map((q, idx) => (
                <div key={q.id} className="flex flex-col items-center animate-in slide-in-from-bottom-2 fade-in duration-300">
                  {idx > 0 && <div className="h-8 w-0.5 bg-slate-300 my-1"></div>}
                  <div className="relative bg-indigo-50 border-2 border-indigo-500 text-indigo-900 px-6 py-3 rounded-full font-bold shadow-sm flex items-center gap-3">
                    <span className="text-xs bg-indigo-200 px-2 py-0.5 rounded-full text-indigo-800">Depth {idx + 1}</span>
                    {q.text}
                    <button 
                      onClick={() => removeQuestion(idx)}
                      className="text-indigo-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {/* 분기 시각화 (장식용) */}
                  <div className="flex w-32 justify-between mt-1 text-xs text-slate-400 font-mono">
                    <span>Yes</span>
                    <span>No</span>
                  </div>
                </div>
              ))
            )}
            
            {/* 결과 리프 노드 시각화 */}
            {selectedQuestions.length > 0 && (
               <div className="mt-4 flex gap-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 bg-slate-100 rounded-lg border-2 border-slate-200 flex items-center justify-center text-xs text-slate-400">
                     Class
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* 시뮬레이션 컨트롤 및 결과 */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-green-400" />
              시뮬레이션 테스트
            </h4>
            <p className="text-slate-400 text-sm">
              준비된 12명의 학생 데이터를 이 트리에 통과시켜 봅니다.
            </p>
          </div>

          {simulationResult ? (
            <div className="flex gap-6 items-center animate-in zoom-in duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{simulationResult.accuracy}%</div>
                <div className="text-xs text-slate-400">정확도</div>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div className="text-center">
                <div className={`text-xl font-bold ${simulationResult.complexity > 10 ? 'text-amber-400' : 'text-blue-400'}`}>
                  {simulationResult.complexity > 10 ? '복잡함' : '적절'}
                </div>
                <div className="text-xs text-slate-400">모델 복잡도</div>
              </div>
              <button 
                onClick={runSimulation}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                다시 하기
              </button>
            </div>
          ) : (
             <button 
              onClick={runSimulation}
              disabled={selectedQuestions.length === 0}
              className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all ${
                selectedQuestions.length === 0 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-400 text-white hover:scale-105 active:scale-95'
              }`}
            >
              채점 시작하기
            </button>
          )}
        </div>

        {/* 피드백 메시지 */}
        {simulationResult && (
          <div className={`p-4 rounded-xl border-l-4 ${simulationResult.accuracy >= 80 ? 'bg-green-50 border-green-500 text-green-800' : 'bg-amber-50 border-amber-500 text-amber-800'}`}>
            <h5 className="font-bold flex items-center gap-2">
              {simulationResult.accuracy >= 80 ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              AI 코치 피드백
            </h5>
            <p className="text-sm mt-1">
              {simulationResult.accuracy >= 80 
                ? "훌륭해요! 간단한 질문만으로도 학생들의 등급을 아주 잘 분류해냈군요. 이것이 바로 의사결정트리의 힘입니다." 
                : "정확도가 조금 아쉽네요. 가장 중요한 질문(속성)이 맨 위에 오지 않았을 수 있어요. 순서를 바꾸거나 다른 질문을 골라보세요!"}
            </p>
             {selectedQuestions.length === 3 && simulationResult.accuracy < 90 && (
                <p className="text-xs mt-2 text-slate-500">
                  Tip: 질문이 많다고 무조건 좋은 건 아니에요. 하지만 지금은 핵심 질문이 빠져있을 수 있어요.
                </p>
             )}
          </div>
        )}

      </div>
    </div>
  );
};
