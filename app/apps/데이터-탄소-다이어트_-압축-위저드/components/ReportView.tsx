import React, { useState } from 'react';
import { ProjectDraft } from '../types';
import { Download, Share2, Sparkles, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@/lib/genai-browser-shim";

interface ReportViewProps {
  project: ProjectDraft;
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ project, onClose }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetFeedback = async () => {
    if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
      alert("AI 피드백 기능을 사용하려면 API 키 설정이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
      const prompt = `
        학생이 작성한 '데이터 탄소 다이어트 프로젝트'를 평가하고 피드백을 주세요.
        
        [프로젝트 내용]
        - 목표: ${project.goal}
        - 대상: ${project.targetData}
        - 전략: ${project.strategy} (이유: ${project.strategyReason.join(', ')})
        - 실행 계획: ${project.executionPlan}
        - 기대 효과: ${project.expectedEffect}
        
        [요청 사항]
        1. 이 계획이 실제로 탄소 절감에 얼마나 효과적일지 칭찬해주세요.
        2. 실행 과정에서 주의할 점이나 보완할 점을 2~3문장으로 조언해주세요.
        3. 말투는 친절하고 격려하는 선생님처럼 해주세요.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setFeedback(response.text || "피드백을 생성할 수 없습니다.");
    } catch (error) {
      console.error("AI Feedback Error:", error);
      setFeedback("AI 피드백 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none">
      <div className="bg-slate-800 text-white p-8 text-center print:bg-white print:text-black">
        <h1 className="text-3xl font-bold mb-2">🌿 데이터 탄소 다이어트 프로젝트</h1>
        <p className="opacity-80">작성일: {new Date(project.timestamp).toLocaleDateString()}</p>
      </div>

      <div className="p-8 space-y-8">
        <section>
          <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">1. 프로젝트 개요</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-xs text-gray-500 uppercase">Target</span>
              <span className="font-semibold text-lg">{project.targetData}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-xs text-gray-500 uppercase">Goal</span>
              <span className="font-semibold text-lg">{project.goal}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">2. 압축 전략 및 근거</h3>
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="font-bold text-indigo-900 text-lg mb-1">{project.strategy}</p>
            <p className="text-indigo-700 text-sm">
              선택 이유: {project.strategyReason.join(', ')}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">3. 실행 계획</h3>
          <div className="bg-white border border-gray-200 p-6 rounded-lg whitespace-pre-line shadow-sm">
            {project.executionPlan}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-3">4. 기대 효과 및 윤리적 고려</h3>
          <p className="mb-4 font-medium">✨ {project.expectedEffect}</p>
          <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
             <div className="text-sm text-yellow-800">
               <strong>윤리적 체크:</strong> 과도한 압축으로 인한 정보 손실이 누군가에게 오해를 주거나, 접근성을 해치지 않도록 주의해야 합니다. 원본 보존이 필요한 중요한 기록인지 항상 확인하세요.
             </div>
          </div>
        </section>

        {/* AI Feedback Section */}
        <div className="mt-8 border-t pt-6 print:hidden">
          {!feedback ? (
            <button
              onClick={handleGetFeedback}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? (
                "AI 선생님이 분석 중입니다..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> AI 피드백 받기 (Gemini)
                </>
              )}
            </button>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 animate-fadeIn">
              <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI 선생님의 피드백
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-6 flex justify-center gap-4 print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
          <Download className="w-4 h-4" /> PDF 저장 / 인쇄
        </button>
        <button onClick={onClose} className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700">
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ReportView;