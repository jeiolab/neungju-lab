'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { Award, Monitor, Smartphone, CheckSquare, Square } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', category: 'SMARTPHONE', text: '화면 잠금(패턴/PIN/생체인식) 설정하기', description: '기기 분실 시 데이터를 보호하는 첫 번째 관문입니다.', checked: false },
  { id: '2', category: 'SMARTPHONE', text: '알 수 없는 출처의 앱 설치 차단', description: '공식 스토어 외의 앱은 악성코드가 포함될 확률이 높습니다.', checked: false },
  { id: '3', category: 'SMARTPHONE', text: '"내 기기 찾기" 기능 켜두기', description: '분실 시 위치 추적 및 원격 데이터 삭제가 가능합니다.', checked: false },
  { id: '4', category: 'PC', text: '운영체제 자동 업데이트 켜기', description: '최신 보안 패치를 자동으로 적용합니다.', checked: false },
  { id: '5', category: 'PC', text: '백신 프로그램 설치 및 실시간 감시', description: '바이러스와 악성코드를 탐지합니다.', checked: false },
  { id: '6', category: 'PC', text: '중요 파일 백업하기 (클라우드/외장하드)', description: '랜섬웨어 감염 시 데이터를 복구할 수 있는 유일한 방법입니다.', checked: false },
];

const Checklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progress = Math.round((checkedCount / items.length) * 100);
  
  const data = [
    { name: 'Completed', value: checkedCount },
    { name: 'Remaining', value: items.length - checkedCount },
  ];
  const COLORS = ['#10b981', '#e2e8f0'];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 relative flex-shrink-0">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={35}
                  outerRadius={50}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold text-slate-700">{progress}%</span>
            </div>
          </div>
          
          <div className="flex-1">
             <h2 className="text-2xl font-bold text-blue-900 mb-2">내 보안 레벨 체크</h2>
             <p className="text-slate-600">
               아래 체크리스트를 완료하여 당신의 기기를 안전하게 만드세요. 
               모든 항목을 완료하면 <strong className="text-emerald-600">'보안 마스터'</strong> 인증서를 드립니다!
             </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
            <Smartphone className="w-5 h-5" /> 스마트폰 보안
          </h3>
          {items.filter(i => i.category === 'SMARTPHONE').map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${item.checked ? 'text-emerald-600' : 'text-slate-300'}`}>
                  {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <div className={`font-medium ${item.checked ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                </div>
              </div>
            </div>
          ))}

          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg mt-6">
            <Monitor className="w-5 h-5" /> PC 보안
          </h3>
          {items.filter(i => i.category === 'PC').map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${item.checked ? 'text-emerald-600' : 'text-slate-300'}`}>
                  {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <div>
                  <div className={`font-medium ${item.checked ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {item.text}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Section */}
        <div className="flex flex-col items-center justify-center">
          {progress === 100 ? (
            <div className="w-full max-w-md bg-gradient-to-br from-yellow-50 to-white border-4 border-yellow-400 p-8 rounded-xl shadow-lg text-center relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award size={150} />
              </div>
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-slate-800 mb-2 font-serif">CERTIFICATE</h3>
              <p className="text-yellow-600 font-bold tracking-widest mb-6">OF SECURITY MASTER</p>
              
              <div className="border-t border-b border-slate-200 py-4 mb-6">
                <p className="text-slate-600 italic">
                  위 학생은 모든 보안 수칙을 훌륭히<br/>
                  이행하였으므로 이 인증서를 수여합니다.
                </p>
              </div>
              
              <div className="text-sm text-slate-400 font-mono">
                Issued by: 정보 보안 지킴이<br/>
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md h-80 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <Award size={48} className="mb-4 opacity-50" />
              <p className="text-center">
                모든 항목을 완료하면<br/>
                인증서가 이곳에 나타납니다.
              </p>
              <div className="mt-4 w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;