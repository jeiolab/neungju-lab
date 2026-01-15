'use client';

import React, { useState, useEffect } from 'react';
import { Users, Save } from 'lucide-react';
import { loadProgress, saveProgress } from '../services/storage';

export const ApplicationTab: React.FC = () => {
    const [rules, setRules] = useState('');

    useEffect(() => {
        const p = loadProgress();
        setRules(p.classRules || '');
    }, []);

    const handleSave = () => {
        const p = loadProgress();
        p.classRules = rules;
        saveProgress(p);
        alert("저장되었습니다! 친구들과 공유해보세요.");
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
                    <Users className="text-pink-500" />
                    우리 반 SNS 사용 규칙 만들기
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                    오늘 배운 내용을 바탕으로 나와 친구들이 지킬 규칙 5가지를 적어보세요.
                </p>
                
                <textarea 
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    placeholder={`1. 친구 사진 허락 없이 올리지 않기\n2. 공용 PC 쓰고 반드시 로그아웃 하기\n3. ...`}
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-yellow-50/50 focus:bg-white transition-colors focus:ring-2 focus:ring-pink-200 focus:border-pink-300 resize-none leading-relaxed"
                />

                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> 저장하기
                    </button>
                </div>
            </div>
        </div>
    );
};