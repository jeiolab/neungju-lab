import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Shield, Lock, FileArchive, Terminal } from 'lucide-react';

export const SecurityDocs: React.FC = () => {
    const [briefing, setBriefing] = useState<string>("기밀 문서 해독 중 (Decrypting)...");

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const model = ai.models;
                
                const prompt = `
                Act as a senior cybersecurity officer briefing a new recruit.
                Explain the difference between Data Compression (like Huffman) and Data Encryption (like AES).
                Structure it as a confidential memo.
                Keep it concise (under 200 words).
                Use formatting like "SUBJECT:", "CLASSIFICATION: TOP SECRET".
                Tone: Serious, professional, slightly dramatic hacker style.
                Write in Korean (한국어로 작성해줘).
                `;

                const response = await model.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: prompt,
                });

                setBriefing(response.text || "접속 불가. 통신이 차단되었습니다.");
            } catch (e) {
                setBriefing("연결 끊김. 오프라인 백업: 압축은 데이터를 줄이는 것이고, 암호화는 데이터를 숨기는 것입니다.");
            }
        };

        fetchBriefing();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 grid gap-8">
            <div className="bg-white p-8 rounded-xl border-2 border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-indigo-600 border-b border-indigo-200 pb-2">
                    <Terminal size={20} />
                    <h2 className="font-bold">기밀 메모</h2>
                </div>
                <div className="font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {briefing}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <FileArchive className="text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-800">압축 (Compression)</h3>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm">
                        <li>목표: 파일 크기 줄이기.</li>
                        <li>방법: 중복 데이터 제거 (예: 허프만 코딩).</li>
                        <li>유형: 무손실(ZIP) 또는 손실(JPEG).</li>
                        <li>비유: 침낭을 주머니에 넣기 위해 꾹꾹 눌러 접는 것.</li>
                    </ul>
                 </div>

                 <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <Lock className="text-red-600" />
                        <h3 className="text-xl font-bold text-slate-800">암호화 (Encryption)</h3>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 text-sm">
                        <li>목표: 정보 보호 및 기밀 유지.</li>
                        <li>방법: 키(Key)를 사용하여 데이터를 뒤섞음.</li>
                        <li>유형: 대칭키(같은 키) 또는 비대칭키(공개/개인 키).</li>
                        <li>비유: 침낭을 금고에 넣고 잠그는 것.</li>
                    </ul>
                 </div>
            </div>
        </div>
    );
};