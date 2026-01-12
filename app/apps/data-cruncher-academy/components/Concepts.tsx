import React from 'react';
import { Database, Zap, PiggyBank, Scale, FileText, Image } from 'lucide-react';

export const Concepts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 bg-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4">왜 데이터를 압축할까요?</h2>
        <p className="text-blue-100 text-lg leading-relaxed mb-6">
          디지털 세상의 데이터 양은 폭발적으로 증가하고 있습니다. 
          데이터 압축은 한정된 자원을 효율적으로 사용하기 위한 필수 기술입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm">
            <Database className="w-8 h-8 mb-3 text-blue-300" />
            <h3 className="font-bold mb-2">저장 공간 절약</h3>
            <p className="text-sm text-blue-200">더 많은 사진과 영상을 같은 용량의 하드디스크에 저장할 수 있습니다.</p>
          </div>
          <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm">
            <Zap className="w-8 h-8 mb-3 text-yellow-300" />
            <h3 className="font-bold mb-2">전송 속도 향상</h3>
            <p className="text-sm text-blue-200">파일 크기가 작을수록 인터넷으로 전송하는 시간이 획기적으로 줄어듭니다.</p>
          </div>
          <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm">
            <PiggyBank className="w-8 h-8 mb-3 text-green-300" />
            <h3 className="font-bold mb-2">비용 절감</h3>
            <p className="text-sm text-blue-200">데이터 센터 유지 비용과 네트워크 사용 요금을 아낄 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">무손실 압축 (Lossless)</h3>
        <p className="text-slate-600 mb-4">
          원본 데이터를 1비트도 잃어버리지 않고 압축하는 방식입니다. 압축을 풀면 원본과 100% 동일해집니다.
        </p>
        <ul className="space-y-2 text-sm text-slate-500">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 텍스트 문서 (.txt, .doc)</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 컴퓨터 프로그램 (.exe)</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 의료용 이미지 (X-Ray)</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
          <Image className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">손실 압축 (Lossy)</h3>
        <p className="text-slate-600 mb-4">
          사람이 인지하기 힘든 데이터를 제거하여 용량을 대폭 줄입니다. 압축을 풀면 원본과 약간 달라집니다.
        </p>
        <ul className="space-y-2 text-sm text-slate-500">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 일반 사진 (.jpg)</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 음악 파일 (.mp3)</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 동영상 스트리밍 (.mp4)</li>
        </ul>
      </div>

      <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-center justify-between shadow-sm">
        <div>
           <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-slate-900">
             <Scale className="w-5 h-5 text-blue-600" /> 트레이드 오프 (Trade-off)
           </h3>
           <p className="text-slate-600 text-sm">
             화질을 유지하고 싶다면 용량이 커지고, 용량을 줄이고 싶다면 화질이 떨어집니다.<br/>
             좋은 데이터 관리자는 상황에 맞는 <strong>최적의 균형</strong>을 찾아야 합니다.
           </p>
        </div>
      </div>
    </div>
  );
};
