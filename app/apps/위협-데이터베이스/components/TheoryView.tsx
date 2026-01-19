'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Bug, Lock, Network, Mail, Server } from 'lucide-react';

const PackageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const concepts = [
  {
    title: "악성 코드 유형 (Malware Types)",
    items: [
      {
        name: "웜 (Worm)",
        icon: <Bug className="w-6 h-6 text-rose-500" />,
        desc: "스스로 복제하여 다른 컴퓨터로 전파되는 독립적인 악성 프로그램입니다.",
        mech: "OS 취약점 악용 -> 자가 복제 -> 네트워크 스캔 -> 전파"
      },
      {
        name: "트로이 목마 (Trojan Horse)",
        icon: <PackageIcon className="w-6 h-6 text-amber-500" />,
        desc: "정상적인 소프트웨어로 위장하여 사용자를 속이는 악성 코드입니다.",
        mech: "정상 파일로 위장 -> 사용자 설치 유도 -> 악성 기능 실행"
      },
      {
        name: "랜섬웨어 (Ransomware)",
        icon: <Lock className="w-6 h-6 text-red-600" />,
        desc: "피해자의 데이터를 암호화하고 몸값(Ransom)을 요구하는 악성 소프트웨어입니다.",
        mech: "시스템 감염 -> 파일 암호화 -> 랜섬 노트(협박문) 표시"
      }
    ]
  },
  {
    title: "공격 기법 (Attack Vectors)",
    items: [
      {
        name: "피싱 (Phishing)",
        icon: <Mail className="w-6 h-6 text-blue-500" />,
        desc: "신뢰할 수 있는 기관을 사칭하여 이메일 등을 통해 개인정보를 탈취하는 수법입니다.",
        mech: "가짜 이메일 전송 -> 악성 링크 클릭 -> 계정 정보 탈취"
      },
      {
        name: "디도스 (DDoS)",
        icon: <Server className="w-6 h-6 text-purple-500" />,
        desc: "분산 서비스 거부 공격. 수많은 컴퓨터를 이용해 서버에 트래픽을 폭주시킵니다.",
        mech: "좀비 PC(봇넷) 감염 -> 대량 요청 전송 -> 서버 과부하 -> 서비스 중단"
      }
    ]
  }
];

const TheoryView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-lab-800">위협 데이터베이스</h2>
        <p className="text-lab-500">적을 알고 나를 알면 백전백승입니다.</p>
      </div>

      {concepts.map((section, idx) => (
        <motion.div 
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold border-l-4 border-primary-500 pl-4 text-lab-700">
            {section.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {section.items.map((item) => (
              <div key={item.name} className="bg-white p-6 rounded-xl shadow-sm border border-lab-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-lab-50 rounded-lg border border-lab-100">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-lab-800">{item.name}</h4>
                </div>
                <p className="text-sm text-lab-600 mb-4 leading-relaxed">{item.desc}</p>
                <div className="bg-lab-900 text-primary-500 p-3 rounded font-mono text-xs">
                  <span className="text-lab-400">$ mechanism_analysis:</span><br/>
                  {item.mech}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TheoryView;