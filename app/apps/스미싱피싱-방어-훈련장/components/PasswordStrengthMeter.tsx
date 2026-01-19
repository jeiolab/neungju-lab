'use client';

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthMeter: React.FC = () => {
  const [password, setPassword] = useState('');

  const checks = [
    { label: '8자 이상', valid: password.length >= 8 },
    { label: '숫자 포함', valid: /\d/.test(password) },
    { label: '특수문자 포함', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: '영문 대/소문자', valid: /[a-zA-Z]/.test(password) },
  ];

  const validCount = checks.filter(c => c.valid).length;
  
  let strengthColor = 'bg-gray-600';
  let strengthText = '입력 대기';
  
  if (password.length > 0) {
    if (validCount <= 1) { strengthColor = 'bg-red-500'; strengthText = '위험'; }
    else if (validCount <= 3) { strengthColor = 'bg-yellow-500'; strengthText = '주의'; }
    else { strengthColor = 'bg-green-500'; strengthText = '안전'; }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        🔐 비밀번호 강도 테스터
      </h3>
      <input 
        type="text" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="테스트할 비밀번호 입력 (저장되지 않음)"
        className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 mb-4 focus:outline-none focus:border-indigo-500 transition-colors"
      />
      
      <div className="h-2 w-full bg-slate-200 rounded-full mb-4 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${strengthColor}`} 
          style={{ width: `${(validCount / 4) * 100}%` }}
        ></div>
      </div>
      <p className={`text-right text-sm font-bold mb-4 ${
        strengthText === '안전' ? 'text-green-400' : strengthText === '위험' ? 'text-red-400' : 'text-yellow-400'
      }`}>
        판정: {strengthText}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
            {check.valid ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-slate-400" />}
            <span className={check.valid ? 'text-slate-900 font-medium' : ''}>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;