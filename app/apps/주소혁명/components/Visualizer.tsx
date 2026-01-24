import React, { useState, useEffect } from 'react';
import { SectionTitle } from './SectionTitle';
import { RefreshCw, ArrowRight, Check, Monitor, Wifi, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Visualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'converter' | 'myip'>('chart');
  
  // Converter State
  const [ipv4Input, setIpv4Input] = useState('192.168.0.1');
  const [convertedIPv6, setConvertedIPv6] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // My IP State
  const [myIP, setMyIP] = useState<string | null>(null);
  const [loadingIP, setLoadingIP] = useState(false);

  const handleConvert = () => {
    setIsAnimating(true);
    
    // Simulate complex calculation and conversion logic
    setTimeout(() => {
      try {
        const parts = ipv4Input.split('.');
        if (parts.length !== 4) throw new Error("Invalid Format");
        
        // Simple IPv4-mapped IPv6 address simulation logic for education
        // ::ffff:192.168.0.1 (Mixed notation) or Pure Hex
        const hexParts = parts.map(p => {
          const num = parseInt(p);
          if (isNaN(num) || num < 0 || num > 255) throw new Error("Invalid Number");
          return num.toString(16).padStart(2, '0');
        });

        // Construct a realistic looking IPv6 mapping
        // Prefix + IPv4 hex parts
        const ipv6 = `2001:0db8:0000:0000:0000:ffff:${hexParts[0]}${hexParts[1]}:${hexParts[2]}${hexParts[3]}`;
        
        setConvertedIPv6(ipv6);
      } catch (e) {
        setConvertedIPv6("유효하지 않은 IPv4 형식입니다. (예: 192.168.0.1)");
      }
      setIsAnimating(false);
    }, 800);
  };

  const fetchMyIP = async () => {
    setLoadingIP(true);
    try {
      // Using a public IP API
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      setMyIP(data.ip);
    } catch (error) {
      setMyIP("IP를 확인할 수 없습니다. (광고 차단 등을 확인해주세요)");
    } finally {
      setLoadingIP(false);
    }
  };

  const chartData = [
    { name: 'IPv4', bits: 32, label: '32 Bits' },
    { name: 'IPv6', bits: 128, label: '128 Bits' },
  ];

  return (
    <section id="visualizer" className="py-20 bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          title="시각화 연구소" 
          subtitle="주소 공간의 크기와 형식을 직접 눈으로 확인하고 체험해보세요."
        />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex-1 py-4 text-sm sm:text-base font-medium transition-colors ${activeTab === 'chart' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              주소 길이 비교
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex-1 py-4 text-sm sm:text-base font-medium transition-colors ${activeTab === 'converter' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              주소 변환기
            </button>
            <button
              onClick={() => setActiveTab('myip')}
              className={`flex-1 py-4 text-sm sm:text-base font-medium transition-colors ${activeTab === 'myip' ? 'bg-white text-emerald-600 border-b-2 border-emerald-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
            >
              내 IP 확인
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-10 flex-1 flex flex-col items-center justify-center w-full">
            
            {activeTab === 'chart' && (
              <div className="w-full max-w-3xl animate-fade-in">
                <h3 className="text-xl font-bold text-center mb-2 text-slate-800">비트(Bit) 수 비교</h3>
                <p className="text-center text-slate-500 mb-8">IPv6는 IPv4보다 4배 더 긴 주소 체계를 가집니다.</p>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#64748b" width={50} tick={{fontSize: 14, fontWeight: 'bold'}} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="bits" radius={[0, 4, 4, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="block text-sm font-semibold text-blue-600 uppercase">IPv4 주소 공간</span>
                    <span className="text-2xl font-bold text-slate-800">43억 개</span>
                    <p className="text-sm text-slate-600 mt-1">지구 인구(약 80억)보다 적습니다.</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <span className="block text-sm font-semibold text-indigo-600 uppercase">IPv6 주소 공간</span>
                    <span className="text-2xl font-bold text-slate-800">3.4 × 10³⁸ 개</span>
                    <p className="text-sm text-slate-600 mt-1">지구상의 모든 모래알 수보다 많습니다.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'converter' && (
              <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">가상 IPv6 업그레이드</h3>
                  <p className="text-slate-500">IPv4 주소를 입력하면 IPv6 형식으로 변환된 모습을 보여줍니다.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">IPv4 주소 입력</label>
                    <input
                      type="text"
                      value={ipv4Input}
                      onChange={(e) => setIpv4Input(e.target.value)}
                      className="w-full text-lg p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-center"
                      placeholder="예: 192.168.0.1"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleConvert}
                      disabled={isAnimating}
                      className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                      IPv6로 업그레이드
                    </button>
                  </div>

                  {convertedIPv6 && (
                    <div className={`transform transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center -translate-y-full">
                          <div className="h-8 w-0.5 bg-slate-200"></div>
                        </div>
                        <div className="bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-center break-all shadow-inner border border-slate-800">
                          <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Converted Result</p>
                          <span className="text-lg sm:text-xl md:text-2xl">{convertedIPv6}</span>
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-3">
                          * 실제 매핑 방식은 더 복잡하지만, 주소 길이의 복잡성을 보여주기 위한 예시입니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'myip' && (
              <div className="w-full max-w-xl text-center animate-fade-in">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="text-emerald-600 w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">현재 내 IP 주소 확인</h3>
                  <p className="text-slate-500">지금 접속한 기기의 공인 IP 주소가 어떤 형식을 사용하고 있을까요?</p>
                </div>

                <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[160px]">
                  {loadingIP ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-medium">IP 주소 조회 중...</span>
                    </div>
                  ) : myIP ? (
                    <div className="animate-fade-in-up">
                      <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-800 break-all">
                        {myIP}
                      </span>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {myIP.includes(':') ? (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">IPv6 감지됨</span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">IPv4 감지됨</span>
                        )}
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Public IP</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={fetchMyIP}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40"
                    >
                      <Wifi className="w-5 h-5" />
                      내 IP 확인하기
                    </button>
                  )}
                </div>
                
                {myIP && (
                  <button 
                    onClick={() => { setMyIP(null); }}
                    className="mt-6 text-sm text-slate-400 hover:text-emerald-600 underline"
                  >
                    다시 확인하기
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};