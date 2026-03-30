import React, { useState, useEffect } from 'react';
import { getRiskAssessment } from '../services/geminiService';
import { Task, ProjectConfig } from '../types';
import { Lightbulb, AlertOctagon } from 'lucide-react';

interface ReflectionTabProps {
    tasks: Task[];
    config: ProjectConfig | null;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({ tasks, config }) => {
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && !feedback) {
        setLoading(true);
        getRiskAssessment(tasks).then(res => {
            setFeedback(res);
            setLoading(false);
        });
    }
  }, [tasks, feedback]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        {/* AI Coach Feedback */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Lightbulb className="text-yellow-300" /> AI 코치 피드백
            </h3>
            {loading ? (
                <p className="animate-pulse opacity-80">당신의 계획을 분석하여 잠재적 위험을 찾고 있습니다...</p>
            ) : (
                <p className="leading-relaxed opacity-95">
                    {feedback || "'시뮬레이션' 탭에서 계획을 먼저 작성하면 피드백을 받을 수 있어요!"}
                </p>
            )}
        </div>

        {/* Thought Experiments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertOctagon size={18} className="text-orange-500"/> 만약에...
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                    촬영 주간 내내 비가 많이 온다는 일기예보가 있다면?
                </p>
                <textarea 
                    className="w-full p-3 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-200 outline-none"
                    rows={3}
                    placeholder="계획을 어떻게 수정해야 할까요?"
                ></textarea>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertOctagon size={18} className="text-orange-500"/> 만약에...
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                    메인 편집 담당 친구가 마감 이틀 전에 갑자기 아프다면?
                </p>
                <textarea 
                    className="w-full p-3 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-200 outline-none"
                    rows={3}
                    placeholder="누가 대신 할까요? 파일은 공유되어 있나요?"
                ></textarea>
            </div>
        </div>

        {/* Project Summary */}
        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">프로젝트 요약</h3>
             {config ? (
                 <ul className="text-sm text-slate-600 space-y-2">
                     <li><strong>컨셉:</strong> {config.concept === 'Informative' ? '정보 전달' : config.concept === 'Emotional' ? '감성' : '유머'}</li>
                     <li><strong>팀 규모:</strong> {config.teamSize}명</li>
                     <li><strong>전체 작업 수:</strong> {tasks.length}개</li>
                     <li><strong>기획 단계 작업:</strong> {tasks.filter(t => t.phase === 'Planning').length}개</li>
                     <li><strong>제작(촬영) 단계 작업:</strong> {tasks.filter(t => t.phase === 'Production').length}개</li>
                     <li><strong>편집(후반) 단계 작업:</strong> {tasks.filter(t => t.phase === 'Post-Production').length}개</li>
                 </ul>
             ) : (
                 <p className="text-slate-500 italic">아직 프로젝트 데이터가 없습니다.</p>
             )}
        </div>
    </div>
  );
};

export default ReflectionTab;