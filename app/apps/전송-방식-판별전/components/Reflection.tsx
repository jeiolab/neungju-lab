import React, { useState } from 'react';
import { PenTool, Send } from 'lucide-react';

const Reflection: React.FC = () => {
    const [inputs, setInputs] = useState({ q1: '', q2: '', q3: '' });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-2">생각해볼 문제</h2>
                <p className="text-indigo-200 text-sm">조건이 바뀌면 선택도 바뀝니다. 나만의 기준을 세워보세요.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                    <label className="block text-slate-700 font-bold mb-2">
                        1. Wi-Fi가 없는 야외 공원에서 대용량 사진 100장을 친구에게 보내야 한다면?
                    </label>
                    <textarea 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        rows={3}
                        placeholder="예: 데이터 무제한이라면 테더링이나 카카오톡, 아니라면..."
                        value={inputs.q1}
                        onChange={(e) => setInputs({...inputs, q1: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-slate-700 font-bold mb-2">
                        2. 해킹 위험이 있는 카페 공용 와이파이. 인터넷 뱅킹을 해야 한다면?
                    </label>
                    <textarea 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        rows={3}
                        placeholder="예: 와이파이를 끄고 LTE/5G망을 사용한다..."
                        value={inputs.q2}
                        onChange={(e) => setInputs({...inputs, q2: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-slate-700 font-bold mb-2">
                        3. 교실에서 선생님 몰래(?) 쪽지를 보내고 싶다면 어떤 기술이 들키지 않을까? (농담)
                    </label>
                    <textarea 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        rows={3}
                        placeholder="블루투스 채팅? 종이 비행기(물리 계층)? ..."
                        value={inputs.q3}
                        onChange={(e) => setInputs({...inputs, q3: e.target.value})}
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                        {saved ? '저장되었습니다!' : <><PenTool className="w-4 h-4 mr-2" /> 내 생각 기록하기</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reflection;
