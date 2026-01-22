import React from 'react';
import { WizardState } from '../types';
import { Shield, Award, Check } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface SecurityReportProps {
  data: WizardState;
  quizScore: number;
}

const SecurityReport: React.FC<SecurityReportProps> = ({ data, quizScore }) => {
  const chartData = [
    { subject: '설계 완성도', A: data.score, fullMark: 100 },
    { subject: '이론 지식', A: (quizScore / 10) * 100, fullMark: 100 },
    { subject: '데이터 최소화', A: data.badges.includes('데이터 최소수집') ? 100 : 50, fullMark: 100 },
    { subject: '로그 관리', A: data.badges.includes('로그 청결') ? 100 : 50, fullMark: 100 },
    { subject: '운영 보안', A: data.operations.keyManagement.includes('권장') ? 100 : 40, fullMark: 100 },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none">
      {/* Header */}
      <div className="text-center border-b pb-6 mb-6">
        <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">보안 설계 리포트</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString()} 생성 | 작성자: 수행평가 제출용</p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">1. 프로젝트 개요</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><span className="font-bold text-gray-700">서비스명:</span> {data.serviceName || '미입력'}</p>
            <p><span className="font-bold text-gray-700">설명:</span> {data.serviceDescription || '미입력'}</p>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">2. 획득 배지</h2>
            <div className="flex gap-2 flex-wrap">
              {data.badges.length > 0 ? data.badges.map(badge => (
                <span key={badge} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-200">
                  <Award className="w-4 h-4" /> {badge}
                </span>
              )) : <span className="text-gray-400 text-sm">획득한 배지가 없습니다.</span>}
            </div>
          </div>
        </div>

        <div className="h-64">
           <h2 className="text-xl font-bold text-gray-800 mb-2 border-l-4 border-indigo-500 pl-3">3. 보안 점수</h2>
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="My Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">4. 상세 설계 내용</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 border rounded-lg">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b">구분</th>
                <th className="px-6 py-3 border-b">선택 내용</th>
                <th className="px-6 py-3 border-b">보안 분석</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">수집 데이터</td>
                <td className="px-6 py-4">{data.collectedData.join(', ') || '없음'}</td>
                <td className="px-6 py-4">
                    {data.collectedData.length > 4 ? 
                    <span className="text-red-500">과도한 수집 주의</span> : 
                    <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3"/> 최소 수집 준수</span>}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">비밀번호 저장</td>
                <td className="px-6 py-4">{data.securityTech.passwordStorage || '-'}</td>
                <td className="px-6 py-4">
                    {data.securityTech.passwordStorage.includes('해시') ? 
                    <span className="text-green-600 font-bold">안전함 (Hash)</span> : 
                    <span className="text-red-600 font-bold">취약함 (평문/암호화)</span>}
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">통신 보안</td>
                <td className="px-6 py-4">{data.securityTech.communication || '-'}</td>
                <td className="px-6 py-4">
                     {data.securityTech.communication.includes('HTTPS') ? 
                    <span className="text-green-600">안전함 (TLS)</span> : 
                    <span className="text-red-600">도청 위험 있음</span>}
                </td>
              </tr>
               <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">키 관리</td>
                <td className="px-6 py-4">{data.operations.keyManagement || '-'}</td>
                <td className="px-6 py-4">
                    {data.operations.keyManagement.includes('분리') ? 
                    <span className="text-green-600">우수함</span> : 
                    <span className="text-red-600">소스코드 유출 시 위험</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       {/* Operations Checklist */}
       <div className="bg-indigo-50 p-6 rounded-xl print:bg-gray-50">
          <h3 className="font-bold text-indigo-900 mb-2">운영자 서약</h3>
          <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
              <li>나는 사용자들의 데이터를 소중히 다루겠습니다.</li>
              <li>보안 패치를 미루지 않고 주기적으로 수행하겠습니다.</li>
              <li>불필요한 로그는 남기지 않고, 저장 기간이 지나면 파기하겠습니다.</li>
          </ul>
       </div>
       
       <div className="mt-8 text-center no-print">
          <button onClick={() => window.print()} className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-bold shadow-lg transition-transform hover:-translate-y-1">
              PDF로 저장 / 인쇄하기
          </button>
       </div>
    </div>
  );
};

export default SecurityReport;
