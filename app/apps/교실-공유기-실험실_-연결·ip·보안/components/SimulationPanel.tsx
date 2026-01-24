import React, { useState, useEffect, useCallback } from 'react';
import { SimulationConfig, SimulationResult, ConnectionStatus, DailyMission } from '../types';
import { INITIAL_GATEWAY, CORRECT_SUBNET_PREFIX, PUBLIC_DNS } from '../constants';
import { Wifi, ShieldCheck, Activity, RotateCcw, MonitorCheck, Lock, Unlock } from 'lucide-react';

interface Props {
  onExperimentComplete: (result: SimulationResult) => void;
  dailyMission: DailyMission | null;
}

const SimulationPanel: React.FC<Props> = ({ onExperimentComplete, dailyMission }) => {
  const [config, setConfig] = useState<SimulationConfig>({
    dhcpEnabled: true,
    ipAddress: '',
    gateway: INITIAL_GATEWAY,
    dns: PUBLIC_DNS,
    wifiSsid: 'Classroom_WiFi_5G',
    wifiPassword: 'password123',
  });

  const [result, setResult] = useState<SimulationResult>({
    connectionScore: 0,
    securityScore: 0,
    speedScore: 0,
    status: ConnectionStatus.DISCONNECTED,
    feedback: ['설정을 확인하고 연결을 시도해보세요.'],
  });

  const generateAutoIP = () => `${CORRECT_SUBNET_PREFIX}.${Math.floor(Math.random() * 200) + 10}`;

  // Reset/Initialize logic
  useEffect(() => {
    if (config.dhcpEnabled) {
      setConfig(prev => ({
        ...prev,
        ipAddress: generateAutoIP(),
        gateway: INITIAL_GATEWAY,
        dns: PUBLIC_DNS
      }));
    }
  }, [config.dhcpEnabled]);

  const checkPasswordStrength = (pwd: string): number => {
    if (pwd.length < 8) return 20;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    
    let score = 40;
    if (hasSpecial) score += 20;
    if (hasNumber) score += 20;
    if (hasUpper) score += 20;
    return score;
  };

  const runSimulation = useCallback(() => {
    let connectionScore = 0;
    let speedScore = 0;
    let securityScore = 0;
    const feedbacks: string[] = [];
    let status = ConnectionStatus.DISCONNECTED;

    // 1. Connection Logic
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    const isValidIP = ipPattern.test(config.ipAddress);
    const isCorrectSubnet = config.ipAddress.startsWith(CORRECT_SUBNET_PREFIX);
    const isGatewayMatch = config.gateway === INITIAL_GATEWAY;

    // Daily Mission Fault Injection logic
    let missionPenalty = false;
    if (dailyMission) {
        if (dailyMission.targetFault === 'IP_MISMATCH' && isCorrectSubnet) {
             // If mission is to fix mismatch, but user is correct, that's good. 
             // But if user hasn't touched anything and it's default correct, we might simulate initial broken state visually?
             // For this sim, we assume the inputs represent the current state.
        }
    }

    if (!isValidIP) {
      feedbacks.push("❌ 유효하지 않은 IP 주소 형식입니다. (0~255 숫자 사용)");
    } else if (!isCorrectSubnet) {
      feedbacks.push(`⚠️ IP 대역이 게이트웨이(${INITIAL_GATEWAY})와 다릅니다. 같은 네트워크에 있어야 합니다.`);
      connectionScore = 30;
      status = ConnectionStatus.UNSTABLE;
    } else if (!isGatewayMatch) {
      feedbacks.push("❌ 게이트웨이 주소가 올바르지 않아 인터넷으로 나갈 수 없습니다.");
      connectionScore = 20;
    } else if (config.ipAddress === config.gateway) {
      feedbacks.push("❌ IP주소가 게이트웨이와 충돌합니다.");
      connectionScore = 0;
    } else {
      connectionScore = 100;
      feedbacks.push("✅ IP 연결 성공! 로컬 네트워크에 정상 접속되었습니다.");
      status = ConnectionStatus.CONNECTED;
    }

    // 2. Speed/DNS Logic
    if (status === ConnectionStatus.CONNECTED) {
      if (!config.dns) {
        speedScore = 0;
        feedbacks.push("🐌 DNS가 설정되지 않아 웹사이트 주소를 찾을 수 없습니다.");
      } else if (config.dns !== PUBLIC_DNS && config.dns !== INITIAL_GATEWAY) {
        speedScore = 50;
        feedbacks.push("⚠️ 알 수 없는 DNS입니다. 응답 속도가 느릴 수 있습니다.");
      } else {
        speedScore = 100;
        feedbacks.push("🚀 DNS 설정이 완벽합니다. 웹 서핑 속도 최적!");
      }
    }

    // 3. Security Logic
    securityScore = checkPasswordStrength(config.wifiPassword);
    if (securityScore < 50) {
      feedbacks.push("🔓 Wi-Fi 비밀번호가 너무 약합니다. 해킹 위험이 있습니다.");
    } else {
      feedbacks.push("🔒 보안 설정이 안전합니다.");
    }
    
    // DHCP Bonus logic
    if (config.dhcpEnabled) {
       feedbacks.push("💡 DHCP(자동)를 사용하면 관리가 편리합니다.");
       // DHCP usually ensures correct config, so boost scores if connection was good
       if (connectionScore === 100) connectionScore = 100;
    } else {
       feedbacks.push("🔧 수동 설정(Static IP)은 서버 운영이나 특정 기기 관리에 유리합니다.");
    }

    // Mission Check
    if (dailyMission) {
      if (dailyMission.targetFault === 'DNS' && (!config.dns || speedScore < 50)) {
         feedbacks.push(`🎯 오늘의 미션 실패: DNS 문제를 해결해야 합니다.`);
      } else if (dailyMission.targetFault === 'WEAK_PW' && securityScore < 60) {
         feedbacks.push(`🎯 오늘의 미션 실패: 비밀번호 보안을 강화해야 합니다.`);
      } else if (dailyMission.targetFault === 'IP_MISMATCH' && !isCorrectSubnet) {
         feedbacks.push(`🎯 오늘의 미션 실패: IP 대역을 맞춰야 합니다.`);
      } else if (status === ConnectionStatus.CONNECTED) {
         feedbacks.push(`🎉 오늘의 미션 클리어! 장애를 복구했습니다.`);
      }
    }

    const newResult = {
      connectionScore,
      securityScore,
      speedScore,
      status: connectionScore < 50 ? ConnectionStatus.DISCONNECTED : status,
      feedback: feedbacks
    };

    setResult(newResult);
    onExperimentComplete(newResult);
  }, [config, dailyMission, onExperimentComplete]);

  // Run simulation whenever config changes (debounced slightly for UX or immediate)
  // Here we run immediately for responsive feel
  useEffect(() => {
    const timer = setTimeout(() => {
        runSimulation();
    }, 500);
    return () => clearTimeout(timer);
  }, [config, runSimulation]);

  const handleInputChange = (field: keyof SimulationConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MonitorCheck className="w-6 h-6 text-blue-600" />
          연결 실험 패널
        </h2>
        {dailyMission && (
             <div className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full border border-orange-200 animate-pulse">
                🚨 미션: {dailyMission.description}
             </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <label className="font-semibold text-slate-700">IP 할당 방식</label>
              <div className="flex bg-slate-200 rounded-lg p-1">
                <button
                  onClick={() => handleInputChange('dhcpEnabled', true)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${config.dhcpEnabled ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  DHCP (자동)
                </button>
                <button
                  onClick={() => handleInputChange('dhcpEnabled', false)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!config.dhcpEnabled ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Static (수동)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">IP 주소</label>
                <input
                  type="text"
                  value={config.ipAddress}
                  disabled={config.dhcpEnabled}
                  onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.dhcpEnabled ? 'bg-slate-100 text-slate-400' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">게이트웨이</label>
                <input
                  type="text"
                  value={config.gateway}
                  disabled={config.dhcpEnabled}
                  onChange={(e) => handleInputChange('gateway', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.dhcpEnabled ? 'bg-slate-100 text-slate-400' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">DNS 서버</label>
                <input
                  type="text"
                  value={config.dns}
                  disabled={config.dhcpEnabled}
                  onChange={(e) => handleInputChange('dns', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${config.dhcpEnabled ? 'bg-slate-100 text-slate-400' : 'bg-white'}`}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Wifi className="w-4 h-4" /> Wi-Fi 보안 설정
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Wi-Fi 이름 (SSID)</label>
                <input
                  type="text"
                  value={config.wifiSsid}
                  onChange={(e) => handleInputChange('wifiSsid', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">비밀번호</label>
                <div className="relative">
                    <input
                    type="text"
                    value={config.wifiPassword}
                    onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    />
                    <div className="absolute right-2 top-2 text-slate-400">
                        {checkPasswordStrength(config.wifiPassword) > 60 ? <Lock size={16}/> : <Unlock size={16} className="text-red-400"/>}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <div className={`text-2xl font-bold mb-1 ${result.connectionScore === 100 ? 'text-green-600' : 'text-slate-600'}`}>
                        {result.connectionScore}
                    </div>
                    <div className="text-xs text-slate-500">연결 점수</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <div className={`text-2xl font-bold mb-1 ${result.speedScore === 100 ? 'text-blue-600' : 'text-slate-600'}`}>
                        {result.speedScore}
                    </div>
                    <div className="text-xs text-slate-500">속도/DNS</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-100 border border-slate-200">
                    <div className={`text-2xl font-bold mb-1 ${result.securityScore >= 80 ? 'text-purple-600' : result.securityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.securityScore}
                    </div>
                    <div className="text-xs text-slate-500">보안 점수</div>
                </div>
            </div>

            <div className="flex-1 bg-slate-800 rounded-lg p-5 text-slate-100 font-mono text-sm shadow-inner overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="font-bold text-green-400">시스템 로그</span>
                </div>
                <ul className="space-y-3">
                    {result.feedback.map((msg, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                            <span className="text-slate-500 mt-0.5">{`>`}</span>
                            <span>{msg}</span>
                        </li>
                    ))}
                    {result.status === ConnectionStatus.CONNECTED && (
                         <li className="flex gap-2 items-start text-blue-300">
                            <span className="text-slate-500 mt-0.5">{`>`}</span>
                            <span>인터넷 트래픽 송수신 중... (Ping: 12ms)</span>
                        </li>
                    )}
                </ul>
            </div>
            
            <button 
                onClick={() => setConfig({ ...config, dhcpEnabled: !config.dhcpEnabled })} // Just to trigger a re-render/reset effect slightly
                className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-sm"
            >
                <RotateCcw className="w-4 h-4" /> 시뮬레이션 초기화
            </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;