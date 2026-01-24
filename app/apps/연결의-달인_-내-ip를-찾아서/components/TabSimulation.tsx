import React, { useState, useEffect } from 'react';
import { Difficulty } from '../types';
import { Wifi, WifiOff, RefreshCcw, CheckCircle, AlertCircle, Monitor, Router as RouterIcon } from 'lucide-react';

interface TabSimulationProps {
  onBadgeEarned: (badge: Difficulty) => void;
}

export const TabSimulation: React.FC<TabSimulationProps> = ({ onBadgeEarned }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [gateway, setGateway] = useState('');
  const [isDhcp, setIsDhcp] = useState(false);
  
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Scenario Constants
  const TARGET_GATEWAY = "192.168.0.1";
  const TARGET_SUBNET = "255.255.255.0";
  const NETWORK_PREFIX = "192.168.0.";

  useEffect(() => {
    resetSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const resetSimulation = () => {
    setIp('');
    setSubnet('');
    setGateway('');
    setStatus('idle');
    setFeedback('');
    setAttempts(0);
    
    if (difficulty === Difficulty.BEGINNER) {
      setIsDhcp(false); // Start unchecked
    } else if (difficulty === Difficulty.ADVANCED) {
      setIsDhcp(false);
      setIp('192.168.1.50'); // Wrong Network
      setSubnet('255.255.255.0');
      setGateway('192.168.0.1'); // Correct Gateway
      setFeedback("인터넷이 끊겼어요! 설정값을 확인하고 고쳐주세요.");
    } else {
      setIsDhcp(false);
    }
  };

  const handleDhcpToggle = () => {
    setIsDhcp(!isDhcp);
    if (!isDhcp) {
      setIp(NETWORK_PREFIX + Math.floor(Math.random() * 200 + 2));
      setSubnet(TARGET_SUBNET);
      setGateway(TARGET_GATEWAY);
    } else {
      setIp('');
      setSubnet('');
      setGateway('');
    }
  };

  const validate = () => {
    setAttempts(prev => prev + 1);
    
    if (difficulty === Difficulty.BEGINNER) {
      if (isDhcp) {
        setStatus('success');
        setFeedback("잘했어요! DHCP는 가장 쉽고 빠른 연결 방법입니다.");
        onBadgeEarned(Difficulty.BEGINNER);
      } else {
        setStatus('error');
        setFeedback("초급 단계에서는 '자동으로 IP 주소 받기'를 사용해보세요.");
      }
      return;
    }

    // Common Validation for Intermediate & Advanced
    if (!ip || !subnet || !gateway) {
      setStatus('error');
      setFeedback("모든 빈칸을 채워주세요!");
      return;
    }

    // 1. Subnet Check
    if (subnet !== TARGET_SUBNET) {
      setStatus('error');
      setFeedback(`서브넷 마스크가 틀렸어요. 보통 가정집은 ${TARGET_SUBNET}을 사용합니다.`);
      return;
    }

    // 2. Gateway Check
    if (gateway !== TARGET_GATEWAY) {
      setStatus('error');
      setFeedback(`게이트웨이 주소가 라우터(공유기) 주소와 다릅니다. 공유기는 ${TARGET_GATEWAY}입니다.`);
      return;
    }

    // 3. IP Network Check
    if (!ip.startsWith(NETWORK_PREFIX)) {
      setStatus('error');
      setFeedback(`IP 주소가 게이트웨이와 같은 대역(${NETWORK_PREFIX}x)에 있어야 합니다.`);
      return;
    }

    // 4. IP Conflict Check
    if (ip === TARGET_GATEWAY) {
      setStatus('error');
      setFeedback("IP 주소가 게이트웨이와 겹칩니다! 다른 숫자를 써주세요.");
      return;
    }

    // 5. Valid Range Check
    const lastOctet = parseInt(ip.split('.')[3]);
    if (isNaN(lastOctet) || lastOctet <= 0 || lastOctet >= 255) {
      setStatus('error');
      setFeedback("IP 주소의 마지막 자리는 1~254 사이의 숫자여야 합니다.");
      return;
    }

    setStatus('success');
    if (difficulty === Difficulty.INTERMEDIATE) {
      setFeedback("완벽해요! 수동으로 IP를 정확하게 설정했습니다.");
      onBadgeEarned(Difficulty.INTERMEDIATE);
    } else {
      setFeedback("트러블슈팅 성공! 네트워크 문제를 해결하셨군요.");
      onBadgeEarned(Difficulty.ADVANCED);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header / Difficulty Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800">네트워크 연결 시뮬레이션</h2>
          <p className="text-sm text-slate-500">현재 모드: 
            <span className="ml-2 font-medium text-blue-600">
              {difficulty === Difficulty.BEGINNER && "초급 (자동 연결)"}
              {difficulty === Difficulty.INTERMEDIATE && "중급 (수동 입력)"}
              {difficulty === Difficulty.ADVANCED && "고급 (문제 해결)"}
            </span>
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={() => setDifficulty(Difficulty.BEGINNER)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${difficulty === Difficulty.BEGINNER ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            초급
          </button>
          <button 
            onClick={() => setDifficulty(Difficulty.INTERMEDIATE)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${difficulty === Difficulty.INTERMEDIATE ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            중급
          </button>
          <button 
            onClick={() => setDifficulty(Difficulty.ADVANCED)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${difficulty === Difficulty.ADVANCED ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            고급
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Panel: Scenario Info */}
        <div className="md:w-1/3 space-y-4">
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RouterIcon size={100} />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <RouterIcon size={20} />
              우리 집 공유기 정보
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-slate-600 pb-2">
                <span className="text-slate-400">Gateway IP</span>
                <span className="font-mono text-green-400">192.168.0.1</span>
              </li>
              <li className="flex justify-between border-b border-slate-600 pb-2">
                <span className="text-slate-400">Subnet Mask</span>
                <span className="font-mono text-yellow-400">255.255.255.0</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-green-400">Online</span>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-slate-700/50 rounded-lg text-xs text-slate-300">
               💡 팁: PC의 IP 주소는 게이트웨이와 같은 네트워크 대역(192.168.0.x)이어야 합니다.
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-center gap-3 transition-colors duration-500 ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {status === 'success' ? <Wifi size={32} /> : <WifiOff size={32} />}
            <div>
              <p className="font-bold">{status === 'success' ? "인터넷 연결됨!" : "연결 안 됨"}</p>
              <p className="text-xs opacity-75">{status === 'success' ? "훌륭합니다! 네트워크가 정상입니다." : "설정을 확인해주세요."}</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Form */}
        <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Monitor className="text-slate-600" />
            <h3 className="font-bold text-lg text-slate-800">Internet Protocol Version 4 (TCP/IPv4) 속성</h3>
          </div>

          <div className="space-y-6">
            {/* DHCP Toggle */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDhcp ? 'border-blue-600' : 'border-slate-300'}`}>
                  {isDhcp && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <input type="radio" checked={isDhcp} onChange={handleDhcpToggle} className="hidden" disabled={difficulty !== Difficulty.BEGINNER && difficulty !== Difficulty.INTERMEDIATE} />
                <span className="text-slate-700 group-hover:text-slate-900">자동으로 IP 주소 받기 (DHCP)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!isDhcp ? 'border-blue-600' : 'border-slate-300'}`}>
                  {!isDhcp && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <input type="radio" checked={!isDhcp} onChange={() => setIsDhcp(false)} className="hidden" disabled={difficulty === Difficulty.BEGINNER} />
                <span className="text-slate-700 group-hover:text-slate-900">다음 IP 주소 사용 (수동 설정)</span>
              </label>
            </div>

            {/* Inputs */}
            <div className={`space-y-4 pl-8 transition-opacity duration-300 ${isDhcp ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-slate-600">IP 주소:</label>
                <input 
                  type="text" 
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="예: 192.168.0.10"
                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-slate-600">서브넷 마스크:</label>
                <input 
                  type="text" 
                  value={subnet}
                  onChange={(e) => setSubnet(e.target.value)}
                  placeholder="예: 255.255.255.0"
                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium text-slate-600">기본 게이트웨이:</label>
                <input 
                  type="text" 
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value)}
                  placeholder="예: 192.168.0.1"
                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Actions & Feedback */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
              <div className="flex justify-end gap-3">
                 <button 
                  onClick={resetSimulation}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCcw size={16} />
                  초기화
                </button>
                <button 
                  onClick={validate}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-transform active:scale-95"
                >
                  연결 확인
                </button>
              </div>

              {feedback && (
                <div className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in ${status === 'success' ? 'bg-blue-50 text-blue-800' : 'bg-orange-50 text-orange-800'}`}>
                  {status === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={20} /> : <AlertCircle className="shrink-0 mt-0.5" size={20} />}
                  <div className="text-sm leading-relaxed font-medium">
                    <span className="font-bold block mb-1">AI 사수:</span>
                    {feedback}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};