'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Smartphone, CheckCircle, AlertTriangle, XCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

// --- Password Strength Checker Component ---
const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0); // 0-4
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    let score = 0;
    const newFeedback: string[] = [];

    if (password.length === 0) {
      setStrength(0);
      setFeedback([]);
      return;
    }

    if (password.length >= 8) score += 1;
    else newFeedback.push("길이가 너무 짧습니다 (8자 이상 권장)");

    if (/[A-Z]/.test(password)) score += 1;
    else newFeedback.push("대문자를 포함하세요");

    if (/[0-9]/.test(password)) score += 1;
    else newFeedback.push("숫자를 포함하세요");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else newFeedback.push("특수문자를 포함하세요");

    setStrength(score);
    setFeedback(newFeedback);
  }, [password]);

  const getBarColor = (index: number) => {
    if (index >= strength) return 'bg-slate-200';
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength <= 1) return '위험';
    if (strength <= 3) return '보통';
    return '안전';
  };

  const getStrengthTextColor = () => {
    if (strength <= 1) return 'text-red-500';
    if (strength <= 3) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-blue-600" />
        비밀번호 안전도 검사기
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        입력한 비밀번호는 어디에도 저장되거나 전송되지 않습니다. 안심하고 테스트하세요.
      </p>
      
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해보세요"
          className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex gap-2 mb-2 h-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${getBarColor(i)}`} />
        ))}
      </div>
      
      <div className="flex justify-between items-start">
        <div className="text-sm text-slate-500">
          {feedback.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-1 text-red-400 text-xs mt-1">
              <XCircle size={12} /> {msg}
            </div>
          ))}
          {strength === 4 && (
            <div className="flex items-center gap-1 text-emerald-500 text-xs mt-1">
              <CheckCircle size={12} /> 아주 훌륭한 비밀번호입니다!
            </div>
          )}
        </div>
        <span className={`font-bold ${getStrengthTextColor()}`}>
          {getStrengthLabel()}
        </span>
      </div>
    </div>
  );
};

// --- 2FA Simulation Component ---
const TwoFactorSim = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timer: number | undefined;
    if (step === 2 && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && step === 2) {
      // Time expired
      // Optionally handle expiration
    }
    return () => {
      if (timer !== undefined) clearInterval(timer);
    };
  }, [step, timeLeft]);

  const handleLogin = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    setStep(2);
    setTimeLeft(30);
    setCode('');
  };

  const handleVerify = () => {
    if (code === generatedCode) {
      setStep(3);
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const reset = () => {
    setStep(1);
    setCode('');
    setGeneratedCode('');
    setTimeLeft(0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Smartphone className="w-5 h-5 text-emerald-600" />
        2단계 인증 체험하기
      </h3>

      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100">
        {step === 1 && (
          <div className="w-full max-w-xs space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-700">가상 포털 로그인</h4>
            </div>
            <input type="text" value="student_id" disabled className="w-full p-2 border rounded bg-slate-100 text-slate-500" />
            <input type="password" value="********" disabled className="w-full p-2 border rounded bg-slate-100 text-slate-500" />
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              로그인
            </button>
            <p className="text-xs text-center text-slate-400">
              * 실제 로그인이 아닌 시뮬레이션입니다.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-xs space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Smartphone className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-slate-700">인증번호 입력</h4>
              <p className="text-sm text-slate-500">휴대폰으로 전송된 6자리 번호를 입력하세요.</p>
              <div className="mt-2 bg-slate-800 text-green-400 font-mono py-1 px-3 rounded inline-block text-lg tracking-widest">
                {generatedCode}
              </div>
              <p className="text-xs text-slate-400 mt-1">가상 스마트폰 알림</p>
            </div>
            
            <input 
              type="text" 
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              className="w-full p-2 text-center text-xl tracking-widest border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            
            <button 
              onClick={handleVerify}
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
              disabled={code.length !== 6}
            >
              인증 확인
            </button>
            <div className="text-center text-sm text-red-500 font-medium">
              남은 시간: {timeLeft}초
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-emerald-700 mb-2">인증 성공!</h4>
              <p className="text-slate-600">
                2단계 인증을 통해 계정을 안전하게 보호했습니다.<br/>
                비밀번호를 알아도, 이 단계가 없으면 해커는 접속할 수 없습니다.
              </p>
            </div>
            <button 
              onClick={reset}
              className="px-6 py-2 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
            >
              다시 체험하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Simulation: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <PasswordChecker />
      <TwoFactorSim />
    </div>
  );
};

export default Simulation;