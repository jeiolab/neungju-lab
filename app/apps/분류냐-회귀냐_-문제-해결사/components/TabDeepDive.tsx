import React from 'react';
import { BookOpen, BarChart3, LineChart } from 'lucide-react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-600" /> 교과서 예시 파헤치기
            </h2>
            <p className="text-gray-600 mb-4">
                학교 교과서나 뉴스에서 자주 보는 예시들을 자세히 분석해봅시다.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">스팸 메일 필터링</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">분류</span>
                </div>
                <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                    <BarChart3 className="w-12 h-12" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    입력된 메일 내용을 분석해서 <strong>'스팸(1)'</strong>인지 <strong>'정상(0)'</strong>인지 구분합니다. 
                    중간 상태(0.5같은 스팸)는 없습니다. 분류기(Classifier)가 확률을 계산하더라도 최종 결정은 '스팸함 이동' 아니면 '받은편지함 유지'입니다.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">아이스크림 판매량 예측</h3>
                    <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-bold">회귀</span>
                </div>
                <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                    <LineChart className="w-12 h-12" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    기온(X)에 따른 판매량(Y)을 예측합니다. 판매량은 100개, 101개뿐만 아니라 
                    평균적으로 150.5개와 같이 <strong>수치적인 크기</strong>가 중요합니다. 
                    그래프를 그렸을 때 점들이 선형 관계를 이룬다면 회귀(Regression)입니다.
                </p>
            </div>
        </div>
    </div>
  );
};

export default TabDeepDive;
