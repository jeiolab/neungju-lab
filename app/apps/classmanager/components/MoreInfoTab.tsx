import React from 'react';
import { Box, TrendingUp, HelpCircle } from 'lucide-react';

export const MoreInfoTab: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-fade-in">
      
      {/* 3D Section */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3 text-purple-600">
            <Box size={32} />
            <h2 className="text-2xl font-bold">3차원 데이터로의 확장</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            지금까지는 <strong>학생 x 과목</strong>의 2차원 데이터를 다뤘습니다. 
            만약 <strong>1학기, 2학기</strong> 성적을 모두 관리해야 한다면 어떻게 될까요?
          </p>
          <div className="bg-purple-50 p-4 rounded-lg font-mono text-sm text-purple-800 border border-purple-100">
            scores[학생][학기][과목] = 95
          </div>
          <p className="text-slate-500 text-sm">
            이렇게 차원이 늘어날 때마다 대괄호 [] 하나가 더 추가됩니다. 
            3D 게임, 시간표 데이터, 영상 처리 등이 모두 이 원리를 사용합니다.
          </p>
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
             {/* Simple visual representation of 3D stack */}
             <div className="relative w-48 h-48">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 border-2 border-blue-400 z-10 flex items-center justify-center opacity-90 shadow-lg translate-x-4 translate-y-4 rounded">1학기</div>
                <div className="absolute top-4 left-4 w-32 h-32 bg-green-200 border-2 border-green-400 z-0 flex items-center justify-center opacity-90 rounded">2학기</div>
             </div>
        </div>
      </section>

      {/* Think About It Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 text-white p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HelpCircle size={100} />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-yellow-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">Q</span>
                학생이 전학을 간다면?
            </h3>
            <p className="text-slate-300 mb-4">
                리스트 구조에서 중간에 있는 데이터(행)를 삭제해야 합니다.
                이때 인덱스는 어떻게 변할까요?
            </p>
            <div className="text-sm font-mono text-yellow-400 bg-slate-900 p-3 rounded">
                del scores[2] <br/>
                # 뒤에 있는 학생들의 인덱스가 하나씩 당겨집니다.
            </div>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={100} />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-yellow-500 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">Q</span>
                과목이 늘어난다면?
            </h3>
            <p className="text-slate-300 mb-4">
                '과학' 과목이 추가된다면 모든 학생의 리스트 안에 데이터를 하나씩 더 넣어야 합니다.
            </p>
            <div className="text-sm font-mono text-green-400 bg-slate-900 p-3 rounded">
                for student in scores:<br/>
                &nbsp;&nbsp;student.append(0) # 초기값
            </div>
        </div>
      </section>

    </div>
  );
};