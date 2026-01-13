import React, { useState } from 'react';
import { RouterConfig } from '../types';
import { Save, RefreshCw, Wifi } from 'lucide-react';

const RouterSettingsTab: React.FC = () => {
  const [config, setConfig] = useState<RouterConfig>({
    ssid: 'NetFixer_Public',
    password: '',
    securityMode: 'Open',
    frequency: '2.4GHz',
    channel: 6,
    txPower: 'Medium'
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setMessage("설정 저장 중... 시스템 재부팅 중입니다.");
    setTimeout(() => {
        let feedback = "설정이 성공적으로 적용되었습니다.";
        if (config.securityMode === 'Open') {
            feedback += " 경고: 네트워크가 보안되지 않았습니다!";
        } else if (config.password.length < 8) {
            feedback += " 경고: 비밀번호가 너무 약합니다 (최소 8자).";
        }
        setMessage(feedback);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
        
        {/* Router Header */}
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
                <Wifi size={24} />
                <h2 className="text-xl font-bold tracking-wide">NetFixer 공유기 설정</h2>
            </div>
            <div className="text-xs bg-emerald-700 px-2 py-1 rounded">Firmware v1.0.4</div>
        </div>

        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
                <ul className="space-y-2 text-sm font-medium text-slate-600">
                    <li className="text-emerald-600 bg-white shadow-sm px-3 py-2 rounded border-l-4 border-emerald-500">무선 설정 (Wireless)</li>
                    <li className="px-3 py-2 hover:bg-slate-100 rounded cursor-not-allowed opacity-50">LAN 설정</li>
                    <li className="px-3 py-2 hover:bg-slate-100 rounded cursor-not-allowed opacity-50">WAN 설정</li>
                    <li className="px-3 py-2 hover:bg-slate-100 rounded cursor-not-allowed opacity-50">방화벽 (Firewall)</li>
                    <li className="px-3 py-2 hover:bg-slate-100 rounded cursor-not-allowed opacity-50">시스템 도구</li>
                </ul>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-6">무선 기본 설정</h3>
                
                <div className="space-y-6 max-w-lg">
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">네트워크 이름 (SSID)</label>
                        <input 
                            type="text" 
                            name="ssid" 
                            value={config.ssid} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">주파수 대역 (Band)</label>
                        <select 
                            name="frequency"
                            value={config.frequency}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                        >
                            <option value="2.4GHz">2.4GHz (넓은 커버리지)</option>
                            <option value="5GHz">5GHz (빠른 속도)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">보안 모드</label>
                        <select 
                            name="securityMode"
                            value={config.securityMode}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white ${config.securityMode === 'Open' ? 'border-red-300 text-red-600' : 'border-slate-300'}`}
                        >
                            <option value="Open">개방형 (보안 없음)</option>
                            <option value="WPA2-PSK">WPA2-PSK (권장)</option>
                            <option value="WPA3-SAE">WPA3-SAE (최신 표준)</option>
                        </select>
                        {config.securityMode === 'Open' && (
                            <p className="text-xs text-red-500 mt-1">경고: 보안되지 않은 네트워크는 해킹에 취약합니다.</p>
                        )}
                    </div>

                    {config.securityMode !== 'Open' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                            <input 
                                type="text" 
                                name="password" 
                                value={config.password} 
                                onChange={handleChange}
                                placeholder="강력한 비밀번호 입력"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="flex-1">
                             <label className="block text-sm font-medium text-slate-700 mb-1">채널 (Channel)</label>
                             <select name="channel" value={config.channel} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
                                 <option value="1">1</option>
                                 <option value="6">6</option>
                                 <option value="11">11</option>
                                 <option value="auto">자동 (Auto)</option>
                             </select>
                        </div>
                        <div className="flex-1">
                             <label className="block text-sm font-medium text-slate-700 mb-1">전송 출력 (Tx Power)</label>
                             <select name="txPower" value={config.txPower} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white">
                                 <option value="High">높음 (100%)</option>
                                 <option value="Medium">중간 (50%)</option>
                                 <option value="Low">낮음 (25%)</option>
                             </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                         <div className="text-sm font-bold text-slate-600">
                             {message && (
                                 <span className={message.includes('경고') ? 'text-red-500' : 'text-emerald-600'}>
                                     {message}
                                 </span>
                             )}
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => setConfig({ssid: '', password: '', securityMode: 'Open', frequency: '2.4GHz', channel: 6, txPower: 'Medium'})} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <RefreshCw size={16} /> 초기화
                             </button>
                             <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md flex items-center gap-2 text-sm font-medium transition-colors">
                                <Save size={16} /> 설정 적용
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
        <p className="text-center text-slate-400 text-xs mt-4">
            이것은 시뮬레이션입니다. 실제 인터넷 설정에는 영향을 주지 않습니다.
        </p>
      </div>
    </div>
  );
};

export default RouterSettingsTab;