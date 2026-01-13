import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
    {
        q: "왜 JPEG는 사진 용량을 획기적으로 줄이나요?",
        a: "JPEG는 사람의 눈이 밝기 변화에는 민감하지만 색상 변화에는 둔감하다는 점을 이용합니다. 눈에 잘 안 띄는 색상 정보를 과감히 삭제(손실 압축)하여 용량을 줄입니다."
    },
    {
        q: "PNG는 언제 써야 하나요?",
        a: "PNG는 무손실 압축이라 화질이 깨지지 않습니다. 특히 배경을 투명하게 해야 하거나, 글자/로고처럼 경계가 뚜렷한 이미지에 적합합니다."
    },
    {
        q: "MP3와 FLAC의 차이는?",
        a: "MP3는 손실 압축 오디오로 사람이 못 듣는 주파수를 삭제합니다. FLAC은 무손실이라 원본 음질을 유지하지만 용량이 MP3보다 큽니다."
    }
];

export default function MoreInfo() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="pb-20 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 px-2">더 알아보기 📚</h2>
            <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full p-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-bold text-gray-700">{faq.q}</span>
                            {openIndex === idx ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                        </button>
                        {openIndex === idx && (
                            <div className="p-5 pt-0 text-sm text-gray-600 bg-gray-50 border-t border-gray-100 leading-relaxed">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white shadow-md mt-8">
                <h3 className="font-bold text-lg mb-2">나만의 상황 제보하기</h3>
                <p className="text-sm opacity-90 mb-4">앱에 없는 특별한 상황이 있나요? 친구들과 공유해보세요.</p>
                <button className="px-4 py-2 bg-white text-blue-600 font-bold rounded-lg text-sm shadow">
                    준비중입니다
                </button>
            </div>
        </div>
    );
}