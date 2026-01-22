import React from 'react';
import { BookOpen, Key, FileText, FileLock } from 'lucide-react';

interface IntroductionProps {
  onComplete: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-500" />
          보안 동아리 오리엔테이션
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          안녕, 신입 부원들! 👋 나는 보안 동아리 부장이야.<br/>
          수업 시간에 친구한테 몰래 쪽지를 보냈는데, 선생님한테 들켰다고 생각해봐.<br/>
          내용이 그대로 적혀있다면? 으악! 😱 상상만 해도 끔찍하지?<br/>
          그래서 우리에겐 <span className="font-bold text-blue-600 bg-blue-100 px-1 rounded">암호(Encryption)</span>가 필요한 거야.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Plaintext Card */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
          <div className="flex justify-center mb-4">
            <FileText size={48} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-green-800">평문 (Plaintext)</h3>
          <p className="text-center text-slate-600">
            누구나 읽을 수 있는 원래의 메시지.<br/>
            예: "오늘 급식 맛있다"
          </p>
        </div>

        {/* Ciphertext Card */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 hover:shadow-md transition-shadow">
          <div className="flex justify-center mb-4">
            <FileLock size={48} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-red-800">암호문 (Ciphertext)</h3>
          <p className="text-center text-slate-600">
            알아볼 수 없게 변환된 메시지.<br/>
            예: "A#9dk@!fj"
          </p>
        </div>

        {/* Key Card */}
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow">
          <div className="flex justify-center mb-4">
            <Key size={48} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2 text-yellow-800">키 (Key)</h3>
          <p className="text-center text-slate-600">
            암호화하거나 복호화할 때 필요한 비밀 열쇠.<br/>
            이게 없으면 못 읽어!
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
          개념 접수 완료! 다음으로 👉
        </button>
      </div>
    </div>
  );
};

export default Introduction;