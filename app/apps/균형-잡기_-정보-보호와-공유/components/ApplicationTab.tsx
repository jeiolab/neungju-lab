import React, { useState } from 'react';
import { Card, Button } from './ui/UIComponents';
import { evaluateProposal } from '../services/geminiService';
import { PenTool, Send, Loader2, MessageSquare } from 'lucide-react';

const ApplicationTab: React.FC = () => {
  const [scenario, setScenario] = useState("우리 학교 홈페이지 공지사항 공개 범위");
  const [proposal, setProposal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!proposal.trim()) return;
    setIsLoading(true);
    const result = await evaluateProposal(scenario, proposal);
    setFeedback(result || '');
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">현실 적용: 정책 제안서 쓰기</h2>
        <p className="text-slate-600 mt-2">여러분이 직접 정책 결정자가 되어 제안서를 작성해보세요.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {["우리 학교 공지사항 공개 범위", "동네 도서관 대출 기록 활용", "교내 CCTV 설치 확대"].map(s => (
            <button 
                key={s}
                onClick={() => { setScenario(s); setFeedback(""); setProposal(""); }}
                className={`p-3 text-sm rounded-lg border ${scenario === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
                {s}
            </button>
        ))}
      </div>

      <Card title={`📝 제안서 작성: ${scenario}`}>
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                <p className="font-bold mb-2">작성 팁:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>누구에게 어디까지 공개할 것인가? (범위)</li>
                    <li>어떤 안전 장치를 둘 것인가? (보호)</li>
                    <li>이 정책으로 얻는 이익은 무엇인가? (공익)</li>
                </ul>
            </div>
            
            <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="예: 학교 공지사항은 로그인을 한 재학생과 학부모에게만 공개하고, 민감한 개인정보(이름, 전화번호)는 마스킹 처리하여 게시해야 한다. 왜냐하면..."
                className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading || !proposal.trim()}>
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : <div className="flex items-center gap-2"><Send className="w-4 h-4"/> AI 검토 받기</div>}
                </Button>
            </div>
        </div>
      </Card>

      {feedback && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500 animate-slide-up">
            <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold text-lg">
                <MessageSquare className="w-5 h-5"/>
                AI 피드백 리포트
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationTab;
